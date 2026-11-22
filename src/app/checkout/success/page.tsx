import type { Metadata } from "next";
import { SuccessView } from "@/components/checkout/SuccessView";

export const metadata: Metadata = { title: "Order confirmed" };

export default function SuccessPage() {
  return <SuccessView />;
}
