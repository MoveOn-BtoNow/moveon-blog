import { conexao } from "../../infraestrutura/banco/conexao";

export interface DadosServidorEmail {
  emailAtivo: boolean;
  smtpHost: string;
  smtpPorta: number;
  smtpSeguro: boolean;
  smtpUsuario: string;
  emailRemetenteNome: string;
  emailRemetenteEndereco: string;
  smtpSenhaCriptografada?: string;
  emailSegredoCriptografado?: string;
}

export class RepositorioServidorEmail {
  async obter() {
    const resultado = await conexao.query(
      `SELECT email_ativo "emailAtivo",coalesce(smtp_host,'') "smtpHost",
        smtp_porta "smtpPorta",smtp_seguro "smtpSeguro",
        coalesce(smtp_usuario,'') "smtpUsuario",
        coalesce(email_remetente_nome,'') "emailRemetenteNome",
        coalesce(email_remetente_endereco,'') "emailRemetenteEndereco",
        (smtp_senha_criptografada IS NOT NULL) "smtpSenhaConfigurada",
        (email_segredo_cancelamento_criptografado IS NOT NULL) "emailSegredoConfigurado"
       FROM configuracoes_portal WHERE id=1`,
    );
    return resultado.rows[0];
  }

  async salvar(dados: DadosServidorEmail): Promise<void> {
    await conexao.query(
      `UPDATE configuracoes_portal SET email_ativo=$1,smtp_host=$2,smtp_porta=$3,
        smtp_seguro=$4,smtp_usuario=$5,email_remetente_nome=$6,
        email_remetente_endereco=$7,
        smtp_senha_criptografada=coalesce($8,smtp_senha_criptografada),
        email_segredo_cancelamento_criptografado=coalesce($9,email_segredo_cancelamento_criptografado),
        atualizado_em=now() WHERE id=1`,
      [dados.emailAtivo,dados.smtpHost,dados.smtpPorta,dados.smtpSeguro,
        dados.smtpUsuario,dados.emailRemetenteNome,dados.emailRemetenteEndereco,
        dados.smtpSenhaCriptografada ?? null,dados.emailSegredoCriptografado ?? null],
    );
  }

  async reservarTeste(administradorId: string): Promise<boolean> {
    const resultado = await conexao.query(
      `INSERT INTO limites_teste_servidor_email(administrador_id) VALUES($1)
       ON CONFLICT(administrador_id) DO UPDATE SET
         inicio_janela=CASE WHEN limites_teste_servidor_email.inicio_janela < now()-interval '1 hour' THEN now() ELSE limites_teste_servidor_email.inicio_janela END,
         tentativas=CASE WHEN limites_teste_servidor_email.inicio_janela < now()-interval '1 hour' THEN 1 ELSE limites_teste_servidor_email.tentativas+1 END,
         ultimo_teste_em=now()
       WHERE limites_teste_servidor_email.ultimo_teste_em < now()-interval '1 minute'
         AND (limites_teste_servidor_email.inicio_janela < now()-interval '1 hour' OR limites_teste_servidor_email.tentativas < 5)
       RETURNING administrador_id`,
      [administradorId],
    );
    return resultado.rowCount === 1;
  }
}
