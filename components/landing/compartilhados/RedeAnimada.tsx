"use client";

import { useRef } from "react";
import { type CoresRede, useRedeAnimada } from "@/hooks/useRedeAnimada";

/** Paletas por posição na página (as mesmas do HTML original). */
const PALETAS: Record<string, CoresRede> = {
  "hero-net": { edge: "rgba(184,190,205,0.12)", edgeCrit: "rgba(254,48,0,0.42)", pulse: "rgba(205,210,225,0.5)", pulseCrit: "rgba(255,96,48,0.95)", glow: "rgba(254,48,0,.9)", node: "rgba(205,210,225,", nodeRing: "rgba(205,210,225,0.16)", nodeCrit: "rgba(255,96,48,0.95)", nodeHalo: "rgba(254,48,0," },
  "page-net": { edge: "rgba(150,170,210,0.10)", edgeCrit: "rgba(86,150,235,0.34)", pulse: "rgba(180,195,225,0.45)", pulseCrit: "rgba(125,185,255,0.95)", glow: "rgba(86,150,235,.85)", node: "rgba(170,190,220,", nodeRing: "rgba(170,190,220,0.16)", nodeCrit: "rgba(125,185,255,0.95)", nodeHalo: "rgba(86,150,235," },
  "contato-net": { edge: "rgba(160,180,215,0.12)", edgeCrit: "rgba(254,48,0,0.38)", pulse: "rgba(190,205,230,0.5)", pulseCrit: "rgba(255,96,48,0.95)", glow: "rgba(254,48,0,.85)", node: "rgba(180,198,225,", nodeRing: "rgba(180,198,225,0.18)", nodeCrit: "rgba(255,96,48,0.95)", nodeHalo: "rgba(254,48,0," },
};

/** Canvas decorativo com a rede animada de iniciativas. */
export default function RedeAnimada({ className }: { className: "hero-net" | "page-net" | "contato-net" }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useRedeAnimada(canvas, PALETAS[className]);
  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
