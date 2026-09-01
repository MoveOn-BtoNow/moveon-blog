import type { Metadata } from "next";
import PaginaSobre from "./PaginaSobre";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a MOVE.ON, consultoria de transformação de negócios que conecta processos, tecnologia, projetos e pessoas.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Quem Somos | MOVE.ON",
    description:
      "Ecossistema de gestão que conecta processos, tecnologia e projetos.",
    images: [{ url: "/evento.png", alt: "Evento da MOVE.ON" }],
  },
};

export default function Sobre() {
  return <PaginaSobre />;
}
