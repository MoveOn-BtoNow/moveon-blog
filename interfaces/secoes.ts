import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

/** "dim" aplica o fundo alternado da seção (classe `dim`). */
export type FundoSecao = "dim" | undefined;

export interface BotaoChamada {
  rotulo: string;
  href: string;
  /** Valor de `data-cta`, usado pelo Google Tag Manager. */
  cta?: string;
}

/** Título padrão de seção: etiqueta, título e texto de apoio opcional. */
export interface TituloSecao {
  etiqueta: string;
  titulo: string;
  /** Um parágrafo por item. */
  textos?: string[];
}

export interface ItemTexto {
  titulo: string;
  texto: string;
}

export interface Solucao {
  /** Etiqueta acima do nome ("Para entender o cenário…"). */
  rotulo: string;
  titulo: string;
  descricao: string;
  ganhos: string[];
  /** Selos pequenos abaixo dos ganhos (opcional). */
  selos?: string[];
}

export interface ColunaComparativo {
  titulo: string;
  itens: string[];
}

export interface SecaoContatoConteudo extends TituloSecao {
  formulario: ConfiguracaoFormularioLead;
}

export type { PerguntaFrequente };
