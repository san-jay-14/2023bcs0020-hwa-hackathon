import type { Metadata } from "next";
import { QuizView } from "@/components/quiz/QuizView";

export const metadata: Metadata = {
  title: "Find your tier",
  description: "Five quick questions to match your dog to a Longshift Stage tier and size. No login.",
};

export default function QuizPage() {
  return <QuizView />;
}
