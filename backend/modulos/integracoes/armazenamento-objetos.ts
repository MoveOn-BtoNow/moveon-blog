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
  s3UrlPublica: string;
  s3ForcarPathStyle: boolean;
  s3ChaveAcesso: string;
  s3ChaveSecreta: string;
};
async function configuracao() {
  return (await new RepositorioIntegracoes().obter(true)) as ConfigS3;
}
function cliente(c: ConfigS3) {
  return new S3Client({
    region: c.s3Regiao,
    endpoint: c.s3Endpoint || undefined,
    forcePathStyle: c.s3ForcarPathStyle,
    credentials: {
      accessKeyId: c.s3ChaveAcesso,
      secretAccessKey: c.s3ChaveSecreta,
    },
  });
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
  return `${c.s3UrlPublica.replace(/\/$/, "")}/${chave}`;
}
function chaveUrl(url: string, c: ConfigS3) {
  if (!c.s3UrlPublica || !c.s3Bucket || !c.s3ChaveAcesso || !c.s3ChaveSecreta)
    return null;
  const base = c.s3UrlPublica.replace(/\/$/, "") + "/";
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
