"use client";

import { type RefObject, useEffect } from "react";

/** Cores da animação de rede (as que terminam em "," recebem a opacidade + ")"). */
export interface CoresRede {
  edge: string;
  edgeCrit: string;
  pulse: string;
  pulseCrit: string;
  glow: string;
  node: string;
  nodeRing: string;
  nodeCrit: string;
  nodeHalo: string;
}

interface No { bx: number; by: number; x: number; y: number; ph: number; r: number; crit: boolean }
interface Aresta { a: No; b: No; crit: boolean; pulse: number }

/**
 * Desenha no <canvas> a "rede de dependências do portfólio": nós por fase,
 * caminho crítico em destaque e pulsos de execução. Respeita prefers-reduced-motion.
 */
export function useRedeAnimada(canvasRef: RefObject<HTMLCanvasElement | null>, cores: CoresRede | undefined) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !cores) return;
    const C = cores;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, t = 0, quadro = 0, temporizador: ReturnType<typeof setTimeout> | undefined;
    let nos: No[] = [], arestas: Aresta[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const embaralhar = <T,>(lista: T[]) => {
      for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
      }
      return lista;
    };

    function montar() {
      nos = []; arestas = [];
      const colunas = Math.max(4, Math.round(W / 210));
      const larguraColuna = W / (colunas + 0.4);
      const porColuna: No[][] = [];
      for (let c = 0; c < colunas; c++) {
        const quantidade = 3 + Math.floor(Math.random() * 2);
        const daColuna: No[] = [];
        for (let i = 0; i < quantidade; i++) {
          const x = larguraColuna * (c + 0.7) + rnd(-16, 16);
          const y = H * ((i + 0.5) / quantidade) + rnd(-H * 0.05, H * 0.05);
          const no: No = { bx: x, by: y, x, y, ph: rnd(0, Math.PI * 2), r: rnd(2.1, 3.7), crit: false };
          daColuna.push(no); nos.push(no);
        }
        porColuna.push(daColuna);
      }
      for (let c = 0; c < porColuna.length - 1; c++) {
        porColuna[c].forEach((no) => {
          const k = 1 + (Math.random() < 0.4 ? 1 : 0);
          embaralhar(porColuna[c + 1].slice()).slice(0, k).forEach((alvo) => arestas.push({ a: no, b: alvo, crit: false, pulse: Math.random() }));
        });
      }
      const caminho = porColuna.map((col) => col[Math.floor(Math.random() * col.length)]);
      caminho.forEach((no) => (no.crit = true));
      for (let c = 0; c < caminho.length - 1; c++) {
        let aresta = arestas.find((e) => e.a === caminho[c] && e.b === caminho[c + 1]);
        if (!aresta) { aresta = { a: caminho[c], b: caminho[c + 1], crit: true, pulse: Math.random() }; arestas.push(aresta); }
        aresta.crit = true;
      }
    }

    function redimensionar() {
      const rect = canvas!.getBoundingClientRect();
      W = rect.width; H = rect.height;
      if (!W || !H) return;
      canvas!.width = W * dpr; canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      montar();
    }

    function desenhar() {
      t += 0.006;
      ctx!.clearRect(0, 0, W, H);
      nos.forEach((n) => { n.x = n.bx + Math.sin(t * 0.8 + n.ph) * 6; n.y = n.by + Math.cos(t * 0.6 + n.ph) * 6; });
      arestas.forEach((e) => {
        ctx!.beginPath(); ctx!.moveTo(e.a.x, e.a.y); ctx!.lineTo(e.b.x, e.b.y);
        ctx!.strokeStyle = e.crit ? C.edgeCrit : C.edge;
        ctx!.lineWidth = e.crit ? 1.4 : 1; ctx!.stroke();
        e.pulse += e.crit ? 0.01 : 0.006; if (e.pulse > 1) e.pulse -= 1;
        const px = e.a.x + (e.b.x - e.a.x) * e.pulse, py = e.a.y + (e.b.y - e.a.y) * e.pulse;
        ctx!.beginPath(); ctx!.arc(px, py, e.crit ? 2.6 : 1.7, 0, Math.PI * 2);
        if (e.crit) { ctx!.fillStyle = C.pulseCrit; ctx!.shadowColor = C.glow; ctx!.shadowBlur = 10; }
        else { ctx!.fillStyle = C.pulse; ctx!.shadowBlur = 0; }
        ctx!.fill(); ctx!.shadowBlur = 0;
      });
      nos.forEach((n) => {
        const p = 0.5 + 0.5 * Math.sin(t * 2 + n.ph);
        if (n.crit) {
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r + 3 + p * 2, 0, Math.PI * 2);
          ctx!.fillStyle = C.nodeHalo + (0.1 + p * 0.1).toFixed(3) + ")"; ctx!.fill();
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r + 1, 0, Math.PI * 2);
          ctx!.fillStyle = C.nodeCrit; ctx!.shadowColor = C.glow; ctx!.shadowBlur = 12; ctx!.fill(); ctx!.shadowBlur = 0;
        } else {
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx!.fillStyle = C.node + (0.32 + p * 0.22).toFixed(3) + ")"; ctx!.fill();
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r + 1, 0, Math.PI * 2);
          ctx!.strokeStyle = C.nodeRing; ctx!.lineWidth = 1; ctx!.stroke();
        }
      });
      if (!reduzir) quadro = requestAnimationFrame(desenhar);
    }

    const aoRedimensionar = () => { clearTimeout(temporizador); temporizador = setTimeout(redimensionar, 180); };
    redimensionar();
    if (reduzir) desenhar(); else quadro = requestAnimationFrame(desenhar);
    window.addEventListener("resize", aoRedimensionar, { passive: true });
    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(temporizador);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, [canvasRef, cores]);
}
