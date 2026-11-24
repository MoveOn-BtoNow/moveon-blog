"use client";

import { type RefObject, useEffect } from "react";

const DURACAO_MS = 1350;
const suavizar = (progresso: number) => 1 - Math.pow(1 - progresso, 3);

/**
 * Anima de 0 até `data-target` os números `.metric-number` dentro de `raiz`
 * quando eles aparecem na tela.
 */
export function useContadorAnimado(raiz: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const elemento = raiz.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const numero = entrada.target as HTMLElement;
          const alvo = Number(numero.dataset.target || "0");
          const inicio = performance.now();
          const quadro = (agora: number) => {
            const progresso = Math.min((agora - inicio) / DURACAO_MS, 1);
            numero.textContent = Math.round(alvo * suavizar(progresso)).toLocaleString("pt-BR");
            if (progresso < 1) requestAnimationFrame(quadro);
          };
          requestAnimationFrame(quadro);
          observador.unobserve(numero);
        }
      },
      { threshold: 0.55 },
    );
    elemento.querySelectorAll(".metric-number").forEach((numero) => observador.observe(numero));
    return () => observador.disconnect();
  }, [raiz]);
}
