"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { type Item, money } from "@/lib/menu";

/** "+" for simple items; for items with options/variants, a row of choice chips. */
export default function AddButton({ item, tone = "dark", className = "" }: { item: Item; tone?: "dark" | "light"; className?: string }) {
  const { add, qtyOf } = useCart();
  const [picking, setPicking] = useState(false);
  const qty = qtyOf(item.id);
  const choices = item.variants?.map((v) => ({ label: v.label, price: v.price })) ?? item.options?.map((o) => ({ label: o, price: item.price }));

  if (item.soldOut) return <span className="text-[11px] uppercase tracking-[0.3em] opacity-50">Sold out</span>;

  const base =
    tone === "dark"
      ? "bg-salmon text-ink hover:bg-rice"
      : "bg-ink text-rice hover:bg-salmon hover:text-ink";

  if (choices && picking) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label={`Choose ${item.name}`}>
        {choices.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => {
              add(item.id, c.label);
              setPicking(false);
            }}
            className={`min-h-9 rounded-full px-3.5 text-xs font-semibold transition-colors ${base}`}
          >
            {c.label}
            {item.variants ? ` · ${money(c.price)}` : ""}
          </button>
        ))}
        <button type="button" onClick={() => setPicking(false)} className="min-h-9 px-2 text-xs opacity-60 hover:opacity-100" aria-label="Cancel">
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => (choices ? setPicking(true) : add(item.id))}
      className={`relative inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${base} ${className}`}
      aria-label={`Add ${item.name} to order`}
    >
      <svg className="h-3 w-3" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2" />
      </svg>
      Add
      {qty > 0 && (
        <span key={qty} className="pop ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] text-rice">
          {qty}
        </span>
      )}
    </button>
  );
}
