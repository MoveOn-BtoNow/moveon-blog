"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useMenuNavegacao } from "@/hooks/useMenuNavegacao";
import type { LinkNavegacao } from "@/interfaces/navegacao";
import "./cabecalho-site.css";
import { LINKS_SITE } from "../links-site";


interface CabecalhoSiteProps {
  /** Itens do menu. Padrão: menu principal do site. Landing pages passam as âncoras da própria página. */
  links?: LinkNavegacao[];
  /** Destino do botão "Fale com especialista" e valor opcional de `data-cta` (Google Tag Manager). */
  chamada?: { href: string; dataCta?: string };
  /** Mostra o botão de busca do blog. */
  comBusca?: boolean;
  /** Mostra o botão de acesso à administração do blog (login, recuperação de senha e painel). */
  comAdmin?: boolean;
  /** Abre a busca do blog na própria página; sem ela, o botão leva para /blog?buscar=1. */
  aoBuscar?: () => void;
  /** Link do menu que fica destacado. */
  ativo?: string;
  /** Reserva o espaço do cabeçalho fixo. Use false quando o topo da página já fica por baixo dele. */
  comEspaco?: boolean;
}

/** Rotas internas usam o Link do Next; âncoras da própria página continuam como <a>. */
function Ancora({ href, children, ...resto }: ComponentProps<"a"> & { href: string }) {
  if (href.startsWith("/")) return <Link href={href} {...resto}>{children}</Link>;
  return <a href={href} {...resto}>{children}</a>;
}

/**
 * Cabeçalho único do site (landing pages e blog). A logo sempre leva para a página inicial.
 */
export default function CabecalhoSite({
  links = LINKS_SITE,
  chamada = { href: "/#contato" },
  comBusca = false,
  comAdmin = false,
  aoBuscar,
  ativo,
  comEspaco = true,
}: CabecalhoSiteProps) {
  const { rolou, menuAberto, alternarMenu, fecharMenu } = useMenuNavegacao(18, "cab-site-menu-aberto");
  return (
    <>
      <header className={rolou ? "cab-site cab-site-rolado" : "cab-site"}>
        <div className="cab-site-interno">
          <Link className="cab-site-logo" href="/" aria-label="MOVE.ON Consulting — página inicial">
            <img src="/landing/logo-fundo-preto.png" alt="MOVE.ON Business Transformation" />
          </Link>
          <nav className={menuAberto ? "cab-site-links aberto" : "cab-site-links"} aria-label="Navegação principal">
            {links.map((link) => (
              <Ancora
                key={link.href}
                className={link.href === ativo ? "cab-site-link ativo" : "cab-site-link"}
                href={link.href}
                onClick={fecharMenu}
              >
                {link.rotulo}
              </Ancora>
            ))}
          </nav>
          <div className="cab-site-acoes">
            <a className="cab-site-icone" href="https://www.instagram.com/moveonconsulting_/" target="_blank" rel="noreferrer" aria-label="Instagram MOVE.ON">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a className="cab-site-icone" href="https://www.linkedin.com/company/moveonbto/" target="_blank" rel="noreferrer" aria-label="LinkedIn MOVE.ON">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
            {(comBusca || aoBuscar) && (aoBuscar ? (
              <button className="cab-site-icone" type="button" aria-label="Buscar publicações" onClick={aoBuscar}>
                <IconeBusca />
              </button>
            ) : (
              <Link className="cab-site-icone" href="/blog?buscar=1" aria-label="Buscar publicações">
                <IconeBusca />
              </Link>
            ))}
            {comAdmin && (
              <Link className="cab-site-icone" href="/admin" aria-label="Abrir administração" title="Administração">
                <IconeAdmin />
              </Link>
            )}
            <Ancora className="cab-site-cta" href={chamada.href} data-cta={chamada.dataCta}>
              Fale com especialista
            </Ancora>
            <button className="cab-site-menu" type="button" aria-label="Abrir menu" aria-expanded={menuAberto} onClick={alternarMenu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {comEspaco && <div className="cab-site-espaco" aria-hidden="true" />}
    </>
  );
}

function IconeBusca() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconeAdmin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
