"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCart, useCartLines } from "@/lib/cart";
import { FREE_SHIPPING_OVER, STAGE_PACK_PRICE } from "@/lib/data";
import { computeTotals, money } from "@/lib/pricing";
import { CartLineRow } from "./CartLineRow";
import { Eyebrow, TicketButton } from "../ui";

export function CartView() {
  const { lines, mounted } = useCartLines();
  const add = useCart((s) => s.add);
  const clear = useCart((s) => s.clear);
  const t = computeTotals(lines);
  const hasPack = lines.some((l) => l.kind === "pack" || l.kind === "bundle");
  const shellTier = lines.find((l) => l.kind === "shell")?.tier;

  return (
    <section className="min-h-svh bg-cream px-5 pb-24 pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow className="mb-3 text-coral">Cart</Eyebrow>
        <h1 className="display text-7xl md:text-[9vw]">Your cart</h1>

        {!mounted ? null : lines.length === 0 ? (
          <div className="mt-14 grid place-items-center rounded-[2rem] border-2 border-dashed border-ink/25 p-12 text-center md:p-24">
            <p className="display text-5xl md:text-7xl">Nothing here. Yet.</p>
            <p className="mt-3 max-w-md opacity-70">Start with the shell, then choose a tier that suits how your dog chews.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <TicketButton href="/product" variant="ink" size="lg">
                Shop Longshift
              </TicketButton>
              <TicketButton href="/quiz" variant="cream">
                Find your tier
              </TicketButton>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-8 rounded-2xl bg-mint p-5">
                <p className="font-bold">
                  {t.freeShippingLeft > 0 ? `Add ${money(t.freeShippingLeft)} more for free standard shipping` : "You've unlocked free standard shipping 🎉"}
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/10">
                  <motion.div className="h-full rounded-full bg-teal" animate={{ width: `${Math.min(100, (t.subtotal / FREE_SHIPPING_OVER) * 100)}%` }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
                </div>
              </div>
              <ul className="divide-y divide-ink/15">
                <AnimatePresence initial={false}>
                  {lines.map((l) => (
                    <div key={l.key} className="py-6 first:pt-0">
                      <CartLineRow line={l} />
                    </div>
                  ))}
                </AnimatePresence>
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <Link href="/product" className="u-link text-sm font-bold">
                  ← Continue shopping
                </Link>
                <button onClick={clear} className="u-link text-sm font-semibold opacity-70">
                  Clear cart
                </button>
              </div>

              {!hasPack && (
                <div className="mt-10 flex flex-col gap-4 rounded-[2rem] bg-peach p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="display text-3xl md:text-4xl">Don&rsquo;t forget the Stages.</p>
                    <p className="mt-1 opacity-80">The shell works with edible Stage refills. 6 loads for {money(STAGE_PACK_PRICE)}.</p>
                  </div>
                  <TicketButton variant="ink" onClick={() => add({ kind: "pack", tier: shellTier ?? "medium" })}>
                    Add a pack
                  </TicketButton>
                </div>
              )}
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(10,31,30,0.4)] md:p-8 lg:sticky lg:top-28">
                <h2 className="display text-4xl">Summary</h2>
                <dl className="mt-5 space-y-3">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold">{money(t.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="font-semibold">{t.shipping === 0 ? "Free" : money(t.shipping)}</dd>
                  </div>
                  <div className="flex items-end justify-between border-t border-ink/15 pt-4">
                    <dt className="eyebrow">Estimated total</dt>
                    <dd className="display text-5xl">{money(t.total)}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <TicketButton href="/checkout" variant="ink" size="lg" full>
                    Checkout
                  </TicketButton>
                </div>
                <ul className="mt-5 space-y-2 text-sm opacity-75">
                  <li>• Test mode: nothing is charged or shipped</li>
                  <li>• Standard shipping $6, free over {money(FREE_SHIPPING_OVER)}</li>
                  <li>• No account needed</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
