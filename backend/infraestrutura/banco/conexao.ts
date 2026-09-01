import pg from "pg";
import { ambiente } from "../../configuracoes/ambiente";

const estadoGlobal = globalThis as unknown as { poolPostgresql?: pg.Pool };

export const conexao =
  estadoGlobal.poolPostgresql ??
  new pg.Pool({
    connectionString: ambiente.DATABASE_URL,
    max: ambiente.BANCO_MAX_CONEXOES,
    idleTimeoutMillis: ambiente.BANCO_TEMPO_OCIOSO_MS,
    connectionTimeoutMillis: ambiente.BANCO_TEMPO_CONEXAO_MS,
  });

if (ambiente.NODE_ENV !== "production") {
  estadoGlobal.poolPostgresql = conexao;
}

export async function verificarConexao(): Promise<void> {
  await conexao.query("SELECT 1");
}

export async function encerrarConexao(): Promise<void> {
  await conexao.end();
}
