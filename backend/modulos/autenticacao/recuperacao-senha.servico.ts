import { hash } from "bcryptjs";
import nodemailer from "nodemailer";
import { conexao } from "../../infraestrutura/banco/conexao";
import { ambiente } from "../../configuracoes/ambiente";
import { gerarHashSha256, gerarTokenSeguro } from "../../compartilhado/seguranca/criptografia";
import { obterConfiguracaoEmail } from "../newsletter/newsletter.servico";

const mensagemGenerica = `Se o e-mail estiver cadastrado, enviaremos um link de recuperação. Confira também a caixa de spam. Para solicitar novamente, aguarde pelo menos ${ambiente.RECUPERACAO_INTERVALO_MINUTOS} minutos.`;
const hashChave = (valor: string) => gerarHashSha256(valor.toLowerCase().trim());

async function reservarLimite(tipo: "origem" | "identidade", chave: string, intervalo: number, maximo: number) {
  const resultado = await conexao.query<{ permitido: boolean }>(
    `INSERT INTO limites_recuperacao_senha(tipo,chave_hash,tentativas,janela_inicio,proximo_envio_em)
     VALUES($1,$2,1,now(),now()+($3::int*interval '1 minute'))
     ON CONFLICT(tipo,chave_hash) DO UPDATE SET
       tentativas=CASE WHEN limites_recuperacao_senha.janela_inicio < now()-interval '1 hour' THEN 1 ELSE limites_recuperacao_senha.tentativas+1 END,
       janela_inicio=CASE WHEN limites_recuperacao_senha.janela_inicio < now()-interval '1 hour' THEN now() ELSE limites_recuperacao_senha.janela_inicio END,
       proximo_envio_em=now()+($3::int*interval '1 minute')
     WHERE limites_recuperacao_senha.proximo_envio_em <= now()
       AND (limites_recuperacao_senha.janela_inicio < now()-interval '1 hour' OR limites_recuperacao_senha.tentativas < $4::int)
     RETURNING true permitido`, [tipo, hashChave(chave), intervalo, maximo]);
  return resultado.rowCount === 1;
}

export class ServicoRecuperacaoSenha {
  async solicitar(email: string, ip: string): Promise<string> {
    const inicio = Date.now();
    try {
      const origemPermitida = await reservarLimite("origem", ip, 1, ambiente.RECUPERACAO_MAX_POR_IP_HORA);
      const identidadePermitida = origemPermitida && await reservarLimite("identidade", email, ambiente.RECUPERACAO_INTERVALO_MINUTOS, 12);
      if (origemPermitida && identidadePermitida) {
        const usuario = await conexao.query<{ id: string; nome: string; email: string }>(
          "SELECT id,nome,email FROM administradores WHERE lower(email)=lower($1) AND ativo=true LIMIT 1", [email]);
        const administrador = usuario.rows[0];
        if (administrador) {
          const configuracao = await obterConfiguracaoEmail();
          if (configuracao.ativo && configuracao.host) {
            const token = gerarTokenSeguro();
            const url = new URL("/recuperar-senha", ambiente.URL_PUBLICA_PORTAL);
            url.searchParams.set("token", token);
            const transporte = nodemailer.createTransport({host: configuracao.host, port: configuracao.porta, secure: configuracao.seguro,
              auth: configuracao.usuario ? {user: configuracao.usuario, pass: configuracao.senha} : undefined});
            await conexao.query("UPDATE recuperacoes_senha SET utilizado_em=now() WHERE administrador_id=$1 AND utilizado_em IS NULL", [administrador.id]);
            const registro = await conexao.query<{ id: string }>(
              `INSERT INTO recuperacoes_senha(administrador_id,token_hash,expira_em)
               VALUES($1,$2,now()+($3::int*interval '1 minute')) RETURNING id`,
              [administrador.id, gerarHashSha256(token), ambiente.RECUPERACAO_EXPIRACAO_MINUTOS]);
            void transporte.sendMail({
                from: {name: configuracao.remetenteNome, address: configuracao.remetenteEndereco}, to: administrador.email,
                subject: "Recuperação de senha — MOVE.ON",
                text: `Olá, ${administrador.nome}.\n\nRecebemos uma solicitação para redefinir sua senha. Acesse o link em até ${ambiente.RECUPERACAO_EXPIRACAO_MINUTOS} minutos:\n${url}\n\nSe não foi você, ignore este e-mail. O link funciona apenas uma vez.`,
                html: `<div style="font:17px Arial,sans-serif;max-width:620px;margin:auto;padding:32px;color:#222"><h1 style="color:#fe3000">MOVE.ON</h1><h2>Recuperação de senha</h2><p>Olá, ${administrador.nome.replace(/[&<>"']/g, "")}. Recebemos uma solicitação para redefinir sua senha.</p><p>Este link expira em ${ambiente.RECUPERACAO_EXPIRACAO_MINUTOS} minutos e funciona apenas uma vez.</p><p><a href="${url.toString().replace(/&/g, "&amp;")}" style="background:#fe3000;color:white;padding:14px 22px;border-radius:10px;display:inline-block;text-decoration:none">Criar nova senha</a></p><p>Se não foi você, ignore esta mensagem.</p></div>`,
              }).catch(async (erro: unknown) => {
                try { await conexao.query("DELETE FROM recuperacoes_senha WHERE id=$1", [registro.rows[0].id]); }
                catch (falha) { console.error("Falha ao invalidar link não enviado:", falha); }
                console.error("Falha ao enviar recuperação de senha:", erro);
              });
          }
        }
      }
    } catch (erro) {
      // Resposta pública idêntica inclusive quando o provedor de e-mail falhar.
      console.error("Falha na solicitação de recuperação:", erro);
    } finally {
      const restante = 1800 - (Date.now() - inicio);
      if (restante > 0) await new Promise((resolver) => setTimeout(resolver, restante));
    }
    return mensagemGenerica;
  }

