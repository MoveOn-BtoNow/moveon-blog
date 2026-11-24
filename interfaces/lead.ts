/** Um par rótulo/valor enviado no e-mail do lead. */
export interface CampoLead {
  rotulo: string;
  valor: string;
}

/** Lead captado em uma landing page. */
export interface Lead {
  assunto: string;
  origem: string;
  /** E-mail do visitante, usado como "responder para". */
  email: string;
  campos: CampoLead[];
}

/**
 * - `enviado`: o FormSubmit aceitou o lead.
 * - `ativacao-pendente`: o formulário ainda precisa ser ativado no e-mail da MOVE.ON.
 * - `falha`: não foi possível enviar automaticamente.
 */
export type ResultadoEnvioLead = "enviado" | "ativacao-pendente" | "falha";
