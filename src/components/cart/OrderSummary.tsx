"use client";

import { LineThumb } from "./CartLineRow";
import { computeTotals, lineSubtitle, lineTitle, money, unitPrice, type CartLine } from "@/lib/pricing";
import type { ShippingId } from "@/lib/data";

export function OrderSummary({ lines, shipping = "standard", editable = false }: { lines: CartLine[]; shipping?: ShippingId; editable?: boolean }) {
  const t = computeTotals(lines, shipping);
  return (
    <div>
      <ul className="space-y-4">
        {lines.map((l) => (
          <li key={l.key} className="flex items-center gap-4">
            <div className="relative">
              <LineThumb line={l} className="h-16 w-16" />
              <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-bold text-cream">{l.qty}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold leading-tight">{lineTitle(l)}</p>
              <p className="truncate text-sm opacity-65">{lineSubtitle(l)}</p>
            </div>
            <p className="font-bold">{money(unitPrice(l) * l.qty)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2 border-t border-ink/15 pt-5">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">{money(t.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="font-semibold">{t.shipping === 0 ? "Free" : money(t.shipping)}</dd>
        </div>
        <div className="flex items-end justify-between border-t border-ink/15 pt-4">
          <dt className="eyebrow">Total</dt>
          <dd className="display text-5xl">{money(t.total)}</dd>
        </div>
      </dl>
      {!editable && <p className="mt-3 text-xs opacity-60">Prices in USD. Taxes are not applied in test mode.</p>}
    </div>
  );
}
