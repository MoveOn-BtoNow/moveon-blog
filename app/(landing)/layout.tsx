import type { Metadata } from "next";

const urlPublica = process.env.URL_PUBLICA_PORTAL;

export const metadata: Metadata = {
  ...(urlPublica ? { metadataBase: new URL(urlPublica) } : {}),
  authors: [{ name: "MOVE.ON Consulting" }],
  robots: { index: true, follow: true },
  referrer: "strict-origin-when-cross-origin",
  icons: {
    icon: [{ url: "/landing/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/landing/favicon.svg" }],
  },
};

/**
 * Layout raiz das landing pages institucionais (rota "/" e páginas de solução).
 * É separado do layout do blog para que o CSS de um não interfira no outro.
 */
export default function LayoutLanding({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
