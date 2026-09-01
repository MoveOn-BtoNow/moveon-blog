import { Router } from "express";
import { consultarSaude } from "./saude.controlador";

export const rotasSaude = Router();
rotasSaude.get("/", consultarSaude);
