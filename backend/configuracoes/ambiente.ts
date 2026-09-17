import { z } from "zod";

const esquemaAmbiente = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  HOST_API: z.string().min(1),
  PORTA_API: z.coerce.number().int().min(1).max(65_535),
  ORIGENS_PERMITIDAS: z.string().min(1),
  LIMITE_CORPO_JSON: z.string().regex(/^\d+(kb|mb)$/i),
  BANCO_MAX_CONEXOES: z.coerce.number().int().min(1).max(100),
  BANCO_TEMPO_OCIOSO_MS: z.coerce.number().int().positive(),
  BANCO_TEMPO_CONEXAO_MS: z.coerce.number().int().positive(),
  NOME_COOKIE_SESSAO: z.string().regex(/^[A-Za-z0-9_-]+$/),
  DURACAO_SESSAO_DIAS: z.coerce.number().int().min(1).max(365),
  COOKIE_SAMESITE: z.enum(["strict", "lax", "none"]),
  COOKIE_SEGURO: z
    .string()
    .transform((valor) => valor.toLowerCase() === "true"),
  MAX_TENTATIVAS_LOGIN: z.coerce.number().int().min(1).max(100),
  MAX_LOGINS_SIMULTANEOS_POR_IP: z.coerce.number().int().min(1).max(20),
  JANELA_TENTATIVAS_MINUTOS: z.coerce.number().int().min(1).max(1_440),
  BLOQUEIO_LOGIN_INICIAL_SEGUNDOS: z.coerce.number().int().min(30).max(3600).default(60),
  BLOQUEIO_LOGIN_MAX_DIAS: z.coerce.number().int().min(1).max(30).default(7),
  RECUPERACAO_EXPIRACAO_MINUTOS: z.coerce.number().int().min(5).max(60).default(30),
  RECUPERACAO_INTERVALO_MINUTOS: z.coerce.number().int().min(1).max(60).default(5),
  RECUPERACAO_MAX_POR_IP_HORA: z.coerce.number().int().min(1).max(20).default(5),
  MAX_CADASTROS_NEWSLETTER_POR_IP: z.coerce.number().int().min(1).max(100),
  JANELA_NEWSLETTER_MINUTOS: z.coerce.number().int().min(1).max(10_080),
  NOME_COOKIE_VISITANTE: z.string().regex(/^[A-Za-z0-9_-]+$/),
  DURACAO_COOKIE_VISITANTE_DIAS: z.coerce.number().int().min(1).max(730),
  MAX_REACOES_POR_IP_HORA: z.coerce.number().int().min(1).max(1000),
  MAX_MENSAGENS_CONTATO_POR_IP_HORA: z.coerce.number().int().min(1).max(100),
  CUSTO_HASH_SENHA: z.coerce.number().int().min(10).max(15),
  PASTA_UPLOADS: z.string().min(1),
  MAX_IMAGEM_CAPA_MB: z.coerce.number().int().min(1).max(20),
  MAX_VIDEO_MB: z.coerce.number().int().min(10).max(1000),
  LIMITE_PUBLICACOES_DESTAQUE: z.coerce.number().int().min(1).max(20),
  LIMPEZA_MIDIAS_ORFAS_HORAS: z.coerce.number().int().min(1).max(720).default(24),
  INTERVALO_LIMPEZA_MIDIAS_MINUTOS: z.coerce.number().int().min(10).max(10080).default(360),
  EMAIL_ATIVO: z.string().transform((v) => v.toLowerCase() === "true"),
  SMTP_HOST: z.string().min(1),
  SMTP_PORTA: z.coerce.number().int().min(1).max(65535),
  SMTP_SEGURO: z.string().transform((v) => v.toLowerCase() === "true"),
  SMTP_USUARIO: z.string(),
  SMTP_SENHA: z.string(),
  EMAIL_REMETENTE_NOME: z.string().min(1),
  EMAIL_REMETENTE_ENDERECO: z.string().email(),
  EMAIL_SEGREDO_CANCELAMENTO: z.string().min(32),
  URL_PUBLICA_PORTAL: z.string().url(),
  REDIS_ATIVO: z.string().default("false").transform((v) => v.toLowerCase() === "true"),
  REDIS_URL: z.string().default("redis://127.0.0.1:6380"),
  REDIS_PREFIXO: z.string().regex(/^[A-Za-z0-9:_-]+$/).default("moveon"),
});

const resultado = esquemaAmbiente.safeParse(process.env);

if (!resultado.success) {
  const campos = resultado.error.issues
    .map((item) => item.path.join("."))
    .join(", ");
  throw new Error(`Configuração inválida no .env. Verifique: ${campos}`);
}

export const ambiente = {
  ...resultado.data,
  origensPermitidas: resultado.data.ORIGENS_PERMITIDAS.split(",")
    .map((origem) => origem.trim())
    .filter(Boolean),
};
