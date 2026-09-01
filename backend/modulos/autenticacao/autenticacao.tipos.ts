export interface AdministradorPersistido {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  caminhoFoto?: string | null;
}

export interface AdministradorAutenticado {
  id: string;
  nome: string;
  email: string;
  caminhoFoto?: string | null;
}

export interface ContextoSessao {
  agenteUsuario: string | null;
  enderecoIp: string | null;
}
