"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Shell } from "../Shell";
import { STAGES } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BEATS = [
  { n: "01", title: "Lick", kicker: "Minute one", copy: "A smooth, soft peach layer that meets your dog the second you leave. No skill. No learning curve. Just instant engagement.", bg: "#ffb89a", fg: "#0a1f1e" },
  { n: "02", title: "Chew", kicker: "Next up", copy: "Caramel ridges and generous volume. Your dog earns the way forward, because the food, not a timer, sets the pace.", bg: "#e39a3b", fg: "#0a1f1e" },
  { n: "03", title: "Core", kicker: "The finish", copy: "Firm, but always dentable. Every Stage passes the thumbnail test, so the long finish never relies on hardness.", bg: "#4b2a18", fg: "#fff6e8" },
  { n: "04", title: "Done", kicker: "Quiet", copy: "An empty shell is the safe end state. Nothing to break off. Nothing to do. You come home to a clean, solid, rinse-ready shell.", bg: "#0b5f5c", fg: "#fff6e8" },
];

export function StageStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=360%", scrub: 0.6, pin: true, anticipatePin: 1 },
        });
        gsap.set(".beat", { opacity: 0, y: 60 });
        gsap.set(".beat-0", { opacity: 1, y: 0 });
        BEATS.forEach((b, i) => {
          const t = i;
          if (i > 0) {
            tl.to(root.current, { backgroundColor: b.bg, color: b.fg, duration: 0.6 }, t - 0.3);
            tl.to(`.beat-${i - 1}`, { opacity: 0, y: -60, duration: 0.4 }, t - 0.3);
            tl.to(`.beat-${i}`, { opacity: 1, y: 0, duration: 0.5 }, t - 0.1);
          }
          if (i < 3) tl.to(`.ls-layer-${i + 1}`, { scaleY: 0.02, duration: 0.8 }, t + 0.15);
          tl.to(".progress-bar", { scaleX: (i + 1) / 4, duration: 0.8 }, t);
        });
        tl.to(".story-shell", { rotate: 6, scale: 0.92, duration: 3 }, 0);
        tl.to({}, { duration: 0.3 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-svh overflow-hidden" style={{ backgroundColor: BEATS[0].bg, color: BEATS[0].fg }}>
      <div className="mx-auto grid h-full max-w-[1600px] items-center gap-6 px-5 pt-24 md:grid-cols-2 md:px-10">
        <div className="relative z-10 h-[46svh] md:h-[60svh]">
          {BEATS.map((b, i) => (
            <div key={b.n} className={`beat beat-${i} absolute inset-0 flex flex-col justify-center`}>
              <p className="eyebrow mb-3 opacity-70">
                Stage {b.n} · {b.kicker}
              </p>
              <h2 className="display text-[22vw] leading-[0.85] md:text-[11vw]">{b.title}</h2>
              <p className="mt-5 max-w-md text-lg font-medium leading-snug md:text-xl">{b.copy}</p>
              {i < 3 && (
                <p className="mt-4 text-sm font-bold uppercase tracking-widest opacity-60">
                  {STAGES[i].look} · {STAGES[i].texture}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute aspect-square w-[80%] rounded-full bg-white/20 blur-2xl" />
          <Shell view="cutaway" color="#0b5f5c" className="story-shell relative w-full max-w-[560px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]" />
        </div>
      </div>
      <div className="absolute inset-x-5 bottom-6 md:inset-x-10">
        <div className="mb-2 flex justify-between eyebrow opacity-70">
          <span>Stage by stage</span>
          <span>Scroll</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-current/20">
          <div className="progress-bar h-full origin-left scale-x-[0.25] rounded-full bg-current" />
        </div>
      </div>
    </section>
  );
}
