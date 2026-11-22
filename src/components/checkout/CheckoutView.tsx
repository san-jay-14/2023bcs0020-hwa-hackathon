"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, useCartLines } from "@/lib/cart";
import { FREE_SHIPPING_OVER, SHIPPING_OPTIONS, type ShippingId } from "@/lib/data";
import { computeTotals, money } from "@/lib/pricing";
import { OrderSummary } from "../cart/OrderSummary";
import { Eyebrow, TicketButton } from "../ui";

type F = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  region: string;
  zip: string;
  country: string;
  notes: string;
  ack: boolean;
};

const EMPTY: F = { email: "", firstName: "", lastName: "", phone: "", address: "", address2: "", city: "", region: "", zip: "", country: "US", notes: "", ack: false };
const COUNTRIES = ["US", "CA", "GB", "AU", "IN", "DE", "FR"];

function validate(f: F): Partial<Record<keyof F, string>> {
  const e: Partial<Record<keyof F, string>> = {};
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (!f.firstName.trim()) e.firstName = "First name is required.";
  if (!f.lastName.trim()) e.lastName = "Last name is required.";
  if (f.address.trim().length < 4) e.address = "Enter your street address.";
  if (!f.city.trim()) e.city = "City is required.";
  if (!f.region.trim()) e.region = "State or region is required.";
  if (f.zip.trim().length < 3) e.zip = "Enter a postal code.";
  if (!f.ack) e.ack = "Please confirm this is a test order.";
  return e;
}

