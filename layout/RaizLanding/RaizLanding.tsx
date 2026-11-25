"use client";

import { type ReactNode, useRef } from "react";
import { useContadorAnimado } from "@/hooks/useContadorAnimado";
import { useRevelarAoRolar } from "@/hooks/useRevelarAoRolar";

interface RaizLandingProps {
  /** Nome da página; gera a classe `lp-<pagina>` que escopa o CSS dela. */
  pagina: string;
  children: ReactNode;
}

/** Elemento raiz de toda landing page: escopa o CSS e liga as animações de rolagem. */
export default function RaizLanding({ pagina, children }: RaizLandingProps) {
  const raiz = useRef<HTMLDivElement>(null);
  useRevelarAoRolar(raiz);
  useContadorAnimado(raiz);
  return (
    <div ref={raiz} className={`lp-raiz lp-${pagina}`}>
      {children}
    </div>
  );
}
