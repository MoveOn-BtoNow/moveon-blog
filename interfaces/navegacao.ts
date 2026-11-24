export interface LinkNavegacao {
  rotulo: string;
  href: string;
}

export interface LogoCabecalho {
  href: string;
  src: string;
  alt: string;
}

/** Botão de chamada para ação do cabeçalho. */
export interface ChamadaCabecalho {
  rotulo: string;
  href: string;
  className: string;
  /** Valor de `data-cta`, usado pelo Google Tag Manager. */
  dataCta?: string;
}
