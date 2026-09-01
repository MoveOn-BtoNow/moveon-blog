import { z } from "zod";

export const esquemaCredenciais = z
  .object({
    email: z
      .string()
      .trim()
      .min(3)
      .max(254)
      .regex(/^[^\s@]+@[^\s@]+$/, "Identificador de acesso inválido."),
    senha: z.string().min(8).max(128),
  })
  .strict();

export type Credenciais = z.infer<typeof esquemaCredenciais>;
