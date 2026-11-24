export type ConteudosLegais = {
  politicaPrivacidadeTitulo: string;
  politicaPrivacidadeSubtitulo: string;
  politicaPrivacidadeHtml: string;
  termosUsoTitulo: string;
  termosUsoSubtitulo: string;
  termosUsoHtml: string;
};
export async function obterConteudosLegais(): Promise<ConteudosLegais | null> {
  try {
    const base = process.env.URL_INTERNA_API || "http://127.0.0.1:3001";
    const resposta = await fetch(
      `${base}/api/portal/privacidade/configuracao`,
      { cache: "no-store" },
    );
    if (!resposta.ok) return null;
    return (await resposta.json()) as ConteudosLegais;
  } catch {
    return null;
  }
}
