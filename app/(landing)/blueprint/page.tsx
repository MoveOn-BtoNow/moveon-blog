import type { Metadata } from "next";
import TelaBlueprint from "@/screens/landing/Blueprint/blueprint";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | Blueprint — Strategic Readiness"
  },
  "alternates": {
    "canonical": "/blueprint"
  }
};

export default function Page() {
  return <TelaBlueprint />;
}