  async verificar(token: string): Promise<boolean> {
    const resultado = await conexao.query(
      `SELECT 1 FROM recuperacoes_senha WHERE token_hash=$1 AND utilizado_em IS NULL AND expira_em>now() LIMIT 1`,
      [gerarHashSha256(token)]);
    return resultado.rowCount === 1;
  }

  async redefinir(token: string, senha: string): Promise<boolean> {
    // Evita trabalho bcrypt para tokens arbitrários; a transação confere tudo outra vez.
    if (!(await this.verificar(token))) return false;
    // O hash é calculado antes do bloqueio da linha para não manter uma transação aberta durante bcrypt.
    const senhaHash = await hash(senha, ambiente.CUSTO_HASH_SENHA);
    const cliente = await conexao.connect();
    try {
      await cliente.query("BEGIN");
      const resultado = await cliente.query<{ id: string; administrador_id: string }>(
        `SELECT id,administrador_id FROM recuperacoes_senha WHERE token_hash=$1 FOR UPDATE`, [gerarHashSha256(token)]);
      const registro = resultado.rows[0];
      if (!registro) { await cliente.query("ROLLBACK"); return false; }
      const atualizado = await cliente.query(
        `UPDATE recuperacoes_senha SET utilizado_em=now() WHERE id=$1 AND utilizado_em IS NULL AND expira_em>now() RETURNING id`, [registro.id]);
      if (!atualizado.rowCount) { await cliente.query("ROLLBACK"); return false; }
      const administradorAtualizado = await cliente.query("UPDATE administradores SET senha_hash=$2 WHERE id=$1 AND ativo=true RETURNING id", [registro.administrador_id, senhaHash]);
      if (!administradorAtualizado.rowCount) { await cliente.query("ROLLBACK"); return false; }
      await cliente.query("UPDATE sessoes_administrativas SET revogada_em=now() WHERE administrador_id=$1 AND revogada_em IS NULL", [registro.administrador_id]);
      await cliente.query("UPDATE recuperacoes_senha SET utilizado_em=now() WHERE administrador_id=$1 AND utilizado_em IS NULL", [registro.administrador_id]);
      await cliente.query("COMMIT");
      return true;
    } catch (erro) { await cliente.query("ROLLBACK"); throw erro; }
    finally { cliente.release(); }
  }
}
