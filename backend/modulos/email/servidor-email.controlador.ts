import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";
import { ambiente } from "../../configuracoes/ambiente";
import { criptografarConfiguracao } from "../../compartilhado/seguranca/criptografia-configuracoes";
import { obterConfiguracaoEmail } from "../newsletter/newsletter.servico";
import { RepositorioServidorEmail } from "./servidor-email.repositorio";

const repositorio = new RepositorioServidorEmail();
const esquema = z.object({
  emailAtivo:z.boolean(),smtpHost:z.string().trim().min(1).max(255),
  smtpPorta:z.number().int().min(1).max(65535),smtpSeguro:z.boolean(),
  smtpUsuario:z.string().trim().min(1).max(254),smtpSenha:z.string().max(500).optional(),
  emailRemetenteNome:z.string().trim().min(1).max(180),
  emailRemetenteEndereco:z.email().max(254),
  emailSegredoCancelamento:z.string().min(32).max(500).optional(),
}).strict();

function diagnostico(erro: unknown): string {
  const e=erro as {code?:string;responseCode?:number;message?:string};
  if (e.code==="EAUTH" || e.responseCode===535) return "O servidor recusou as credenciais. Confira o usuário e a senha de app SMTP.";
  if (e.code==="ETIMEDOUT" || e.code==="ECONNECTION") return "O servidor SMTP não respondeu. Confira host, porta e conectividade da VPS.";
  if (e.code==="ESOCKET" || /socket close|wrong version number/i.test(e.message ?? "")) return "A conexão SMTP foi encerrada. Confira a combinação de porta e TLS e se o provedor permite o envio.";
  if (e.code==="EENVELOPE" || (e.responseCode && e.responseCode>=500)) return "O servidor rejeitou o remetente ou destinatário. Confira os endereços e a autorização da conta SMTP.";
  return "O teste não pôde ser concluído. Confira as configurações e os logs do serviço.";
}

export class ControladorServidorEmail {
  obter = async (_req:Request,res:Response) => {
    const dados=await repositorio.obter();
    res.setHeader("Cache-Control","no-store");
    res.json({
      ...dados,
      emailAtivo:dados.emailAtivo ?? ambiente.EMAIL_ATIVO,
      smtpHost:dados.smtpHost || ambiente.SMTP_HOST,
      smtpPorta:dados.smtpPorta || ambiente.SMTP_PORTA,
      smtpSeguro:dados.smtpSeguro ?? ambiente.SMTP_SEGURO,
      smtpUsuario:dados.smtpUsuario || ambiente.SMTP_USUARIO,
      emailRemetenteNome:dados.emailRemetenteNome || ambiente.EMAIL_REMETENTE_NOME,
      emailRemetenteEndereco:dados.emailRemetenteEndereco || ambiente.EMAIL_REMETENTE_ENDERECO,
      smtpSenhaConfigurada:dados.smtpSenhaConfigurada || Boolean(ambiente.SMTP_SENHA),
      emailSegredoConfigurado:dados.emailSegredoConfigurado || Boolean(ambiente.EMAIL_SEGREDO_CANCELAMENTO),
    });
  };

  salvar = async (req:Request,res:Response) => {
    const validacao=esquema.safeParse(req.body);
    if (!validacao.success) {
      res.status(400).json({erro:"Revise as configurações do servidor de e-mail.",detalhes:validacao.error.flatten()});return;
    }
    const dados=validacao.data;
    await repositorio.salvar({
      ...dados,
      smtpSenhaCriptografada:dados.smtpSenha?criptografarConfiguracao(dados.smtpSenha):undefined,
      emailSegredoCriptografado:dados.emailSegredoCancelamento?criptografarConfiguracao(dados.emailSegredoCancelamento):undefined,
    });
    res.setHeader("Cache-Control","no-store");
    res.json({ok:true});
  };

  testar = async (_req:Request,res:Response) => {
    const administrador=res.locals.administrador as {id:string;email:string;nome:string};
    const configuracao=await obterConfiguracaoEmail();
    if (!configuracao.ativo || !configuracao.host || !configuracao.remetenteEndereco ||
        (configuracao.usuario && !configuracao.senha)) {
      res.status(400).json({erro:"Ative o envio e configure host, remetente e credenciais SMTP antes de testar."});return;
    }
    if (!(await repositorio.reservarTeste(administrador.id))) {
      res.setHeader("Retry-After","60");
      res.status(429).json({erro:"Aguarde pelo menos um minuto entre testes (máximo de cinco por hora)."});return;
    }
    const transporte=nodemailer.createTransport({
      host:configuracao.host,port:configuracao.porta,secure:configuracao.seguro,
      requireTLS:!configuracao.seguro,
      connectionTimeout:10_000,greetingTimeout:10_000,socketTimeout:15_000,
      auth:configuracao.usuario?{user:configuracao.usuario,pass:configuracao.senha}:undefined,
    });
    try {
      const retorno=await transporte.sendMail({
        from:{name:configuracao.remetenteNome,address:configuracao.remetenteEndereco},
        to:administrador.email,
        subject:"Teste de envio — MOVE.ON",
        text:`Olá, ${administrador.nome}.\n\nEste é um teste do servidor de e-mail do portal MOVE.ON.\nSe recebeu esta mensagem, o servidor SMTP aceitou o envio.`,
        html:`<div style="max-width:600px;margin:auto;padding:32px;font:17px Arial,sans-serif;color:#222"><h1 style="color:#fe3000">MOVE.ON</h1><h2>Teste de envio concluído</h2><p>O servidor SMTP aceitou este e-mail de teste. A configuração também é usada pela recuperação de senha e pela newsletter.</p></div>`,
      });
      if (!retorno.accepted.some(email=>(typeof email==="string"?email:email.address).toLowerCase()===administrador.email.toLowerCase())) {
        res.status(502).json({erro:"O provedor não aceitou o destinatário do teste. Confira o e-mail da conta administradora."});return;
      }
      res.json({mensagem:`O provedor SMTP aceitou o envio para o e-mail do administrador. Confira a caixa de entrada e o spam.`});
    } catch (erro) {
      const e=erro as {code?:string;responseCode?:number;command?:string};
      console.error("Teste SMTP falhou:",{codigo:e.code,estado:e.responseCode,etapa:e.command});
      res.status(502).json({erro:diagnostico(erro)});
    } finally {transporte.close();}
  };
}
