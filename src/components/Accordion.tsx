"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function Accordion({
  items,
  tone = "ink",
  defaultOpen = null,
}: {
  items: { q: string; a: string }[];
  tone?: "ink" | "cream";
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const line = tone === "cream" ? "border-cream/25" : "border-ink/15";
  return (
    <div className={`border-t ${line}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`border-b ${line}`}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="text-lg font-bold leading-snug md:text-xl">{it.q}</span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="display text-4xl leading-none">
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-base leading-relaxed opacity-85 md:text-lg">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
