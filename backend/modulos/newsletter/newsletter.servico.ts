import { createHmac, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { ambiente } from "../../configuracoes/ambiente";
import { conexao } from "../../infraestrutura/banco/conexao";
import { descriptografarConfiguracao } from "../../compartilhado/seguranca/criptografia-configuracoes";

const assinatura = (id: string, segredo: string) =>
  createHmac("sha256", segredo)
    .update(id)
    .digest("base64url");

export async function obterConfiguracaoEmail() {
  const resultado = await conexao.query(
    `SELECT email_ativo "emailAtivo",smtp_host "smtpHost",smtp_porta "smtpPorta",
     smtp_seguro "smtpSeguro",smtp_usuario "smtpUsuario",
     smtp_senha_criptografada "smtpSenhaCriptografada",
     email_remetente_nome "remetenteNome",email_remetente_endereco "remetenteEndereco",
     email_segredo_cancelamento_criptografado "segredoCriptografado"
     FROM configuracoes_portal WHERE id=1`,
  );
  const dados = resultado.rows[0] ?? {};
  return {
    ativo: dados.emailAtivo ?? ambiente.EMAIL_ATIVO,
    host: dados.smtpHost || ambiente.SMTP_HOST,
    porta: dados.smtpPorta || ambiente.SMTP_PORTA,
    seguro: dados.smtpSeguro ?? ambiente.SMTP_SEGURO,
    usuario: dados.smtpUsuario || ambiente.SMTP_USUARIO,
    senha:
      descriptografarConfiguracao(dados.smtpSenhaCriptografada) ||
      ambiente.SMTP_SENHA,
    remetenteNome: dados.remetenteNome || ambiente.EMAIL_REMETENTE_NOME,
    remetenteEndereco:
      dados.remetenteEndereco || ambiente.EMAIL_REMETENTE_ENDERECO,
    segredo:
      descriptografarConfiguracao(dados.segredoCriptografado) ||
      ambiente.EMAIL_SEGREDO_CANCELAMENTO,
  };
}

export async function tokenCancelamento(id: string) {
  const configuracao = await obterConfiguracaoEmail();
  return `${id}.${assinatura(id, configuracao.segredo)}`;
}

export async function idTokenValido(token: string) {
  const [id, sig] = token.split(".");
  if (!id || !sig) return null;
  const configuracao = await obterConfiguracaoEmail();
  const esperado = assinatura(id, configuracao.segredo);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(esperado)) ? id : null;
  } catch {
    return null;
  }
}

const escapar = (valor: string) =>
  valor.replace(
    /[&<>"']/g,
    (caractere) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[caractere]!,
  );

const substituir = (texto: string, dados: Record<string, string>) =>
  Object.entries(dados).reduce(
    (resultado, [chave, valor]) =>
      resultado.replaceAll(`{{${chave}}}`, valor),
    texto,
  );

const urlPublica = (caminho: string | null | undefined) => {
  if (!caminho) return "";
  try {
    return new URL(caminho, `${ambiente.URL_PUBLICA_PORTAL}/`).toString();
  } catch {
    return "";
  }
};

const corSegura = (cor: string) =>
  /^#[0-9a-f]{6}$/i.test(cor) ? cor : "#fe3000";

const formatarData = (valor: string | Date | null) =>
  valor
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Sao_Paulo",
      }).format(new Date(valor))
    : "Publicada agora";

export class ServicoNewsletter {
  private processamentoEmAndamento = false;

  async publicarAgendadas() {
    const resultado = await conexao.query(
      "UPDATE publicacoes SET situacao='publicada',publicado_em=coalesce(publicado_em,agendado_para),atualizado_em=now() WHERE situacao='agendada' AND agendado_para<=now() RETURNING id",
    );
    for (const item of resultado.rows) await this.enfileirar(item.id);
    await this.processar();
  }

  async enfileirar(publicacaoId: string) {
    await conexao.query(
      `INSERT INTO envios_newsletter(inscricao_id,publicacao_id)
       SELECT id,$1 FROM inscricoes_newsletter WHERE cancelado_em IS NULL
       ON CONFLICT DO NOTHING`,
      [publicacaoId],
    );
    void this.processar().catch((erro) =>
      console.error("Falha ao iniciar o processamento da newsletter:", erro),
    );
  }

