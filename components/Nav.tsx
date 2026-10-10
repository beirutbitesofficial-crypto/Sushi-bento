"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import Logo from "./Logo";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { count, setOpen } = useCart();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "pointer-events-none -translate-y-full opacity-0" : "opacity-100"}`}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
        <a href="#top" aria-label="Sushi Bento — home">
          <Logo markClass="h-8 w-8" />
        </a>
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]">
          <a href="#menu" className="hidden min-h-10 items-center px-3 text-rice/75 hover:text-rice md:inline-flex">
            Menu
          </a>
          <a href="#visit" className="hidden min-h-10 items-center px-3 text-rice/75 hover:text-rice md:inline-flex">
            Visit
          </a>
          <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rice/25 px-4 text-rice/90 hover:border-salmon">
            Order
            {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-salmon px-1 text-[10px] text-ink">{count}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
