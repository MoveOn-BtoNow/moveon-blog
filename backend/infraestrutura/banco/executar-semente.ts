import { hash } from "bcryptjs";
import pg from "pg";
import { z } from "zod";
import { ambiente } from "../../configuracoes/ambiente";

const esquemaSemente = z.object({
  ADMIN_NOME: z.string().min(2).max(120),
  ADMIN_EMAIL: z
    .string()
    .min(3)
    .max(254)
    .regex(/^[^\s@]+@[^\s@]+$/),
  ADMIN_SENHA: z.string().min(12).max(128),
  CUSTO_HASH_SENHA: z.coerce.number().int().min(10).max(15),
  CATEGORIAS_INICIAIS: z.string().min(1),
  NOME_PORTAL: z.string().min(1).max(120),
  DESCRICAO_PORTAL: z.string().min(1).max(300),
  CAMINHO_LOGO: z.string().min(1).max(500),
  CAMINHO_FAVICON: z.string().min(1).max(500),
});

function criarSlug(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

export async function executarSemente(): Promise<void> {
  const configuracao = esquemaSemente.parse(process.env);
  const cliente = new pg.Client({ connectionString: ambiente.DATABASE_URL });
  await cliente.connect();

  try {
    const senhaHash = await hash(
      configuracao.ADMIN_SENHA,
      configuracao.CUSTO_HASH_SENHA,
    );
    await cliente.query("BEGIN");
    const administradorAtualizado = await cliente.query(
      `UPDATE administradores SET email = $1, senha_hash = $2, atualizado_em = now()
       WHERE id = (
         SELECT id FROM administradores WHERE nome = $3 ORDER BY criado_em LIMIT 1
       )`,
      [configuracao.ADMIN_EMAIL, senhaHash, configuracao.ADMIN_NOME],
    );
    if (!administradorAtualizado.rowCount) {
      await cliente.query(
        `INSERT INTO administradores (nome, email, senha_hash) VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET
           nome = EXCLUDED.nome,
           senha_hash = EXCLUDED.senha_hash,
           atualizado_em = now()`,
        [configuracao.ADMIN_NOME, configuracao.ADMIN_EMAIL, senhaHash],
      );
    }

    const categorias = configuracao.CATEGORIAS_INICIAIS.split(",")
      .map((nome) => nome.trim())
      .filter(Boolean);
    for (const nome of categorias) {
      await cliente.query(
        "INSERT INTO categorias (nome, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING",
        [nome, criarSlug(nome)],
      );
    }

    await cliente.query(
      `UPDATE configuracoes_portal SET
         nome = $1, descricao = $2, caminho_logo = $3, caminho_favicon = $4, atualizado_em = now()
       WHERE id = 1`,
      [
        configuracao.NOME_PORTAL,
        configuracao.DESCRICAO_PORTAL,
        configuracao.CAMINHO_LOGO,
        configuracao.CAMINHO_FAVICON,
      ],
    );
    await cliente.query("COMMIT");
    console.log(
      "Administrador, categorias e configurações iniciais atualizados.",
    );
  } catch (erro) {
    await cliente.query("ROLLBACK");
    throw erro;
  } finally {
    await cliente.end();
  }
}
