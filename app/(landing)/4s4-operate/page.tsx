import type { Metadata } from "next";
import Pagina4s4Operate from "@/components/landing/4s4-operate/Pagina4s4Operate";
import "@/styles/landing/4s4-operate.css";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | 4s4.Operate — Evolução Contínua do SAP"
  },
  "alternates": {
    "canonical": "/4s4-operate"
  }
};

export default function Page() {
  return <Pagina4s4Operate />;
}
