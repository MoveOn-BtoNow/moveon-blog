import { z } from "zod";

export const categoriaEntrada = z
  .object({
    nome: z.string().trim().min(2).max(80),
    descricao: z.string().trim().max(300).optional().default(""),
  })
  .strict();
export const parceiroEntrada = z
  .object({
    nome: z.string().trim().min(2).max(160),
    caminhoLogo: z.union([
      z.string().url().max(1000),
      z.string().regex(/^\/(?:uploads\/capas\/[a-f0-9-]+\.(?:jpg|png|webp|avif)|[^<>]+\.(?:jpg|jpeg|png|webp|avif))$/i),
    ]),
    enderecoSite: z.union([z.string().url().max(1000), z.literal("")]).optional(),
    ativo: z.boolean().default(true),
    ordem: z.number().int().min(0).max(10000).default(0),
  })
  .strict();
export const publicacaoEntrada = z
  .object({
    titulo: z.string().trim().min(5).max(180),
    resumo: z.string().trim().min(10).max(500),
    conteudo: z.string().trim().min(1).max(500_000),
    situacao: z.enum(["rascunho", "agendada", "publicada", "arquivada"]),
    destaque: z.boolean().default(false),
    categorias: z.array(z.string().uuid()).min(1),
    imagemCapaUrl: z
      .union([
        z.string().url().max(1000),
        z
          .string()
          .regex(/^\/uploads\/capas\/[a-f0-9-]+\.(jpg|png|webp|avif)$/i),
        z.literal(""),
      ])
      .optional(),
    imagemSocialUrl: z
      .union([
        z.string().url().max(1000),
        z.string().regex(/^\/uploads\/sociais\/[a-f0-9-]+\.jpg$/i),
        z.literal(""),
      ])
      .optional(),
    textoAlternativoCapa: z.string().trim().max(300).optional(),
    agendadoPara: z.string().datetime().optional().nullable(),
    metatitulo: z.string().max(180).optional(),
    metadescricao: z.string().max(320).optional(),
  })
  .strict()
  .superRefine((dados, contexto) => {
    if (dados.situacao === "agendada" && !dados.agendadoPara)
      contexto.addIssue({
        code: "custom",
        message: "Informe a data do agendamento.",
        path: ["agendadoPara"],
      });
    if (dados.situacao === "publicada" && dados.agendadoPara)
      contexto.addIssue({
        code: "custom",
        message: "Uma publicação imediata não deve manter agendamento.",
        path: ["agendadoPara"],
      });
  });
const corHex = z.string().regex(/^#[0-9a-f]{6}$/i);
export const configuracaoEntrada = z
  .object({
    nome: z.string().trim().min(1).max(120),
    descricao: z.string().trim().max(300),
    caminhoLogo: z.string().trim().max(500),
    caminhoFavicon: z.string().trim().max(500),
    corPrimaria: corHex,
    corFundoClaro: corHex,
    corFundoEscuro: corHex,
    corTextoClaro: corHex,
    corTextoEscuro: corHex,
    exibirQuemSomos: z.boolean(),
    exibirOQueResolvemos: z.boolean(),
    exibirRedesSociais: z.boolean(),
    instagramUrl: z.union([z.string().url().max(1000), z.literal("")]),
    linkedinUrl: z.union([z.string().url().max(1000), z.literal("")]),
  })
  .strict();
export const administradorEntrada = z
  .object({
    nome: z.string().trim().min(2).max(120),
    email: z
      .string()
      .trim()
      .regex(/^[^\s@]+@[^\s@]+$/),
    caminhoFoto: z
      .union([
        z
          .string()
          .max(1200)
          .refine(
            (caminho) =>
              /^\/uploads\/perfis\/[a-f0-9-]+\.(?:jpg|png|webp|avif)$/i.test(
                caminho,
              ) ||
              /^\/api\/portal\/midias\/perfis\/[a-f0-9-]+\.webp$/i.test(
                caminho,
              ) ||
              /^https:\/\/[^\s]+$/i.test(caminho),
            "Informe uma foto de perfil gerenciada pela plataforma.",
          ),
        z.literal(""),
      ])
      .optional()
      .default(""),
    alterarEmail: z.boolean().default(false),
    alterarSenha: z.boolean().default(false),
    senhaAtual: z.string().min(8).max(128).optional(),
    novaSenha: z.string().min(12).max(128).optional(),
  })
  .strict()
  .superRefine((d, c) => {
    if ((d.alterarEmail || d.alterarSenha) && !d.senhaAtual)
      c.addIssue({
        code: "custom",
        message: "Informe a senha atual.",
        path: ["senhaAtual"],
      });
    if (d.alterarSenha && !d.novaSenha)
      c.addIssue({
        code: "custom",
        message: "Informe a nova senha.",
        path: ["novaSenha"],
      });
  });

export type DadosCategoria = z.infer<typeof categoriaEntrada>;
export type DadosPublicacao = z.infer<typeof publicacaoEntrada>;
export type DadosConfiguracao = z.infer<typeof configuracaoEntrada>;
export type DadosParceiro = z.infer<typeof parceiroEntrada>;
