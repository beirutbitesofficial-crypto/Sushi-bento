"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { aiPhotos } from "@/lib/ai-photos";
import { DishImg, usePhoto } from "./Dish";
import { itemCount } from "@/lib/menu";
import { site } from "@/lib/site";
import { SplitWords } from "./SplitText";

const LINE =
  "Since 2001 we've been rolling sushi in Achrafieh and sending it across Beirut in little boxes. Rolled fresh, cut to order, packed with care.";

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add(MQ, (ctx) => {
        const { reduced } = ctx.conditions as Record<keyof typeof MQ, boolean>;
        if (reduced) return;
        gsap.fromTo(
          q(".story-line .word"),
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: q(".story-line")[0], start: "top 80%", end: "bottom 45%", scrub: true } }
        );
        gsap.fromTo(
          q(".stat"),
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: q(".stats")[0], start: "top 85%" } }
        );
        gsap.fromTo(q(".story-photo"), { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const years = new Date().getFullYear() - site.since;

  return (
    <section ref={root} id="story" className="relative overflow-hidden bg-ink px-5 py-28 md:px-12 md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1.25fr_1fr] md:gap-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-salmon">Our story</p>
          <p className="story-line mt-6 font-serif text-[8.4vw] leading-[1.12] md:text-[3.3vw]">
            <span className="sr-only">{LINE}</span>
            <span aria-hidden="true">
              <SplitWords text={LINE} mask={false} />
            </span>
          </p>
          <div className="stats mt-14 grid grid-cols-3 gap-6 border-t border-rice/10 pt-8">
            {[
              { n: `${years}`, l: "years rolling" },
              { n: `${itemCount}+`, l: "things on the menu" },
              { n: "120", l: "pieces on the Big Boat" },
            ].map((s) => (
              <div key={s.l} className="stat">
                <p className="font-serif text-4xl text-salmon md:text-6xl">{s.n}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-rice/55">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-[3/4] w-full max-w-[460px]">
          <div className="dish-stage absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-[28px]">
            <StoryPhoto />
          </div>
          <p className="absolute -bottom-8 -left-4 rotate-[-8deg] font-script text-6xl text-salmon md:-left-12 md:text-7xl">Volcano Hill</p>
        </div>
      </div>
    </section>
  );
}

function StoryPhoto() {
  const img = aiPhotos.includes("volcano-hill") ? "ai/volcano-hill" : "volcano-hill";
  const photo = usePhoto("volcano-hill", img);
  return (
    <div className="story-photo absolute inset-0">
      <DishImg photo={photo} alt="Volcano Hill — a tower of nori rolls with shrimp tempura and spicy sauce" pad="px-6 pt-16" />
    </div>
  );
}
