import { Router } from "express";
import { ControladorAutenticacao } from "./autenticacao.controlador";
import { RepositorioAutenticacao } from "./autenticacao.repositorio";
import { ServicoAutenticacao } from "./autenticacao.servico";
import { LimitadorLogin } from "./limitador-login";

const repositorio = new RepositorioAutenticacao();
const servico = new ServicoAutenticacao(repositorio);
const controlador = new ControladorAutenticacao(servico, new LimitadorLogin());

export const rotasAutenticacao = Router();
rotasAutenticacao.post("/entrar", controlador.entrar);
rotasAutenticacao.get("/sessao", controlador.consultarSessao);
rotasAutenticacao.post("/sair", controlador.sair);
