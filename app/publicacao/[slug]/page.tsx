import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Compartilhamento from "./Compartilhamento";
import RodapePortal from "../../componentes/RodapePortal";
import InscricaoNewsletter from "../../componentes/InscricaoNewsletter";
import CabecalhoPortal from "../../componentes/CabecalhoPortal";
import "ckeditor5/ckeditor5-content.css";

type Publicacao = {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: { texto?: string } | string;
  imagemCapaUrl?: string;
  imagemSocialUrl?: string;
  textoAlternativoCapa?: string;
  metatitulo?: string;
  metadescricao?: string;
  publicadoEm: string;
  atualizadoEm: string;
  categorias: { nome: string; slug: string }[];
  configuracoes: {
    nome: string;
    descricao: string;
    caminhoLogo: string;
    caminhoFavicon: string;
    exibirQuemSomos: boolean;
    exibirOQueResolvemos: boolean;
    exibirNewsletter: boolean;
    exibirRedesSociais: boolean;
    instagramUrl: string;
    linkedinUrl: string;
    atualizadoEm: string;
  };
};
const api = process.env.URL_INTERNA_API || "http://127.0.0.1:3001";
const base = (
  process.env.URL_PUBLICA_PORTAL || "http://localhost:3000"
).replace(/\/$/, "");
const absoluto = (caminho?: string) =>
  !caminho
    ? `${base}${process.env.CAMINHO_IMAGEM_SOCIAL || "/og.png"}`
    : caminho.startsWith("http")
      ? caminho
      : `${base}${caminho}`;
async function obter(slug: string): Promise<Publicacao | null> {
  try {
    const r = await fetch(
      `${api}/api/portal/publicacoes/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params,
    p = await obter(slug);
  if (!p)
    return {
      title: "Publicação não encontrada",
      robots: { index: false, follow: false },
    };
  const titulo = p.metatitulo || p.titulo,
    descricao = p.metadescricao || p.resumo,
    url = `${base}/publicacao/${p.slug}`,
    imagem = absoluto(p.imagemSocialUrl || p.imagemCapaUrl),
    favicon = p.configuracoes.caminhoFavicon || "/favicon-32.png";
  return {
    title: titulo,
    description: descricao,
    keywords: p.categorias.map((c) => c.nome),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url,
      title: titulo,
      description: descricao,
      publishedTime: p.publicadoEm,
      modifiedTime: p.atualizadoEm,
      section: p.categorias[0]?.nome,
      images: [
        {
          url: imagem,
          width: 1200,
          height: 630,
          alt: p.textoAlternativoCapa || p.titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [imagem],
    },
    icons: {
      icon: [
        { url: favicon, sizes: "32x32" },
      ],
      apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
    },
  };
}
export default async function PaginaPublicacao({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    p = await obter(slug);
  if (!p) notFound();
  const conteudo =
      typeof p.conteudo === "string" ? p.conteudo : p.conteudo?.texto || "",
    url = `${base}/publicacao/${p.slug}`,
    imagem = absoluto(p.imagemSocialUrl || p.imagemCapaUrl);
  const estruturados = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.titulo,
    description: p.metadescricao || p.resumo,
    image: [imagem],
    datePublished: p.publicadoEm,
    dateModified: p.atualizadoEm,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: process.env.NOME_PORTAL || "MOVE.ON",
      logo: {
        "@type": "ImageObject",
        url: absoluto(process.env.CAMINHO_LOGO || "/logo.png"),
      },
    },
    articleSection: p.categorias.map((c) => c.nome),
    keywords: p.categorias.map((c) => c.nome).join(", "),
    inLanguage: "pt-BR",
  };
  return (
    <div className="publicacao-com-cabecalho">
      <CabecalhoPortal />
      <article className="artigo artigo-rota">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(estruturados).replace(/</g, "\\u003c"),
          }}
        />
        <Compartilhamento
          id={p.id}
          titulo={p.titulo}
          configuracaoRedes={{
            exibirRedesSociais: p.configuracoes.exibirRedesSociais,
            instagramUrl: p.configuracoes.instagramUrl,
            linkedinUrl: p.configuracoes.linkedinUrl,
          }}
        />
        <header>
          <div className="tags-artigo">
            {p.categorias.map((c) => (
              <a
                className="tag"
                href={`/?categoria=${encodeURIComponent(c.slug)}`}
                key={c.slug}
              >
                {c.nome}
              </a>
            ))}
          </div>
          <h1>{p.titulo}</h1>
          <p>{p.resumo}</p>
          <time className="artigo-meta" dateTime={p.publicadoEm}>
            Publicado em{" "}
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "America/Bahia",
            }).format(new Date(p.publicadoEm))}
          </time>
        </header>
        <img
          className="capa-artigo"
          src={p.imagemCapaUrl || "/og.png"}
          alt={p.textoAlternativoCapa || p.titulo}
          width="1600"
          height="900"
          decoding="async"
        />
        <div className="artigo-layout">
          <div
            className="texto conteudo-formatado ck-content"
            dangerouslySetInnerHTML={{ __html: conteudo }}
          />
        </div>
      </article>
      {p.configuracoes.exibirNewsletter && (
        <InscricaoNewsletter nome={p.configuracoes.nome || "MOVE.ON"} />
      )}
      <RodapePortal
        logo={p.configuracoes.caminhoLogo || "/logo.png"}
        descricao={p.configuracoes.descricao}
      />
    </div>
  );
}
