import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { RepositorioIntegracoes } from "./integracoes.repositorio";
type ConfigS3 = {
  armazenamentoModo: string;
  s3Endpoint: string;
  s3Regiao: string;
  s3Bucket: string;
  s3Autenticacao: "iam_role" | "chaves";
  s3UrlPublica: string;
  s3ForcarPathStyle: boolean;
  s3ChaveAcesso: string;
  s3ChaveSecreta: string;
};
async function configuracao() {
  return (await new RepositorioIntegracoes().obter(true)) as ConfigS3;
}
function cliente(c: ConfigS3) {
  const credenciais =
    c.s3Autenticacao === "chaves" && c.s3ChaveAcesso && c.s3ChaveSecreta
      ? { accessKeyId: c.s3ChaveAcesso, secretAccessKey: c.s3ChaveSecreta }
      : undefined;
  return new S3Client({
    region: c.s3Regiao,
    endpoint: c.s3Endpoint || undefined,
    forcePathStyle: c.s3ForcarPathStyle,
    credentials: credenciais,
  });
}
function basePublica(c: ConfigS3) {
  if (c.s3UrlPublica) return c.s3UrlPublica.replace(/\/$/, "");
  if (c.s3Endpoint) {
    const endpoint = c.s3Endpoint.replace(/\/$/, "");
    if (c.s3ForcarPathStyle) return `${endpoint}/${c.s3Bucket}`;
    const url = new URL(endpoint);
    return `${url.protocol}//${c.s3Bucket}.${url.host}`;
  }
  return c.s3Regiao === "us-east-1"
    ? `https://${c.s3Bucket}.s3.amazonaws.com`
    : `https://${c.s3Bucket}.s3.${c.s3Regiao}.amazonaws.com`;
}
export async function usarS3() {
  return (await configuracao()).armazenamentoModo === "s3";
}
export async function enviarObjeto(chave: string, corpo: Buffer, tipo: string) {
  const c = await configuracao();
  if (c.armazenamentoModo !== "s3")
    throw new Error("Storage S3 não está ativo.");
  await cliente(c).send(
    new PutObjectCommand({
      Bucket: c.s3Bucket,
      Key: chave,
      Body: corpo,
      ContentType: tipo,
      CacheControl: "public,max-age=31536000,immutable",
    }),
  );
  return `${basePublica(c)}/${chave}`;
}
function chaveUrl(url: string, c: ConfigS3) {
  if (!c.s3Bucket) return null;
  const base = basePublica(c) + "/";
  return url.startsWith(base)
    ? decodeURIComponent(url.slice(base.length))
    : null;
}
export async function excluirObjeto(url?: string | null) {
  if (!url) return false;
  const c = await configuracao();
  const chave = chaveUrl(url, c);
  if (!chave) return false;
  await cliente(c).send(
    new DeleteObjectCommand({ Bucket: c.s3Bucket, Key: chave }),
  );
  return true;
}
export async function objetoExiste(url?: string | null) {
  if (!url) return false;
  const c = await configuracao();
  const chave = chaveUrl(url, c);
  if (!chave) return false;
  try {
    await cliente(c).send(
      new HeadObjectCommand({ Bucket: c.s3Bucket, Key: chave }),
    );
    return true;
  } catch {
    return false;
  }
}
