import { NextResponse } from "next/server";
import { SHIPPING_OPTIONS } from "@/lib/data";
import { computeTotals, isValidLine, lineKey, lineTitle, unitPrice, type CartLine } from "@/lib/pricing";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: CORS });

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export function GET() {
  return json({
    endpoint: "/api/orders",
    method: "POST",
    mode: "test",
    description: "Accepts a test order and returns a confirmation. Nothing is charged or shipped.",
    example: {
      items: [{ kind: "bundle", size: "M", color: "teal", tier: "medium", qty: 1 }],
      shippingMethod: "standard",
      customer: { name: "Test Owner", email: "test@example.com" },
    },
    itemKinds: {
      shell: "requires size (S|M|L), color (teal|ink|ember), tier (light|medium|heavy), qty",
      pack: "requires tier, qty",
      bundle: "requires size M, color, tier, qty",
    },
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Request body must be valid JSON." }, 400);
  }

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return json({ ok: false, error: "`items` must be a non-empty array." }, 400);
  }
  if (rawItems.length > 20) return json({ ok: false, error: "Too many line items." }, 400);

  const lines: CartLine[] = [];
  for (const [i, it] of rawItems.entries()) {
    if (!isValidLine({ ...(it as object), key: "x" })) {
      return json({ ok: false, error: `Item ${i + 1} is invalid. See GET /api/orders for the expected shape.` }, 400);
    }
    const l = it as CartLine;
    lines.push({ ...l, key: lineKey(l) });
  }

  const shippingMethod = SHIPPING_OPTIONS.some((o) => o.id === body.shippingMethod) ? (body.shippingMethod as "standard" | "express") : "standard";
  const totals = computeTotals(lines, shippingMethod);
  const ship = SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)!;

  const customer = (body.customer && typeof body.customer === "object" ? body.customer : {}) as Record<string, unknown>;
  const email = typeof customer.email === "string" ? customer.email.trim() : "";
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return json({ ok: false, error: "`customer.email` is not a valid email." }, 400);

  const orderId = "LS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const eta = new Date();
  eta.setDate(eta.getDate() + (shippingMethod === "express" ? 3 : 7));

  return json(
    {
      ok: true,
      status: "confirmed",
      testMode: true,
      orderId,
      placedAt: new Date().toISOString(),
      estimatedDelivery: eta.toISOString().slice(0, 10),
      shippingMethod: ship.name,
      customer: { name: typeof customer.name === "string" ? customer.name : undefined, email: email || undefined },
      items: lines.map((l) => ({ title: lineTitle(l), qty: l.qty, unitPrice: unitPrice(l), lineTotal: unitPrice(l) * l.qty })),
      totals: { currency: "USD", ...totals },
      message: "Test order confirmed. Nothing was charged and nothing will ship.",
    },
    201,
  );
}
