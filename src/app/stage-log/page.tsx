import type { Metadata } from "next";
import { StageLogView } from "@/components/log/StageLogView";

export const metadata: Metadata = {
  title: "Stage Log",
  description: "Log how far your dog gets, see a 7-day pattern, and get a nudge to tier up or rotate. Saved in your browser.",
};

export default function StageLogPage() {
  return <StageLogView />;
}
