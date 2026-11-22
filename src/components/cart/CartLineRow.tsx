"use client";

import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { COLORS, STAGES } from "@/lib/data";
import { lineSubtitle, lineTitle, money, unitPrice, type CartLine } from "@/lib/pricing";
import { Shell } from "../Shell";

export function LineThumb({ line, className = "" }: { line: CartLine; className?: string }) {
  const color = COLORS.find((c) => c.id === line.color);
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl ${className}`}
      style={{ background: line.kind === "pack" ? "#ffb89a" : color?.bg }}
    >
      {line.kind === "pack" ? (
        <div className="flex h-3/5 w-3/5 flex-col overflow-hidden rounded-lg">
          {STAGES.map((s) => (
            <div key={s.n} className="flex-1" style={{ background: s.color }} />
          ))}
        </div>
      ) : (
        <Shell color={color?.hex} className="w-[88%]" loaded={line.kind === "bundle"} />
      )}
    </div>
  );
}

export function CartLineRow({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const price = unitPrice(line);
  return (
    <motion.li layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className="flex gap-4">
      <LineThumb line={line} className={compact ? "h-24 w-24" : "h-28 w-28 md:h-36 md:w-36"} />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className={`font-bold leading-tight ${compact ? "text-base" : "text-lg"}`}>{lineTitle(line)}</h3>
            <p className="font-bold">{money(price * line.qty)}</p>
          </div>
          <p className="mt-1 text-sm opacity-65">{lineSubtitle(line)}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-ink/20">
            <button className="h-9 w-9 text-lg" aria-label="Decrease quantity" onClick={() => setQty(line.key, line.qty - 1)}>
              −
            </button>
            <span className="w-7 text-center font-bold" aria-live="polite">{line.qty}</span>
            <button className="h-9 w-9 text-lg" aria-label="Increase quantity" onClick={() => setQty(line.key, line.qty + 1)}>
              +
            </button>
          </div>
          <button className="u-link text-sm font-semibold opacity-70" onClick={() => remove(line.key)}>
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}
