"use client";

import { ReactNode } from "react";
import CabecalhoPortal from "./CabecalhoPortal";
import RodapePortal from "./RodapePortal";

export default function PaginaLegal({
  titulo,
  resumo,
  children,
}: {
  titulo: string;
  resumo: string;
  children: ReactNode;
}) {
  return (
    <div className="pagina-legal">
      <CabecalhoPortal />
      <main className="legal-conteudo">
        <header>
          <span>MOVE.ON · DOCUMENTO LEGAL</span>
          <h1>{titulo}</h1>
          <p>{resumo}</p>
          <time dateTime="2026-08-31">Última atualização: 31 de agosto de 2026</time>
        </header>
        <article>{children}</article>
      </main>
      <RodapePortal />
    </div>
  );
}