  async processar() {
    const configuracao = await obterConfiguracaoEmail();
    if (!configuracao.ativo) return;
    if (this.processamentoEmAndamento) return;
    this.processamentoEmAndamento = true;
    try {
      await conexao.query(
        `UPDATE envios_newsletter
         SET situacao='falhou',erro='Envio interrompido; reenfileirado automaticamente.'
         WHERE situacao='enviando' AND criado_em < now() - interval '10 minutes'`,
      );
    const transporte = nodemailer.createTransport({
      host: configuracao.host,
      port: configuracao.porta,
      secure: configuracao.seguro,
      auth: configuracao.usuario
        ? { user: configuracao.usuario, pass: configuracao.senha }
        : undefined,
    });
    const itens = await conexao.query(
      `SELECT e.id,i.id inscricao_id,i.email,p.titulo,p.slug,p.resumo,
        p.imagem_capa_url,p.publicado_em,c.nome,c.descricao,c.caminho_logo,
        c.cor_primaria,c.newsletter_assunto,c.newsletter_texto,
        coalesce((SELECT string_agg(cat.nome, ', ' ORDER BY cat.nome)
          FROM publicacoes_categorias pc
          JOIN categorias cat ON cat.id=pc.categoria_id
          WHERE pc.publicacao_id=p.id),'Conteúdo') categorias
       FROM envios_newsletter e
       JOIN inscricoes_newsletter i ON i.id=e.inscricao_id
       JOIN publicacoes p ON p.id=e.publicacao_id
       CROSS JOIN configuracoes_portal c
       WHERE e.situacao IN ('pendente','falhou') AND e.tentativas<3
         AND i.cancelado_em IS NULL AND p.situacao='publicada'
       ORDER BY e.criado_em LIMIT 50`,
    );

    for (const item of itens.rows) {
      await conexao.query(
        "UPDATE envios_newsletter SET situacao='enviando',tentativas=tentativas+1 WHERE id=$1",
        [item.id],
      );
      try {
        const link = urlPublica(`/publicacao/${encodeURIComponent(item.slug)}`);
        const cancelar = urlPublica(
          `/api/portal/newsletter/cancelar?token=${encodeURIComponent(`${item.inscricao_id}.${assinatura(item.inscricao_id, configuracao.segredo)}`)}`,
        );
        const variaveis = {
          nome_portal: String(item.nome),
          titulo: String(item.titulo),
          resumo: String(item.resumo),
          categorias: String(item.categorias),
          data_publicacao: formatarData(item.publicado_em),
          link_publicacao: link,
        };
        const valoresHtml = Object.fromEntries(
          Object.entries(variaveis).map(([chave, valor]) => [
            chave,
            escapar(valor),
          ]),
        );
        const introducao = escapar(
          substituir(String(item.newsletter_texto), variaveis),
        ).replaceAll("\n", "<br>");
        const logo = urlPublica(item.caminho_logo);
        const capa = urlPublica(item.imagem_capa_url);
        const cor = corSegura(item.cor_primaria);
        const preheader = `Nova publicação: ${variaveis.titulo}. Leia em primeira mão na ${variaveis.nome_portal}.`;
        const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${valoresHtml.titulo}</title></head><body style="margin:0;background:#efefef;font-family:Arial,sans-serif;color:#171717"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapar(preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efefef"><tr><td align="center" style="padding:32px 12px"><table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,.10)"><tr><td align="center" style="background:#111;padding:30px 24px">${logo ? `<a href="${ambiente.URL_PUBLICA_PORTAL}" style="text-decoration:none"><img src="${escapar(logo)}" alt="${valoresHtml.nome_portal}" width="170" style="display:block;max-width:170px;height:auto;border:0"></a>` : `<strong style="color:#fff;font-size:25px">${valoresHtml.nome_portal}</strong>`}<p style="margin:12px 0 0;color:#bbb;font-size:13px">${escapar(String(item.descricao || "Conteúdo que move"))}</p></td></tr>${capa ? `<tr><td><a href="${link}"><img src="${escapar(capa)}" alt="Imagem de capa: ${valoresHtml.titulo}" width="640" style="display:block;width:100%;height:auto;max-height:360px;object-fit:cover;border:0"></a></td></tr>` : ""}<tr><td style="padding:38px 42px 34px"><p style="margin:0 0 12px;color:${cor};font-size:13px;font-weight:800;letter-spacing:1.4px">NOVA PUBLICAÇÃO • EM PRIMEIRA MÃO</p><h1 style="margin:0 0 14px;font-size:32px;line-height:1.18;color:#171717">${valoresHtml.titulo}</h1><p style="margin:0 0 22px;color:#777;font-size:13px;font-weight:700">${valoresHtml.categorias} &nbsp;•&nbsp; ${valoresHtml.data_publicacao}</p><p style="margin:0 0 20px;font-size:18px;line-height:1.65;color:#333">${introducao}</p><div style="margin:0 0 26px;padding:18px 20px;background:#f6f6f6;border-left:4px solid ${cor};color:#555;font-size:16px;line-height:1.6">${valoresHtml.resumo}</div><a href="${link}" style="display:inline-block;background:${cor};color:#fff;text-decoration:none;padding:16px 24px;border-radius:11px;font-size:16px;font-weight:800">Ler publicação completa →</a><p style="margin:24px 0 0;color:#888;font-size:12px;line-height:1.55">Se o botão não funcionar, acesse:<br><a href="${link}" style="color:${cor};word-break:break-all">${link}</a></p></td></tr><tr><td style="padding:24px 38px;background:#f6f6f6;color:#777;font-size:12px;line-height:1.6;text-align:center">Você recebeu este e-mail porque se inscreveu para receber novidades da ${valoresHtml.nome_portal}.<br><a href="${cancelar}" style="color:#777;text-decoration:underline">Cancelar o recebimento de novas atualizações</a></td></tr></table></td></tr></table></body></html>`;
        await transporte.sendMail({
          from: {
            name: configuracao.remetenteNome,
            address: configuracao.remetenteEndereco,
          },
          to: item.email,
          subject: substituir(item.newsletter_assunto, variaveis),
          html,
          text: `${item.nome}\nNOVA PUBLICAÇÃO — EM PRIMEIRA MÃO\n\n${item.titulo}\n${item.categorias} • ${variaveis.data_publicacao}\n\n${substituir(item.newsletter_texto, variaveis)}\n\n${item.resumo}\n\nLeia a publicação completa: ${link}\n\nCancelar o recebimento: ${cancelar}`,
        });
        await conexao.query(
          "UPDATE envios_newsletter SET situacao='enviado',enviado_em=now(),erro=null WHERE id=$1",
          [item.id],
        );
      } catch (erro) {
        await conexao.query(
          "UPDATE envios_newsletter SET situacao='falhou',erro=$2 WHERE id=$1",
          [item.id, String(erro).slice(0, 1000)],
        );
      }
    }
    } finally {
      this.processamentoEmAndamento = false;
    }
  }
}

export const servicoNewsletter = new ServicoNewsletter();
