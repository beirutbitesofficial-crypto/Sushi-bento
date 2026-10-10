"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findItem, money } from "./menu";
import { site } from "./site";

export type Line = {
  key: string;
  id: string;
  name: string;
  /** Variant or option label, e.g. "Spicy" or "Large". */
  choice?: string;
  price: number;
  qty: number;
};

export type OrderType = "delivery" | "pickup";
export type Customer = { name: string; phone: string; address: string; notes: string };

type Cart = {
  lines: Line[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, choice?: string) => void;
  setQty: (key: string, qty: number) => void;
  qtyOf: (id: string) => number;
  clear: () => void;
  /** Bumped on every add — the cart pill uses it to bounce. */
  pulse: number;
};

const CartContext = createContext<Cart | null>(null);
const STORAGE = "sushibento.cart.v1";

function priceFor(id: string, choice?: string) {
  const item = findItem(id);
  if (!item) return null;
  const variant = item.variants?.find((v) => v.label === choice);
  return { item, price: variant ? variant.price : item.price };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Restore (per-device convenience only; ignore if storage is blocked).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return;
      const saved = JSON.parse(raw) as Line[];
      // Re-price from the menu so stale prices never survive.
      setLines(
        saved.flatMap((l) => {
          const p = priceFor(l.id, l.choice);
          return p && l.qty > 0 ? [{ ...l, name: p.item.name, price: p.price }] : [];
        })
      );
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((id: string, choice?: string) => {
    const p = priceFor(id, choice);
    if (!p) return;
    const key = choice ? `${id}::${choice}` : id;
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      if (found) return ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...ls, { key, id, name: p.item.name, choice, price: p.price, qty: 1 }];
    });
    setPulse((n) => n + 1);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<Cart>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return {
      lines,
      count,
      total,
      open,
      setOpen,
      add,
      setQty,
      qtyOf: (id) => lines.filter((l) => l.id === id).reduce((n, l) => n + l.qty, 0),
      clear: () => setLines([]),
      pulse,
    };
  }, [lines, open, add, setQty, pulse]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** The WhatsApp message the restaurant receives. */
export function orderMessage(lines: Line[], total: number, type: OrderType, c: Customer) {
  const rows = lines.map((l) => `• ${l.qty} × ${l.name}${l.choice ? ` (${l.choice})` : ""} — ${money(l.qty * l.price)}`);
  return [
    `Hello ${site.name}! New ${type === "delivery" ? "delivery" : "pickup"} order:`,
    "",
    ...rows,
    "",
    `Total: ${money(total)}`,
    "",
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    type === "delivery" ? `Address: ${c.address}` : "Pickup from the restaurant",
    c.notes ? `Notes: ${c.notes}` : "",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n")
    .trim();
}
