"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import { LogoMark } from "./Logo";
import { SplitChars } from "./SplitText";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ, (context) => {
        const { desktop, reduced } = context.conditions as Record<keyof typeof MQ, boolean>;
        if (reduced) {
          gsap.set(q(".hero-reveal"), { autoAlpha: 1 });
          return;
        }

        // ---- Intro on load: the mark assembles like a maki being rolled ----
        const intro = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
        intro
          .set(q(".hero-reveal"), { autoAlpha: 1 })
          .fromTo(q(".hero-bg"), { scale: 1.25, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.8 }, 0)
          .fromTo(q(".hero-mark .logo-nori"), { scale: 0, rotate: -90, transformOrigin: "50% 50%" }, { scale: 1, rotate: 0, duration: 1.4, ease: "back.out(1.4)" }, 0.3)
          .fromTo(q(".hero-mark .logo-rice"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 1.1, ease: "back.out(1.6)" }, 0.55)
          .fromTo(q(".hero-mark .logo-salmon"), { scale: 0, rotate: 45, transformOrigin: "50% 50%" }, { scale: 1, rotate: 0, duration: 1.1, ease: "back.out(2)" }, 0.75)
          .fromTo(q(".hero-title .char"), { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.045 }, 0.9)
          .fromTo(q(".hero-script"), { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "power2.inOut" }, 1.5)
          .fromTo(q(".hero-loc"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 1.7)
          .fromTo(q(".hero-cta"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.08 }, 1.9)
          .fromTo(q(".hero-corner"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" }, 2.0);

        // ---- Scroll out: copy lifts away, backdrop drifts slower ----
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
          .to(q(".hero-content"), { yPercent: -25, autoAlpha: 0 }, 0)
          .to(q(".hero-bg-inner"), { yPercent: 16, scale: 1.08 }, 0)
          .to(q(".hero-chrome"), { autoAlpha: 0, duration: 0.3 }, 0);

        if (desktop) {
          const layers = [
            { el: q(".hero-bg-inner")[0], depth: 18 },
            { el: q(".hero-mark")[0], depth: -12 },
          ].map(({ el, depth }) => ({
            depth,
            x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
          }));
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => (l.x(nx * l.depth), l.y(ny * l.depth)));
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => window.removeEventListener("pointermove", onMove);
        }
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative h-screen-s min-h-[560px] w-full overflow-hidden bg-ink" aria-label="Sushi Bento — Achrafieh, Beirut">
      {/* Backdrop: their own TaTuna shot, pushed into the dark */}
      <div className="hero-bg hero-reveal invisible-pre absolute inset-0">
        <div
          className="hero-bg-inner absolute -inset-[6%] bg-cover bg-center opacity-45 will-change-transform md:bg-[position:70%_40%]"
          style={{ backgroundImage: "url(/menu/tatuna.webp)" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 45% 40% at 50% 42%, rgba(244,119,59,0.18), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 vignette" aria-hidden="true" />

      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-5 pt-10 text-center">
        <h1 className="sr-only">Sushi Bento — sushi rolled by hand in Achrafieh, Beirut since 2001</h1>
        <LogoMark className="hero-mark hero-reveal invisible-pre w-[min(30vw,17svh)] drop-shadow-[0_20px_60px_rgba(244,119,59,0.35)] md:w-[min(13vw,19vh)]" />

        <div className="relative mt-7 md:mt-9" aria-hidden="true">
          <p className="hero-title hero-reveal invisible-pre whitespace-nowrap font-sans text-[10.5vw] font-extralight uppercase leading-none tracking-[0.1em] md:text-[7.2vw] md:tracking-[0.14em]">
            <SplitChars text="Sushi" className="text-salmon" />
            <span className="inline-block w-[0.35em]" />
            <SplitChars text="Bento" />
          </p>
          <p className="hero-script hero-reveal invisible-pre pointer-events-none absolute -bottom-[0.95em] right-[-2%] rotate-[-6deg] font-script text-[11vw] leading-none text-salmon/90 md:text-[5.4vw]">
            since {site.since}
          </p>
        </div>

        <p className="hero-loc hero-reveal invisible-pre mt-16 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.5em] text-rice/75 md:mt-20 md:text-xs">
          <span className="h-px w-8 bg-salmon/70 md:w-12" />
          {site.area}, {site.city}
          <span className="h-px w-8 bg-salmon/70 md:w-12" />
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#menu" className="hero-cta hero-reveal invisible-pre inline-flex min-h-12 items-center gap-3 rounded-full bg-salmon px-7 text-xs font-bold uppercase tracking-[0.28em] text-ink transition-transform hover:-translate-y-0.5">
            Order now
            <svg className="h-3 w-5" viewBox="0 0 24 12" fill="none" aria-hidden="true">
              <path d="M0 6 H22 M17 1 L22 6 L17 11" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </a>
          <a href="#craft" className="hero-cta hero-reveal invisible-pre inline-flex min-h-12 items-center rounded-full border border-rice/25 px-7 text-xs font-semibold uppercase tracking-[0.28em] text-rice/85 transition-colors hover:border-rice/60">
            Watch us roll
          </a>
        </div>
      </div>

      <div className="hero-chrome pointer-events-none absolute inset-0 z-10">
        <div className="hero-corner hero-reveal invisible-pre absolute left-5 top-1/2 hidden -translate-y-1/2 font-jp text-2xl leading-[1.6] text-rice/30 [writing-mode:vertical-rl] md:left-10 md:block">
          寿司 弁当
        </div>
        <div className="hero-corner hero-reveal invisible-pre absolute right-5 top-1/2 hidden -translate-y-1/2 text-[11px] uppercase tracking-[0.5em] text-rice/40 [writing-mode:vertical-rl] md:right-10 md:block">
          Est. {site.since} — {site.city}
        </div>
        <div className="hero-corner hero-reveal invisible-pre absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-8">
          <span className="text-[11px] uppercase tracking-[0.5em] text-rice/55">Scroll</span>
          <span className="relative block h-10 w-px overflow-hidden bg-rice/15">
            <span className="scroll-tick absolute inset-x-0 top-0 h-1/2 bg-salmon" />
          </span>
        </div>
      </div>
    </section>
  );
}
