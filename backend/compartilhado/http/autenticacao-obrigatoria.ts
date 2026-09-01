import type { NextFunction, Request, Response } from "express";
import { lerCookie, NOME_COOKIE_SESSAO } from "./cookies";
import { RepositorioAutenticacao } from "../../modulos/autenticacao/autenticacao.repositorio";
import { ServicoAutenticacao } from "../../modulos/autenticacao/autenticacao.servico";

const servico = new ServicoAutenticacao(new RepositorioAutenticacao());

export async function exigirAutenticacao(
  requisicao: Request,
  resposta: Response,
  proximo: NextFunction,
): Promise<void> {
  const administrador = await servico.obterAdministrador(
    lerCookie(requisicao, NOME_COOKIE_SESSAO),
  );
  if (!administrador) {
    resposta.status(401).json({ erro: "Sessão inválida ou expirada." });
    return;
  }
  resposta.locals.administrador = administrador;
  proximo();
}
