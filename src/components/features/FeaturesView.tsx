"use client";

import { motion, useAnimationControls, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { STAGES, TIERS } from "@/lib/data";
import { IMG } from "@/lib/images";
import { Fade, Parallax, ScrubText, SplitText } from "../motion";
import { Shell } from "../Shell";
import { Eyebrow, Img, Marquee, Star, TicketButton } from "../ui";

const HOTSPOTS = [
  { id: "rim", x: 50, y: 28, t: "Raised rim", d: "A wide, round opening with a softly raised rim. Easy to load, easy on the mouth." },
  { id: "cone", x: 50, y: 52, t: "Straight-sided cone", d: "Widest at the opening, narrowing to the bottom, with no bulge or undercut. Rigid Stages slide in and out, and washing is effortless." },
  { id: "wall", x: 19, y: 50, t: "Thick wall", d: "Wall thickness is about one fifth of the shell diameter. Solid, substantial, built to be chewed on." },
  { id: "base", x: 50, y: 85, t: "Weighted base", d: "A dense, fixed weight moulded into a slightly convex bottom. The shell rocks and rights itself, rather than rolling. Whether the ballast survives power chewers is still being verified." },
  { id: "solid", x: 82, y: 70, t: "Solid, continuous base", d: "No seams, no separate bottom plate, no snap tabs, no side holes. One piece." },
];

function Anatomy() {
  const [active, setActive] = useState(HOTSPOTS[1].id);
  const a = HOTSPOTS.find((h) => h.id === active)!;
  return (
    <section className="bg-cream px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Eyebrow className="mb-4 text-coral">Anatomy</Eyebrow>
        <SplitText as="h2" className="display text-6xl md:text-[8vw]">
          {"Nothing to *break off.*"}
        </SplitText>
        <div className="mt-14 grid items-center gap-10 md:grid-cols-12">
          <div className="relative md:col-span-7">
            <div className="rounded-[2rem] bg-mint p-6 md:p-12">
              <div className="relative">
                <Shell view="cutaway" color="#0b5f5c" className="w-full drop-shadow-[0_24px_28px_rgba(0,0,0,0.2)]" />
                {HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setActive(h.id)}
                    onMouseEnter={() => setActive(h.id)}
                    aria-label={h.t}
                    className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    <span className={`absolute inset-0 rounded-full ${active === h.id ? "animate-ping bg-sun/80" : "bg-transparent"}`} />
                    <span className={`relative grid h-7 w-7 place-items-center rounded-full border-2 border-ink text-sm font-extrabold transition-all duration-300 ${active === h.id ? "scale-110 bg-sun text-ink" : "bg-cream text-ink group-hover:bg-sun"}`}>
                      +
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-5">
            <ul className="mb-8 flex flex-wrap gap-2">
              {HOTSPOTS.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => setActive(h.id)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${active === h.id ? "border-ink bg-ink text-cream" : "border-ink/20 hover:border-ink"}`}
                  >
                    {h.t}
                  </button>
                </li>
              ))}
            </ul>
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <h3 className="display text-5xl md:text-6xl">{a.t}</h3>
              <p className="mt-4 text-xl leading-snug">{a.d}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageCards() {
  return (
    <section className="bg-ink px-5 pb-32 pt-24 text-cream md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <Eyebrow className="mb-4 text-sun">The Stage system</Eyebrow>
        <SplitText as="h2" className="display max-w-5xl text-6xl md:text-[8vw]">
          {"The food sets\nthe *pace.*"}
        </SplitText>
        <p className="mt-6 max-w-xl text-xl text-cream/80">
          Three edible Stages, stacked widest on top. Your dog reaches the next only by finishing the one in front. No timer. No mechanism. Just food, texture and volume.
        </p>
        <div className="mt-16 space-y-6">
          {STAGES.map((s, i) => (
            <div key={s.n} className="sticky" style={{ top: 90 + i * 28 }}>
              <div className="grid overflow-hidden rounded-[2rem] md:grid-cols-12" style={{ background: s.color, color: s.n === 3 ? "#fff6e8" : "#0a1f1e" }}>
                <div className="flex min-h-[320px] flex-col justify-between p-8 md:col-span-7 md:min-h-[420px] md:p-12">
                  <span className="eyebrow">Stage 0{s.n}</span>
                  <div>
                    <h3 className="display text-[22vw] md:text-[11vw]">{s.name}</h3>
                    <p className="mt-2 max-w-md text-xl font-medium leading-snug">{s.job}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 content-end gap-6 border-t border-current/20 p-8 md:col-span-5 md:border-l md:border-t-0 md:p-12">
                  <div>
                    <p className="eyebrow opacity-60">Look</p>
                    <p className="mt-1 text-xl font-bold">{s.look}</p>
                  </div>
                  <div>
                    <p className="eyebrow opacity-60">Texture</p>
                    <p className="mt-1 text-xl font-bold">{s.texture}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="eyebrow opacity-60">Rule</p>
                    <p className="mt-1 text-lg font-semibold">Passes the thumbnail test: if a thumbnail can&rsquo;t dent it, it&rsquo;s too hard.</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <Fade key={t.id}>
              <div className="rounded-3xl border border-cream/20 p-7">
                <p className="display text-5xl text-sun">{t.name}</p>
                <p className="mt-3 text-lg font-semibold">{t.forWho}</p>
                <p className="mt-1 text-cream/70">{t.firmness}</p>
              </div>
            </Fade>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-sm text-cream/55">
          Ingredients, nutrition and hardness values are being developed with a pet-food formulator, so we are not publishing numbers for them yet. Xylitol is absent from every ingredient.
        </p>
      </div>
    </section>
  );
}

function Wobble() {
  const controls = useAnimationControls();
  const [n, setN] = useState(0);
  const nudge = () => {
    setN((x) => x + 1);
    controls.start({ rotate: [0, 16, -11, 6, -3, 0], transition: { duration: 1.6, ease: "easeInOut" } });
  };
  return (
    <section className="relative overflow-hidden bg-sun px-5 py-24 text-ink md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow className="mb-4">The wobble base</Eyebrow>
          <SplitText as="h2" className="display text-6xl md:text-[8vw]" accent="text-coral">
            {"Rocks.\nRights itself.\n*Stays put.*"}
          </SplitText>
          <p className="mt-6 max-w-md text-xl font-medium leading-snug">
            A slightly convex base and a dense, fixed weight invite gentle nudging. It rocks in place instead of rolling across the room, because rolling toys are loud on hard floors.
          </p>
          <p className="mt-4 text-sm opacity-70">Nudged {n} {n === 1 ? "time" : "times"}. Go on, try it →</p>
        </div>
        <div className="grid place-items-center">
          <button onClick={nudge} aria-label="Nudge the shell" className="relative w-full max-w-[520px]">
            <motion.div animate={controls} style={{ transformOrigin: "50% 92%" }}>
              <Shell color="#0b5f5c" className="w-full drop-shadow-[0_28px_26px_rgba(0,0,0,0.25)]" />
            </motion.div>
            <span className="eyebrow absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-cream">Tap to nudge</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// [label, typical stuffable, typical timed feeder, Longshift]
const ROWS: [string, boolean, boolean, boolean][] = [
  ["No moving parts or timer mechanism", true, false, true],
  ["Multiple Stages in one load", false, true, true],
  ["Food sets the pace, not a timer", false, false, true],
  ["Tiered firmness for your chew style", false, false, true],
  ["Straight-sided cavity that rinses clean", false, false, true],
];

function Compare() {
  const Dot = ({ on }: { on: boolean }) => (
    <span className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-sm font-extrabold ${on ? "bg-ink text-sun" : "border-2 border-ink/20 text-ink/30"}`}>{on ? "✓" : "–"}</span>
  );
  return (
    <section className="bg-cream px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-5xl">
        <Eyebrow className="mb-4 text-coral">How it compares</Eyebrow>
        <SplitText as="h2" className="display text-6xl md:text-8xl">
          {"A different *kind* of toy."}
        </SplitText>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="py-4" />
                <th className="eyebrow p-3 text-center">Typical stuffable</th>
                <th className="eyebrow p-3 text-center">Typical timed feeder</th>
                <th className="display p-3 text-center text-2xl text-teal-deep">Longshift</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, stuffable, timed, ls]) => (
                <tr key={label} className="border-b border-ink/15">
                  <td className="py-5 pr-4 text-lg font-semibold">{label}</td>
                  <td className="p-3"><Dot on={stuffable} /></td>
                  <td className="p-3"><Dot on={timed} /></td>
                  <td className="bg-sun/40 p-3"><Dot on={ls} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-sm opacity-60">Generalised categories, shown for orientation. Individual products vary.</p>
      </div>
    </section>
  );
}

