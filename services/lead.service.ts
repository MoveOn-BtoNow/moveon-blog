import type { Lead, ResultadoEnvioLead } from "@/interfaces/lead";

/** Caixa de entrada que recebe os leads das landing pages. */
export const DESTINO_LEADS = "contato@moveon.consulting";
const URL_FORMSUBMIT = `https://formsubmit.co/ajax/${DESTINO_LEADS}`;

/** Envia o lead pelo FormSubmit (mesmo serviço usado pelas landing pages em HTML). */
export async function enviarLead(lead: Lead): Promise<ResultadoEnvioLead> {
  const corpo: Record<string, string> = {
    _subject: lead.assunto,
    _template: "table",
    _captcha: "false",
    _replyto: lead.email,
  };
  for (const campo of lead.campos) corpo[campo.rotulo] = campo.valor;
  corpo["Origem"] = lead.origem;

  try {
    const resposta = await fetch(URL_FORMSUBMIT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(corpo),
    });
    const resultado = (await resposta.json().catch(() => null)) as { success?: unknown; message?: unknown } | null;
    const mensagem = resultado?.message ? String(resultado.message) : "";
    // O FormSubmit exige uma ativação única: na primeira submissão ele envia
    // um e-mail com o link "Activate Form" para a caixa de destino.
    if (mensagem.toLowerCase().includes("activation")) return "ativacao-pendente";
    if (!resposta.ok || (resultado && String(resultado.success) === "false")) return "falha";
    return "enviado";
  } catch {
    return "falha";
  }
}

/** Abre o programa de e-mail do visitante com o lead preenchido, para que ele nunca se perca. */
export function abrirEmailComLead(lead: Lead): void {
  const linhas = [...lead.campos.map((c) => `${c.rotulo}: ${c.valor || "-"}`), `Origem: ${lead.origem}`];
  const href = `mailto:${DESTINO_LEADS}?subject=${encodeURIComponent(lead.assunto)}&body=${encodeURIComponent(linhas.join("\n"))}`;
  window.location.href = href;
}
