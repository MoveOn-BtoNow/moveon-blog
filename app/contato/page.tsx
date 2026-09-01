import type { Metadata } from "next";
import PaginaContato from "./PaginaContato";

export const metadata: Metadata = {
  title: "Contato | MOVE.ON",
  description: "Converse com a equipe MOVE.ON sobre seus desafios de transformação, SAP, processos e governança.",
  alternates: { canonical: "/contato" },
};

export default function Contato(){ return <PaginaContato/>; }

