import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { Request, Response } from "express";
import { Readable } from "node:stream";
import { ambiente } from "../../configuracoes/ambiente";
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
  return `${ambiente.URL_PUBLICA_PORTAL.replace(/\/$/, "")}/api/portal/midias`;
}
function baseDiretaS3(c: ConfigS3) {
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
function erroS3(erro: unknown): Error {
  const mensagem = erro instanceof Error ? erro.message : String(erro);
  if (/credentials|credential provider/i.test(mensagem))
    return new Error(
      "A API não encontrou credenciais AWS. Associe uma IAM Role com acesso ao bucket à instância EC2 e reinicie o serviço moveon.",
    );
  return erro instanceof Error ? erro : new Error("Falha ao acessar o S3.");
}
export async function usarS3() {
  return (await configuracao()).armazenamentoModo === "s3";
}
export async function enviarObjeto(chave: string, corpo: Buffer, tipo: string) {
  const c = await configuracao();
  if (c.armazenamentoModo !== "s3")
    throw new Error("Storage S3 não está ativo.");
  try {
    await cliente(c).send(
      new PutObjectCommand({
        Bucket: c.s3Bucket,
        Key: chave,
        Body: corpo,
        ContentType: tipo,
        CacheControl: "public,max-age=31536000,immutable",
      }),
    );
  } catch (erro) {
    throw erroS3(erro);
  }
  return `${basePublica(c)}/${chave}`;
}
function chaveUrl(url: string, c: ConfigS3) {
  if (!c.s3Bucket) return null;
  for (const base of [
    basePublica(c),
    "/api/portal/midias",
    baseDiretaS3(c),
  ]) {
    const prefixo = base + "/";
    if (url.startsWith(prefixo)) return decodeURIComponent(url.slice(prefixo.length));
  }
  return null;
}
export async function entregarObjeto(requisicao: Request, resposta: Response) {
  const pasta = String(requisicao.params.pasta || "");
  const arquivo = String(requisicao.params.arquivo || "");
  if (
    !["capas", "sociais", "conteudos", "videos", "perfis"].includes(pasta) ||
    !/^[a-f0-9-]+\.(?:webp|jpg|mp4|webm|mov)$/i.test(arquivo)
  )
    return void resposta.status(404).end();
  const c = await configuracao();
  if (c.armazenamentoModo !== "s3") return void resposta.status(404).end();
  try {
    const objeto = await cliente(c).send(
      new GetObjectCommand({
        Bucket: c.s3Bucket,
        Key: `${pasta}/${arquivo}`,
        Range: requisicao.get("range") || undefined,
      }),
    );
    resposta.status(objeto.ContentRange ? 206 : 200);
    resposta.setHeader("Content-Type", objeto.ContentType || "application/octet-stream");
    resposta.setHeader("Cache-Control", "public,max-age=31536000,immutable");
    resposta.setHeader("Accept-Ranges", "bytes");
    if (objeto.ContentLength != null)
      resposta.setHeader("Content-Length", String(objeto.ContentLength));
    if (objeto.ContentRange)
      resposta.setHeader("Content-Range", objeto.ContentRange);
    if (objeto.ETag) resposta.setHeader("ETag", objeto.ETag);
    if (objeto.Body instanceof Readable) objeto.Body.pipe(resposta);
    else resposta.end(Buffer.from(await objeto.Body!.transformToByteArray()));
  } catch (erro) {
    const status = (erro as { $metadata?: { httpStatusCode?: number } }).$metadata
      ?.httpStatusCode;
    if (status === 404 || status === 403) return void resposta.status(404).end();
    throw erroS3(erro);
  }
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
