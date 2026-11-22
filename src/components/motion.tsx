"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { createElement, useEffect, useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Word-by-word masked reveal. Wrap a word in *asterisks* to apply `accent`. Use \n for line breaks. */
export function SplitText({
  children,
  className = "",
  accent = "text-sun",
  as = "div",
  delay = 0,
  stagger = 0.05,
  immediate = false,
}: {
  children: string;
  className?: string;
  accent?: string;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const lines = children.split("\n");
  let i = 0;
  return createElement(
    as,
    { className },
    lines.map((line, li) => (
      <span key={li} className="block">
        {line.split(" ").map((raw, wi) => {
          const isAccent = raw.startsWith("*") && raw.endsWith("*") && raw.length > 2;
          const word = isAccent ? raw.slice(1, -1) : raw;
          const idx = i++;
          return (
            <span key={wi} className="inline-block overflow-hidden align-bottom py-[0.07em] -my-[0.07em]">
              <motion.span
                className={`inline-block ${isAccent ? accent : ""}`}
                initial={reduce ? false : { y: "115%", rotate: 4 }}
                {...(immediate
                  ? { animate: { y: 0, rotate: 0 } }
                  : { whileInView: { y: 0, rotate: 0 }, viewport: { once: true, margin: "0px 0px -8% 0px" } })}
                transition={{ duration: 1, ease: EASE, delay: delay + idx * stagger }}
              >
                {word}
              </motion.span>
              {" "}
            </span>
          );
        })}
      </span>
    )),
  );
}

export function Fade({
  children,
  className = "",
  delay = 0,
  y = 40,
  x = 0,
  scale = 1,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function ScrubWord({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const end = Math.min(1, start + 1.6 / n);
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
      {" "}
    </motion.span>
  );
}

/** Paragraph whose words light up as you scroll through it. */
export function ScrubText({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = children.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrubWord key={i} word={w} i={i} n={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

export function CountUp({
  to,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const c = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => (el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => c.stop();
  }, [inView, to, duration, prefix, suffix, decimals]);
  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/** Image/block wrapper with scroll-linked parallax. */
export function Parallax({
  children,
  amount = 60,
  className = "",
  scale = 1.18,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Element drifts toward the cursor. */
export function Magnetic({ children, strength = 0.3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
