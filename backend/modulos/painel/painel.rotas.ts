import { Router } from "express";
import { exigirAutenticacao } from "../../compartilhado/http/autenticacao-obrigatoria";
import { ControladorPainel } from "./painel.controlador";
import multer from "multer";
import { ambiente } from "../../configuracoes/ambiente";
import { ControladorContato } from "../contato/contato.controlador";
import { ControladorIntegracoes } from "../integracoes/integracoes.controlador";
import { ControladorServidorEmail } from "../email/servidor-email.controlador";
const c = new ControladorPainel();
const contato = new ControladorContato();
const integracoes = new ControladorIntegracoes();
const servidorEmail = new ControladorServidorEmail();
export const rotasPainel = Router();
rotasPainel.use(exigirAutenticacao);
const receberImagem = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: ambiente.MAX_IMAGEM_CAPA_MB * 1024 * 1024, files: 1 },
  fileFilter: (_req, arquivo, concluir) =>
    concluir(
      null,
      ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        arquivo.mimetype,
      ),
    ),
});
const receberVideo=multer({storage:multer.memoryStorage(),limits:{fileSize:ambiente.MAX_VIDEO_MB*1024*1024,files:1},fileFilter:(_req,arquivo,concluir)=>concluir(null,["video/mp4","video/webm","video/quicktime"].includes(arquivo.mimetype))});
rotasPainel.post(
  "/uploads/capas",
  (requisicao, resposta, proximo) =>
    receberImagem.single("imagem")(requisicao, resposta, (erro) =>
      erro
        ? resposta.status(400).json({
            erro:
              erro.code === "LIMIT_FILE_SIZE"
                ? `A imagem deve ter no máximo ${ambiente.MAX_IMAGEM_CAPA_MB} MB.`
                : "Arquivo de imagem inválido.",
          })
        : proximo(),
    ),
  c.enviarCapa,
);
rotasPainel.post(
  "/uploads/imagens-conteudo",
  (requisicao, resposta, proximo) =>
    receberImagem.single("imagem")(requisicao, resposta, (erro) =>
      erro
        ? resposta.status(400).json({
            erro:
              erro.code === "LIMIT_FILE_SIZE"
                ? `A imagem deve ter no máximo ${ambiente.MAX_IMAGEM_CAPA_MB} MB.`
                : "Arquivo de imagem inválido.",
          })
        : proximo(),
    ),
  c.enviarImagemConteudo,
);
rotasPainel.post(
  "/uploads/logos",
  (requisicao, resposta, proximo) =>
    receberImagem.single("imagem")(requisicao, resposta, (erro) =>
      erro ? resposta.status(400).json({ erro: erro.code === "LIMIT_FILE_SIZE" ? `A imagem deve ter no máximo ${ambiente.MAX_IMAGEM_CAPA_MB} MB.` : "Arquivo de imagem inválido." }) : proximo(),
    ),
  c.enviarLogo,
);
rotasPainel.post(
  "/uploads/perfil",
  (req, res, next) =>
    receberImagem.single("imagem")(req, res, (erro) =>
      erro
        ? res.status(400).json({
            erro:
              erro.code === "LIMIT_FILE_SIZE"
                ? `A foto deve ter no máximo ${ambiente.MAX_IMAGEM_CAPA_MB} MB.`
                : "Foto inválida.",
          })
        : next(),
    ),
  c.enviarFotoPerfil,
);
rotasPainel.get("/resumo", c.resumo);
rotasPainel.post("/uploads/videos",(req,res,next)=>receberVideo.single("video")(req,res,erro=>erro?res.status(400).json({erro:erro.code==="LIMIT_FILE_SIZE"?`O vídeo deve ter no máximo ${ambiente.MAX_VIDEO_MB} MB.`:"Arquivo de vídeo inválido."}):next()),c.enviarVideo);
rotasPainel.get("/publicacoes", c.listarPublicacoes);
rotasPainel.get("/publicacoes/:id", c.obterPublicacao);
rotasPainel.post("/publicacoes", c.criarPublicacao);
rotasPainel.put("/publicacoes/:id", c.atualizarPublicacao);
rotasPainel.delete("/publicacoes/:id", c.excluirPublicacao);
rotasPainel.get("/parceiros", c.listarParceiros);
rotasPainel.get("/parceiros-exibicao", c.obterExibicaoCarrosselParceiros);
rotasPainel.put("/parceiros-exibicao", c.atualizarExibicaoCarrosselParceiros);
rotasPainel.post("/parceiros", c.salvarParceiro);
rotasPainel.put("/parceiros/:id", c.salvarParceiro);
rotasPainel.delete("/parceiros/:id", c.excluirParceiro);
rotasPainel.get("/categorias", c.listarCategorias);
rotasPainel.post("/categorias", c.criarCategoria);
rotasPainel.put("/categorias/:id", c.atualizarCategoria);
rotasPainel.delete("/categorias/:id", c.excluirCategoria);
rotasPainel.get("/metricas", c.metricas);
rotasPainel.get("/newsletter", c.listarNewsletter);
rotasPainel.delete("/newsletter/:id", c.removerNewsletter);
rotasPainel.get("/newsletter-modelo", c.obterModeloNewsletter);
rotasPainel.put("/newsletter-modelo", c.atualizarModeloNewsletter);
rotasPainel.get("/servidor-email", servidorEmail.obter);
rotasPainel.put("/servidor-email", servidorEmail.salvar);
rotasPainel.post("/servidor-email/testar", servidorEmail.testar);
rotasPainel.get("/configuracoes", c.obterConfiguracoes);
rotasPainel.put("/configuracoes", c.atualizarConfiguracoes);
rotasPainel.get("/administrador", c.obterAdministrador);
rotasPainel.put("/administrador", c.atualizarAdministrador);
rotasPainel.get("/contato/configuracao", contato.configuracao);
rotasPainel.put("/contato/configuracao", contato.salvarConfiguracao);
rotasPainel.get("/contato/mensagens", contato.listar);
rotasPainel.get("/contato/mensagens/:id", contato.obter);
rotasPainel.patch("/contato/mensagens/:id", contato.alterarSituacao);
rotasPainel.post("/contato/mensagens/:id/responder", contato.responder);
rotasPainel.delete("/contato/mensagens/:id", contato.excluir);
rotasPainel.get("/contato/eventos", contato.eventos);
rotasPainel.get("/integracoes", integracoes.obter);
rotasPainel.put("/integracoes", integracoes.salvar);
rotasPainel.put("/integracoes/armazenamento", integracoes.salvarArmazenamento);
rotasPainel.put("/integracoes/analytics", integracoes.salvarAnalytics);
rotasPainel.put("/integracoes/opentelemetry", integracoes.salvarOpenTelemetry);
rotasPainel.post(
  "/integracoes/opentelemetry/testar",
  integracoes.testarOpenTelemetry,
);
rotasPainel.get("/conteudos-legais", integracoes.conteudosLegais);
rotasPainel.put("/conteudos-legais/consentimento", integracoes.salvarConsentimento);
rotasPainel.put("/conteudos-legais/privacidade", integracoes.salvarDocumento("privacidade"));
rotasPainel.put("/conteudos-legais/termos", integracoes.salvarDocumento("termos"));
