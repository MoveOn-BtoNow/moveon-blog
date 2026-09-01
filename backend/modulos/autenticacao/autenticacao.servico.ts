import { compare } from "bcryptjs";
import { ambiente } from "../../configuracoes/ambiente";
import {
  gerarHashSha256,
  gerarTokenSeguro,
} from "../../compartilhado/seguranca/criptografia";
import type {
  AdministradorAutenticado,
  ContextoSessao,
} from "./autenticacao.tipos";
import type { Credenciais } from "./autenticacao.validacao";
import { RepositorioAutenticacao } from "./autenticacao.repositorio";

// Hash bcrypt vÃ¡lido usado para igualar o custo da verificaÃ§Ã£o quando o e-mail
// nÃ£o existe, reduzindo enumeraÃ§Ã£o de contas por diferenÃ§a de tempo.
const HASH_COMPARACAO_FICTICIA =
  "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW";

export class ServicoAutenticacao {
  constructor(private readonly repositorio: RepositorioAutenticacao) {}

  async autenticar(
    credenciais: Credenciais,
    contexto: ContextoSessao,
  ): Promise<{
    administrador: AdministradorAutenticado;
    token: string;
  } | null> {
    const administrador = await this.repositorio.buscarAdministradorPorEmail(
      credenciais.email,
    );
    const senhaValida = await compare(
      credenciais.senha,
      administrador?.senha_hash ?? HASH_COMPARACAO_FICTICIA,
    );
    if (!administrador || !senhaValida)
      return null;

    const token = gerarTokenSeguro();
    await this.repositorio.criarSessao(
      administrador.id,
      gerarHashSha256(token),
      contexto.enderecoIp ? gerarHashSha256(contexto.enderecoIp) : null,
      contexto,
      ambiente.DURACAO_SESSAO_DIAS,
    );
    await this.repositorio.registrarUltimoAcesso(administrador.id);

    return {
      administrador: {
        id: administrador.id,
        nome: administrador.nome,
        email: administrador.email,
        caminhoFoto: administrador.caminhoFoto,
      },
      token,
    };
  }

  async obterAdministrador(
    token?: string,
  ): Promise<AdministradorAutenticado | null> {
    return token
      ? this.repositorio.buscarAdministradorPorToken(gerarHashSha256(token))
      : null;
  }

  async encerrarSessao(token?: string): Promise<void> {
    if (token) await this.repositorio.revogarSessao(gerarHashSha256(token));
  }
}
