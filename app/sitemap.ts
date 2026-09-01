import type { MetadataRoute } from "next";

type ItemSitemap = {
  slug: string;
  destaque?: boolean;
  atualizadoEm?: string;
  publicadoEm: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (
    process.env.URL_PUBLICA_PORTAL || "http://localhost:3000"
  ).replace(/\/$/, "");
  try {
    const resposta = await fetch(
      `${process.env.URL_INTERNA_API || "http://127.0.0.1:3001"}/api/portal/inicial`,
      { cache: "no-store" },
    );
    const dados = (await resposta.json()) as { publicacoes: ItemSitemap[] };
    return [
      {
        url: base,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      { url: `${base}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      ...dados.publicacoes.map((p) => ({
        url: `${base}/publicacao/${p.slug}`,
        lastModified: new Date(p.atualizadoEm || p.publicadoEm),
        changeFrequency: "weekly" as const,
        priority: p.destaque ? 0.9 : 0.8,
      })),
    ];
  } catch {
    return [
      {
        url: base,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
