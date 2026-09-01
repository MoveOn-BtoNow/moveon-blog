import { randomUUID } from "node:crypto";
import { access, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { ambiente } from "../../configuracoes/ambiente";
import {
  enviarObjeto,
  excluirObjeto,
  objetoExiste,
  usarS3,
} from "../integracoes/armazenamento-objetos";

const raizUploads = path.resolve(process.cwd(), ambiente.PASTA_UPLOADS);
const pastaCapas = path.join(raizUploads, "capas");
const pastaSociais = path.join(raizUploads, "sociais");
const pastaPerfis = path.join(raizUploads, "perfis");
const pastaConteudos = path.join(raizUploads, "conteudos");
const formatos = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
type OpcoesEntradaSharp = {
  failOn: "error";
  limitInputPixels: number | boolean;
  sequentialRead?: boolean;
};
type OpcoesRedimensionamento = {
  width?: number;
  height?: number;
  fit: "inside" | "cover";
  position?: string;
  withoutEnlargement?: boolean;
  fastShrinkOnLoad?: boolean;
};
interface ProcessadorImagem {
  rotate(): ProcessadorImagem;
  clone(): ProcessadorImagem;
  metadata(): Promise<{ width?: number; height?: number }>;
  resize(opcoes: OpcoesRedimensionamento): ProcessadorImagem;
  resize(
    largura: number,
    altura: number,
    opcoes: OpcoesRedimensionamento,
  ): ProcessadorImagem;
  webp(opcoes: { quality: number }): ProcessadorImagem;
  jpeg(opcoes: { quality: number; progressive: boolean }): ProcessadorImagem;
  toFile(destino: string): Promise<unknown>;
  toBuffer(): Promise<Buffer>;
}
const criarProcessadorImagem = sharp as unknown as (
  entrada: Buffer,
  opcoes: OpcoesEntradaSharp,
) => ProcessadorImagem;

export function obterRaizUploads() {
  return raizUploads;
}

export async function armazenarCapa(arquivo?: Express.Multer.File) {
  if (!arquivo) throw new Error("Selecione uma imagem de capa.");
  const tipo = await fileTypeFromBuffer(arquivo.buffer);
  const extensao = tipo ? formatos.get(tipo.mime) : undefined;
  if (!extensao)
    throw new Error("Formato inválido. Envie JPEG, PNG, WebP ou AVIF.");
  const remoto = await usarS3();
  if (!remoto)
    await Promise.all([
      mkdir(pastaCapas, { recursive: true }),
      mkdir(pastaSociais, { recursive: true }),
    ]);
  const identificador = randomUUID();
  const nomeCapa = `${identificador}.webp`;
  const nomeSocial = `${identificador}.jpg`;
  const imagem = criarProcessadorImagem(arquivo.buffer, {
    failOn: "error",
    limitInputPixels: 40_000_000,
  }).rotate();
  const metadados = await imagem.metadata();
  if (!metadados.width || !metadados.height)
    throw new Error("Não foi possível validar as dimensões da imagem.");
  const capa = imagem
    .clone()
    .resize({
      width: 1600,
      height: 1000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84 });
  const social = imagem
    .clone()
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88, progressive: true });
  if (remoto) {
    const [bufferCapa, bufferSocial] = await Promise.all([
      capa.toBuffer(),
      social.toBuffer(),
    ]);
    const [caminho, caminhoSocial] = await Promise.all([
      enviarObjeto(`capas/${nomeCapa}`, bufferCapa, "image/webp"),
      enviarObjeto(`sociais/${nomeSocial}`, bufferSocial, "image/jpeg"),
    ]);
    return { caminho, caminhoSocial, larguraSocial: 1200, alturaSocial: 630 };
  }
  await Promise.all([
    capa.toFile(path.join(pastaCapas, nomeCapa)),
    social.toFile(path.join(pastaSociais, nomeSocial)),
  ]);
  return {
    caminho: `/uploads/capas/${nomeCapa}`,
    caminhoSocial: `/uploads/sociais/${nomeSocial}`,
    larguraSocial: 1200,
    alturaSocial: 630,
  };
}
export async function armazenarFotoPerfil(arquivo?: Express.Multer.File) {
  if (!arquivo) throw new Error("Selecione uma foto de perfil.");
  const tipo = await fileTypeFromBuffer(arquivo.buffer);
  const extensao = tipo ? formatos.get(tipo.mime) : undefined;
  if (!extensao)
    throw new Error("Formato inválido. Envie JPEG, PNG, WebP ou AVIF.");
  const remoto = await usarS3();
  if (!remoto) await mkdir(pastaPerfis, { recursive: true });
  const nome = `${randomUUID()}.webp`;
  const foto = criarProcessadorImagem(arquivo.buffer, {
    failOn: "error",
    limitInputPixels: false,
    sequentialRead: true,
  })
    .rotate()
    .resize(512, 512, {
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
      fastShrinkOnLoad: true,
    })
    .webp({ quality: 86 });
  if (remoto)
    return enviarObjeto(`perfis/${nome}`, await foto.toBuffer(), "image/webp");
  await foto.toFile(path.join(pastaPerfis, nome));
  return `/uploads/perfis/${nome}`;
}

