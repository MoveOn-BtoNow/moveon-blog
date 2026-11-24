import type { Metadata } from "next";
import PaginaBpm from "@/components/landing/bpm/PaginaBpm";
import "@/styles/landing/bpm.css";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | BPM — Business Transformation"
  },
  "alternates": {
    "canonical": "/bpm"
  }
};

export default function Page() {
  return <PaginaBpm />;
}
