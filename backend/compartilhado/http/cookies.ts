import type { Request } from "express";
import { ambiente } from "../../configuracoes/ambiente";

export const NOME_COOKIE_SESSAO = ambiente.NOME_COOKIE_SESSAO;

export function lerCookie(
  requisicao: Request,
  nome: string,
): string | undefined {
  const item = requisicao.headers.cookie
    ?.split(";")
    .map((valor) => valor.trim())
    .find((valor) => valor.startsWith(`${nome}=`));

  return item?.slice(nome.length + 1);
}

export function criarCookieSessao(
  token: string,
  duracaoSegundos?: number,
): string {
  const duracao =
    duracaoSegundos ?? 60 * 60 * 24 * ambiente.DURACAO_SESSAO_DIAS;
  const seguro = ambiente.COOKIE_SEGURO ? "; Secure" : "";
  const sameSite =
    ambiente.COOKIE_SAMESITE[0].toUpperCase() +
    ambiente.COOKIE_SAMESITE.slice(1);

  return `${NOME_COOKIE_SESSAO}=${token}; HttpOnly${seguro}; SameSite=${sameSite}; Path=/; Max-Age=${duracao}`;
}

export function criarCookieExpirado(): string {
  return criarCookieSessao("", 0);
}

export function criarCookieVisitante(token: string): string {
  const seguro = ambiente.COOKIE_SEGURO ? "; Secure" : "";
  const sameSite =
    ambiente.COOKIE_SAMESITE[0].toUpperCase() +
    ambiente.COOKIE_SAMESITE.slice(1);
  const duracao = 60 * 60 * 24 * ambiente.DURACAO_COOKIE_VISITANTE_DIAS;
  return `${ambiente.NOME_COOKIE_VISITANTE}=${token}; HttpOnly${seguro}; SameSite=${sameSite}; Path=/; Max-Age=${duracao}`;
}
