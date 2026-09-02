import type { Request, Response } from "express";
import {
  criarCookieExpirado,
  criarCookieSessao,
  lerCookie,
  NOME_COOKIE_SESSAO,
} from "../../compartilhado/http/cookies";
import { ServicoAutenticacao } from "./autenticacao.servico";
import { esquemaCredenciais } from "./autenticacao.validacao";
import { LimitadorLogin } from "./limitador-login";

export class ControladorAutenticacao {
  constructor(
    private readonly servico: ServicoAutenticacao,
    private readonly limitador: LimitadorLogin,
  ) {}

  entrar = async (requisicao: Request, resposta: Response): Promise<void> => {
    const enderecoIp = requisicao.ip || "local";
    const identidade =
      typeof requisicao.body?.email === "string"
        ? requisicao.body.email.trim().toLowerCase().slice(0, 254)
        : "entrada-invalida";
    resposta.setHeader("Cache-Control", "no-store");
    resposta.setHeader("Pragma", "no-cache");
    const bloqueioAtual = await this.limitador.consultar(enderecoIp, identidade);
    if (bloqueioAtual.bloqueado) {
      resposta.setHeader("Retry-After", String(bloqueioAtual.aguardeSegundos));
      resposta.status(429).json({
        erro: "Acesso temporariamente bloqueado por segurança.",
        aguardeSegundos: bloqueioAtual.aguardeSegundos,
      });
      return;
    }
    if (!this.limitador.iniciar(enderecoIp)) {
      resposta.status(429).json({ erro: "Muitas tentativas simultâneas." });
      return;
    }

    try {
      const validacao = esquemaCredenciais.safeParse(requisicao.body);
      if (!validacao.success) {
        const bloqueio = await this.limitador.registrarFalha(enderecoIp, identidade);
        if (bloqueio.bloqueado) {
          resposta.setHeader("Retry-After", String(bloqueio.aguardeSegundos));
          resposta.status(429).json({ erro: "Acesso temporariamente bloqueado por segurança.", aguardeSegundos: bloqueio.aguardeSegundos });
        } else resposta.status(401).json({ erro: "E-mail ou senha incorretos." });
        return;
      }

      const resultado = await this.servico.autenticar(validacao.data, {
        agenteUsuario: requisicao.get("user-agent") ?? null,
        enderecoIp,
      });

      if (!resultado) {
        const bloqueio = await this.limitador.registrarFalha(enderecoIp, identidade);
        if (bloqueio.bloqueado) {
          resposta.setHeader("Retry-After", String(bloqueio.aguardeSegundos));
          resposta.status(429).json({ erro: "Acesso temporariamente bloqueado por segurança.", aguardeSegundos: bloqueio.aguardeSegundos });
        } else resposta.status(401).json({ erro: "E-mail ou senha incorretos." });
        return;
      }

      await this.limitador.limpar(enderecoIp, identidade);
      resposta.setHeader("Set-Cookie", criarCookieSessao(resultado.token));
      resposta.setHeader("Cache-Control", "no-store");
      resposta.json({ administrador: resultado.administrador });
    } finally {
      this.limitador.finalizar(enderecoIp);
    }
  };

  consultarSessao = async (
    requisicao: Request,
    resposta: Response,
  ): Promise<void> => {
    const token = lerCookie(requisicao, NOME_COOKIE_SESSAO);
    const administrador = await this.servico.obterAdministrador(token);
    resposta.setHeader("Cache-Control", "no-store");
    if (!administrador) {
      resposta.status(200).json({ autenticado: false });
      return;
    }
    resposta.json({ autenticado: true, administrador });
  };

  sair = async (requisicao: Request, resposta: Response): Promise<void> => {
    await this.servico.encerrarSessao(
      lerCookie(requisicao, NOME_COOKIE_SESSAO),
    );
    resposta.setHeader("Set-Cookie", criarCookieExpirado());
    resposta.json({ ok: true });
  };
}
