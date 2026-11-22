"use client";

import Link from "next/link";
import { Marquee, TicketButton } from "../ui";
import { Logo } from "./Nav";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="border-b border-cream/15 py-6">
        <Marquee items={["One piece", "No batteries", "No moving parts", "Food-timed Stages"]} className="display text-4xl text-sun md:text-6xl" duration={40} />
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="display text-6xl md:text-8xl">
            Make the first
            <br />
            minutes <span className="text-sun">count.</span>
          </p>
          <div className="mt-8">
            <TicketButton href="/product" variant="sun" size="lg">
              Shop Longshift
            </TicketButton>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3 md:pl-16">
          <div>
            <p className="eyebrow mb-4 text-cream/50">Shop</p>
            <ul className="space-y-2 text-lg">
              <li><Link className="u-link" href="/product">The shell</Link></li>
              <li><Link className="u-link" href="/product#refills">Stage Packs</Link></li>
              <li><Link className="u-link" href="/cart">Cart</Link></li>
              <li><Link className="u-link" href="/checkout">Checkout</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-cream/50">Discover</p>
            <ul className="space-y-2 text-lg">
              <li><Link className="u-link" href="/features">Features</Link></li>
              <li><Link className="u-link" href="/quiz">Find your tier</Link></li>
              <li><Link className="u-link" href="/stage-log">Stage Log</Link></li>
              <li><Link className="u-link" href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow mb-4 text-cream/50">Straight talk</p>
            <p className="text-sm leading-relaxed text-cream/70">
              Longshift is a concept in development. A prototype is pending, renders are illustrative, and this store runs in
              test mode. Longshift is a toy, not a treatment for separation anxiety, and no toy is indestructible. Supervise
              your dog and consult your vet.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 border-t border-cream/15 px-5 py-6 text-sm text-cream/60 md:flex-row md:items-center md:justify-between md:px-10">
        <Logo className="text-cream" />
        <p>© 2026 Longshift. Designed for the moments after you walk out.</p>
      </div>
      <p aria-hidden className="display pointer-events-none select-none whitespace-nowrap text-center text-[26vw] leading-[0.75] text-cream/[0.06]">
        Longshift
      </p>
    </footer>
  );
}
