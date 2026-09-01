import { conexao } from "../../infraestrutura/banco/conexao";
import type {
  AdministradorAutenticado,
  AdministradorPersistido,
  ContextoSessao,
} from "./autenticacao.tipos";

export class RepositorioAutenticacao {
  async buscarAdministradorPorEmail(
    email: string,
  ): Promise<AdministradorPersistido | null> {
    const resultado = await conexao.query<AdministradorPersistido>(
      `SELECT id, nome, email, senha_hash, caminho_foto "caminhoFoto"
       FROM administradores
       WHERE lower(email) = lower($1) AND ativo = true
       LIMIT 1`,
      [email],
    );
    return resultado.rows[0] ?? null;
  }

  async registrarUltimoAcesso(administradorId: string): Promise<void> {
    await conexao.query(
      "UPDATE administradores SET ultimo_acesso_em = now() WHERE id = $1",
      [administradorId],
    );
  }

  async criarSessao(
    administradorId: string,
    tokenHash: string,
    ipHash: string | null,
    contexto: ContextoSessao,
    duracaoDias: number,
  ): Promise<void> {
    await conexao.query(
      `INSERT INTO sessoes_administrativas
       (administrador_id, token_hash, endereco_ip_hash, agente_usuario, expira_em)
       VALUES ($1, $2, $3, $4, now() + ($5 * interval '1 day'))`,
      [
        administradorId,
        tokenHash,
        ipHash,
        contexto.agenteUsuario?.slice(0, 500),
        duracaoDias,
      ],
    );
  }

  async buscarAdministradorPorToken(
    tokenHash: string,
  ): Promise<AdministradorAutenticado | null> {
    const resultado = await conexao.query<AdministradorAutenticado>(
      `SELECT administrador.id, administrador.nome, administrador.email, administrador.caminho_foto "caminhoFoto"
       FROM sessoes_administrativas sessao
       JOIN administradores administrador ON administrador.id = sessao.administrador_id
       WHERE sessao.token_hash = $1
         AND sessao.revogada_em IS NULL
         AND sessao.expira_em > now()
         AND administrador.ativo = true
       LIMIT 1`,
      [tokenHash],
    );
    return resultado.rows[0] ?? null;
  }

  async revogarSessao(tokenHash: string): Promise<void> {
    await conexao.query(
      "UPDATE sessoes_administrativas SET revogada_em = now() WHERE token_hash = $1 AND revogada_em IS NULL",
      [tokenHash],
    );
  }
}
