/** Opção de um campo de seleção. Sem `valor`, o valor enviado é o próprio rótulo. */
export interface OpcaoCampo {
  valor?: string;
  rotulo: string;
}

/** Campo exibido no formulário de contato de uma landing page. */
export interface CampoFormulario {
  /** `name` e `id` do campo. */
  nome: string;
  /** Texto do <label>. */
  rotulo: string;
  /** Rótulo usado no e-mail enviado à MOVE.ON. */
  rotuloEnvio: string;
  tipo?: "text" | "email" | "select" | "textarea";
  placeholder?: string;
  autoComplete?: string;
  obrigatorio?: boolean;
  linhas?: number;
  larguraTotal?: boolean;
  opcoes?: OpcaoCampo[];
}

export interface BotaoFormulario {
  texto: string;
  classe: string;
  /** Valor de `data-cta`, usado pelo Google Tag Manager. */
  cta?: string;
  divClasse: string;
}

/** Configuração completa do formulário de lead de uma página. */
export interface ConfiguracaoFormularioLead {
  /** Identifica a página de origem no e-mail do lead. */
  origem: string;
  /** Início do assunto do e-mail. Padrão: "Contato via site MOVE.ON". */
  prefixoAssunto?: string;
  /** Foca o campo "nome" quando um link para #leadForm é clicado. */
  focarAoNavegar?: boolean;
  classe: string;
  mensagemInicial: string;
  botao: BotaoFormulario;
  campos: CampoFormulario[];
}
