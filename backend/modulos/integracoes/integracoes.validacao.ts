import { z } from "zod";
const urlOuVazio = z.union([z.string().trim().url().max(500), z.literal("")]);
export const esquemaIntegracoes = z
  .object({
    armazenamentoModo: z.enum(["local", "s3"]),
    s3Endpoint: urlOuVazio,
    s3Regiao: z.string().trim().min(2).max(100),
    s3Bucket: z.string().trim().max(255),
    s3Autenticacao: z.enum(["iam_role", "chaves"]),
    s3ChaveAcesso: z.string().max(500),
    s3ChaveSecreta: z.string().max(500),
    s3UrlPublica: urlOuVazio,
    s3ForcarPathStyle: z.boolean(),
    analyticsAtivo: z.boolean(),
    analyticsIdMedicao: z.union([
      z
        .string()
        .trim()
        .regex(/^G-[A-Z0-9]{5,20}$/),
      z.literal(""),
    ]),
    consentimentoAtivo: z.boolean(),
    politicaDadosTexto: z.string().trim().min(20).max(10000),
    permitirAnalytics: z.boolean(),
    permitirPreferencias: z.boolean(),
    permitirMarketing: z.boolean(),
    otelAtivo: z.boolean(),
    otelEndpoint: urlOuVazio,
    otelCabecalhos: z.string().max(4000),
    otelNomeServico: z.string().trim().min(2).max(120),
    otelNivelMinimo: z.enum(["debug", "info", "warn", "error"]),
  })
  .superRefine((dados, contexto) => {
    if (dados.armazenamentoModo !== "s3") return;
    if (!dados.s3Bucket)
      contexto.addIssue({ code: "custom", path: ["s3Bucket"], message: "Informe o bucket." });
    if (Boolean(dados.s3ChaveAcesso) !== Boolean(dados.s3ChaveSecreta))
      contexto.addIssue({ code: "custom", path: ["s3ChaveSecreta"], message: "Informe Access Key e Secret Key juntas." });
  })
  .strict();
export const esquemaConsentimento = z
  .object({
    analytics: z.boolean(),
    preferencias: z.boolean(),
    marketing: z.boolean(),
  })
  .strict();
