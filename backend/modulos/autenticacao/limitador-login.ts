import { ambiente } from "../../configuracoes/ambiente";
import { conexao } from "../../infraestrutura/banco/conexao";
import { gerarHashSha256 } from "../../compartilhado/seguranca/criptografia";

export class LimitadorLogin {
  private readonly simultaneos = new Map<string, number>();

  iniciar(origem: string): boolean {
    const chave = gerarHashSha256(origem);
    const quantidade = this.simultaneos.get(chave) ?? 0;
    if (quantidade >= ambiente.MAX_LOGINS_SIMULTANEOS_POR_IP) return false;
    this.simultaneos.set(chave, quantidade + 1);
    return true;
  }

  finalizar(origem: string): void {
    const chave = gerarHashSha256(origem);
    const quantidade = this.simultaneos.get(chave) ?? 0;
    if (quantidade <= 1) this.simultaneos.delete(chave);
    else this.simultaneos.set(chave, quantidade - 1);
  }

  async estaBloqueado(origem: string, identidade: string): Promise<boolean> {
    const resultado = await conexao.query(
      `SELECT
       count(*) FILTER(WHERE origem_hash=$1)::int falhas_origem,
       count(*) FILTER(WHERE identidade_hash=$2)::int falhas_identidade
       FROM tentativas_autenticacao
       WHERE NOT sucesso
         AND ocorrido_em>=now()-($3::int*interval '1 minute')
         AND (origem_hash=$1 OR identidade_hash=$2)`,
      [
        gerarHashSha256(origem),
        gerarHashSha256(identidade.toLowerCase()),
        ambiente.JANELA_TENTATIVAS_MINUTOS,
      ],
    );
    return (
      Number(resultado.rows[0]?.falhas_origem) >= ambiente.MAX_TENTATIVAS_LOGIN ||
      Number(resultado.rows[0]?.falhas_identidade) >= ambiente.MAX_TENTATIVAS_LOGIN
    );
  }

  async registrarFalha(origem: string, identidade: string): Promise<void> {
    await conexao.query(
      `INSERT INTO tentativas_autenticacao(origem_hash,identidade_hash)
       VALUES($1,$2)`,
      [gerarHashSha256(origem), gerarHashSha256(identidade.toLowerCase())],
    );
  }

  async limpar(origem: string, identidade: string): Promise<void> {
    await conexao.query(
      `DELETE FROM tentativas_autenticacao
       WHERE origem_hash=$1 OR identidade_hash=$2`,
      [gerarHashSha256(origem), gerarHashSha256(identidade.toLowerCase())],
    );
  }
}
