import type { Metadata } from "next";
import PaginaCleanCoreStudio from "@/components/landing/clean-core-studio/PaginaCleanCoreStudio";
import "@/styles/landing/clean-core-studio.css";

export const metadata: Metadata = {
  "title": {
    "absolute": "Clean Core Studio | IA da MOVE.ON para SAP S/4HANA"
  },
  "alternates": {
    "canonical": "/clean-core-studio"
  }
};

export default function Page() {
  return <PaginaCleanCoreStudio />;
}
