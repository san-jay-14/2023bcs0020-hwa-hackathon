"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TIERS } from "@/lib/data";
import { IMG, VIDEO } from "@/lib/images";
import { CountUp, Fade, Parallax, ScrubText, SplitText } from "../motion";
import { Shell } from "../Shell";
import { Eyebrow, Img, Marquee, Star, TicketButton } from "../ui";

export function MarqueeBand() {
  return (
    <div className="relative z-10 -mt-px overflow-hidden bg-sun py-5 text-ink">
      <Marquee items={["One piece", "No batteries", "No moving parts", "Food-timed Stages", "Wobble base"]} className="display text-4xl md:text-6xl" />
    </div>
  );
}

export function Statement() {
  return (
    <section className="bg-cream px-5 py-28 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1300px]">
        <Eyebrow className="mb-8 text-coral">The idea</Eyebrow>
        <ScrubText className="display text-[10vw] leading-[0.95] md:text-[6.4vw]">
          Puzzles get solved. Timers fail. So we changed the question. Longshift is one solid shell and three edible Stages, where the food does the timing.
        </ScrubText>
      </div>
    </section>
  );
}

const STATS = [
  { to: 3, suffix: " min", label: "When vocalising starts for many dogs after the owner leaves", src: "Filming study" },
  { to: 10, suffix: " min", label: "Most dogs showed signs of distress within this window", src: "Filming study" },
  { to: 2, prefix: "<", suffix: " min", label: "A puzzle that took about 15 minutes on day one, by day five", src: "Owner review" },
  { to: 76, suffix: "%", label: "Dogs chose a new toy over a familiar one", src: "One experiment" },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24 text-cream md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Eyebrow className="mb-6 text-sun">Why we built it</Eyebrow>
        <SplitText as="h2" className="display max-w-5xl text-6xl md:text-[8vw]">
          {"The first minutes\nmatter *most.*"}
        </SplitText>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-cream/15 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Fade key={i} delay={i * 0.08} y={30} className="bg-ink p-8 md:p-10">
              <p className="display text-[18vw] leading-none text-sun md:text-8xl">
                <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-5 text-lg leading-snug text-cream/85">{s.label}</p>
              <p className="eyebrow mt-4 text-cream/45">{s.src}</p>
            </Fade>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm text-cream/55">
          Context from the research behind Longshift: short-absence studies with small samples and individual reviews. These
          numbers are why the first minutes get a dedicated Stage. They are not a claim about what Longshift does for any dog.
        </p>
      </div>
    </section>
  );
}

const BENTO = [
  { t: "One piece.", d: "A thick-walled shell moulded as a single solid piece. No seams, no bottom plate, no snap tabs, no side holes.", c: "bg-teal text-cream", span: "md:col-span-7" },
  { t: "No batteries. No squeaker.", d: "Nothing electronic, nothing that rattles loose. Nothing to swallow.", c: "bg-sun text-ink", span: "md:col-span-5" },
  { t: "The cone.", d: "A straight-sided cavity that is widest at the opening and narrows to the bottom. Stages slide in and out. Washing takes seconds.", c: "bg-coral text-cream", span: "md:col-span-5" },
  { t: "The wobble.", d: "A weighted, slightly convex base. Nudge it and it rocks, then rights itself, rather than rolling across the room.", c: "bg-peach text-ink", span: "md:col-span-7" },
];

