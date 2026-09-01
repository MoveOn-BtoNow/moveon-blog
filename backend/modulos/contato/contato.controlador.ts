import type { Request, Response } from "express";
import { eventosContato } from "./contato.eventos";
import { RepositorioContato } from "./contato.repositorio";
import { ServicoContato } from "./contato.servico";
import {
  esquemaConfiguracaoContato,
  esquemaListaMensagens,
  esquemaMensagemContato,
  esquemaResposta,
  esquemaSituacao,
} from "./contato.validacao";

const repositorio = new RepositorioContato();
const servico = new ServicoContato(repositorio);
const idValido = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
const erro = (res: Response, mensagem = "Revise os dados informados.") =>
  res.status(400).json({ erro: mensagem });
const parametroId = (req: Request) =>
  Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
export class ControladorContato {
  configuracaoPublica = async (_req: Request, res: Response) =>
    res.json(await repositorio.configuracaoPublica());
  enviar = async (req: Request, res: Response) => {
    const cfg = await repositorio.configuracaoPublica();
    if (!cfg.exibirContato || !cfg.exibirFormulario)
      return res
        .status(404)
        .json({ erro: "Formulário de contato indisponível." });
    const v = esquemaMensagemContato.safeParse(req.body);
    if (!v.success) return erro(res);
    try {
      await servico.receber(
        v.data,
        req.ip || req.socket.remoteAddress || "desconhecido",
        req.get("user-agent") || "",
      );
      return res
        .status(201)
        .json({
          mensagem:
            "Mensagem enviada com sucesso. Nossa equipe entrará em contato.",
        });
    } catch (e) {
      return res
        .status(429)
        .json({
          erro:
            e instanceof Error
              ? e.message
              : "Não foi possível enviar a mensagem.",
        });
    }
  };
  configuracao = async (_req: Request, res: Response) =>
    res.json(await repositorio.configuracaoAdministrativa());
  salvarConfiguracao = async (req: Request, res: Response) => {
    const v = esquemaConfiguracaoContato.safeParse(req.body);
    if (!v.success) return erro(res);
    try {
      await repositorio.salvarConfiguracao(v.data, res.locals.administrador.id);
      return res.json(await repositorio.configuracaoAdministrativa());
    } catch (e) {
      return erro(res, e instanceof Error ? e.message : undefined);
    }
  };
  listar = async (req: Request, res: Response) => {
    const v = esquemaListaMensagens.safeParse(req.query);
    if (!v.success) return erro(res);
    return res.json(
      await repositorio.listar(
        v.data.busca,
        v.data.situacao,
        v.data.cursor,
        v.data.limite,
      ),
    );
  };
  obter = async (req: Request, res: Response) => {
    const id = parametroId(req);
    if (!idValido(id)) return erro(res);
    const d = await repositorio.obter(id, true);
    return d
      ? res.json(d)
      : res.status(404).json({ erro: "Mensagem não encontrada." });
  };
  alterarSituacao = async (req: Request, res: Response) => {
    const id = parametroId(req);
    const v = esquemaSituacao.safeParse(req.body);
    if (!idValido(id) || !v.success) return erro(res);
    return (await repositorio.situacao(id, v.data.situacao))
      ? res.json({ sucesso: true })
      : res.status(404).json({ erro: "Mensagem não encontrada." });
  };
  responder = async (req: Request, res: Response) => {
    const id = parametroId(req);
    const v = esquemaResposta.safeParse(req.body);
    if (!idValido(id) || !v.success) return erro(res);
    try {
      return (await servico.responder(
        id,
        v.data.resposta,
        res.locals.administrador.id,
      ))
        ? res.json({ sucesso: true })
        : res.status(404).json({ erro: "Mensagem não encontrada." });
    } catch (e) {
      return res
        .status(503)
        .json({
          erro: e instanceof Error ? e.message : "Falha ao enviar a resposta.",
        });
    }
  };
  excluir = async (req: Request, res: Response) => {
    const id = parametroId(req);
    if (!idValido(id)) return erro(res);
    return (await repositorio.excluir(id))
      ? res.status(204).end()
      : res.status(404).json({ erro: "Mensagem não encontrada." });
  };
  eventos = async (req: Request, res: Response) => {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders();
    res.write(
      `event: resumo\ndata: ${JSON.stringify({ totalNovas: await repositorio.contarNovas() })}\n\n`,
    );
    const enviar = (e: unknown) =>
      res.write(`event: contato\ndata: ${JSON.stringify(e)}\n\n`);
    const remover = eventosContato.ouvir(enviar);
    const pulso = setInterval(() => res.write(": pulso\n\n"), 25000);
    req.on("close", () => {
      clearInterval(pulso);
      remover();
      res.end();
    });
  };
}
