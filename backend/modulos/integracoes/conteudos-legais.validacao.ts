import { z } from "zod";
const html = z.string().trim().min(1).max(500000);
export const esquemaConsentimentoLegal = z
  .object({ titulo: z.string().trim().min(3).max(180), conteudoHtml: html })
  .strict();
export const esquemaDocumentoLegal = z
  .object({
    titulo: z.string().trim().min(3).max(180),
    subtitulo: z.string().trim().min(10).max(500),
    conteudoHtml: html,
  })
  .strict();
