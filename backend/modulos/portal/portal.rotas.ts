import { Router } from "express";
import { z } from "zod";
import { gerarHashSha256 } from "../../compartilhado/seguranca/criptografia";
import {
  criarCookieVisitante,
  lerCookie,
  NOME_COOKIE_SESSAO,
} from "../../compartilhado/http/cookies";
import { ServicoAutenticacao } from "../autenticacao/autenticacao.servico";
import { RepositorioAutenticacao } from "../autenticacao/autenticacao.repositorio";
import { RepositorioPortal } from "./portal.repositorio";
import { idTokenValido } from "../newsletter/newsletter.servico";
import { conexao } from "../../infraestrutura/banco/conexao";
import { ambiente } from "../../configuracoes/ambiente";
import { randomBytes } from "node:crypto";
import { LimitadorRequisicoes } from "../../compartilhado/seguranca/limitador-requisicoes";
import { ControladorContato } from "../contato/contato.controlador";
import { ControladorIntegracoes } from "../integracoes/integracoes.controlador";
import { entregarObjeto } from "../integracoes/armazenamento-objetos";

const repositorio = new RepositorioPortal();
const autenticacao = new ServicoAutenticacao(new RepositorioAutenticacao());
export const rotasPortal = Router();
const contato = new ControladorContato();
const integracoes = new ControladorIntegracoes();
const limitadorNewsletter = new LimitadorRequisicoes(
  ambiente.MAX_CADASTROS_NEWSLETTER_POR_IP,
  ambiente.JANELA_NEWSLETTER_MINUTOS * 60_000,
);
rotasPortal.get("/midias/:pasta/:arquivo", entregarObjeto);
const obterVisitanteSeguro = (req: Parameters<typeof lerCookie>[0], res: import("express").Response) => {
  let identificador = lerCookie(req, ambiente.NOME_COOKIE_VISITANTE);
  if (!identificador || !/^[a-f0-9]{64}$/i.test(identificador)) {
    identificador = randomBytes(32).toString("hex");
    res.append("Set-Cookie", criarCookieVisitante(identificador));
  }
  return gerarHashSha256(identificador);
};
rotasPortal.get("/inicial", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json(await repositorio.inicial());
});
rotasPortal.get("/contato/configuracao", contato.configuracaoPublica);
rotasPortal.post("/contato/mensagens", contato.enviar);
rotasPortal.get("/privacidade/configuracao", integracoes.publica);
rotasPortal.post("/privacidade/consentimento", integracoes.consentir);
rotasPortal.get("/publicacoes", async (req, res) => {
  const validacao = z
    .object({
      busca: z.string().max(150).optional(),
      categoria: z.string().max(120).optional(),
      cursor: z.string().max(100).optional(),
      limite: z.coerce.number().int().min(1).max(30).default(12),
    })
    .safeParse(req.query);
  if (!validacao.success)
    return void res.status(400).json({ erro: "Filtros inválidos." });
  res.setHeader(
    "Cache-Control",
    validacao.data.busca
      ? "no-store"
      : "public, max-age=30, stale-while-revalidate=120",
  );
  res.json(await repositorio.listarPublicacoes(validacao.data));
});
rotasPortal.get("/publicacoes/:slug", async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, stale-while-revalidate=300",
  );
  const item = await repositorio.obterPublicacaoPorSlug(
    String(req.params.slug),
  );
  if (item) res.json(item);
  else res.status(404).json({ erro: "Publicação não encontrada." });
});
rotasPortal.get("/reacoes/:publicacaoId", async (req, res) => {
  const validacao = z.string().uuid().safeParse(req.params.publicacaoId);
  if (!validacao.success)
    return void res.status(400).json({ erro: "Publicação inválida." });
  res.setHeader("Cache-Control", "private, no-store");
  res.json(
    await repositorio.obterReacoes(
      validacao.data,
      obterVisitanteSeguro(req, res),
    ),
  );
});
rotasPortal.post("/reacoes/:publicacaoId", async (req, res) => {
  const validacao = z.string().uuid().safeParse(req.params.publicacaoId);
  if (!validacao.success)
    return void res.status(400).json({ erro: "Publicação inválida." });
  const origem = req.get("origin");
  if (origem && !ambiente.origensPermitidas.includes(origem))
    return void res.status(403).json({ erro: "Origem não autorizada." });
  const agente = req.get("user-agent") ?? "";
  if (/bot|crawler|spider|preview|headless/i.test(agente))
    return void res.status(403).json({ erro: "Reação não permitida." });
  const resultado = await repositorio.alternarReacao(
    validacao.data,
    obterVisitanteSeguro(req, res),
    gerarHashSha256(req.ip || "origem-desconhecida"),
    agente,
    ambiente.MAX_REACOES_POR_IP_HORA,
  );
  if ("limitado" in resultado && resultado.limitado) {
    res.setHeader("Retry-After", "3600");
    return void res.status(429).json({
      erro: "Limite de reações atingido. Tente novamente mais tarde.",
    });
  }
  if ("inexistente" in resultado && resultado.inexistente)
    return void res.status(404).json({ erro: "Publicação não encontrada." });
  res.json(resultado);
});
rotasPortal.post("/eventos", async (req, res) => {
  const validacao = z
    .object({
      tipo: z.enum([
        "visualizacao",
        "compartilhamento",
        "busca",
        "clique_categoria",
      ]),
      publicacaoId: z.string().uuid().optional(),
      categoriaId: z.string().uuid().optional(),
      referencia: z.string().max(1000).optional(),
    })
    .strict()
    .safeParse(req.body);
  if (!validacao.success)
    return void res.status(400).json({ erro: "Evento inválido." });
  const agente = req.get("user-agent") ?? "";
  const eRobo = /bot|crawler|spider|preview|headless|lighthouse/i.test(agente);
  const eAdministrador = Boolean(
    await autenticacao.obterAdministrador(lerCookie(req, NOME_COOKIE_SESSAO)),
  );
  const visitante = gerarHashSha256(
    String(req.get("x-visitante") || req.ip || "anonimo"),
  );
  await repositorio.registrarEvento(
    validacao.data,
    visitante,
    gerarHashSha256(req.ip || "local"),
    agente,
    eRobo,
    eAdministrador,
  );
  res.status(204).end();
});
rotasPortal.post("/newsletter", async (req, res) => {
  if (!(await repositorio.newsletterDisponivel()))
    return void res.status(404).json({ erro: "Newsletter indisponível." });
  const validacao = z
    .object({
      email: z.string().trim().toLowerCase().email().max(254),
      website: z.string().max(0).optional(),
    })
    .strict()
    .safeParse(req.body);
  if (!validacao.success)
    return void res.status(400).json({ erro: "E-mail inválido." });
  const origem = gerarHashSha256(req.ip || "origem-desconhecida");
  const limite = limitadorNewsletter.consumir(origem);
  res.setHeader("X-RateLimit-Limit", ambiente.MAX_CADASTROS_NEWSLETTER_POR_IP);
  res.setHeader("X-RateLimit-Remaining", limite.tentativasRestantes);
  if (!limite.permitido) {
    res.setHeader("Retry-After", limite.segundosParaTentarNovamente);
    return void res.status(429).json({
      erro: "Muitas tentativas de cadastro. Aguarde um pouco e tente novamente.",
    });
  }
  await repositorio.newsletter(validacao.data.email);
  res.status(201).json({
    ok: true,
    mensagem: "E-mail cadastrado com sucesso na newsletter MOVE.ON!",
  });
});
rotasPortal.get("/newsletter/cancelar", async (req, res) => {
  const id = await idTokenValido(String(req.query.token || ""));
  if (!id) {
    res
      .status(400)
      .type("html")
      .send("<h1>Link de cancelamento inválido.</h1>");
    return;
  }
  await conexao.query(
    "UPDATE inscricoes_newsletter SET cancelado_em=now() WHERE id=$1",
    [id],
  );
  res
    .type("html")
    .send(
      '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Newsletter cancelada</title><body style="font-family:Arial;text-align:center;padding:70px;background:#f5f5f5"><div style="max-width:600px;margin:auto;background:white;padding:45px;border-radius:20px"><h1 style="color:#fe3000">Recebimento cancelado</h1><p>Seu e-mail foi removido da newsletter MOVE.ON. Você não receberá novas atualizações.</p><a href="/" style="color:#fe3000">Voltar ao portal</a></div></body></html>',
    );
});