const PROVING = [
  ["Power chewers vs. the weighted base", "Whether moulded-in ballast survives the strongest chewers is being tested."],
  ["Real-world Stage timing", "Pace comes from volume, stickiness, ridges and cavity depth. We make no duration claims until it is measured."],
  ["Sizing", "The size table is a design assumption being confirmed with trainers and vets."],
  ["The tier-up rule", "Moving up a tier when your dog finishes in under about half the time you were out is a design guess that needs testing."],
  ["The recipe", "Stages are formulated with a pet-food specialist. Final ingredients and nutrition are not published yet."],
];

function Proving() {
  return (
    <section className="bg-teal px-5 py-24 text-cream md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow className="mb-4 text-sun">Honest by design</Eyebrow>
          <SplitText as="h2" className="display text-6xl md:text-8xl">
            {"What we’re still *proving.*"}
          </SplitText>
          <p className="mt-6 max-w-md text-lg text-cream/85">
            Longshift is a concept. A great product earns its claims. Here&rsquo;s what is still being verified before we say more.
          </p>
        </div>
        <ul className="md:col-span-7">
          {PROVING.map(([t, d], i) => (
            <Fade key={t} y={24}>
              <li className="flex gap-5 border-t border-cream/30 py-6">
                <span className="display text-3xl text-sun">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-bold">{t}</h3>
                  <p className="mt-1 text-cream/80">{d}</p>
                </div>
              </li>
            </Fade>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FeaturesView() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 25]);
  return (
    <>
      <section ref={heroRef} className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-coral px-5 pb-12 pt-32 text-cream md:px-10">
        <motion.div style={{ y, rotate: rot }} className="absolute right-[-8vw] top-[14vh] w-[62vw] max-w-[820px]">
          <Shell color="#0b5f5c" view="cutaway" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]" />
        </motion.div>
        <Eyebrow className="relative mb-6 text-sun">Features</Eyebrow>
        <SplitText as="h1" immediate delay={0.3} className="display relative text-[19vw] leading-[0.85] md:text-[14vw]" accent="text-sun">
          {"Engineered\naround *one* idea."}
        </SplitText>
        <p className="relative mt-8 max-w-xl text-xl font-medium">
          No moving parts. No batteries. No timer. Just a solid shell and three Stages that let the food do the timing.
        </p>
      </section>

      <div className="overflow-hidden bg-ink py-5 text-sun">
        <Marquee items={["One piece", "Wobble base", "Three Stages", "Three tiers", "Rinse-ready"]} className="display text-4xl md:text-6xl" />
      </div>

      <section className="bg-cream px-5 py-28 md:px-10 md:py-44">
        <div className="mx-auto max-w-[1300px]">
          <ScrubText className="display text-[9vw] leading-[0.98] md:text-[5.6vw]">
            Most dog toys ask your dog to solve something. Longshift asks nothing. It simply gives your dog something good to do, one Stage at a time, from the very first minute.
          </ScrubText>
        </div>
      </section>

      <Anatomy />
      <StageCards />
      <Wobble />

      <section className="overflow-hidden bg-cream px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 md:grid-cols-12">
          <Parallax amount={50} className="aspect-[4/5] rounded-[2rem] md:col-span-5">
            <Img src={IMG.lifestyle3} alt="Placeholder dog photo" className="h-full w-full" />
          </Parallax>
          <div className="md:col-span-7 md:pl-12">
            <Eyebrow className="mb-4 text-coral">Materials</Eyebrow>
            <h2 className="display text-6xl md:text-8xl">Chew-safe rubber. Matte teal.</h2>
            <p className="mt-6 max-w-xl text-xl leading-snug">
              We are targeting a food-grade rubber or TPE compound with a soft-touch matte finish in deep teal. The exact compound and hardness are being set with a manufacturer, and we will publish them when they are.
            </p>
            <div className="mt-8 flex gap-3">
              {["#0b5f5c", "#232c3a", "#c4421a"].map((c) => (
                <span key={c} className="h-12 w-12 rounded-full border-2 border-white shadow" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Compare />
      <Proving />

      <section className="bg-sun px-5 py-28 text-center text-ink md:px-10 md:py-44">
        <SplitText as="h2" className="display text-[16vw] leading-[0.85] md:text-[12vw]" accent="text-coral">
          {"Ready to *shift?*"}
        </SplitText>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <TicketButton href="/product" variant="ink" size="lg">
            Shop Longshift
          </TicketButton>
          <TicketButton href="/quiz" variant="cream" size="lg">
            Find your tier
          </TicketButton>
        </div>
        <div className="mt-10 flex justify-center gap-2 text-ink/60">
          <Star />
        </div>
      </section>
    </>
  );
}
