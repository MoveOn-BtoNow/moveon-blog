import type { Metadata } from "next";
import PaginaBlueprint from "@/components/landing/blueprint/PaginaBlueprint";
import "@/styles/landing/blueprint.css";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | Blueprint — Strategic Readiness"
  },
  "alternates": {
    "canonical": "/blueprint"
  }
};

export default function Page() {
  return <PaginaBlueprint />;
}
