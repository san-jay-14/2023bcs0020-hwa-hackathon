import type { Metadata } from "next";
import { ProductView } from "@/components/product/ProductView";

export const metadata: Metadata = {
  title: "Shop Longshift",
  description: "Pick your size, colour and Stage tier. One shell, three Stages, zero batteries. From $22.",
};

export default function ProductPage() {
  return <ProductView />;
}
