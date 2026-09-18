import nodemailer from "nodemailer";
import { ambiente } from "../../configuracoes/ambiente";
import { gerarHashSha256 } from "../../compartilhado/seguranca/criptografia";
import { obterConfiguracaoEmail } from "../newsletter/newsletter.servico";
import { eventosContato } from "./contato.eventos";
import { RepositorioContato } from "./contato.repositorio";

type RespostaRecaptcha = {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
};
const escapar = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const linhas = (v: string) => escapar(v).replace(/\r?\n/g, "<br>");

export class ServicoContato {
  constructor(private readonly repositorio = new RepositorioContato()) {}
  private async validarRecaptcha(token: string, ip: string) {
    const c = await this.repositorio.segredoRecaptcha();
    if (!c.ativo) return null;
    if (!token || !c.segredo)
      throw new Error("Não foi possível validar a proteção anti-robô.");
    const controlador = new AbortController();
    const tempo = setTimeout(() => controlador.abort(), 6000);
    try {
      const corpo = new URLSearchParams({
        secret: c.segredo,
        response: token,
        remoteip: ip,
      });
      const resposta = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        { method: "POST", body: corpo, signal: controlador.signal },
      );
      const dados = (await resposta.json()) as RespostaRecaptcha;
      if (
        !dados.success ||
        dados.action !== "contato" ||
        Number(dados.score ?? 0) < c.minimo
      )
        throw new Error("Não foi possível confirmar o envio. Tente novamente.");
      return Number(dados.score ?? 0);
    } finally {
      clearTimeout(tempo);
    }
  }
  async receber(
    d: {
      nome: string;
      email: string;
      empresa: string;
      cargo: string;
      clienteSap: string;
      desafio: string;
      tokenRecaptcha: string;
    },
    ip: string,
    agente: string,
  ) {
    const ipHash = gerarHashSha256(`contato:${ip}`);
    if (
      !(await this.repositorio.verificarLimite(
        ipHash,
        ambiente.MAX_MENSAGENS_CONTATO_POR_IP_HORA,
      ))
    ) {
      await this.repositorio.registrarTentativa(ipHash, false, "limite");
      throw new Error(
        "Limite de mensagens atingido. Tente novamente mais tarde.",
      );
    }
    const conteudoHash = gerarHashSha256(
      `${d.email}|${d.desafio}`.toLowerCase(),
    );
    if (await this.repositorio.duplicada(conteudoHash)) {
      await this.repositorio.registrarTentativa(ipHash, false, "duplicada");
      throw new Error("Esta mensagem já foi recebida.");
    }
    const pontuacao = await this.validarRecaptcha(d.tokenRecaptcha, ip);
    const assunto = `Contato de ${d.empresa}`.slice(0, 180);
    const mensagem = await this.repositorio.criar({
      ...d,
      assunto,
      mensagem: d.desafio,
      ipHash,
      conteudoHash,
      agenteUsuario: agente.slice(0, 500),
      pontuacaoRecaptcha: pontuacao,
    });
    await this.repositorio.registrarTentativa(ipHash, true, "aceita");
    eventosContato.publicar({ tipo: "nova_mensagem", ...mensagem });
    void this.encaminhar(mensagem.id).catch((e) =>
      console.error("Falha ao encaminhar contato:", e),
    );
    return mensagem;
  }
  private async transporte() {
    const c = await obterConfiguracaoEmail();
    if (!c.ativo || !c.host || !c.usuario || !c.senha) return null;
    return {
      c,
      transporte: nodemailer.createTransport({
        host: c.host,
        port: c.porta,
          secure: c.seguro,
          requireTLS: !c.seguro,
        auth: { user: c.usuario, pass: c.senha },
      }),
    };
  }
  async encaminhar(id: string) {
    const cfg = await this.repositorio.configuracaoAdministrativa();
    if (!cfg.encaminharEmail || !cfg.email) return;
    const m = await this.repositorio.obter(id);
    const email = await this.transporte();
    if (!m || !email) return;
    await email.transporte.sendMail({
      from: `${email.c.remetenteNome} <${email.c.remetenteEndereco}>`,
      to: cfg.email,
      replyTo: m.email,
      subject: `Nova mensagem no portal — ${m.assunto}`,
      html: `<div style="background:#f4f4f4;padding:32px;font-family:Arial;color:#171717"><div style="max-width:680px;margin:auto;background:white;border-radius:18px;overflow:hidden"><div style="background:#111;padding:24px;color:white;border-top:5px solid #fe3000"><b style="font-size:24px">MOVE.ON</b><p>Nova mensagem de contato</p></div><div style="padding:30px"><h1 style="font-size:25px">${escapar(m.assunto)}</h1><p><b>Nome:</b> ${escapar(m.nome)}<br><b>E-mail:</b> ${escapar(m.email)}<br><b>Empresa:</b> ${escapar(m.empresa)}<br><b>Cargo:</b> ${escapar(m.cargo)}<br><b>Cliente SAP:</b> ${escapar(m.clienteSap)}</p><div style="padding:20px;background:#f7f7f7;border-left:4px solid #fe3000">${linhas(m.mensagem)}</div><p style="color:#666;font-size:13px">Responda pela caixa de entrada do painel administrativo.</p></div></div></div>`,
    });
  }
  async responder(id: string, resposta: string, adminId: string) {
    const m = await this.repositorio.obter(id, true);
    if (!m) return false;
    const email = await this.transporte();
    if (!email)
      throw new Error(
        "Configure e ative o servidor de e-mail antes de responder.",
      );
    await email.transporte.sendMail({
      from: `${email.c.remetenteNome} <${email.c.remetenteEndereco}>`,
      to: m.email,
      replyTo: email.c.remetenteEndereco,
      subject: `Re: ${m.assunto}`,
      html: `<div style="background:#f4f4f4;padding:32px;font-family:Arial;color:#171717"><div style="max-width:680px;margin:auto;background:white;border-radius:18px;overflow:hidden"><div style="height:5px;background:#fe3000"></div><div style="padding:30px"><h2>Olá, ${escapar(m.nome)}.</h2><div style="font-size:17px;line-height:1.7">${linhas(resposta)}</div><hr style="border:0;border-top:1px solid #ddd;margin:28px 0"><b>Equipe MOVE.ON</b></div></div></div>`,
      text: `Olá, ${m.nome}.\n\n${resposta}\n\nEquipe MOVE.ON`,
    });
    return this.repositorio.responder(id, resposta, adminId);
  }
}