export function Bento() {
  return (
    <section className="bg-cream px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SplitText as="h2" className="display text-6xl md:text-[8vw]">
            {"Remarkably\n*simple.*"}
          </SplitText>
          <Fade>
            <TicketButton href="/features" variant="ink">
              Explore every detail
            </TicketButton>
          </Fade>
        </div>
        <div className="grid gap-4 md:grid-cols-12">
          {BENTO.map((b, i) => (
            <motion.article
              key={b.t}
              className={`group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[2rem] p-8 md:min-h-[420px] md:p-10 ${b.c} ${b.span}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.1 }}
              whileHover={{ scale: 0.985 }}
            >
              <Star className="h-10 w-10 transition-transform duration-700 group-hover:rotate-180" />
              <div>
                <h3 className="display text-5xl md:text-7xl">{b.t}</h3>
                <p className="mt-4 max-w-md text-lg font-medium leading-snug opacity-90">{b.d}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reel() {
  const rail = [IMG.lifestyle1, IMG.lifestyle3, IMG.lifestyle4, IMG.lifestyle5, IMG.lifestyle6, IMG.lifestyle7];
  return (
    <section className="overflow-hidden bg-teal py-24 text-cream md:py-40">
      <div className="px-5 md:px-10">
        <Eyebrow className="mb-6 text-sun">Made for real life</Eyebrow>
        <SplitText as="h2" className="display max-w-4xl text-6xl md:text-[8vw]">
          {"Built for the\n*goodbye.*"}
        </SplitText>
      </div>
      <div className="relative mx-5 mt-14 overflow-hidden rounded-[2rem] md:mx-10">
        <Parallax amount={50} className="aspect-[16/10] md:aspect-[21/9]">
          <video className="h-full w-full object-cover" src={VIDEO.reel} poster={VIDEO.poster} autoPlay muted loop playsInline />
        </Parallax>
        <div className="absolute bottom-5 left-5 rounded-full bg-ink/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cream backdrop-blur">
          Placeholder video
        </div>
      </div>
      <div className="mt-6">
        <div className="marquee overflow-hidden">
          <div className="marquee-track gap-4 pr-4" style={{ ["--dur" as string]: "60s" }}>
            {[...rail, ...rail, ...rail, ...rail].map((src, i) => (
              <Img key={i} src={src} alt="Placeholder dog photo" className={`h-64 shrink-0 rounded-3xl md:h-80 ${i % 3 === 0 ? "w-72 md:w-96" : "w-56 md:w-72"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TierTeaser() {
  const colors = ["bg-peach", "bg-caramel", "bg-chestnut text-cream"];
  return (
    <section className="bg-cream px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Eyebrow className="mb-6 text-coral">Three tiers</Eyebrow>
        <SplitText as="h2" className="display max-w-5xl text-6xl md:text-[8vw]">
          {"Matched to *how* your\ndog chews."}
        </SplitText>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
            >
              <Link
                href={`/product?tier=${t.id}`}
                className={`group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[2rem] p-8 transition-transform duration-500 hover:-translate-y-2 ${colors[i]}`}
              >
                <div className="flex items-start justify-between">
                  <span className="display text-8xl opacity-30">0{i + 1}</span>
                  <span className="eyebrow rounded-full border border-current px-3 py-1">{t.id === "heavy" ? "Firmest" : t.id === "light" ? "Softest" : "Balanced"}</span>
                </div>
                <div>
                  <h3 className="display text-7xl">{t.name}</h3>
                  <p className="mt-3 text-lg font-semibold">{t.forWho}</p>
                  <p className="mt-1 opacity-80">{t.firmness}</p>
                  <p className="eyebrow mt-6 flex items-center gap-2 transition-all duration-500 group-hover:gap-4">
                    Choose {t.name} <span>→</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-ink p-8 text-cream md:flex-row md:items-center md:p-12">
          <div>
            <p className="display text-4xl md:text-6xl">Not sure which?</p>
            <p className="mt-2 max-w-md text-cream/75">Five quick questions. No login. You&rsquo;ll get a tier and a size.</p>
          </div>
          <TicketButton href="/quiz" variant="sun" size="lg">
            Find your tier
          </TicketButton>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  ["Play", "Optional: a short play session with the shell. The wobble base invites gentle nudging."],
  ["Load", "Pick your tier. Stack three Stages, widest on top."],
  ["Leave", "Stage 1 gives your dog something to do in the first minutes."],
  ["Return", "Finished early? Go up a tier or rotate to a new variant. Never refill the same Stage on the spot."],
  ["Rinse", "Wash the shell between loads. The straight-sided cone makes it easy."],
];

export function Loop() {
  return (
    <section className="overflow-hidden bg-sun px-5 py-24 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow className="mb-6">The loop</Eyebrow>
            <SplitText as="h2" className="display text-6xl md:text-[7vw]" accent="text-coral">
              {"Load. Leave.\n*Repeat.*"}
            </SplitText>
            <div className="mt-10 hidden md:block">
              <Shell color="#0b5f5c" className="w-full max-w-sm" />
            </div>
          </div>
          <ol className="md:col-span-7">
            {STEPS.map(([t, d], i) => (
              <Fade key={t} delay={0.05} y={30}>
                <li className="flex items-start gap-6 border-t-2 border-ink py-7 md:gap-10 md:py-9">
                  <span className="display text-5xl text-coral md:text-6xl">0{i + 1}</span>
                  <div>
                    <h3 className="display text-4xl md:text-6xl">{t}</h3>
                    <p className="mt-2 max-w-lg text-lg font-medium leading-snug">{d}</p>
                  </div>
                </li>
              </Fade>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-coral px-5 py-28 text-cream md:px-10 md:py-48">
      <div className="mx-auto max-w-[1600px] text-center">
        <SplitText as="h2" className="display text-[17vw] leading-[0.85] md:text-[13vw]" accent="text-sun">
          {"Meet *Longshift.*"}
        </SplitText>
        <Fade delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-xl font-medium">
            Shells from ₹1,850. Stage Packs from ₹1,350. The Starter Bundle, a Medium shell plus one Stage Pack, is ₹3,150.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <TicketButton href="/product" variant="sun" size="lg">
              Shop now
            </TicketButton>
            <TicketButton href="/features" variant="cream" size="lg">
              Explore features
            </TicketButton>
          </div>
        </Fade>
      </div>
    </section>
  );
}

export function FaqTeaser() {
  return (
    <section className="bg-cream px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow className="mb-4 text-coral">Straight answers</Eyebrow>
          <SplitText as="h2" className="display text-6xl md:text-7xl">
            {"Finished\n*early?*"}
          </SplitText>
        </div>
        <Fade className="md:col-span-7">
          <p className="text-xl leading-snug md:text-2xl">
            If your dog reaches the end in less than about half the time you were out, go up a tier. If the tier is right but
            your dog is bored of it, rotate to a different Stage variant. Dogs get used to a fixed solution, so refilling the
            same load is the weakest option.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <TicketButton href="/faq" variant="ink">
              Read the FAQ
            </TicketButton>
            <TicketButton href="/stage-log" variant="teal">
              Open the Stage Log
            </TicketButton>
          </div>
        </Fade>
      </div>
    </section>
  );
}
