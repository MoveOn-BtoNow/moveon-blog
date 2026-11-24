"use client";

import { type RefObject, useEffect } from "react";

/**
 * Adiciona a classe `visible` aos elementos `.reveal` dentro de `raiz`
 * quando eles entram na tela, com um pequeno atraso escalonado.
 */
export function useRevelarAoRolar(raiz: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const elemento = raiz.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      },
      { threshold: 0.12 },
    );
    elemento.querySelectorAll<HTMLElement>(".reveal").forEach((item, indice) => {
      item.style.transitionDelay = `${Math.min(indice % 6, 5) * 45}ms`;
      observador.observe(item);
    });
    return () => observador.disconnect();
  }, [raiz]);
}
