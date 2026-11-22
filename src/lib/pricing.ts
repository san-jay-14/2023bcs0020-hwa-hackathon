import {
  BUNDLE_PRICE,
  BUNDLE_SIZE,
  COLORS,
  FREE_SHIPPING_OVER,
  SHIPPING_OPTIONS,
  SIZES,
  STAGE_PACK_PRICE,
  TIERS,
  type ColorId,
  type ShippingId,
  type SizeId,
  type TierId,
} from "./data";

export type LineKind = "shell" | "pack" | "bundle";

export type CartLine = {
  key: string;
  kind: LineKind;
  size?: SizeId;
  color?: ColorId;
  tier: TierId;
  qty: number;
};

export const lineKey = (l: Pick<CartLine, "kind" | "size" | "color" | "tier">) =>
  [l.kind, l.size ?? "-", l.color ?? "-", l.tier].join(":");

export function unitPrice(l: Pick<CartLine, "kind" | "size">): number {
  if (l.kind === "pack") return STAGE_PACK_PRICE;
  if (l.kind === "bundle") return BUNDLE_PRICE;
  return SIZES.find((s) => s.id === l.size)?.price ?? 0;
}

export function lineTitle(l: CartLine): string {
  const tier = TIERS.find((t) => t.id === l.tier)?.name ?? "";
  const size = SIZES.find((s) => s.id === l.size)?.label ?? "";
  if (l.kind === "pack") return `Stage Pack · ${tier}`;
  if (l.kind === "bundle") return `Starter Bundle · ${size} shell + ${tier} Pack`;
  return `Longshift Shell · ${size}`;
}

export function lineSubtitle(l: CartLine): string {
  const color = COLORS.find((c) => c.id === l.color)?.name;
  const tier = TIERS.find((t) => t.id === l.tier)?.name;
  if (l.kind === "pack") return "6 loads · 3 Stages each";
  if (l.kind === "bundle") return `${color} · ${tier} tier · 6 loads`;
  return `${color} · matched to ${tier} tier`;
}

export function isValidLine(l: unknown): l is CartLine {
  if (!l || typeof l !== "object") return false;
  const x = l as Record<string, unknown>;
  if (!["shell", "pack", "bundle"].includes(x.kind as string)) return false;
  if (!TIERS.some((t) => t.id === x.tier)) return false;
  if (typeof x.qty !== "number" || !Number.isInteger(x.qty) || x.qty < 1 || x.qty > 20) return false;
  if (x.kind !== "pack") {
    if (!COLORS.some((c) => c.id === x.color)) return false;
    if (!SIZES.some((s) => s.id === x.size)) return false;
  }
  if (x.kind === "bundle" && x.size !== BUNDLE_SIZE) return false;
  return true;
}

export function computeTotals(lines: CartLine[], shipping: ShippingId = "standard") {
  const subtotal = lines.reduce((sum, l) => sum + unitPrice(l) * l.qty, 0);
  const opt = SHIPPING_OPTIONS.find((o) => o.id === shipping) ?? SHIPPING_OPTIONS[0];
  const freeEligible = opt.id === "standard" && subtotal >= FREE_SHIPPING_OVER;
  const shippingCost = lines.length === 0 || freeEligible ? 0 : opt.price;
  return {
    subtotal,
    shipping: shippingCost,
    total: subtotal + shippingCost,
    freeShippingLeft: Math.max(0, FREE_SHIPPING_OVER - subtotal),
  };
}

export const money = (n: number) =>
  n % 1 === 0 ? `₹${n.toLocaleString("en-IN")}` : `₹${n.toFixed(2)}`;
