import Link from "next/link";
import { LINKS_SITE } from "./links-site";
import "@/styles/rodape-site.css";

/** Rodapé usado nas páginas do blog, com o mesmo visual e menu do rodapé da landing page. */
export default function RodapeSite() {
  return (
    <footer className="rod-site">
      <div className="rod-site-interno">
        <div className="rod-site-grade">
          <div>
            <Link className="rod-site-logo" href="/" aria-label="MOVE.ON Consulting — página inicial">
              <img src="/landing/logo-fundo-preto.png" alt="MOVE.ON Business Transformation" />
            </Link>
          </div>
          <nav aria-label="Menu do rodapé">
            <strong>Menu</strong>
            {LINKS_SITE.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.rotulo}
              </Link>
            ))}
          </nav>
          <div>
            <strong>Contato</strong>
            <a href="mailto:contato@moveon.consulting">contato@moveon.consulting</a>
            <div className="rod-site-redes">
              <a className="rod-site-rede" href="https://www.linkedin.com/company/moveonbto" target="_blank" rel="noreferrer" aria-label="LinkedIn MOVE.ON">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M2 9h4v12H2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
              <a className="rod-site-rede" href="https://www.instagram.com/moveonconsulting_/" target="_blank" rel="noreferrer" aria-label="Instagram MOVE.ON">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
              </a>
            </div>
            <Link href="/politica-de-privacidade">Política de privacidade</Link>
            <Link href="/termos">Termos de uso</Link>
          </div>
        </div>
        <div className="rod-site-base">
          <span>
            © 2026 Powered By{" "}
            <a href="https://wa.me/5511971492602" target="_blank" rel="noreferrer">
              Mont Plus
            </a>
          </span>
          <span>CNPJ 43.247.308/0001-49</span>
        </div>
      </div>
    </footer>
  );
}
