import type { Metadata } from "next";
import { FeaturesView } from "@/components/features/FeaturesView";

export const metadata: Metadata = {
  title: "Features",
  description: "One solid shell, a weighted wobble base and three edible Stages that let the food set the pace.",
};

export default function FeaturesPage() {
  return <FeaturesView />;
}
