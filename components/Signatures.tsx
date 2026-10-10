"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { findItem, money, showcase } from "@/lib/menu";
import AddButton from "./AddButton";
import { SplitChars } from "./SplitText";

/** Photos already shot on black fill the card; cut-outs float on the black stage. */
const FULL_BLEED = new Set(["tatuna", "scallopos", "sweet-tuna", "salmon-tartar"]);

export default function Signatures() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = showcase.map((id) => findItem(id)!).filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const horizontal = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
        });
        gsap.fromTo(q(".sg-progress"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        q(".sg-card").forEach((card) => {
          const img = card.querySelector(".sg-img");
          gsap.fromTo(img, { xPercent: -8, scale: 1.12 }, { xPercent: 8, scale: 1.12, ease: "none", scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true } });
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(q(".sg-title .char"), { yPercent: 115 }, { yPercent: 0, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 30%", scrub: 0.8 } });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="signatures" className="relative overflow-hidden bg-ink-2 py-24 hz:h-screen-s hz:py-0">
      <div className="flex h-full flex-col hz:justify-center">
        <div className="flex items-end justify-between gap-6 px-5 md:px-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-salmon">The ones people come back for</p>
            <h2 className="sg-title mt-4 font-serif text-[13vw] leading-none md:text-[6vw]" aria-label="Signatures">
              <SplitChars text="Signatures" />
            </h2>
          </div>
          <span className="relative mb-3 hidden h-px w-56 overflow-hidden bg-rice/15 hz:block">
            <span className="sg-progress absolute inset-0 origin-left bg-salmon" />
          </span>
        </div>

        <div
          ref={track}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-12 hz:mt-12 hz:w-max hz:snap-none hz:overflow-visible hz:gap-8 hz:pr-[20vw]"
        >
          {items.map((item, i) => (
            <article key={item.id} className="sg-card group relative flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] bg-ink sm:w-[48vw] hz:w-[30vw] hz:max-w-[460px]">
              <div className="dish-stage relative aspect-[4/5] overflow-hidden hz:aspect-auto hz:h-[52vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/menu/${item.img}.webp`} alt={item.name} loading="lazy" className={`sg-img dish absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04] ${item.img && (FULL_BLEED.has(item.img) || item.img.startsWith("ai/")) ? "object-cover" : "object-contain p-6"}`} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-rice/80 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-3xl">{item.name}</h3>
                  <p className="shrink-0 font-serif text-2xl text-salmon">{money(item.variants?.[0].price ?? item.price)}</p>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-rice/60">{item.desc ?? `${item.pieces} pieces to share.`}</p>
                <div className="mt-auto pt-2">
                  <AddButton item={item} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
