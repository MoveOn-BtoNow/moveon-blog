import { createHash, randomBytes } from "node:crypto";

export function gerarTokenSeguro(): string {
  return randomBytes(32).toString("base64url");
}

export function gerarHashSha256(valor: string): string {
  return createHash("sha256").update(valor).digest("hex");
}
