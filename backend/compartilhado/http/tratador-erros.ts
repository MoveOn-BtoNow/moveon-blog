import type { ErrorRequestHandler, RequestHandler } from "express";

export const tratarRotaInexistente: RequestHandler = (
  _requisicao,
  resposta,
) => {
  resposta.status(404).json({ erro: "Rota não encontrada." });
};

export const tratarErro: ErrorRequestHandler = (
  erro,
  _requisicao,
  resposta,
  _proximo,
) => {
  void _proximo;
  console.error("Erro não tratado na API:", erro);
  resposta.status(500).json({ erro: "Ocorreu um erro interno." });
};
