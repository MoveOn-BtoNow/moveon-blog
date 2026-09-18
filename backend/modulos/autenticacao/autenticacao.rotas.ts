import { Router } from "express";
import { ControladorAutenticacao } from "./autenticacao.controlador";
import { RepositorioAutenticacao } from "./autenticacao.repositorio";
import { ServicoAutenticacao } from "./autenticacao.servico";
import { LimitadorLogin } from "./limitador-login";
import { ServicoRecuperacaoSenha } from "./recuperacao-senha.servico";
import { z } from "zod";

const repositorio = new RepositorioAutenticacao();
const servico = new ServicoAutenticacao(repositorio);
const controlador = new ControladorAutenticacao(servico, new LimitadorLogin());

export const rotasAutenticacao = Router();
const recuperacao = new ServicoRecuperacaoSenha();
const esquemaEmail = z.object({email:z.email().max(254)}).strict();
const esquemaToken = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const esquemaNovaSenha = z.object({token:esquemaToken,senha:z.string().min(8).max(128)
  .regex(/[a-z]/,"Inclua uma letra minúscula.").regex(/[A-Z]/,"Inclua uma letra maiúscula.")
  .regex(/[0-9]/,"Inclua um número.").regex(/[^A-Za-z0-9\s]/,"Inclua um caractere especial.")
  .regex(/^\S+$/,"Não use espaços."),confirmarSenha:z.string()}).strict()
  .refine((dados)=>dados.senha===dados.confirmarSenha,{path:["confirmarSenha"],message:"As senhas não coincidem."});
rotasAutenticacao.post("/recuperar-senha", async (req,res) => {
  res.setHeader("Cache-Control","no-store");
  const validacao=esquemaEmail.safeParse(req.body);
  // Mesmo para entradas inválidas, evita sinalizar a existência de uma conta.
  const email=validacao.success ? validacao.data.email.trim().toLowerCase() : "entrada-invalida";
  const resultado=await recuperacao.solicitar(email,req.ip || "local");
  if (resultado.aguardeSegundos>0) {
    res.setHeader("Retry-After",String(resultado.aguardeSegundos));
    res.status(429).json({erro:"Aguarde antes de solicitar outro link de recuperação.",aguardeSegundos:resultado.aguardeSegundos});
    return;
  }
  res.json({mensagem:resultado.mensagem});
});
rotasAutenticacao.get("/recuperar-senha/validar",async (req,res) => {
  res.setHeader("Cache-Control","no-store");
  const token=esquemaToken.safeParse(req.query.token);
  res.json({valido:token.success && await recuperacao.verificar(token.data)});
});
rotasAutenticacao.post("/recuperar-senha/confirmar",async (req,res) => {
  res.setHeader("Cache-Control","no-store");
  const dados=esquemaNovaSenha.safeParse(req.body);
  if (!dados.success) {res.status(400).json({erro:"Revise a nova senha.",detalhes: dados.error.flatten().fieldErrors});return;}
  const concluido=await recuperacao.redefinir(dados.data.token,dados.data.senha);
  if (!concluido) {res.status(410).json({erro:"Este link expirou ou já foi utilizado. Solicite uma nova recuperação."});return;}
  res.json({ok:true});
});
rotasAutenticacao.post("/entrar", controlador.entrar);
rotasAutenticacao.get("/sessao", controlador.consultarSessao);
rotasAutenticacao.post("/sair", controlador.sair);
