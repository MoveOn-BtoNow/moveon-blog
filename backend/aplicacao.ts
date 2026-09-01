import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ambiente } from "./configuracoes/ambiente";
import {
  tratarErro,
  tratarRotaInexistente,
} from "./compartilhado/http/tratador-erros";
import { rotas } from "./rotas";
import { obterRaizUploads } from "./modulos/painel/armazenamento-capas";
import { registrarLog } from "./infraestrutura/observabilidade/open-telemetry";

export function criarAplicacao() {
  const aplicacao = express();
  aplicacao.disable("x-powered-by");
  aplicacao.set("trust proxy", 1);
  aplicacao.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
  aplicacao.use((req,res,next)=>{const inicio=performance.now();res.on("finish",()=>registrarLog(res.statusCode>=500?"error":res.statusCode>=400?"warn":"info","requisicao_http",{metodo:req.method,rota:req.path,status:res.statusCode,duracao_ms:Math.round(performance.now()-inicio)}));next();});
  aplicacao.use(
    cors({
      origin: ambiente.origensPermitidas,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );
  aplicacao.use(
    express.json({ limit: ambiente.LIMITE_CORPO_JSON, strict: true }),
  );
  aplicacao.use((requisicao, resposta, proximo) => {
    const alteraEstado = ["POST", "PUT", "PATCH", "DELETE"].includes(
      requisicao.method,
    );
    if (!alteraEstado) return proximo();
    const origem = requisicao.get("origin");
    const contextoNavegacao = requisicao.get("sec-fetch-site");
    if (
      contextoNavegacao === "cross-site" ||
      (origem && !ambiente.origensPermitidas.includes(origem))
    )
      return void resposta.status(403).json({ erro: "Origem não autorizada." });
    proximo();
  });
  aplicacao.use(
    "/uploads",
    express.static(obterRaizUploads(), {
      fallthrough: true,
      immutable: true,
      maxAge: "30d",
      dotfiles: "deny",
    }),
  );
  aplicacao.use("/api", rotas);
  aplicacao.use(tratarRotaInexistente);
  aplicacao.use(tratarErro);
  return aplicacao;
}
