import type { ReactNode } from "react";
import "./selo-hero.css";

/** Selo acima do título do hero, igual em todas as landing pages. */
export default function SeloHero({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={className ? `selo-hero ${className}` : "selo-hero"}>{children}</span>;
}
