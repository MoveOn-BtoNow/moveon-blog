import type { Request, Response } from "express";
import { gerarHashSha256 } from "../../compartilhado/seguranca/criptografia";
import {
  criarCookieVisitante,
  lerCookie,
} from "../../compartilhado/http/cookies";
import { randomBytes } from "node:crypto";
import {
  configurarOpenTelemetry,
  registrarLog,
} from "../../infraestrutura/observabilidade/open-telemetry";
import { ambiente } from "../../configuracoes/ambiente";
import { higienizarConteudoHtml } from "../../compartilhado/seguranca/higienizar-html";
import {
  esquemaConsentimentoLegal,
  esquemaDocumentoLegal,
} from "./conteudos-legais.validacao";
import { RepositorioIntegracoes } from "./integracoes.repositorio";
import {
  esquemaAnalytics,
  esquemaArmazenamento,
  esquemaConsentimento,
  esquemaIntegracoes,
  esquemaOpenTelemetry,
} from "./integracoes.validacao";
const repositorio = new RepositorioIntegracoes();
export class ControladorIntegracoes {
  conteudosLegais = async (_req: Request, res: Response) =>
    res.json(await repositorio.obterConteudosLegais());
  salvarConsentimento = async (req: Request, res: Response) => {
    const v = esquemaConsentimentoLegal.safeParse(req.body);
    if (!v.success)
      return res
        .status(400)
        .json({ erro: "Revise o título e o conteúdo do consentimento." });
    const conteudoHtml = higienizarConteudoHtml(v.data.conteudoHtml);
    if (!conteudoHtml)
      return res
        .status(400)
        .json({ erro: "O conteúdo ficou vazio após a validação." });
    await repositorio.salvarConsentimento(
      { ...v.data, conteudoHtml },
      res.locals.administrador.id,
    );
    return res.json(await repositorio.obterConteudosLegais());
  };
  salvarDocumento =
    (tipo: "privacidade" | "termos") => async (req: Request, res: Response) => {
      const v = esquemaDocumentoLegal.safeParse(req.body);
      if (!v.success)
        return res
          .status(400)
          .json({
            erro: "Revise o título, subtítulo e conteúdo do documento.",
          });
      const conteudoHtml = higienizarConteudoHtml(v.data.conteudoHtml);
      if (!conteudoHtml)
        return res
          .status(400)
          .json({ erro: "O conteúdo ficou vazio após a validação." });
      await repositorio.salvarDocumento(
        tipo,
        { ...v.data, conteudoHtml },
        res.locals.administrador.id,
      );
      return res.json(await repositorio.obterConteudosLegais());
    };
  obter = async (_req: Request, res: Response) =>
    res.json(await repositorio.obter(false));
  salvar = async (req: Request, res: Response) => {
    const v = esquemaIntegracoes.safeParse(req.body);
    if (!v.success)
      return res.status(400).json({
        erro: "Revise as configurações de integrações.",
        detalhes: v.error.flatten(),
      });
    try {
      await repositorio.salvar(v.data, res.locals.administrador.id);
      await configurarOpenTelemetry();
      registrarLog("info", "configuracoes_integracoes_atualizadas", {
        administrador_id: res.locals.administrador.id,
      });
      return res.json(await repositorio.obter(false));
    } catch (e) {
      return res.status(400).json({
        erro: e instanceof Error ? e.message : "Não foi possível salvar.",
      });
    }
  };
  salvarArmazenamento = async (req: Request, res: Response) => {
    const v = esquemaArmazenamento.safeParse(req.body);
    if (!v.success)
      return res.status(400).json({
        erro: "Revise as configurações de armazenamento.",
        detalhes: v.error.flatten(),
      });
    try {
      await repositorio.salvarArmazenamento(
        v.data,
        res.locals.administrador.id,
      );
      return res.json(await repositorio.obter(false));
    } catch (e) {
      return res.status(400).json({
        erro: e instanceof Error ? e.message : "Não foi possível salvar.",
      });
    }
  };
  salvarAnalytics = async (req: Request, res: Response) => {
    const v = esquemaAnalytics.safeParse(req.body);
    if (!v.success)
      return res.status(400).json({
        erro: "Revise as configurações do Google Analytics.",
        detalhes: v.error.flatten(),
      });
    try {
      await repositorio.salvarAnalytics(v.data, res.locals.administrador.id);
      return res.json(await repositorio.obter(false));
    } catch (e) {
      return res.status(400).json({
        erro: e instanceof Error ? e.message : "Não foi possível salvar.",
      });
    }
  };
  salvarOpenTelemetry = async (req: Request, res: Response) => {
    const v = esquemaOpenTelemetry.safeParse(req.body);
    if (!v.success)
      return res.status(400).json({
        erro: "Revise as configurações do OpenTelemetry.",
        detalhes: v.error.flatten(),
      });
    try {
      await repositorio.salvarOpenTelemetry(
        v.data,
        res.locals.administrador.id,
      );
      await configurarOpenTelemetry();
      registrarLog("info", "configuracao_opentelemetry_atualizada", {
        administrador_id: res.locals.administrador.id,
      });
      return res.json(await repositorio.obter(false));
    } catch (e) {
      return res.status(400).json({
        erro: e instanceof Error ? e.message : "Não foi possível salvar.",
      });
    }
  };
  publica = async (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({
      ...(await repositorio.publica()),
      ...(await repositorio.obterConteudosLegais()),
    });
  };
  consentir = async (req: Request, res: Response) => {
    const v = esquemaConsentimento.safeParse(req.body);
    if (!v.success)
      return res.status(400).json({ erro: "Preferências inválidas." });
    const cfg = await repositorio.publica();
    let identificador = lerCookie(req, ambiente.NOME_COOKIE_VISITANTE);
    if (!identificador) {
      identificador = randomBytes(32).toString("hex");
      res.append("Set-Cookie", criarCookieVisitante(identificador));
    }
    const visitante = gerarHashSha256(identificador);
    const ip = gerarHashSha256(`consentimento:${req.ip || ""}`);
    await repositorio.consentir(
      v.data,
      visitante,
      ip,
      req.get("user-agent") || "",
      cfg.versaoPolitica,
    );
    return res.status(204).end();
  };
}
