import type { Metadata } from "next";
import TelaBpm from "@/screens/landing/Bpm/bpm";

export const metadata: Metadata = {
  "title": {
    "absolute": "MOVE.ON Consulting | BPM — Business Transformation"
  },
  "alternates": {
    "canonical": "/bpm"
  }
};

export default function Page() {
  return <TelaBpm />;
}
