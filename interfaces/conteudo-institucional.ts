export interface Imagem {
  src: string;
  alt: string;
}

/** Case de cliente com depoimento, exibido na página inicial. */
export interface CaseCliente {
  logo: Imagem;
  destaque: string;
  descricao: string;
  depoimento: string;
  autor: {
    nome: string;
    cargo: string;
    iniciais: string;
    foto?: string;
  };
}

/** Pessoa da liderança exibida no carrossel da página inicial. */
export interface Lider {
  nome: string;
  cargo: string;
  descricao: string;
  foto: Imagem;
  linkedin: string;
  /** Rótulo acessível do link do LinkedIn. */
  rotuloLinkedin: string;
  /** Quando presente, o cartão ganha o bloco de texto expandido com etiquetas. */
  etiquetas?: string[];
}

/** Escritório da metodologia BTO (abas da seção "Nossa metodologia"). */
export interface EscritorioBto {
  sigla: string;
  nome: string;
  titulo: string;
  descricao: string;
  imagem?: Imagem;
}
