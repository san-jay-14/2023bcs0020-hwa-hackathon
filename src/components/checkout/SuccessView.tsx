"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { money } from "@/lib/pricing";
import { Eyebrow, TicketButton } from "../ui";

type Order = {
  orderId: string;
  estimatedDelivery: string;
  shippingMethod: string;
  customer?: { name?: string; email?: string };
  items: { title: string; qty: number; lineTotal: number }[];
  totals: { subtotal: number; shipping: number; total: number };
};

export function SuccessView() {
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);
  const [confetti, setConfetti] = useState<{ i: number; x: number; y: number; r: number; d: number }[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("longshift.lastOrder");
      if (raw) {
        setOrder(JSON.parse(raw));
        setConfetti(
          Array.from({ length: 28 }, (_, i) => ({
            i,
            x: (Math.random() - 0.5) * 1100,
            y: 500 + Math.random() * 300,
            r: Math.random() * 720,
            d: 2.2 + Math.random(),
          })),
        );
      }
    } catch {}
    setReady(true);
  }, []);

  const colors = ["#ffe600", "#ff5a36", "#ffb89a", "#0e8a84", "#fff6e8"];

  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden bg-teal px-5 pb-20 pt-32 text-cream">
      {order &&
        confetti.map((c) => (
          <motion.span
            key={c.i}
            className="absolute left-1/2 top-1/3 h-3 w-5 rounded-sm"
            style={{ background: colors[c.i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: c.x, y: c.y, opacity: 0, rotate: c.r }}
            transition={{ duration: c.d, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        ))}
      <div className="relative mx-auto w-full max-w-3xl text-center">
        {ready && order ? (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-sun text-4xl text-ink">
              ✓
            </motion.div>
            <Eyebrow className="mb-3 text-sun">Test order confirmed</Eyebrow>
            <h1 className="display whitespace-nowrap text-[15vw] leading-[0.9] md:text-[8vw]">{order.orderId}</h1>
            <p className="mx-auto mt-5 max-w-lg text-xl">
              {order.customer?.name ? `Thanks, ${order.customer.name.split(" ")[0]}. ` : ""}This was a test order, so nothing was charged and nothing will ship. Here&rsquo;s what it would have looked like.
            </p>
            <div className="mx-auto mt-10 rounded-[2rem] bg-cream p-6 text-left text-ink md:p-8">
              <ul className="divide-y divide-ink/10">
                {order.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4 py-3">
                    <span className="font-semibold">
                      {it.title} <span className="opacity-60">× {it.qty}</span>
                    </span>
                    <span className="font-bold">{money(it.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1 border-t border-ink/15 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{money(order.totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping · {order.shippingMethod}</dt>
                  <dd>{order.totals.shipping === 0 ? "Free" : money(order.totals.shipping)}</dd>
                </div>
                <div className="flex items-end justify-between pt-2">
                  <dt className="eyebrow">Total</dt>
                  <dd className="display text-4xl">{money(order.totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm opacity-70">Estimated delivery: {order.estimatedDelivery}</p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <TicketButton href="/stage-log" variant="sun" size="lg">
                Open the Stage Log
              </TicketButton>
              <TicketButton href="/" variant="cream">
                Back home
              </TicketButton>
            </div>
          </>
        ) : ready ? (
          <>
            <h1 className="display text-7xl md:text-9xl">No order found</h1>
            <p className="mt-4 text-xl">We couldn&rsquo;t find a recent order in this browser.</p>
            <div className="mt-8">
              <TicketButton href="/product" variant="sun" size="lg">
                Shop Longshift
              </TicketButton>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
