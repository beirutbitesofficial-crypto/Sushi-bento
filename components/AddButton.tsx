"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { type Item, money } from "@/lib/menu";

/** "+" for simple items; for items with options/variants, a row of choice chips. */
export default function AddButton({ item, tone = "dark", className = "", compact = false }: { item: Item; tone?: "dark" | "light"; className?: string; compact?: boolean }) {
  const { add, qtyOf } = useCart();
  const [picking, setPicking] = useState(false);
  const qty = qtyOf(item.id);
  const choices = item.variants?.map((v) => ({ label: v.label, price: v.price })) ?? item.options?.map((o) => ({ label: o, price: item.price }));

  if (item.soldOut) return <span className={`text-[11px] uppercase tracking-[0.3em] opacity-50 ${className}`}>Sold out</span>;

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => (choices ? setPicking(true) : add(item.id))}
          className={`grid h-11 w-11 place-items-center rounded-full bg-salmon text-ink shadow-[0_8px_20px_-6px_rgba(244,119,59,0.8)] transition-transform active:scale-90 ${className}`}
          aria-label={`Add ${item.name} to order`}
        >
          <svg className="h-4 w-4" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2" />
          </svg>
          {qty > 0 && (
            <span key={qty} className="pop absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rice px-1 text-[10px] font-bold text-ink">
              {qty}
            </span>
          )}
        </button>
        {choices && picking && <ChoiceSheet item={item} choices={choices} onPick={(l) => (add(item.id, l), setPicking(false))} onClose={() => setPicking(false)} />}
      </>
    );
  }

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

/** Bottom sheet for picking a flavour / size from the compact grid. */
function ChoiceSheet({ item, choices, onPick, onClose }: { item: Item; choices: { label: string; price: number }[]; onPick: (label: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={`Choose ${item.name}`}>
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-md rounded-t-[28px] bg-ink-2 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-left sm:rounded-[28px]">
        <p className="font-script text-3xl leading-none text-salmon">choose</p>
        <h3 className="font-serif text-2xl">{item.name}</h3>
        <div className="mt-5 grid gap-2">
          {choices.map((c) => (
            <button key={c.label} type="button" onClick={() => onPick(c.label)} className="flex min-h-13 items-center justify-between rounded-2xl bg-ink px-5 py-3.5 text-left transition-colors hover:bg-salmon hover:text-ink">
              <span className="font-medium">{c.label}</span>
              <span className="font-serif text-salmon">{money(c.price)}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} className="mt-4 w-full py-2 text-sm text-rice/50">
          Cancel
        </button>
      </div>
    </div>
  );
}
