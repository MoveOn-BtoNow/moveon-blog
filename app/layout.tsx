import type { Metadata } from "next";
import "./globals.css";
import ConsentimentoDados from "./componentes/ConsentimentoDados";

const obrigatoria = (nome: string) => {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável ${nome} não definida.`);
  return valor;
};
const nome = obrigatoria("NOME_PORTAL"),
  descricao = obrigatoria("DESCRICAO_PORTAL"),
  base = obrigatoria("URL_PUBLICA_PORTAL"),
  imagem = obrigatoria("CAMINHO_IMAGEM_SOCIAL");
export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: `${nome} — ${descricao}`, template: `%s | ${nome}` },
  description: descricao,
  applicationName: nome,
  authors: [{ name: nome }],
  creator: nome,
  publisher: nome,
  category: "Portal de conteúdo",
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: [{ url: "/favicon-32.png", type: "image/png" }],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${nome} — ${descricao}`,
    description: descricao,
    url: base,
    siteName: nome,
    images: [
      { url: imagem, width: 1200, height: 630, alt: `${nome} — ${descricao}` },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${nome} — ${descricao}`,
    description: descricao,
    images: [imagem],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dados = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organizacao`,
        name: nome,
        url: base,
        logo: {
          "@type": "ImageObject",
          url: new URL(
            process.env.CAMINHO_LOGO || "/logo.png",
            base,
          ).toString(),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: nome,
        description: descricao,
        publisher: { "@id": `${base}/#organizacao` },
        inLanguage: "pt-BR",
      },
    ],
  };
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var tema=localStorage.getItem("tema_moveon");document.documentElement.dataset.theme=tema==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}})();`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dados).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <ConsentimentoDados />
      </body>
    </html>
  );
}
