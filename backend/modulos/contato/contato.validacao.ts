import { z } from "zod";

const texto = (minimo: number, maximo: number) =>
  z.string().trim().min(minimo).max(maximo);
const telefone = z
  .string()
  .trim()
  .max(24)
  .refine(
    (valor) => !valor || /^\+?[\d\s().-]{8,24}$/.test(valor),
    "Telefone inválido.",
  );

export const esquemaMensagemContato = z
  .object({
    nome: texto(2, 120),
    email: z.string().trim().toLowerCase().email().max(254),
    empresa: texto(2, 160),
    cargo: texto(2, 120),
    clienteSap: z.enum(["sim", "nao", "nao_sei"]),
    desafio: texto(10, 5000),
    tokenRecaptcha: z.string().max(5000).optional().default(""),
    website: z.string().max(0).optional().default(""),
  })
  .strict();

export const esquemaConfiguracaoContato = z
  .object({
    exibirContato: z.boolean(),
    exibirFormulario: z.boolean(),
    email: z.union([z.string().trim().email().max(254), z.literal("")]),
    telefone,
    whatsapp: telefone,
    endereco: z.string().trim().max(500),
    horario: z.string().trim().max(300),
    encaminharEmail: z.boolean(),
    recaptchaAtivo: z.boolean(),
    recaptchaChaveSite: z.string().trim().max(500),
    recaptchaChaveSecreta: z.string().max(500).optional().default(""),
    recaptchaPontuacaoMinima: z.number().min(0).max(1),
  })
  .strict();

export const esquemaListaMensagens = z.object({
  busca: z.string().trim().max(160).optional().default(""),
  situacao: z
    .enum(["todas", "nova", "lida", "respondida", "arquivada"])
    .optional()
    .default("todas"),
  cursor: z.string().max(200).optional(),
  limite: z.coerce.number().int().min(1).max(50).default(20),
});

export const esquemaResposta = z.object({ resposta: texto(2, 5000) }).strict();
export const esquemaSituacao = z
  .object({ situacao: z.enum(["lida", "arquivada"]) })
  .strict();
