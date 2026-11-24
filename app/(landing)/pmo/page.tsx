import type { Metadata } from "next";
import TelaPmo from "@/screens/landing/Pmo/pmo";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | PMO Governance"
  },
  "description": "Estruturamos e operamos PMOs para organizar portfólios, priorizar iniciativas, acompanhar riscos e trazer clareza às decisões que geram transformação.",
  "alternates": {
    "canonical": "/pmo"
  },
  "openGraph": {
    "title": "MOVE.ON Consulting | PMO Governance",
    "description": "Governança para tirar a estratégia do plano e levar para a execução. Estruturamos e operamos PMOs para organizar portfólios, priorizar iniciativas e trazer clareza às decisões.",
    "type": "website",
    "locale": "pt_BR"
  },
  "twitter": {
    "card": "summary_large_image"
  }
};

export default function Page() {
  return <TelaPmo />;
}
