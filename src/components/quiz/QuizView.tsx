"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SIZES, TIERS, type SizeId, type TierId } from "@/lib/data";
import { Shell } from "../Shell";
import { Eyebrow, TicketButton } from "../ui";

type Opt = { label: string; sub?: string; score?: number; size?: SizeId; bored?: boolean };
const QUESTIONS: { q: string; hint: string; opts: Opt[] }[] = [
  {
    q: "How does your dog chew?",
    hint: "Think about a normal chew session.",
    opts: [
      { label: "Gentle nibbler", sub: "Licks, nibbles, takes it slow", score: 0 },
      { label: "Steady worker", sub: "Real chewing, but with manners", score: 1 },
      { label: "Power chewer", sub: "Jaws like a vice", score: 2 },
    ],
  },
  {
    q: "How much does your dog weigh?",
    hint: "This picks your shell size.",
    opts: [
      { label: "Under 10 kg", sub: "Small", size: "S" },
      { label: "10 to 25 kg", sub: "Medium", size: "M" },
      { label: "Over 25 kg", sub: "Large", size: "L" },
    ],
  },
  {
    q: "What happened to their last tough toy?",
    hint: "Be honest. We won't tell.",
    opts: [
      { label: "Still in one piece", sub: "Months later", score: 0 },
      { label: "Teeth marks and a few chunks", sub: "Worn, but there", score: 1 },
      { label: "Destroyed in under an hour", sub: "Gone. Fast.", score: 2 },
    ],
  },
  {
    q: "How fast do they finish a chew or treat?",
    hint: "The one they love most.",
    opts: [
      { label: "They savour it", sub: "A long, slow session", score: 0 },
      { label: "A decent while", sub: "Not too fast, not too slow", score: 1 },
      { label: "Gone in minutes", sub: "Inhaled", score: 2 },
    ],
  },
  {
    q: "How do they treat familiar toys?",
    hint: "Novelty matters to dogs.",
    opts: [
      { label: "Loyal to old favourites", sub: "Same toy, every time", bored: false },
      { label: "Bored after a week or so", sub: "Needs a refresh now and then", bored: true },
      { label: "Bored within days", sub: "Always wants something new", bored: true },
    ],
  },
];

export function QuizView() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = step >= QUESTIONS.length;

  const pick = (i: number) => {
    setAnswers((a) => [...a.slice(0, step), i]);
    setTimeout(() => setStep((s) => s + 1), 280);
  };

  let tier: TierId = "medium";
  let size: SizeId = "M";
  let bored = false;
  if (done) {
    const score = [0, 2, 3].reduce((n, qi) => n + (QUESTIONS[qi].opts[answers[qi]].score ?? 0), 0);
    tier = score <= 1 ? "light" : score <= 4 ? "medium" : "heavy";
    size = QUESTIONS[1].opts[answers[1]].size ?? "M";
    bored = !!QUESTIONS[4].opts[answers[4]].bored;
  }
  const t = TIERS.find((x) => x.id === tier)!;
  const s = SIZES.find((x) => x.id === size)!;
  const tierBg = { light: "#ffb89a", medium: "#e39a3b", heavy: "#4b2a18" }[tier];

  return (
    <section className="relative min-h-svh overflow-hidden px-5 pb-20 pt-32 transition-colors duration-700 md:px-10" style={{ background: done ? tierBg : "#ffe600", color: done && tier === "heavy" ? "#fff6e8" : "#0a1f1e" }}>
      <div className="mx-auto max-w-[1300px]">
        <div className="flex items-center justify-between">
          <Eyebrow>Pick your tier</Eyebrow>
          {!done && <Eyebrow>{String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}</Eyebrow>}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-current/15">
          <motion.div className="h-full bg-current" animate={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={step} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="pt-14 md:pt-20">
              <h1 className="display text-6xl md:text-[8vw]">{QUESTIONS[step].q}</h1>
              <p className="mt-3 text-lg opacity-70">{QUESTIONS[step].hint}</p>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {QUESTIONS[step].opts.map((o, i) => (
                  <motion.button
                    key={o.label}
                    onClick={() => pick(i)}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    aria-pressed={answers[step] === i}
                    className={`rounded-[1.75rem] border-2 border-ink p-7 text-left transition-colors duration-300 ${answers[step] === i ? "bg-ink text-sun" : "bg-cream hover:bg-ink hover:text-sun"}`}
                  >
                    <span className="display block text-4xl md:text-5xl">{o.label}</span>
                    <span className="mt-2 block text-base opacity-75">{o.sub}</span>
                  </motion.button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep((x) => x - 1)} className="u-link mt-8 text-sm font-bold uppercase tracking-widest">
                  ← Back
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="grid items-center gap-10 pt-14 md:grid-cols-2 md:pt-20">
              <div>
                <Eyebrow className="mb-3">Your match</Eyebrow>
                <h1 className="display text-[26vw] leading-[0.85] md:text-[14vw]">{t.name}</h1>
                <p className="mt-4 text-2xl font-semibold leading-snug">
                  {s.label} shell · {t.name} Stages
                </p>
                <p className="mt-3 max-w-md text-lg opacity-85">
                  {t.forWho}. {t.firmness}.
                  {bored && " Since your dog tires of familiar things, rotate through at least three Stage variants."}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <TicketButton href={`/product?tier=${tier}&size=${size}`} variant={tier === "heavy" ? "sun" : "ink"} size="lg">
                    Shop {t.name} · {s.label}
                  </TicketButton>
                  <TicketButton
                    variant="cream"
                    onClick={() => {
                      setStep(0);
                      setAnswers([]);
                    }}
                  >
                    Retake
                  </TicketButton>
                </div>
                <p className="mt-6 max-w-md text-xs opacity-70">
                  A starting point, not a guarantee. Use the Stage Log to see how your dog does, and go up a tier if they finish in under about half the time you were out.
                </p>
              </div>
              <motion.div initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 90, damping: 11 }} style={{ transformOrigin: "50% 90%" }}>
                <Shell color="#0b5f5c" view="cutaway" className="w-full max-w-[560px] drop-shadow-[0_30px_36px_rgba(0,0,0,0.3)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
