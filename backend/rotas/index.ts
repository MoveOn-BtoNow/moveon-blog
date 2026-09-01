import { Router } from "express";
import { rotasAutenticacao } from "../modulos/autenticacao/autenticacao.rotas";
import { rotasSaude } from "../modulos/saude/saude.rotas";
import { rotasPainel } from "../modulos/painel/painel.rotas";
import { rotasPortal } from "../modulos/portal/portal.rotas";

export const rotas = Router();
rotas.use("/saude", rotasSaude);
rotas.use("/autenticacao", rotasAutenticacao);
rotas.use("/painel", rotasPainel);
rotas.use("/portal", rotasPortal);
