"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import {
  BUNDLE_PRICE,
  BUNDLE_SIZE,
  COLORS,
  SIZES,
  STAGE_PACK_PRICE,
  STAGES,
  TIERS,
  type ColorId,
  type SizeId,
  type TierId,
} from "@/lib/data";
import { IMG } from "@/lib/images";
import { money } from "@/lib/pricing";
import { Fade, Parallax, SplitText } from "../motion";
import { Shell } from "../Shell";
import { ConceptNote, Eyebrow, Img, Marquee, Star, TicketButton } from "../ui";
import { Accordion } from "../Accordion";

type Slide = { id: string; label: string; kind: "ext" | "cut" | "photo"; src?: string };
const SLIDES: Slide[] = [
  { id: "ext", label: "The shell", kind: "ext" },
  { id: "cut", label: "Cutaway", kind: "cut" },
  { id: "p1", label: "In the home", kind: "photo", src: IMG.lifestyle1 },
  { id: "p2", label: "In motion", kind: "photo", src: IMG.lifestyle9 },
];

function Option({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative rounded-2xl border-2 p-4 text-left transition-colors duration-300 ${active ? "border-ink bg-ink text-cream" : "border-ink/15 bg-cream/60 hover:border-ink/50"} ${className}`}
    >
      {children}
    </button>
  );
}

export function ProductView() {
  const [size, setSize] = useState<SizeId>("M");
  const [color, setColor] = useState<ColorId>("teal");
  const [tier, setTier] = useState<TierId>("medium");
  const [pack, setPack] = useState(true);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { margin: "0px 0px -80px 0px" });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("tier");
    const s = p.get("size");
    if (t && TIERS.some((x) => x.id === t)) setTier(t as TierId);
    if (s && SIZES.some((x) => x.id === s)) setSize(s as SizeId);
  }, []);

  const sz = SIZES.find((s) => s.id === size)!;
  const col = COLORS.find((c) => c.id === color)!;
  const tr = TIERS.find((t) => t.id === tier)!;
  const bundle = pack && size === BUNDLE_SIZE;
  const unit = bundle ? BUNDLE_PRICE : sz.price + (pack ? STAGE_PACK_PRICE : 0);
  const saving = bundle ? sz.price + STAGE_PACK_PRICE - BUNDLE_PRICE : 0;

  function addToCart() {
    if (bundle) add({ kind: "bundle", size, color, tier, qty });
    else {
      add({ kind: "shell", size, color, tier, qty });
      if (pack) add({ kind: "pack", tier, qty });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const current = SLIDES[slide];

  return (
    <>
      <section className="relative pt-[72px] transition-colors duration-700" style={{ background: col.bg }}>
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 pb-16 pt-6 md:grid-cols-12 md:gap-12 md:px-10 md:pb-24">
          {/* Gallery */}
          <div className="md:col-span-7">
            <div className="md:sticky md:top-24">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] bg-white/35 md:aspect-[5/4.4]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id + color}
                    className="absolute inset-0 grid place-items-center"
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {current.kind === "photo" ? (
                      <Img src={current.src!} alt="Placeholder dog photo" className="h-full w-full" />
                    ) : (
                      <motion.div
                        className="w-[84%]"
                        animate={current.kind === "ext" ? { rotate: [0, -3, 2.5, -1, 0] } : {}}
                        transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                        style={{ transformOrigin: "50% 92%" }}
                      >
                        <Shell color={col.hex} view={current.kind === "cut" ? "cutaway" : "exterior"} loaded className="w-full drop-shadow-[0_28px_30px_rgba(0,0,0,0.22)]" />
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="absolute left-5 top-5 rounded-full bg-ink px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
                  {current.label}
                </div>
                <div className="absolute bottom-5 right-5 hidden text-xs font-semibold opacity-60 md:block">
                  Illustrative render · {sz.diameter} cm shell
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setSlide(i)}
                    aria-label={`Show ${s.label}`}
                    aria-current={i === slide}
                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-white/40 transition-all duration-300 ${i === slide ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    {s.kind === "photo" ? (
                      <Img src={s.src!} alt="" className="h-full w-full" />
                    ) : (
                      <Shell color={col.hex} view={s.kind === "cut" ? "cutaway" : "exterior"} className="absolute inset-0 m-auto w-[86%]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-5">
            <Fade y={20}>
              <Eyebrow className="mb-3 flex items-center gap-2">
                <Star className="h-3 w-3" /> Concept · test-mode store
              </Eyebrow>
              <h1 className="display text-7xl md:text-8xl">Longshift</h1>
              <p className="mt-3 text-xl font-semibold leading-snug">One shell. Three Stages. Zero batteries.</p>
              <p className="mt-3 max-w-md leading-relaxed opacity-80">
                A single solid piece of chew-safe rubber with a weighted wobble base. Load it with edible Stages and let the food set the pace.
              </p>
            </Fade>

            <div className="mt-8 space-y-8">
              {/* Size */}
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="eyebrow">1 · Size</h2>
                  <span className="text-sm opacity-70">{sz.label} · {sz.dog}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {SIZES.map((s) => (
                    <Option key={s.id} active={size === s.id} onClick={() => setSize(s.id)}>
                      <span className="display block text-4xl">{s.id}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-80">{s.diameter} cm</span>
                      <span className="block text-xs opacity-70">{money(s.price)}</span>
                    </Option>
                  ))}
                </div>
                <p className="mt-2 text-xs opacity-60">Sizes are guidance based on dog weight. We are confirming them with trainers and vets.</p>
              </div>

              {/* Color */}
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="eyebrow">2 · Colour</h2>
                  <span className="text-sm opacity-70">{col.name} · {col.note}</span>
                </div>
                <div className="flex gap-4">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColor(c.id)}
                      aria-label={c.name}
                      aria-pressed={color === c.id}
                      className="relative h-14 w-14 rounded-full border-2 border-white/60 shadow-md transition-transform duration-300 hover:scale-110"
                      style={{ background: c.hex }}
                    >
                      {color === c.id && <motion.span layoutId="swatch" className="absolute -inset-1.5 rounded-full border-2 border-ink" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier */}
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="eyebrow">3 · Stage tier</h2>
                  <Link href="/quiz" className="u-link text-sm font-semibold">
                    Not sure? Take the quiz
                  </Link>
                </div>
                <div className="grid gap-3">
                  {TIERS.map((t) => (
                    <Option key={t.id} active={tier === t.id} onClick={() => setTier(t.id)} className="flex items-center justify-between gap-4">
                      <div>
                        <span className="display block text-3xl">{t.name}</span>
                        <span className="block text-sm opacity-80">{t.forWho}</span>
                      </div>
                      <span className="hidden text-right text-xs opacity-70 sm:block">{t.firmness}</span>
                    </Option>
                  ))}
                </div>
              </div>

              {/* Pack add-on */}
              <button
                type="button"
                onClick={() => setPack((p) => !p)}
                aria-pressed={pack}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors duration-300 ${pack ? "border-ink bg-ink text-cream" : "border-ink/15 bg-cream/60"}`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 ${pack ? "border-sun bg-sun text-ink" : "border-ink/40"}`}>
                  {pack && "✓"}
                </span>
                <span className="flex-1">
                  <span className="block font-bold">Add a {tr.name} Stage Pack · 6 loads</span>
                  <span className="block text-sm opacity-75">
                    {bundle ? `Starter Bundle: save ${money(saving)}` : `+${money(STAGE_PACK_PRICE)}. Choose Medium to unlock the Starter Bundle.`}
                  </span>
                </span>
                <span className="display text-2xl">{bundle ? money(BUNDLE_PRICE) : `+${money(STAGE_PACK_PRICE)}`}</span>
              </button>

              {/* CTA */}
              <div ref={ctaRef} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border-2 border-ink">
                    <button className="h-14 w-12 text-xl" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                    <span className="w-8 text-center text-lg font-bold" aria-live="polite">{qty}</span>
                    <button className="h-14 w-12 text-xl" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
                  </div>
                  <TicketButton variant="ink" size="lg" full onClick={addToCart}>
                    {added ? "Added ✓" : `Add to cart · ${money(unit * qty)}`}
                  </TicketButton>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-sm font-semibold">
                  {["No batteries", "No moving parts", "Wash between loads", "Test-mode checkout"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Star className="h-3 w-3" /> {t}
                    </li>
                  ))}
                </ul>
                <ConceptNote />
              </div>
            </div>

            <div className="mt-10">
              <Accordion
                items={[
                  { q: "What's in the box", a: `One ${sz.label.toLowerCase()} Longshift shell in ${col.name}${pack ? ` and a ${tr.name} Stage Pack with 6 loads of three Stages each` : ""}. Refills are sold separately.` },
                  { q: "How to use it", a: "Pick the tier by chew strength, load the three Stages widest on top, and leave. If your dog finishes early, go up a tier or rotate to a new variant. Never refill the same Stage on the spot. Count each load toward the day's food." },
                  { q: "Care and cleaning", a: "Wash the shell between loads. The straight-sided cone has no undercut, so it rinses clean. Inspect after every use and retire the shell if it is damaged." },
                  { q: "Shipping and returns", a: "Standard shipping is $6, and free over $60. Express is $14. This store is in test mode, so nothing is charged or shipped." },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-ink py-5 text-sun">
        <Marquee items={["Chew-safe rubber", "Matte finish", "Raised rim", "Weighted base", "Straight-sided cone"]} className="display text-4xl md:text-5xl" duration={36} />
      </div>

      {/* Specs */}
      <section className="bg-cream px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1600px] gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow className="mb-4 text-coral">Tech specs</Eyebrow>
            <SplitText as="h2" className="display text-6xl md:text-8xl">
              {"Every *detail.*\nOn purpose."}
            </SplitText>
          </div>
          <div className="md:col-span-7">
            <dl className="divide-y divide-ink/15 border-y border-ink/15">
              {[
                ["Construction", "One solid piece. No seams, bottom plate, snap tabs, side holes, squeaker or electronics."],
                ["Wall", "About one fifth of the shell diameter, with a solid, continuous base."],
                ["Opening", "Wide and round with a softly raised rim."],
                ["Cavity", "Straight-sided cone, widest at the opening, with no bulge or undercut."],
                ["Base", "Slightly convex with a dense, fixed weight moulded in. It rocks and rights itself."],
                ["Material", "Targeting a food-grade rubber or TPE compound. Final compound and hardness are being set with a manufacturer."],
                ["Finish", "Matte"],
              ].map(([k, v]) => (
                <Fade key={k} y={20}>
                  <div className="grid gap-1 py-5 md:grid-cols-[180px_1fr] md:gap-8">
                    <dt className="eyebrow pt-1">{k}</dt>
                    <dd className="text-lg leading-snug">{v}</dd>
                  </div>
                </Fade>
              ))}
            </dl>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-ink/15">
              <table className="w-full min-w-[520px] text-left">
                <thead className="bg-ink text-cream">
                  <tr>
                    {["Size", "Shell", "Opening", "Dog weight", "Price"].map((h) => (
                      <th key={h} className="eyebrow p-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map((s) => (
                    <tr key={s.id} className={`border-t border-ink/10 ${s.id === size ? "bg-sun/50" : ""}`}>
                      <td className="display p-4 text-2xl">{s.label}</td>
                      <td className="p-4">{s.diameter} cm</td>
                      <td className="p-4">{s.opening} cm</td>
                      <td className="p-4">{s.dog}</td>
                      <td className="p-4 font-bold">{money(s.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Refills */}
      <section id="refills" className="scroll-mt-20 bg-peach px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1600px] items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow className="mb-4">Refills</Eyebrow>
            <SplitText as="h2" className="display text-6xl md:text-8xl" accent="text-coral">
              {"Stage Packs.\n*Fresh* every time."}
            </SplitText>
            <p className="mt-6 max-w-md text-lg font-medium leading-snug">
              Six loads per pack, each with three Stages, in your tier. Rotate at least three variants so a dog that finishes early can move on to something new.
            </p>
            <RefillBuyer tier={tier} setTier={setTier} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {STAGES.map((s, i) => (
              <Fade key={s.n} delay={i * 0.1} y={50}>
                <div className="flex aspect-[3/5] flex-col justify-between rounded-[1.5rem] p-4" style={{ background: s.color, color: s.n === 3 ? "#fff6e8" : "#0a1f1e" }}>
                  <span className="display text-5xl opacity-40">0{s.n}</span>
                  <div>
                    <p className="display text-3xl md:text-4xl">{s.name}</p>
                    <p className="mt-1 text-xs font-semibold md:text-sm">{s.look}</p>
                    <p className="text-xs opacity-80 md:text-sm">{s.texture}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-cream px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 md:grid-cols-2">
          <Parallax amount={40} className="aspect-[4/3] rounded-[2rem]">
            <Img src={IMG.lifestyle2} alt="Placeholder dog photo" className="h-full w-full" />
          </Parallax>
          <div>
            <Eyebrow className="mb-4 text-coral">Straight talk</Eyebrow>
            <h2 className="display text-5xl md:text-7xl">We don&rsquo;t overpromise.</h2>
            <p className="mt-5 max-w-lg text-lg leading-snug">
              No toy is indestructible, and we never say a toy is safe to leave unsupervised. Longshift is not a treatment for anxiety. It&rsquo;s a thoughtfully designed toy with a clear idea behind it: one solid shell, and food that sets the pace.
            </p>
            <div className="mt-8">
              <TicketButton href="/faq" variant="ink">
                Read the full FAQ
              </TicketButton>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {!ctaInView && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur md:hidden"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="leading-tight">
              <p className="display text-2xl">{money(unit * qty)}</p>
              <p className="text-xs opacity-70">{sz.label} · {col.name} · {tr.name}</p>
            </div>
            <TicketButton variant="ink" size="sm" onClick={addToCart}>
              {added ? "Added ✓" : "Add to cart"}
            </TicketButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RefillBuyer({ tier, setTier }: { tier: TierId; setTier: (t: TierId) => void }) {
  const add = useCart((s) => s.add);
  const [done, setDone] = useState(false);
  return (
    <div className="mt-8 max-w-md">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {TIERS.map((t) => (
          <Option key={t.id} active={tier === t.id} onClick={() => setTier(t.id)} className="!p-3 text-center">
            <span className="display text-2xl">{t.name}</span>
          </Option>
        ))}
      </div>
      <TicketButton
        variant="ink"
        size="lg"
        full
        onClick={() => {
          add({ kind: "pack", tier });
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        }}
      >
        {done ? "Added ✓" : `Add ${TIERS.find((t) => t.id === tier)!.name} pack · ${money(STAGE_PACK_PRICE)}`}
      </TicketButton>
    </div>
  );
}
