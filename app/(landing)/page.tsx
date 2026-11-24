import type { Metadata } from "next";
import TelaInicio from "@/screens/landing/Inicio/inicio";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | Governança de Projetos e Processos"
  },
  "description": "A MOVE.ON conecta estratégia, processos e tecnologia para que projetos críticos entreguem resultado com mais clareza, qualidade e governança.",
  "alternates": {
    "canonical": "/"
  },
  "openGraph": {
    "title": "MOVE.ON Consulting | Governança de Projetos e Processos",
    "description": "PMO Estratégico, Reforma Tributária no S/4HANA e Centro de Excelência SAP para empresas que precisam transformar projetos críticos em resultado mensurável.",
    "type": "website",
    "locale": "pt_BR"
  },
  "twitter": {
    "card": "summary_large_image"
  }
};

export default function Page() {
  return <TelaInicio />;
}
