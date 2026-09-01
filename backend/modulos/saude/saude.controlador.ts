import type { Request, Response } from "express";
import { verificarConexao } from "../../infraestrutura/banco/conexao";

export async function consultarSaude(
  _requisicao: Request,
  resposta: Response,
): Promise<void> {
  try {
    await verificarConexao();
    resposta.json({ ok: true, banco: "conectado" });
  } catch {
    resposta.status(503).json({ ok: false, banco: "indisponível" });
  }
}
