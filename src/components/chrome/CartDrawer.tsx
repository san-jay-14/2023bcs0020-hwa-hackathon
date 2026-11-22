"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useCart, useCartLines } from "@/lib/cart";
import { computeTotals, money } from "@/lib/pricing";
import { FREE_SHIPPING_OVER } from "@/lib/data";
import { CartLineRow } from "../cart/CartLineRow";
import { TicketButton } from "../ui";

export function CartDrawer() {
  const open = useCart((s) => s.open);
  const close = useCart((s) => s.closeDrawer);
  const { lines } = useCartLines();
  const t = computeTotals(lines);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label="Cart"
            className="fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[460px] flex-col bg-cream"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 p-6">
              <h2 className="display text-4xl">Your cart</h2>
              <button onClick={close} className="eyebrow u-link" aria-label="Close cart">
                Close ✕
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 p-10 text-center">
                <p className="display text-5xl">Nothing here. Yet.</p>
                <p className="max-w-xs opacity-70">Start with the shell. Then pick the tier that fits your dog.</p>
                <TicketButton href="/product" variant="ink" onClick={close}>
                  Shop Longshift
                </TicketButton>
              </div>
            ) : (
              <>
                <div className="px-6 pt-5">
                  <p className="text-sm font-semibold">
                    {t.freeShippingLeft > 0
                      ? `You're ${money(t.freeShippingLeft)} away from free standard shipping`
                      : "You've unlocked free standard shipping"}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
                    <motion.div
                      className="h-full rounded-full bg-teal"
                      animate={{ width: `${Math.min(100, (t.subtotal / FREE_SHIPPING_OVER) * 100)}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
                <ul className="flex-1 space-y-5 overflow-y-auto p-6" data-lenis-prevent>
                  {lines.map((l) => (
                    <CartLineRow key={l.key} line={l} compact />
                  ))}
                </ul>
                <div className="space-y-4 border-t border-ink/10 p-6">
                  <div className="flex items-end justify-between">
                    <span className="eyebrow">Subtotal</span>
                    <span className="display text-4xl">{money(t.subtotal)}</span>
                  </div>
                  <p className="text-xs opacity-60">Shipping calculated at checkout. Test mode: nothing is charged.</p>
                  <TicketButton href="/checkout" variant="ink" full onClick={close}>
                    Checkout
                  </TicketButton>
                  <Link href="/cart" onClick={close} className="u-link block text-center text-sm font-semibold">
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
