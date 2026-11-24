"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

/** Quantos cartões aparecem por vez, de acordo com a largura da janela. */
export type ItensPorVez = (larguraJanela: number) => number;

/**
 * Carrossel por deslocamento (translateX) de uma trilha de cartões.
 * Mede o primeiro cartão e o `gap` da trilha sempre que ela muda de tamanho.
 * `itensPorVez` deve ser uma função estável (declarada fora do componente).
 */
export function useCarrossel<T extends HTMLElement>(totalItens: number, itensPorVez: ItensPorVez) {
  const trilhaRef = useRef<T>(null);
  const [medidas, setMedidas] = useState({ passo: 0, porVez: totalItens });
  const [posicao, setPosicao] = useState(0);

  useEffect(() => {
    const elemento = trilhaRef.current;
    if (!elemento) return;
    const medir = () => {
      const cartao = elemento.children[0] as HTMLElement | undefined;
      if (!cartao) return;
      const gap = parseFloat(getComputedStyle(elemento).gap || "0") || 0;
      setMedidas({ passo: cartao.getBoundingClientRect().width + gap, porVez: itensPorVez(window.innerWidth) });
    };
    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [itensPorVez]);

  const maximo = Math.max(0, totalItens - medidas.porVez);
  const indice = Math.min(Math.max(posicao, 0), maximo);
  const estiloTrilha: CSSProperties = { transform: `translateX(${-indice * medidas.passo}px)` };

  return {
    trilhaRef,
    estiloTrilha,
    indice,
    maximo,
    anterior: () => setPosicao(indice - 1),
    proximo: () => setPosicao(indice + 1),
    irPara: setPosicao,
  };
}
