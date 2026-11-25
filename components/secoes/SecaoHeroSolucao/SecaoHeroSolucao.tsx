import type { ReactNode } from "react";
import SeloHero from "@/components/SeloHero";

interface SecaoHeroSolucaoProps {
  selo: string;
  titulo: string;
  /** Texto de apoio; pode conter destaques em <b>. */
  subtitulo: ReactNode;
  /** Conteúdo extra abaixo dos botões (ex.: jornada ou diagrama). */
  children?: ReactNode;
}

/** Hero das páginas de solução (BPM, Blueprint, 4s4.Governance e 4s4.Operate). */
export default function SecaoHeroSolucao({ selo, titulo, subtitulo, children }: SecaoHeroSolucaoProps) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <SeloHero className="eyebrow">{selo}</SeloHero>
        <h1>{titulo}</h1>
        <p className="sub">{subtitulo}</p>
        <div className="hero-ctas">
          <a href="#contato" className="btn btn-primary">
            Falar com um especialista
          </a>{" "}
          <a href="#solucoes" className="btn btn-secondary">
            Conheça nossas soluções
          </a>
        </div>
        {children}
      </div>
    </section>
  );
}
