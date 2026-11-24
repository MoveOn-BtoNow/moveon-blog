import type { Metadata } from "next";
import Pagina4s4Governance from "@/components/landing/4s4-governance/Pagina4s4Governance";
import "@/styles/landing/4s4-governance.css";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | 4s4.Governance"
  },
  "alternates": {
    "canonical": "/4s4-governance"
  }
};

export default function Page() {
  return <Pagina4s4Governance />;
}