export function CheckoutView() {
  const router = useRouter();
  const { lines, mounted } = useCartLines();
  const clear = useCart((s) => s.clear);
  const [f, setF] = useState<F>(EMPTY);
  const [ship, setShip] = useState<ShippingId>("standard");
  const [errors, setErrors] = useState<Partial<Record<keyof F, string>>>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const t = computeTotals(lines, ship);

  const set = <K extends keyof F>(k: K, v: F[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map(({ kind, size, color, tier, qty }) => ({ kind, size, color, tier, qty })),
          shippingMethod: ship,
          customer: { name: `${f.firstName} ${f.lastName}`.trim(), email: f.email, phone: f.phone },
          shippingAddress: { line1: f.address, line2: f.address2, city: f.city, region: f.region, postalCode: f.zip, country: f.country },
          notes: f.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong placing your order.");
      try {
        sessionStorage.setItem("longshift.lastOrder", JSON.stringify(data));
      } catch {}
      clear();
      router.push("/checkout/success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  const input = (k: keyof F) =>
    `w-full rounded-xl border-2 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-ink ${errors[k] ? "border-coral" : "border-ink/15"}`;

  // A render helper (not a component) so inputs keep focus between keystrokes.
  const renderField = ({ k, label, type = "text", auto, span = "", opt = false }: { k: keyof F; label: string; type?: string; auto?: string; span?: string; opt?: boolean }) => (
    <div key={k} className={span}>
      <label htmlFor={`f-${k}`} className="mb-1.5 block text-sm font-bold">
        {label} {opt && <span className="font-normal opacity-50">(optional)</span>}
      </label>
      <input
        id={`f-${k}`}
        type={type}
        autoComplete={auto}
        className={input(k)}
        value={f[k] as string}
        onChange={(e) => set(k, e.target.value as F[typeof k])}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
      />
      {errors[k] && (
        <p id={`e-${k}`} role="alert" className="mt-1.5 text-sm font-semibold text-coral">
          {errors[k]}
        </p>
      )}
    </div>
  );

  if (mounted && lines.length === 0) {
    return (
      <section className="grid min-h-svh place-items-center bg-cream px-5 pt-24 text-center">
        <div>
          <p className="display text-6xl md:text-8xl">Your cart is empty</p>
          <p className="mt-3 opacity-70">Add a shell or a Stage Pack to check out.</p>
          <div className="mt-8">
            <TicketButton href="/product" variant="ink" size="lg">
              Shop Longshift
            </TicketButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-svh bg-cream px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-2 text-coral">Checkout</Eyebrow>
            <h1 className="display text-6xl md:text-8xl">Almost there.</h1>
          </div>
          <Link href="/cart" className="u-link text-sm font-bold">
            ← Back to cart
          </Link>
        </div>

        <div className="mb-8 rounded-2xl bg-sun px-5 py-4 text-sm font-semibold">
          <strong>Test mode.</strong> Longshift is a concept in development. Placing this order returns a confirmation, but nothing is charged or shipped, and no payment details are collected.
        </div>

        <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <Block n="1" title="Contact">
              <div className="grid gap-4">
                {renderField({ k: "email", label: "Email", type: "email", auto: "email" })}
                {renderField({ k: "phone", label: "Phone", type: "tel", auto: "tel", opt: true })}
              </div>
            </Block>

            <Block n="2" title="Delivery">
              <div className="grid gap-4 sm:grid-cols-2">
                {renderField({ k: "firstName", label: "First name", auto: "given-name" })}
                {renderField({ k: "lastName", label: "Last name", auto: "family-name" })}
                {renderField({ k: "address", label: "Address", auto: "address-line1", span: "sm:col-span-2" })}
                {renderField({ k: "address2", label: "Apartment, suite, etc.", auto: "address-line2", span: "sm:col-span-2", opt: true })}
                {renderField({ k: "city", label: "City", auto: "address-level2" })}
                {renderField({ k: "region", label: "State / region", auto: "address-level1" })}
                {renderField({ k: "zip", label: "Postal code", auto: "postal-code" })}
                <div>
                  <label htmlFor="f-country" className="mb-1.5 block text-sm font-bold">
                    Country
                  </label>
                  <select id="f-country" className={input("country")} value={f.country} onChange={(e) => set("country", e.target.value)} autoComplete="country">
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Block>

            <Block n="3" title="Shipping method">
              <div className="grid gap-3" role="radiogroup" aria-label="Shipping method">
                {SHIPPING_OPTIONS.map((o) => {
                  const free = o.id === "standard" && computeTotals(lines, "standard").subtotal >= FREE_SHIPPING_OVER;
                  const on = ship === o.id;
                  return (
                    <label key={o.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors ${on ? "border-ink bg-ink text-cream" : "border-ink/15 bg-white"}`}>
                      <input type="radio" name="ship" className="sr-only" checked={on} onChange={() => setShip(o.id)} />
                      <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${on ? "border-sun" : "border-ink/30"}`}>{on && <span className="h-3 w-3 rounded-full bg-sun" />}</span>
                      <span className="flex-1">
                        <span className="block font-bold">{o.name}</span>
                        <span className="block text-sm opacity-70">{o.eta}</span>
                      </span>
                      <span className="font-bold">{free ? "Free" : money(o.price)}</span>
                    </label>
                  );
                })}
              </div>
            </Block>

            <Block n="4" title="Payment">
              <div className="rounded-2xl border-2 border-dashed border-ink/30 bg-white/60 p-5">
                <p className="font-bold">Test payment</p>
                <p className="mt-1 text-sm opacity-75">No card details are collected in test mode. Your order is confirmed instantly, and no money moves.</p>
              </div>
              <div className="mt-4">
                <label htmlFor="f-notes" className="mb-1.5 block text-sm font-bold">
                  Order notes <span className="font-normal opacity-50">(optional)</span>
                </label>
                <textarea id="f-notes" rows={3} className={input("notes")} value={f.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input id="f-ack" type="checkbox" className="mt-1 h-5 w-5 accent-[#0b5f5c]" checked={f.ack} onChange={(e) => set("ack", e.target.checked)} aria-invalid={!!errors.ack} />
                <span className="text-sm">I understand this is a test order for a concept product. Nothing will be charged or shipped.</span>
              </label>
              {errors.ack && (
                <p role="alert" className="mt-1.5 text-sm font-semibold text-coral">
                  {errors.ack}
                </p>
              )}
            </Block>

            <AnimatePresence>
              {serverError && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="rounded-xl bg-coral px-4 py-3 font-semibold text-cream">
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(10,31,30,0.4)] md:p-8 lg:sticky lg:top-28">
              <h2 className="display mb-6 text-4xl">Your order</h2>
              {mounted && <OrderSummary lines={lines} shipping={ship} />}
              <div className="mt-6">
                <TicketButton type="submit" variant="ink" size="lg" full disabled={busy || lines.length === 0}>
                  {busy ? "Placing order…" : `Place test order · ${money(t.total)}`}
                </TicketButton>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-5 flex items-center gap-4">
        <span className="display grid h-11 w-11 place-items-center rounded-full bg-ink text-xl text-sun">{n}</span>
        <span className="display text-4xl md:text-5xl">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}
