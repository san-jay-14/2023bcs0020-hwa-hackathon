"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Shell } from "../Shell";
import { SplitText, Fade } from "../motion";
import { RoundBadge, TicketButton } from "../ui";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const shellY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const wordY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const wordScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 120, damping: 14 });

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-teal text-cream"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
    >
      {/* giant wordmark */}
      <motion.div style={{ y: wordY, scale: wordScale }} className="pointer-events-none absolute inset-x-0 top-[13vh] select-none">
        <h1 className="display text-center text-[26vw] leading-[0.8] tracking-tight text-cream md:text-[22vw]" aria-label="Longshift">
          <SplitText as="span" immediate stagger={0.06} delay={2.1} className="block">
            Longshift
          </SplitText>
        </h1>
      </motion.div>

      {/* sun disc */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-[33%] aspect-square w-[min(72vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun md:top-[60svh] md:w-[min(46vw,760px,62svh)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 2.0 }}
      />

      {/* shell */}
      <motion.div
        style={{ y: shellY, rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        className="relative z-10 mx-auto mt-[22vh] w-[min(78vw,640px)] md:absolute md:left-1/2 md:top-[27svh] md:mx-0 md:mt-0 md:w-[min(46vw,640px,56svh)] md:-translate-x-1/2"
      >
        <motion.div
          initial={{ y: -420, rotate: -18, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 11, delay: 2.15 }}
        >
          <motion.div
            animate={{ rotate: [0, -5, 4.5, -2.5, 1.5, 0] }}
            transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.4, delay: 3.4 }}
            style={{ transformOrigin: "50% 92%" }}
          >
            <Shell color="#0b5f5c" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* badges */}
      <motion.div
        className="absolute right-[6vw] top-[24vh] z-20 hidden h-36 w-36 rotate-12 text-ink md:block"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ type: "spring", delay: 2.9, stiffness: 120, damping: 12 }}
      >
        <RoundBadge text="NO BATTERIES • NO MOVING PARTS • " className="h-full w-full" />
      </motion.div>
      <motion.div
        className="ticket absolute left-[5vw] top-[48vh] z-20 hidden -rotate-6 bg-coral px-6 py-3 text-cream md:block"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="display text-2xl">Food-timed.</p>
      </motion.div>

      {/* copy */}
      <div className="relative z-20 mt-auto grid items-end gap-8 px-5 pb-10 pt-10 md:grid-cols-[1fr_min(46vw,640px,56svh)_1fr] md:gap-6 md:px-10 md:pb-12">
        <div>
          <SplitText as="p" immediate delay={2.8} className="display text-5xl md:text-[3.4vw] md:leading-[0.95]" accent="text-sun">
            {"One shell.\nThree Stages.\n*Zero* batteries."}
          </SplitText>
        </div>
        <div className="hidden md:block" />
        <div>
          <Fade delay={3.1} y={24}>
            <p className="max-w-md text-lg font-medium leading-snug text-cream/90">
              A single, solid piece of chew-safe rubber loaded with edible Stages. The food, not a timer, sets the pace for the
              moments right after you walk out.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <TicketButton href="/product" variant="sun">
                Shop · from $22
              </TicketButton>
              <TicketButton href="/features" variant="cream">
                How it works
              </TicketButton>
            </div>
          </Fade>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span className="eyebrow text-cream/70">Scroll ↓</span>
      </motion.div>
    </section>
  );
}
