import { ambiente } from "../../configuracoes/ambiente";
import { conexao } from "../../infraestrutura/banco/conexao";
import { gerarHashSha256 } from "../../compartilhado/seguranca/criptografia";

type TipoBloqueio = "origem" | "identidade";
type EstadoBloqueio = { bloqueado: boolean; aguardeSegundos: number };
const multiplicadores = [1, 5, 15, 60, 360, 1_440, 4_320, 10_080];

function chave(tipo: TipoBloqueio, valor: string) {
  return { tipo, hash: gerarHashSha256(valor.trim().toLowerCase()) };
}
function duracaoSegundos(nivel: number) {
  const multiplicador = multiplicadores[Math.min(nivel - 1, multiplicadores.length - 1)];
  return Math.min(ambiente.BLOQUEIO_LOGIN_INICIAL_SEGUNDOS * multiplicador, ambiente.BLOQUEIO_LOGIN_MAX_DIAS * 86_400);
}

export class LimitadorLogin {
  private readonly simultaneos = new Map<string, number>();
  iniciar(origem: string): boolean {
    const hash = gerarHashSha256(origem);
    const quantidade = this.simultaneos.get(hash) ?? 0;
    if (quantidade >= ambiente.MAX_LOGINS_SIMULTANEOS_POR_IP) return false;
    this.simultaneos.set(hash, quantidade + 1);
    return true;
  }
  finalizar(origem: string): void {
    const hash = gerarHashSha256(origem);
    const quantidade = this.simultaneos.get(hash) ?? 0;
    if (quantidade <= 1) this.simultaneos.delete(hash);
    else this.simultaneos.set(hash, quantidade - 1);
  }
  async consultar(origem: string, identidade: string): Promise<EstadoBloqueio> {
    const o = chave("origem", origem), i = chave("identidade", identidade);
    const resultado = await conexao.query(
      `SELECT greatest(0,ceil(extract(epoch FROM (max(bloqueado_ate)-now()))))::int segundos
       FROM bloqueios_autenticacao
       WHERE (tipo=$1 AND chave_hash=$2) OR (tipo=$3 AND chave_hash=$4)`,
      [o.tipo, o.hash, i.tipo, i.hash],
    );
    const aguardeSegundos = Number(resultado.rows[0]?.segundos || 0);
    return { bloqueado: aguardeSegundos > 0, aguardeSegundos };
  }
  async registrarFalha(origem: string, identidade: string): Promise<EstadoBloqueio> {
    const cliente = await conexao.connect();
    try {
      await cliente.query("BEGIN");
      let maiorEspera = 0;
      const itens = [chave("origem", origem), chave("identidade", identidade)];
      for (const item of itens) {
        await cliente.query(
          `INSERT INTO bloqueios_autenticacao(tipo,chave_hash,falhas_acumuladas)
           VALUES($1,$2,0) ON CONFLICT(tipo,chave_hash) DO NOTHING`, [item.tipo, item.hash]);
        const atual = await cliente.query(
          `SELECT falhas_acumuladas "falhasAcumuladas",nivel_bloqueio "nivelBloqueio",
                  bloqueado_ate "bloqueadoAte",ultima_falha_em "ultimaFalhaEm"
           FROM bloqueios_autenticacao WHERE tipo=$1 AND chave_hash=$2 FOR UPDATE`, [item.tipo, item.hash]);
        const estado = atual.rows[0];
        const bloqueadoAte = estado.bloqueadoAte ? new Date(estado.bloqueadoAte).getTime() : 0;
        if (bloqueadoAte > Date.now()) {
          maiorEspera = Math.max(maiorEspera, Math.ceil((bloqueadoAte - Date.now()) / 1000));
          continue;
        }
        const foraDaJanela = Date.now() - new Date(estado.ultimaFalhaEm).getTime() > ambiente.JANELA_TENTATIVAS_MINUTOS * 60_000;
        const falhas = (foraDaJanela ? 0 : Number(estado.falhasAcumuladas)) + 1;
        const bloquear = falhas >= ambiente.MAX_TENTATIVAS_LOGIN;
        const nivel = bloquear ? Number(estado.nivelBloqueio) + 1 : Number(estado.nivelBloqueio);
        const segundos = bloquear ? duracaoSegundos(nivel) : 0;
        await cliente.query(
          `UPDATE bloqueios_autenticacao SET falhas_acumuladas=$3,nivel_bloqueio=$4,
             bloqueado_ate=CASE WHEN $5::int>0 THEN now()+($5::int*interval '1 second') ELSE null END,
             ultima_falha_em=now(),atualizado_em=now() WHERE tipo=$1 AND chave_hash=$2`,
          [item.tipo, item.hash, bloquear ? 0 : falhas, nivel, segundos]);
        maiorEspera = Math.max(maiorEspera, segundos);
      }
      await cliente.query(
        `INSERT INTO tentativas_autenticacao(origem_hash,identidade_hash) VALUES($1,$2)`,
        [itens[0].hash, itens[1].hash]);
      await cliente.query("COMMIT");
      return { bloqueado: maiorEspera > 0, aguardeSegundos: maiorEspera };
    } catch (erro) {
      await cliente.query("ROLLBACK");
      throw erro;
    } finally { cliente.release(); }
  }
  async limpar(origem: string, identidade: string): Promise<void> {
    const o = chave("origem", origem), i = chave("identidade", identidade);
    await conexao.query(
      `DELETE FROM bloqueios_autenticacao
       WHERE (tipo='origem' AND chave_hash=$1) OR (tipo='identidade' AND chave_hash=$2)`, [o.hash, i.hash]);
  }
}
