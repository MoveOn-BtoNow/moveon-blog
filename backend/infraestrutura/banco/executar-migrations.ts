import pg from "pg";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { ambiente } from "../../configuracoes/ambiente";

export async function executarMigrations(): Promise<void> {
  const cliente = new pg.Client({ connectionString: ambiente.DATABASE_URL });
  await cliente.connect();

  try {
    await cliente.query(`CREATE TABLE IF NOT EXISTS controle_migrations (
      nome varchar(255) PRIMARY KEY,
      executada_em timestamptz NOT NULL DEFAULT now()
    )`);

    const arquivos = (await readdir(resolve("migrations")))
      .filter((nome) => nome.endsWith(".sql"))
      .sort();

    for (const nome of arquivos) {
      const migrationExecutada = await cliente.query(
        "SELECT 1 FROM controle_migrations WHERE nome = $1",
        [nome],
      );
      if (migrationExecutada.rowCount) continue;

      await cliente.query(await readFile(resolve("migrations", nome), "utf8"));
      await cliente.query(
        "INSERT INTO controle_migrations (nome) VALUES ($1)",
        [nome],
      );
      console.log(`Migration executada: ${nome}`);
    }
  } finally {
    await cliente.end();
  }
}
