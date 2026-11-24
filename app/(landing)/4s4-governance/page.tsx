import type { Metadata } from "next";
import TelaGovernance4s4 from "@/screens/landing/Governance4s4/4s4-governance";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | 4s4.Governance"
  },
  "alternates": {
    "canonical": "/4s4-governance"
  }
};

export default function Page() {
  return <TelaGovernance4s4 />;
}
