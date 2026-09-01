import { randomUUID } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
import { enviarObjeto, usarS3 } from "../integracoes/armazenamento-objetos";
export async function armazenarVideo(arquivo?: Express.Multer.File) {
  if (!arquivo) throw new Error("Selecione um vídeo.");
  if (!(await usarS3()))
    throw new Error(
      "Ative e configure o armazenamento S3 antes de enviar vídeos.",
    );
  const tipo = await fileTypeFromBuffer(arquivo.buffer);
  const formatos = new Map([
    ["video/mp4", "mp4"],
    ["video/webm", "webm"],
    ["video/quicktime", "mov"],
  ]);
  const extensao = tipo ? formatos.get(tipo.mime) : undefined;
  if (!extensao) throw new Error("Formato inválido. Envie MP4, WebM ou MOV.");
  return enviarObjeto(
    `videos/${randomUUID()}.${extensao}`,
    arquivo.buffer,
    tipo!.mime,
  );
}
