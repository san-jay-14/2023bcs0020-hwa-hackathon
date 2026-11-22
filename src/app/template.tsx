"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

let navigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [curtain, setCurtain] = useState(false);

  useEffect(() => {
    if (navigated) setCurtain(true);
    navigated = true;
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: navigated ? 0.3 : 0 }}
      >
        {children}
      </motion.div>
      {curtain && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] origin-top bg-teal"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        />
      )}
    </>
  );
}
