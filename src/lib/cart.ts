"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lineKey, type CartLine } from "./pricing";
import { useEffect, useState } from "react";

type NewLine = Omit<CartLine, "key" | "qty"> & { qty?: number };

type CartState = {
  lines: CartLine[];
  open: boolean;
  add: (l: NewLine) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      add: (l: NewLine) =>
        set((s: CartState) => {
          const key = lineKey(l);
          const qty = l.qty ?? 1;
          const found = s.lines.find((x: CartLine) => x.key === key);
          if (found) {
            return {
              lines: s.lines.map((x: CartLine) =>
                x.key === key ? { ...x, qty: Math.min(20, x.qty + qty) } : x,
              ),
              open: true,
            };
          }
          return { lines: [...s.lines, { ...l, key, qty }], open: true };
        }),
      setQty: (key: string, qty: number) =>
        set((s: CartState) => ({
          lines:
            qty < 1
              ? s.lines.filter((x: CartLine) => x.key !== key)
              : s.lines.map((x: CartLine) => (x.key === key ? { ...x, qty: Math.min(20, qty) } : x)),
        })),
      remove: (key: string) => set((s: CartState) => ({ lines: s.lines.filter((x: CartLine) => x.key !== key) })),
      clear: () => set({ lines: [] }),
      openDrawer: () => set({ open: true }),
      closeDrawer: () => set({ open: false }),
    }),
    {
      name: "longshift.cart.v1",
      partialize: (s: CartState) => ({ lines: s.lines }),
    },
  ),
);

/** True once mounted on the client, so persisted state never causes hydration mismatches. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function useCartLines() {
  const lines = useCart((s) => s.lines);
  const mounted = useMounted();
  return { lines: mounted ? lines : [], mounted };
}
