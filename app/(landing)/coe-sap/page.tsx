import type { Metadata } from "next";
import TelaCoeSap from "@/screens/landing/CoeSap/coe-sap";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | 4s4.TAX — Reforma Tributária no S/4HANA"
  },
  "description": "4s4.TAX: a MOVE.ON adequa seu SAP S/4HANA à Reforma Tributária de ponta a ponta — fiscal, processos, configuração, testes e governança do programa, sem comprometer a estabilidade do sistema.",
  "alternates": {
    "canonical": "/coe-sap"
  },
  "openGraph": {
    "title": "MOVE.ON Consulting | 4s4.TAX — Reforma Tributária no S/4HANA",
    "description": "A Reforma Tributária vai exigir adequação contínua do seu SAP até 2033. A MOVE.ON cuida dessa adequação de ponta a ponta no S/4HANA.",
    "type": "website",
    "locale": "pt_BR"
  },
  "twitter": {
    "card": "summary_large_image"
  }
};

export default function Page() {
  return <TelaCoeSap />;
}