export async function armazenarImagemConteudo(arquivo?: Express.Multer.File) {
  if (!arquivo) throw new Error("Selecione uma imagem.");
  const tipo = await fileTypeFromBuffer(arquivo.buffer);
  if (!tipo || !formatos.has(tipo.mime))
    throw new Error("Formato inválido. Envie JPEG, PNG, WebP ou AVIF.");
  const nome = `${randomUUID()}.webp`;
  const imagem = criarProcessadorImagem(arquivo.buffer, {
    failOn: "error",
    limitInputPixels: 40_000_000,
    sequentialRead: true,
  })
    .rotate()
    .resize({
      width: 1920,
      height: 1920,
      fit: "inside",
      withoutEnlargement: true,
      fastShrinkOnLoad: true,
    })
    .webp({ quality: 84 });
  if (await usarS3())
    return enviarObjeto(
      `conteudos/${nome}`,
      await imagem.toBuffer(),
      "image/webp",
    );
  await mkdir(pastaConteudos, { recursive: true });
  await imagem.toFile(path.join(pastaConteudos, nome));
  return `/uploads/conteudos/${nome}`;
}

export async function fotoPerfilExiste(caminho?: string | null) {
  if (await objetoExiste(caminho)) return true;
  if (!caminho?.startsWith("/uploads/perfis/")) return false;
  const destino = path.resolve(pastaPerfis, path.basename(caminho));
  if (path.dirname(destino) !== pastaPerfis) return false;
  try {
    await access(destino);
    return true;
  } catch {
    return false;
  }
}

export async function excluirCapaGerenciada(caminho?: string | null) {
  if (await excluirObjeto(caminho)) return;
  if (
    !caminho ||
    !/^\/uploads\/(capas|sociais)\/[a-f0-9-]+\.(jpg|webp)$/i.test(caminho)
  )
    return;
  const nome = path.basename(caminho);
  const pasta = caminho.startsWith("/uploads/sociais/")
    ? pastaSociais
    : pastaCapas;
  const destino = path.resolve(pasta, nome);
  if (path.dirname(destino) !== pasta) return;
  await unlink(destino).catch((erro) => {
    if ((erro as NodeJS.ErrnoException).code !== "ENOENT") throw erro;
  });
}

export async function excluirMidiaGerenciada(caminho?: string | null) {
  if (!caminho) return;
  if (await excluirObjeto(caminho)) return;
  if (!/^\/uploads\/(capas|sociais|conteudos)\/[a-f0-9-]+\.(jpg|webp)$/i.test(caminho))
    return;
  const segmento = caminho.split("/")[2];
  const pastas: Record<string, string> = {
    capas: pastaCapas,
    sociais: pastaSociais,
    conteudos: pastaConteudos,
  };
  const pasta = pastas[segmento];
  if (!pasta) return;
  const destino = path.resolve(pasta, path.basename(caminho));
  if (path.dirname(destino) !== pasta) return;
  await unlink(destino).catch((erro) => {
    if ((erro as NodeJS.ErrnoException).code !== "ENOENT") throw erro;
  });
}

export function extrairUrlsDeMidia(conteudo: unknown) {
  const html =
    typeof conteudo === "string"
      ? conteudo
      : conteudo && typeof conteudo === "object" && "texto" in conteudo
        ? String((conteudo as { texto?: unknown }).texto || "")
        : "";
  const urls = new Set<string>();
  for (const correspondencia of html.matchAll(
    /(?:src|href|url)=["']([^"']+)["']/gi,
  ))
    urls.add(correspondencia[1]);
  return urls;
}
export async function excluirFotoPerfil(caminho?: string | null) {
  if (await excluirObjeto(caminho)) return;
  if (!caminho?.startsWith("/uploads/perfis/")) return;
  const destino = path.resolve(pastaPerfis, path.basename(caminho));
  if (path.dirname(destino) !== pastaPerfis) return;
  await unlink(destino).catch((e) => {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  });
}
