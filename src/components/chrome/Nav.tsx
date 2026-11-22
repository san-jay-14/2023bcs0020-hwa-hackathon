"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart, useCartLines } from "@/lib/cart";
import { TicketButton } from "../ui";

const LINKS = [
  { href: "/product", label: "Shop" },
  { href: "/features", label: "Features" },
  { href: "/quiz", label: "Find your tier" },
  { href: "/stage-log", label: "Stage Log" },
  { href: "/faq", label: "FAQ" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`display flex items-center gap-2 text-3xl leading-none ${className}`} aria-label="Longshift home">
      <span className="relative inline-block h-6 w-8">
        <span className="absolute inset-x-0 bottom-0 h-5 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] bg-current" />
        <span className="absolute left-1/2 top-0 h-2.5 w-6 -translate-x-1/2 rounded-[50%] bg-sun ring-2 ring-current" />
      </span>
      Longshift
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { lines } = useCartLines();
  const openDrawer = useCart((s) => s.openDrawer);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();
  const count = lines.reduce((n, l) => n + l.qty, 0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160 && !menu);
  });

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", menu);
  }, [menu]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 z-50"
        animate={{ top: hidden ? -90 : 0 }}
        initial={false}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 md:px-10">
          <div className="text-white mix-blend-difference">
            <Logo />
          </div>
          <nav className="hidden items-center gap-9 text-sm font-bold uppercase tracking-[0.12em] text-white mix-blend-difference lg:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`u-link py-1 ${pathname === l.href ? "bg-[length:100%_2px]" : ""}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={openDrawer}
              className="ticket ticket-btn tb-sun h-11 px-6 text-lg"
              aria-label={`Open cart, ${count} items`}
            >
              <span className="flex items-center gap-2">
                Cart
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-sm text-sun">{count}</span>
              </span>
            </button>
            <button
              className="relative grid h-11 w-11 place-items-center text-white mix-blend-difference lg:hidden"
              onClick={() => setMenu((m) => !m)}
              aria-label="Menu"
              aria-expanded={menu}
            >
              <span className={`absolute h-0.5 w-7 bg-current transition-transform duration-300 ${menu ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-0.5 w-7 bg-current transition-transform duration-300 ${menu ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-teal px-6 pt-20 text-cream"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-1">
              {[{ href: "/", label: "Home" }, ...LINKS].map((l, i) => (
                <div key={l.href} className="overflow-hidden">
                  <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={l.href} className="display block text-6xl leading-[1.05]">
                      {l.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <div className="mt-10">
              <TicketButton href="/product" variant="sun">
                Shop Longshift
              </TicketButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
