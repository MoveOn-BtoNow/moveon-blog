import type { Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import { ambiente } from "../../configuracoes/ambiente";
import { higienizarConteudoHtml } from "../../compartilhado/seguranca/higienizar-html";
import { RepositorioPainel } from "./painel.repositorio";
import {
  administradorEntrada,
  categoriaEntrada,
  configuracaoEntrada,
  publicacaoEntrada,
  parceiroEntrada,
} from "./painel.validacao";
import {
  armazenarCapa,
  armazenarFotoPerfil,
  armazenarImagemConteudo,
  armazenarLogo,
  excluirMidiaGerenciada,
  extrairUrlsDeMidia,
  fotoPerfilExiste,
} from "./armazenamento-capas";
import { servicoNewsletter } from "../newsletter/newsletter.servico";
import { z } from "zod";
import { criarCookieExpirado } from "../../compartilhado/http/cookies";
import { criptografarConfiguracao } from "../../compartilhado/seguranca/criptografia-configuracoes";
import { armazenarVideo } from "./armazenamento-videos";

const repositorio = new RepositorioPainel();
const idParametro = (requisicao: Request) => String(requisicao.params.id);
async function excluirSeNaoUtilizada(caminho?: string | null) {
  if (!caminho) return;
  try {
    if ((await repositorio.contarReferenciasMidia(caminho)) === 0)
      await excluirMidiaGerenciada(caminho);
  } catch (erro) {
    // A persistência principal já foi concluída. A rotina periódica tentará
    // novamente sem devolver um falso erro ao administrador.
    console.error("Falha ao excluir mídia substituída; limpeza reagendada:", erro);
  }
}

export class ControladorPainel {
  enviarImagemConteudo = async (requisicao: Request, resposta: Response) => {
    try {
      resposta.status(201).json({
        caminho: await armazenarImagemConteudo(requisicao.file),
      });
    } catch (erro) {
      resposta.status(400).json({
        erro: erro instanceof Error ? erro.message : "Imagem inválida.",
      });
    }
  };
  enviarVideo = async (requisicao:Request,resposta:Response)=>{try{resposta.status(201).json({caminho:await armazenarVideo(requisicao.file)});}catch(e){resposta.status(400).json({erro:e instanceof Error?e.message:"Vídeo inválido."});}};
  listarParceiros = async (_: Request, resposta: Response) =>
    resposta.json(await repositorio.listarParceiros());
  salvarParceiro = async (requisicao: Request, resposta: Response) => {
    const validacao = parceiroEntrada.safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta.status(400).json({ erro: "Revise os dados do parceiro.", detalhes: validacao.error.flatten() });
    const id = requisicao.params.id ? idParametro(requisicao) : undefined;
    const anterior = id ? await repositorio.obterParceiro(id) : null;
    const item = await repositorio.salvarParceiro(validacao.data, id);
    if (anterior?.caminhoLogo && anterior.caminhoLogo !== validacao.data.caminhoLogo)
      await excluirSeNaoUtilizada(anterior.caminhoLogo);
    resposta.status(requisicao.params.id ? 200 : 201).json(item);
  };
  excluirParceiro = async (requisicao: Request, resposta: Response) => {
    const item = await repositorio.excluirParceiro(idParametro(requisicao));
    await excluirSeNaoUtilizada(item?.caminhoLogo);
    resposta.status(204).end();
  };
  obterExibicaoCarrosselParceiros = async (_: Request, resposta: Response) =>
    resposta.json({ exibir: await repositorio.exibicaoCarrosselParceiros() });
  atualizarExibicaoCarrosselParceiros = async (requisicao: Request, resposta: Response) => {
    const validacao = z.object({ exibir: z.boolean() }).strict().safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta.status(400).json({ erro: "Configuração de exibição inválida." });
    await repositorio.atualizarExibicaoCarrosselParceiros(validacao.data.exibir);
    resposta.json({ ok: true, exibir: validacao.data.exibir });
  };
  enviarCapa = async (requisicao: Request, resposta: Response) => {
    try {
      resposta.status(201).json(await armazenarCapa(requisicao.file));
    } catch (erro) {
      resposta.status(400).json({
        erro: erro instanceof Error ? erro.message : "Imagem inválida.",
      });
    }
  };
  enviarLogo = async (requisicao: Request, resposta: Response) => {
    try {
      resposta.status(201).json({ caminho: await armazenarLogo(requisicao.file) });
    } catch (erro) {
      resposta.status(400).json({ erro: erro instanceof Error ? erro.message : "Imagem inválida." });
    }
  };
  enviarFotoPerfil = async (requisicao: Request, resposta: Response) => {
    try {
      resposta
        .status(201)
        .json({ caminho: await armazenarFotoPerfil(requisicao.file) });
    } catch (e) {
      resposta
        .status(400)
        .json({ erro: e instanceof Error ? e.message : "Foto inválida." });
    }
  };
  resumo = async (_: Request, resposta: Response) =>
    resposta.json(await repositorio.resumo());
  listarPublicacoes = async (requisicao: Request, resposta: Response) => {
    const validacao = z
      .object({
        cursor: z.string().max(500).optional(),
        busca: z.string().max(150).optional(),
        limite: z.coerce.number().int().min(1).max(50).default(20),
      })
      .safeParse(requisicao.query);
    if (!validacao.success)
      return void resposta.status(400).json({ erro: "Filtros inválidos." });
    resposta.json(await repositorio.listarPublicacoes(validacao.data));
  };
  obterPublicacao = async (requisicao: Request, resposta: Response) => {
    const item = await repositorio.obterPublicacao(idParametro(requisicao));
    if (item) resposta.json(item);
    else resposta.status(404).json({ erro: "Publicação não encontrada." });
  };
  criarPublicacao = async (requisicao: Request, resposta: Response) => {
    const validacao = publicacaoEntrada.safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta.status(400).json({
        erro: "Revise os dados da publicação.",
        detalhes: validacao.error.flatten(),
      });
    validacao.data.conteudo = higienizarConteudoHtml(validacao.data.conteudo);
    if (!validacao.data.conteudo)
      return void resposta.status(400).json({
        erro: "O conteúdo ficou vazio após a validação de segurança.",
      });
    const id = await repositorio.salvarPublicacao(
      validacao.data,
      resposta.locals.administrador.id,
    );
    if (validacao.data.situacao === "publicada")
      await servicoNewsletter.enfileirar(String(id));
    resposta.status(201).json({ id });
  };
  atualizarPublicacao = async (requisicao: Request, resposta: Response) => {
    const validacao = publicacaoEntrada.safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta.status(400).json({
        erro: "Revise os dados da publicação.",
        detalhes: validacao.error.flatten(),
      });
    validacao.data.conteudo = higienizarConteudoHtml(validacao.data.conteudo);
    if (!validacao.data.conteudo)
      return void resposta.status(400).json({
        erro: "O conteúdo ficou vazio após a validação de segurança.",
      });
    const anterior = await repositorio.obterPublicacao(idParametro(requisicao));
    await repositorio.salvarPublicacao(
      validacao.data,
      resposta.locals.administrador.id,
      idParametro(requisicao),
    );
    if (
      validacao.data.situacao === "publicada" &&
      anterior?.situacao !== "publicada"
    )
      await servicoNewsletter.enfileirar(idParametro(requisicao));
    if (
      anterior?.imagemCapaUrl &&
      anterior.imagemCapaUrl !== validacao.data.imagemCapaUrl
    )
      await excluirSeNaoUtilizada(anterior.imagemCapaUrl);
    if (
      anterior?.imagemSocialUrl &&
      anterior.imagemSocialUrl !== validacao.data.imagemSocialUrl
    )
      await excluirSeNaoUtilizada(anterior.imagemSocialUrl);
    const urlsAnteriores = extrairUrlsDeMidia(anterior?.conteudo);
    const urlsAtuais = extrairUrlsDeMidia(validacao.data.conteudo);
    await Promise.all(
      [...urlsAnteriores]
        .filter((url) => !urlsAtuais.has(url))
        .map((url) => excluirSeNaoUtilizada(url)),
    );
    resposta.json({ ok: true });
  };
  excluirPublicacao = async (requisicao: Request, resposta: Response) => {
    const item = await repositorio.obterPublicacao(idParametro(requisicao));
    if (!item)
      return void resposta
        .status(404)
        .json({ erro: "Publicação não encontrada." });
    await repositorio.excluirPublicacao(idParametro(requisicao));
    await Promise.all([
      excluirSeNaoUtilizada(item?.imagemCapaUrl),
      excluirSeNaoUtilizada(item?.imagemSocialUrl),
      ...[...extrairUrlsDeMidia(item?.conteudo)].map((url) =>
        excluirSeNaoUtilizada(url),
      ),
    ]);
    resposta.status(204).end();
  };
  listarCategorias = async (_: Request, resposta: Response) =>
    resposta.json(await repositorio.listarCategorias());
  criarCategoria = async (requisicao: Request, resposta: Response) => {
    const validacao = categoriaEntrada.safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta
        .status(400)
        .json({ erro: "Revise os dados da categoria." });
    resposta.status(201).json(await repositorio.criarCategoria(validacao.data));
  };
  atualizarCategoria = async (requisicao: Request, resposta: Response) => {
    const validacao = categoriaEntrada.safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta
        .status(400)
        .json({ erro: "Revise os dados da categoria." });
    resposta.json(
      await repositorio.atualizarCategoria(
        idParametro(requisicao),
        validacao.data,
      ),
    );
  };
  excluirCategoria = async (requisicao: Request, resposta: Response) => {
    try {
      await repositorio.excluirCategoria(idParametro(requisicao));
      resposta.status(204).end();
    } catch {
      resposta
        .status(409)
        .json({ erro: "A categoria está vinculada a publicações." });
    }
  };
  metricas = async (_: Request, resposta: Response) =>
    resposta.json(await repositorio.metricas());
  obterConfiguracoes = async (_: Request, resposta: Response) =>
    resposta.json(await repositorio.configuracoes());
  atualizarConfiguracoes = async (requisicao: Request, resposta: Response) => {
    const validacao = configuracaoEntrada.safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta
        .status(400)
        .json({ erro: "Revise as configurações." });
    const anterior = await repositorio.configuracoes();
    await repositorio.atualizarConfiguracoes(
      validacao.data,
      resposta.locals.administrador.id,
    );
    await Promise.all([
      anterior?.caminhoLogo && anterior.caminhoLogo !== validacao.data.caminhoLogo
        ? excluirSeNaoUtilizada(anterior.caminhoLogo) : Promise.resolve(),
      anterior?.caminhoFavicon && anterior.caminhoFavicon !== validacao.data.caminhoFavicon
        ? excluirSeNaoUtilizada(anterior.caminhoFavicon) : Promise.resolve(),
    ]);
    resposta.json({ ok: true });
  };
  obterAdministrador = async (_: Request, resposta: Response) => {
    const administrador = await repositorio.administrador(
      resposta.locals.administrador.id,
    );
    if (
      administrador.caminhoFoto &&
      !(await fotoPerfilExiste(administrador.caminhoFoto))
    ) {
      await repositorio.removerFotoAdministrador(administrador.id);
      administrador.caminhoFoto = null;
    }
    resposta.json({
      id: administrador.id,
      nome: administrador.nome,
      email: administrador.email,
      caminhoFoto: administrador.caminhoFoto,
    });
  };
  atualizarAdministrador = async (requisicao: Request, resposta: Response) => {
    const validacao = administradorEntrada.safeParse(requisicao.body);
    if (!validacao.success)
      return void resposta
        .status(400)
        .json({ erro: "Revise os dados do administrador." });
    const atual = await repositorio.administrador(
      resposta.locals.administrador.id,
    );
    if (
      validacao.data.caminhoFoto &&
      validacao.data.caminhoFoto !== atual.caminhoFoto &&
      !(await fotoPerfilExiste(validacao.data.caminhoFoto))
    )
      return void resposta.status(400).json({
        erro: "A foto enviada não foi encontrada no armazenamento do portal.",
      });
    if (
      (validacao.data.alterarEmail || validacao.data.alterarSenha) &&
      !(await compare(validacao.data.senhaAtual!, atual.senha_hash))
    )
      return void resposta.status(400).json({ erro: "Senha atual incorreta." });
    const email = validacao.data.alterarEmail
      ? validacao.data.email
      : atual.email;
    const novaHash = validacao.data.alterarSenha
      ? await hash(validacao.data.novaSenha!, ambiente.CUSTO_HASH_SENHA)
      : undefined;
    await repositorio.atualizarAdministrador(
      atual.id,
      validacao.data.nome,
      email,
      validacao.data.caminhoFoto,
      novaHash,
      validacao.data.alterarSenha,
    );
    if (validacao.data.alterarSenha) {
      resposta.setHeader("Set-Cookie", criarCookieExpirado());
    }
    if (atual.caminhoFoto && atual.caminhoFoto !== validacao.data.caminhoFoto)
      await excluirSeNaoUtilizada(atual.caminhoFoto);
    resposta.json({
      ok: true,
      sessoesRevogadas: validacao.data.alterarSenha,
    });
  };
  listarNewsletter = async (req: Request, res: Response) =>
    res.json(
      await repositorio.listarInscritos(
        Math.max(1, Number(req.query.pagina) || 1),
        20,
      ),
    );
  removerNewsletter = async (req: Request, res: Response) => {
    await repositorio.removerInscrito(idParametro(req));
    res.status(204).end();
  };
  obterModeloNewsletter = async (_req: Request, res: Response) => {
    const dados = await repositorio.configuracaoNewsletter();
    res.json({
      ...dados,
      emailAtivo: dados.emailAtivo ?? ambiente.EMAIL_ATIVO,
      smtpHost: dados.smtpHost || ambiente.SMTP_HOST,
      smtpPorta: dados.smtpPorta || ambiente.SMTP_PORTA,
      smtpSeguro: dados.smtpSeguro ?? ambiente.SMTP_SEGURO,
      smtpUsuario: dados.smtpUsuario || ambiente.SMTP_USUARIO,
      emailRemetenteNome:
        dados.emailRemetenteNome || ambiente.EMAIL_REMETENTE_NOME,
      emailRemetenteEndereco:
        dados.emailRemetenteEndereco || ambiente.EMAIL_REMETENTE_ENDERECO,
      smtpSenhaConfigurada:
        dados.smtpSenhaConfigurada || Boolean(ambiente.SMTP_SENHA),
      emailSegredoConfigurado:
        dados.emailSegredoConfigurado ||
        Boolean(ambiente.EMAIL_SEGREDO_CANCELAMENTO),
    });
  };
  atualizarModeloNewsletter = async (req: Request, res: Response) => {
    const v = z
      .object({
        assunto: z.string().trim().min(3).max(180),
        texto: z.string().trim().min(10).max(5000),
        exibirNewsletter: z.boolean(),
        emailAtivo: z.boolean(),
        smtpHost: z.string().trim().max(255),
        smtpPorta: z.number().int().min(1).max(65535),
        smtpSeguro: z.boolean(),
        smtpUsuario: z.string().trim().max(500),
        smtpSenha: z.string().max(500).optional(),
        emailRemetenteNome: z.string().trim().min(1).max(180),
        emailRemetenteEndereco: z.string().trim().email().max(254),
        emailSegredoCancelamento: z.string().min(32).max(500).optional(),
      })
      .strict()
      .safeParse(req.body);
    if (!v.success)
      return void res
        .status(400)
        .json({ erro: "Revise o modelo da newsletter." });
    await repositorio.atualizarNewsletter({
      ...v.data,
      smtpSenhaCriptografada: v.data.smtpSenha
        ? criptografarConfiguracao(v.data.smtpSenha)
        : undefined,
      emailSegredoCriptografado: v.data.emailSegredoCancelamento
        ? criptografarConfiguracao(v.data.emailSegredoCancelamento)
        : undefined,
    });
    res.json({ ok: true });
  };
}
