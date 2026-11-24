import type { Metadata } from "next";
import TelaOperate4s4 from "@/screens/landing/Operate4s4/4s4-operate";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | 4s4.Operate — Evolução Contínua do SAP"
  },
  "alternates": {
    "canonical": "/4s4-operate"
  }
};

export default function Page() {
  return <TelaOperate4s4 />;
}
