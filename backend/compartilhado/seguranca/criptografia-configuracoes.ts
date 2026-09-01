import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { ambiente } from "../../configuracoes/ambiente";

const chave = () =>
  createHash("sha256")
    .update(`moveon:configuracoes:${ambiente.EMAIL_SEGREDO_CANCELAMENTO}`)
    .digest();

export function criptografarConfiguracao(valor: string): string {
  const iv = randomBytes(12);
  const cifra = createCipheriv("aes-256-gcm", chave(), iv);
  const conteudo = Buffer.concat([cifra.update(valor, "utf8"), cifra.final()]);
  const autenticacao = cifra.getAuthTag();
  return [iv, autenticacao, conteudo]
    .map((parte) => parte.toString("base64url"))
    .join(".");
}

export function descriptografarConfiguracao(valor?: string | null): string | null {
  if (!valor) return null;
  try {
    const [iv, autenticacao, conteudo] = valor
      .split(".")
      .map((parte) => Buffer.from(parte, "base64url"));
    if (!iv || !autenticacao || !conteudo) return null;
    const decifra = createDecipheriv("aes-256-gcm", chave(), iv);
    decifra.setAuthTag(autenticacao);
    return Buffer.concat([decifra.update(conteudo), decifra.final()]).toString("utf8");
  } catch {
    return null;
  }
}
