"use client";

import { useRef, useState } from "react";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

interface FaqProps {
  itens: PerguntaFrequente[];
  /** "acordeao": botão com animação de altura; "details": <details> nativo do HTML. */
  variante: "acordeao" | "details";
  className?: string;
}

function ItemAcordeao({ item }: { item: PerguntaFrequente }) {
  const resposta = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);
  const [altura, setAltura] = useState<string>();

  function alternar() {
    const proximo = !aberto;
    setAberto(proximo);
    setAltura(proximo ? `${resposta.current?.scrollHeight ?? 0}px` : "0px");
  }

  return (
    <div className={aberto ? "faq-item is-open" : "faq-item"}>
      <button className="faq-q" type="button" aria-expanded={aberto} onClick={alternar}>
        <span>{item.pergunta}</span>
        <svg className="faq-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="faq-a" ref={resposta} style={altura ? { maxHeight: altura } : undefined}>
        <p>{item.resposta}</p>
      </div>
    </div>
  );
}

/** Perguntas frequentes das landing pages. */
export default function Faq({ itens, variante, className }: FaqProps) {
  return (
    <div className={className}>
      {itens.map((item) =>
        variante === "acordeao" ? (
          <ItemAcordeao key={item.pergunta} item={item} />
        ) : (
          <details key={item.pergunta} open={item.aberta}>
            <summary>{item.pergunta}</summary>
            <p>{item.resposta}</p>
          </details>
        ),
      )}
    </div>
  );
}
