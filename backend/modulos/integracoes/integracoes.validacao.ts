import { z } from "zod";
const urlOuVazio = z.union([z.string().trim().url().max(500), z.literal("")]);
export const esquemaArmazenamento = z
  .object({
    armazenamentoModo: z.enum(["local", "s3"]),
    s3Endpoint: urlOuVazio.default(""),
    s3Regiao: z.string().trim().min(2).max(100).default("us-east-1"),
    s3Bucket: z.string().trim().max(255).default(""),
    s3Autenticacao: z.enum(["iam_role", "chaves"]).default("iam_role"),
    s3ChaveAcesso: z.string().max(500).default(""),
    s3ChaveSecreta: z.string().max(500).default(""),
    s3UrlPublica: urlOuVazio.default(""),
    s3ForcarPathStyle: z.boolean().default(false),
  })
  .strict()
  .superRefine((dados, contexto) => {
    if (dados.armazenamentoModo !== "s3") return;
    if (!dados.s3Bucket)
      contexto.addIssue({
        code: "custom",
        path: ["s3Bucket"],
        message: "Informe o bucket.",
      });
    if (
      dados.s3Autenticacao === "chaves" &&
      Boolean(dados.s3ChaveAcesso) !== Boolean(dados.s3ChaveSecreta)
    )
      contexto.addIssue({
        code: "custom",
        path: ["s3ChaveSecreta"],
        message: "Informe Access Key e Secret Key juntas.",
      });
  });
export const esquemaAnalytics = z
  .object({
    analyticsAtivo: z.boolean(),
    analyticsIdMedicao: z.union([
      z.string().trim().regex(/^G-[A-Z0-9]{5,20}$/),
      z.literal(""),
    ]),
    consentimentoAtivo: z.boolean(),
    permitirAnalytics: z.boolean(),
    permitirPreferencias: z.boolean(),
    permitirMarketing: z.boolean(),
  })
  .strict();
export const esquemaOpenTelemetry = z
  .object({
    otelAtivo: z.boolean(),
    otelEndpoint: urlOuVazio,
    otelCabecalhos: z.string().max(4000),
    otelNomeServico: z.string().trim().min(2).max(120),
    otelNivelMinimo: z.enum(["debug", "info", "warn", "error"]),
  })
  .strict()
  .superRefine((dados, contexto) => {
    if (dados.otelAtivo && !dados.otelEndpoint)
      contexto.addIssue({
        code: "custom",
        path: ["otelEndpoint"],
        message: "Informe o endpoint OTLP/HTTP.",
      });
    if (dados.otelEndpoint) {
      const endpoint = new URL(dados.otelEndpoint);
      if (!['http:', 'https:'].includes(endpoint.protocol))
        contexto.addIssue({
          code: "custom",
          path: ["otelEndpoint"],
          message: "Use um endpoint HTTP ou HTTPS.",
        });
      if (!endpoint.pathname.endsWith("/v1/logs"))
        contexto.addIssue({
          code: "custom",
          path: ["otelEndpoint"],
          message: "O endpoint de logs OTLP/HTTP deve terminar com /v1/logs.",
        });
    }
    const proibidos = new Set([
      "host",
      "content-length",
      "connection",
      "transfer-encoding",
      "cookie",
    ]);
    for (const [indice, linha] of dados.otelCabecalhos.split(/\r?\n/).entries()) {
      if (!linha.trim()) continue;
      const separador = linha.indexOf(":");
      const nome = separador > 0 ? linha.slice(0, separador).trim() : "";
      const valor = separador > 0 ? linha.slice(separador + 1).trim() : "";
      if (
        !/^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(nome) ||
        !valor ||
        proibidos.has(nome.toLowerCase())
      )
        contexto.addIssue({
          code: "custom",
          path: ["otelCabecalhos"],
          message: `Cabeçalho inválido na linha ${indice + 1}.`,
        });
    }
  });
export const esquemaIntegracoes = z
  .object({
    armazenamentoModo: z.enum(["local", "s3"]),
    s3Endpoint: urlOuVazio.default(""),
    s3Regiao: z.string().trim().min(2).max(100).default("us-east-1"),
    s3Bucket: z.string().trim().max(255).default(""),
    s3Autenticacao: z.enum(["iam_role", "chaves"]).default("iam_role"),
    s3ChaveAcesso: z.string().max(500).default(""),
    s3ChaveSecreta: z.string().max(500).default(""),
    s3UrlPublica: urlOuVazio.default(""),
    s3ForcarPathStyle: z.boolean().default(false),
    analyticsAtivo: z.boolean(),
    analyticsIdMedicao: z.union([
      z
        .string()
        .trim()
        .regex(/^G-[A-Z0-9]{5,20}$/),
      z.literal(""),
    ]),
    consentimentoAtivo: z.boolean(),
    politicaDadosTexto: z.string().trim().min(20).max(10000).optional(),
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
      contexto.addIssue({
        code: "custom",
        path: ["s3Bucket"],
        message: "Informe o bucket.",
      });
    if (
      dados.s3Autenticacao === "chaves" &&
      Boolean(dados.s3ChaveAcesso) !== Boolean(dados.s3ChaveSecreta)
    )
      contexto.addIssue({
        code: "custom",
        path: ["s3ChaveSecreta"],
        message: "Informe Access Key e Secret Key juntas.",
      });
  })
  .strict();
export const esquemaConsentimento = z
  .object({
    analytics: z.boolean(),
    preferencias: z.boolean(),
    marketing: z.boolean(),
  })
  .strict();
