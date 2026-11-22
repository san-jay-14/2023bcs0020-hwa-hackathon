"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TIERS, type TierId } from "@/lib/data";
import { Eyebrow, TicketButton } from "../ui";

type Entry = { id: string; date: string; hoursOut: number; stage: 1 | 2 | 3 | 4; finishHours?: number; notes: string };

const KEY = "longshift.log.v1";
const TIER_KEY = "longshift.log.tier.v1";
const STAGE_LABEL = ["", "Stage 1 · Lick", "Stage 2 · Chew", "Stage 3 · Core", "Finished it all"];
const STAGE_COLOR = ["", "#ffb89a", "#e39a3b", "#4b2a18", "#0e8a84"];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const dayLabel = (d: string) => (d.length === 10 ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }) : "");

export function StageLogView() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tier, setTier] = useState<TierId>("medium");
  const [loaded, setLoaded] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const [form, setForm] = useState({ date: "", hoursOut: "4", stage: 2 as 1 | 2 | 3 | 4, finishHours: "", notes: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const t = iso(new Date());
    setTodayStr(t);
    setForm((f) => ({ ...f, date: t }));
    try {
      setEntries(JSON.parse(localStorage.getItem(KEY) || "[]"));
      const t = localStorage.getItem(TIER_KEY);
      if (t && TIERS.some((x) => x.id === t)) setTier(t as TierId);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
      localStorage.setItem(TIER_KEY, tier);
    } catch {}
  }, [entries, tier, loaded]);

  const sorted = useMemo(() => [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id.localeCompare(a.id))), [entries]);

  // 7-day pattern, oldest → newest
  const week = useMemo(() => {
    const days: { date: string; stage: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      if (!todayStr) {
        days.push({ date: String(i), stage: 0, count: 0 });
        continue;
      }
      const d = new Date(todayStr + "T12:00:00");
      d.setDate(d.getDate() - i);
      const date = iso(d);
      const es = entries.filter((e) => e.date === date);
      days.push({ date, stage: es.length ? Math.max(...es.map((e) => e.stage)) : 0, count: es.length });
    }
    return days;
  }, [entries, todayStr]);

  const insight = useMemo(() => {
    const latest = sorted[0];
    const out: { tone: "go" | "info" | "care"; title: string; body: string }[] = [];
    if (!latest) return out;
    const idx = TIERS.findIndex((t) => t.id === tier);
    if (latest.stage === 4 && latest.finishHours != null && latest.finishHours < latest.hoursOut / 2) {
      const next = TIERS[idx + 1];
      out.push(
        next
          ? { tone: "go", title: `Go up to ${next.name}`, body: `Your dog reached the end in ${latest.finishHours} h, under about half of the ${latest.hoursOut} h you were out. Try the ${next.name} tier. If the tier feels right but your dog is bored, rotate to a different Stage variant instead of refilling the same load.` }
          : { tone: "go", title: "Rotate a new variant", body: `Your dog finished in under about half the time you were out, and you're already on Heavy. Rotate to a different Stage variant, since refilling the same load is the weakest option.` },
      );
    } else if (latest.stage === 4) {
      out.push({ tone: "info", title: "Good fit", body: "Your dog used a good share of the time you were out. Keep this tier, and rotate variants now and then to keep it fresh." });
    } else {
      out.push({ tone: "info", title: "Right on pace", body: `Your last session ended on ${STAGE_LABEL[latest.stage]}. That's a sensible pace. Keep logging to see the pattern.` });
    }
    const daysOnStage1 = week.filter((d) => d.count > 0 && d.stage === 1).length;
    if (daysOnStage1 >= 3) {
      out.push({ tone: "care", title: "Worth a chat with a vet", body: "Your dog has stayed on Stage 1 for several days this week. If that continues, consider talking to a vet or a qualified behaviourist. The Stage Log doesn't diagnose anything, and neither does Longshift." });
    }
    return out;
  }, [sorted, tier, week]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const hoursOut = parseFloat(form.hoursOut);
    const finish = form.finishHours === "" ? undefined : parseFloat(form.finishHours);
    if (!form.date || !(hoursOut > 0) || hoursOut > 24) return setError("Enter how many hours you were out (0 to 24).");
    if (form.stage === 4 && (finish == null || !(finish > 0))) return setError("Enter how many hours it took to finish everything.");
    if (finish != null && finish > hoursOut) return setError("Time to finish can't be longer than the time you were out.");
    setError("");
    setEntries((es) => [{ id: crypto.randomUUID(), date: form.date, hoursOut, stage: form.stage, finishHours: form.stage === 4 ? finish : undefined, notes: form.notes.trim() }, ...es]);
    setForm((f) => ({ ...f, notes: "", finishHours: "" }));
  }

  function sample() {
    const mk = (back: number, hoursOut: number, stage: 1 | 2 | 3 | 4, finishHours?: number): Entry => {
      const d = new Date(todayStr + "T12:00:00");
      d.setDate(d.getDate() - back);
      return { id: crypto.randomUUID(), date: iso(d), hoursOut, stage, finishHours, notes: "Sample entry" };
    };
    setEntries([mk(6, 4, 2), mk(5, 5, 3), mk(4, 3, 3), mk(3, 4, 4, 3), mk(2, 6, 4, 2), mk(1, 4, 4, 1.5), mk(0, 5, 4, 2)]);
  }

  const field = "w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-lg outline-none transition-colors focus:border-ink";
  const maxH = 4;

  return (
    <>
      <section className="grain relative bg-chestnut px-5 pb-16 pt-40 text-cream md:px-10 md:pb-24 md:pt-52">
        <div className="mx-auto max-w-[1600px]">
          <Eyebrow className="mb-4 text-sun">Stage Log</Eyebrow>
          <h1 className="display text-[17vw] leading-[0.85] md:text-[12vw]">
            Know your dog&rsquo;s <span className="text-sun">pace.</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl text-cream/85">
            Log how long you were out and how far your dog got. See a 7-day pattern and get a nudge to go up a tier or rotate. Saved in this browser only. No login. No diagnosis.
          </p>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12">
          {/* Form */}
          <form onSubmit={submit} className="space-y-6 rounded-[2rem] bg-peach p-6 md:p-10 lg:col-span-5" noValidate>
            <h2 className="display text-4xl md:text-5xl">Log a session</h2>
            <div>
              <p className="eyebrow mb-2">Your tier</p>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((t) => (
                  <button key={t.id} type="button" aria-pressed={tier === t.id} onClick={() => setTier(t.id)} className={`rounded-xl border-2 py-3 font-bold transition-colors ${tier === t.id ? "border-ink bg-ink text-cream" : "border-ink/20 bg-white/60"}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="eyebrow mb-2 block">Date</span>
                <input type="date" className={field} value={form.date} max={todayStr || undefined} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </label>
              <label className="block">
                <span className="eyebrow mb-2 block">Hours out</span>
                <input type="number" inputMode="decimal" min="0.5" max="24" step="0.5" className={field} value={form.hoursOut} onChange={(e) => setForm({ ...form, hoursOut: e.target.value })} />
              </label>
            </div>
            <fieldset>
              <legend className="eyebrow mb-2">Stage reached</legend>
              <div className="grid grid-cols-2 gap-2">
                {([1, 2, 3, 4] as const).map((n) => (
                  <label key={n} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 font-semibold transition-colors ${form.stage === n ? "border-ink bg-ink text-cream" : "border-ink/20 bg-white/60"}`}>
                    <input type="radio" name="stage" className="sr-only" checked={form.stage === n} onChange={() => setForm({ ...form, stage: n })} />
                    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-white/70" style={{ background: STAGE_COLOR[n] }} />
                    {STAGE_LABEL[n]}
                  </label>
                ))}
              </div>
            </fieldset>
            <AnimatePresence>
              {form.stage === 4 && (
                <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="block overflow-hidden">
                  <span className="eyebrow mb-2 block">Hours to finish everything</span>
                  <input type="number" inputMode="decimal" min="0.1" step="0.25" className={field} value={form.finishHours} onChange={(e) => setForm({ ...form, finishHours: e.target.value })} placeholder="e.g. 1.5" />
                </motion.label>
              )}
            </AnimatePresence>
            <label className="block">
              <span className="eyebrow mb-2 block">Notes (optional)</span>
              <textarea rows={3} className={field} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Variant used, mood, anything you noticed…" />
            </label>
            {error && <p role="alert" className="rounded-xl bg-coral px-4 py-3 font-semibold text-cream">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <TicketButton type="submit" variant="ink" size="lg">
                Save entry
              </TicketButton>
              <button type="button" onClick={sample} className="u-link self-center text-sm font-bold">
                Load a sample week
              </button>
            </div>
          </form>

          {/* Pattern */}
          <div className="space-y-8 lg:col-span-7">
            <div className="rounded-[2rem] bg-ink p-6 text-cream md:p-10">
              <div className="flex items-end justify-between">
                <h2 className="display text-4xl md:text-5xl">Last 7 days</h2>
                <p className="eyebrow text-cream/60">Furthest Stage per day</p>
              </div>
              <div className="mt-8 flex h-64 items-end gap-2 md:gap-4" role="img" aria-label="Seven day bar chart of Stage reached">
                {week.map((d, i) => (
                  <div key={d.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <motion.div
                      className="w-full rounded-t-2xl"
                      style={{ background: d.stage ? STAGE_COLOR[d.stage] : "rgba(255,246,232,.12)", originY: 1 }}
                      initial={{ height: 0 }}
                      animate={{ height: d.stage ? `${(d.stage / maxH) * 100}%` : "6%" }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                    />
                    <span className="eyebrow text-[10px] text-cream/70">{dayLabel(d.date)}</span>
                  </div>
                ))}
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-cream/70">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: STAGE_COLOR[n] }} /> {STAGE_LABEL[n]}
                  </li>
                ))}
              </ul>
            </div>

            <AnimatePresence mode="popLayout">
              {insight.map((i) => (
                <motion.div
                  key={i.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-[2rem] p-6 md:p-8 ${i.tone === "go" ? "bg-sun" : i.tone === "care" ? "bg-coral text-cream" : "bg-mint"}`}
                >
                  <p className="eyebrow mb-2">{i.tone === "go" ? "Suggestion" : i.tone === "care" ? "Worth knowing" : "Insight"}</p>
                  <h3 className="display text-4xl md:text-5xl">{i.title}</h3>
                  <p className="mt-3 max-w-xl text-lg leading-snug">{i.body}</p>
                  {i.tone === "go" && (
                    <div className="mt-5">
                      <TicketButton href="/product#refills" variant="ink" size="sm">
                        Shop Stage Packs
                      </TicketButton>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {insight.length === 0 && (
              <div className="rounded-[2rem] border-2 border-dashed border-ink/25 p-8 text-center">
                <p className="display text-4xl">No entries yet</p>
                <p className="mt-2 opacity-70">Log your first session, or load a sample week to see how it works.</p>
              </div>
            )}

            {sorted.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="display text-4xl">History</h2>
                  <button className="u-link text-sm font-bold" onClick={() => confirm("Delete all entries?") && setEntries([])}>
                    Clear all
                  </button>
                </div>
                <ul className="divide-y divide-ink/15 border-y border-ink/15">
                  <AnimatePresence initial={false}>
                    {sorted.map((e) => (
                      <motion.li key={e.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="flex items-center gap-4 py-4">
                          <span className="h-10 w-2 shrink-0 rounded-full" style={{ background: STAGE_COLOR[e.stage] }} />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold">
                              {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {e.hoursOut} h out · {STAGE_LABEL[e.stage]}
                              {e.finishHours != null && ` in ${e.finishHours} h`}
                            </p>
                            {e.notes && <p className="truncate text-sm opacity-65">{e.notes}</p>}
                          </div>
                          <button className="u-link text-sm font-semibold opacity-70" onClick={() => setEntries((es) => es.filter((x) => x.id !== e.id))} aria-label="Delete entry">
                            Delete
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            )}
            <p className="text-sm opacity-60">
              The Stage Log doesn&rsquo;t diagnose or treat anything. Suggestions use a simple rule of thumb that is still being tested. Questions about your dog&rsquo;s behaviour belong with a vet or behaviourist. <Link className="u-link font-semibold" href="/faq">Read the FAQ</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
