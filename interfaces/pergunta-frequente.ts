export interface PerguntaFrequente {
  pergunta: string;
  resposta: string;
  /** Começa aberta (somente na variante "details"). */
  aberta?: boolean;
}
