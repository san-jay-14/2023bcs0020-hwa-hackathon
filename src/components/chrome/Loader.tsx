"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Shell } from "../Shell";

export function Loader() {
  const [show, setShow] = useState(true);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("ls.loaded") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    document.documentElement.classList.add("lenis-stopped");
    const c = animate(0, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (num.current) num.current.textContent = String(Math.round(v)).padStart(2, "0");
      },
      onComplete: () => {
        try {
          sessionStorage.setItem("ls.loaded", "1");
        } catch {}
        setShow(false);
        document.documentElement.classList.remove("lenis-stopped");
      },
    });
    return () => {
      c.stop();
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="loader-root fixed inset-0 z-[100] flex flex-col items-center justify-center bg-teal text-cream"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-52 md:w-72"
          >
            <motion.div animate={{ rotate: [0, -5, 4, -2, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "50% 90%" }}>
              <Shell color="#0b5f5c" />
            </motion.div>
          </motion.div>
          <p className="display mt-6 text-5xl md:text-7xl">Longshift</p>
          <span className="eyebrow absolute bottom-8 left-6 opacity-80">Loading the first Stage</span>
          <span ref={num} className="display absolute bottom-6 right-6 text-6xl text-sun md:text-8xl">
            00
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
