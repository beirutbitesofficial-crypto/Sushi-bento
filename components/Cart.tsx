"use client";

import { useEffect, useRef, useState } from "react";
import { type Customer, type OrderType, orderMessage, useCart } from "@/lib/cart";
import { money } from "@/lib/menu";
import { site, whatsappLink } from "@/lib/site";
import { LogoMark } from "./Logo";

/** Floating cart button — shows once something is in the order. */
export function CartPill() {
  const { count, total, setOpen, pulse } = useCart();
  if (count === 0) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-5 right-5 z-50 flex min-h-14 items-center gap-3 rounded-full bg-salmon pl-3 pr-6 text-ink shadow-[0_14px_40px_-10px_rgba(244,119,59,0.7)] transition-transform hover:-translate-y-0.5 md:bottom-8 md:right-8"
      aria-label={`Open your order: ${count} items, ${money(total)}`}
    >
      <span key={pulse} className="pop grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-bold text-rice">
        {count}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.25em]">Your order</span>
      <span className="font-serif text-lg">{money(total)}</span>
    </button>
  );
}

export function CartDrawer() {
  const { lines, total, open, setOpen, setQty, clear } = useCart();
  const [type, setType] = useState<OrderType>("delivery");
  const [c, setC] = useState<Customer>({ name: "", phone: "", address: "", notes: "" });
  const [error, setError] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, setOpen]);

  const send = () => {
    if (!lines.length) return setError("Your order is empty.");
    if (!c.name.trim() || !c.phone.trim()) return setError("Please add your name and phone number.");
    if (type === "delivery" && !c.address.trim()) return setError("Please add the delivery address.");
    setError("");
    window.open(whatsappLink(orderMessage(lines, total, type, c)), "_blank", "noopener");
  };

  const field = "min-h-12 w-full rounded-2xl border border-rice/12 bg-ink px-4 text-sm text-rice placeholder:text-rice/35 focus:border-salmon/60 focus:outline-none";

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-ink-2 shadow-2xl outline-none transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-rice/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8" />
            <h2 className="font-serif text-2xl">Your order</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full text-xl text-rice/70 hover:bg-rice/10" aria-label="Close">
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="py-16 text-center text-rice/50">Nothing here yet — add something from the menu.</p>
          ) : (
            <ul>
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 border-b border-dashed border-rice/10 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg leading-tight">{l.name}</p>
                    {l.choice && <p className="text-xs text-rice/50">{l.choice}</p>}
                    <p className="mt-1 text-sm text-salmon">{money(l.price * l.qty)}</p>
                  </div>
                  <div className="flex items-center rounded-full border border-rice/15">
                    <button type="button" className="grid h-9 w-9 place-items-center text-lg" onClick={() => setQty(l.key, l.qty - 1)} aria-label={`One less ${l.name}`}>
                      −
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                    <button type="button" className="grid h-9 w-9 place-items-center text-lg" onClick={() => setQty(l.key, l.qty + 1)} aria-label={`One more ${l.name}`}>
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {lines.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-1 rounded-full bg-ink p-1">
                {(["delivery", "pickup"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`min-h-10 rounded-full text-xs font-bold uppercase tracking-[0.25em] transition-colors ${type === t ? "bg-salmon text-ink" : "text-rice/60"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={field} placeholder="Your name" autoComplete="name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
                <input className={field} placeholder="Phone" type="tel" autoComplete="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />
              </div>
              {type === "delivery" && (
                <input className={field} placeholder="Delivery address (building, floor, area)" autoComplete="street-address" value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} />
              )}
              <textarea className={`${field} min-h-20 py-3`} placeholder="Notes — no wasabi, extra ginger, chopsticks for 4…" value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} />
              <button type="button" onClick={clear} className="text-xs text-rice/40 underline hover:text-rice/70">
                Clear order
              </button>
            </div>
          )}
        </div>

        <footer className="border-t border-rice/10 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.3em] text-rice/55">Total</span>
            <span className="font-serif text-3xl">{money(total)}</span>
          </div>
          {error && <p className="mb-3 text-sm text-[#FF8A7A]">{error}</p>}
          <button
            type="button"
            onClick={send}
            disabled={!lines.length}
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-salmon text-xs font-bold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-rice disabled:opacity-40"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Send order on WhatsApp
          </button>
          <p className="mt-3 text-center text-[11px] text-rice/40">Prices in {site.currency}. We confirm your order and delivery time on WhatsApp.</p>
        </footer>
      </div>
    </div>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}
