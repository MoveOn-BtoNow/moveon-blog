import type { Metadata } from "next";
import TelaCleanCoreStudio from "@/screens/landing/CleanCoreStudio/clean-core-studio";

export const metadata: Metadata = {
  "title": {
    "absolute": "Clean Core Studio | IA da MOVE.ON para SAP S/4HANA"
  },
  "alternates": {
    "canonical": "/clean-core-studio"
  }
};

export default function Page() {
  return <TelaCleanCoreStudio />;
}
