"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/*
 * THE ROLL — pinned, scroll-scrubbed (timeline seconds; scrolling back reverses it exactly)
 *  0.0 – 1.0   rice falls onto the nori, on the bamboo mat
 *  0.9 – 1.6   salmon, avocado, cucumber are laid in
 *  1.6 – 2.6   the mat rolls it up → one long maki on the board
 *  2.7 – 7.6   the yanagiba makes seven cuts
 *  7.6 – 8.3   eight pieces separate
 *  8.3 – 9.4   each piece turns to face us (piece 4 is the Sushi Bento logo)
 *  9.4 – 11.2  a lacquer bento box draws in, the pieces land in it
 * 11.2 – 12.0  hold
 */

const N = 8;
const ROLL = { x: 300, y: 520, w: 1000, h: 170 };
const PW = ROLL.w / N;
const CY = ROLL.y + ROLL.h / 2;
const FACE = 140;
const SPREAD = 34;
const cellX = (c: number) => 515 + 190 * c;
const cellY = (r: number) => 355 + 190 * r;
const T_CUT0 = 3.1;
const T_CUT = 0.6;

// Deterministic rice grains on the nori sheet.
const GRAINS = (() => {
  let s = 2001;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 110 }, () => ({
    x: 380 + rnd() * 840,
    y: 358 + rnd() * 224,
    r: rnd() * 180,
  }));
})();

/** Side view of one piece; the two end pieces get the roll's rounded ends. */
function sidePath(i: number) {
  const x0 = ROLL.x + PW * i;
  const x1 = x0 + PW;
  const { y, h } = ROLL;
  const r = 34;
  if (i === 0) return `M${x0 + r} ${y}H${x1}V${y + h}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x0 + r} ${y}Z`;
  if (i === N - 1) return `M${x0} ${y}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x1 - r} ${y + h}H${x0}Z`;
  return `M${x0} ${y}H${x1}V${y + h}H${x0}Z`;
}

type Filling = (s: number) => React.ReactNode;

/** Cross-section fillings — index 3 is exactly the logo. */
const FILLINGS: { label: string; draw: Filling }[] = [
  {
    label: "California",
    draw: (s) => (
      <>
        <rect x={-s * 0.2} y={-s * 0.17} width={s * 0.22} height={s * 0.34} rx={s * 0.05} fill="#F6F0E6" />
        <rect x={-s * 0.2} y={-s * 0.17} width={s * 0.22} height={s * 0.08} rx={s * 0.03} fill="#E2563B" />
        <rect x={s * 0.04} y={-s * 0.15} width={s * 0.16} height={s * 0.16} rx={s * 0.04} fill="#A9C46C" />
        <rect x={s * 0.05} y={s * 0.04} width={s * 0.13} height={s * 0.12} rx={s * 0.03} fill="#5E9440" />
      </>
    ),
  },
  { label: "Avocado", draw: (s) => <path d={`M${-s * 0.2} ${s * 0.16} Q0 ${-s * 0.34} ${s * 0.2} ${s * 0.16} Z`} fill="#A9C46C" stroke="#6E8F37" strokeWidth={s * 0.025} /> },
  { label: "Tuna", draw: (s) => <rect x={-s * 0.18} y={-s * 0.18} width={s * 0.36} height={s * 0.36} rx={s * 0.08} fill="#C42F45" /> },
  { label: "Salmon", draw: (s) => <rect x={-s * 0.228} y={-s * 0.228} width={s * 0.456} height={s * 0.456} rx={s * 0.14} fill="#F4773B" /> },
  {
    label: "Kappa",
    draw: (s) => (
      <>
        {[
          [-0.13, -0.13],
          [0.02, -0.14],
          [-0.12, 0.02],
          [0.03, 0.03],
        ].map(([x, y], i) => (
          <rect key={i} x={x * s} y={y * s} width={s * 0.12} height={s * 0.12} rx={s * 0.025} fill={i % 2 ? "#7FB255" : "#5E9440"} />
        ))}
      </>
    ),
  },
  {
    label: "Spicy salmon",
    draw: (s) => (
      <>
        <circle r={s * 0.21} fill="#EA6A3A" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={Math.cos(i) * s * 0.1} cy={Math.sin(i * 1.7) * s * 0.1} r={s * 0.03} fill="#B8321E" />
        ))}
      </>
    ),
  },
  {
    label: "Naked",
    draw: (s) => (
      <>
        <rect x={-s * 0.2} y={-s * 0.18} width={s * 0.2} height={s * 0.36} rx={s * 0.06} fill="#F4773B" />
        <rect x={s * 0.01} y={-s * 0.18} width={s * 0.19} height={s * 0.36} rx={s * 0.06} fill="#A9C46C" />
      </>
    ),
  },
  {
    label: "Funky",
    draw: (s) => (
      <>
        <rect x={-s * 0.2} y={-s * 0.2} width={s * 0.2} height={s * 0.2} rx={s * 0.05} fill="#C42F45" />
        <rect x={0} y={-s * 0.2} width={s * 0.2} height={s * 0.2} rx={s * 0.05} fill="#F4773B" />
        <rect x={-s * 0.2} y={0} width={s * 0.2} height={s * 0.2} rx={s * 0.05} fill="#F3EEE4" />
        <rect x={0} y={0} width={s * 0.2} height={s * 0.2} rx={s * 0.05} fill="#A9C46C" />
      </>
    ),
  },
];

function Face({ i }: { i: number }) {
  const s = FACE;
  return (
    <g>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={s * 0.3} fill="#45191A" />
      <rect x={-s * 0.415} y={-s * 0.415} width={s * 0.83} height={s * 0.83} rx={s * 0.23} fill="#FFFDF9" />
      {/* rice texture */}
      <g fill="#E9E1D3">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => {
          const a = (k / 10) * Math.PI * 2 + i;
          return <ellipse key={k} cx={Math.cos(a) * s * 0.33} cy={Math.sin(a) * s * 0.33} rx={s * 0.035} ry={s * 0.018} transform={`rotate(${k * 37} ${Math.cos(a) * s * 0.33} ${Math.sin(a) * s * 0.33})`} />;
        })}
      </g>
      {FILLINGS[i].draw(s)}
    </g>
  );
}

export default function RollScene() {
  const root = useRef<HTMLElement>(null);
  // Portrait phones get the same scene turned 90°: the roll runs down the screen.
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const on = () => setVertical(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const pieces = q(".piece");
      const sides = q(".piece-side");
      const faces = q(".piece-face");
      const cuts = q(".cut-line");

      const finalState = () => {
        gsap.set(q(".flat, .board, .knife, .cut-line"), { autoAlpha: 0 });
        gsap.set(sides, { scaleX: 0 });
        gsap.set(faces, { scaleX: 1 });
        gsap.set(q(".box"), { autoAlpha: 1, scale: 1 });
        gsap.set(q(".cell"), { autoAlpha: 1 });
        pieces.forEach((p, i) => gsap.set(p, { x: cellX(i % 4) - (ROLL.x + PW * i + PW / 2), y: cellY(Math.floor(i / 4)) - CY }));
        gsap.set(q(".cap"), { autoAlpha: 1 });
      };

      mm.add(MQ, (ctx) => {
        const { reduced, mobile } = ctx.conditions as Record<keyof typeof MQ, boolean>;
        if (reduced) {
          finalState();
          gsap.set(q(".cap"), { autoAlpha: 0 });
          gsap.set(q(".cap-3"), { autoAlpha: 1 });
          return;
        }

        // ---- initial state ----
        gsap.set(q(".grain-dot"), { y: -90, autoAlpha: 0 });
        gsap.set(q(".rice-bed"), { autoAlpha: 0 });
        gsap.set(q(".filling"), { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(q(".flat"), { autoAlpha: 1, scaleY: 1, y: 0, transformOrigin: "50% 100%" });
        gsap.set(sides, { scaleY: 0, scaleX: 1, transformOrigin: "50% 100%" });
        gsap.set(faces, { scaleX: 0, transformOrigin: "50% 50%" });
        gsap.set(cuts, { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(q(".knife"), { x: 1500, y: -420, rotate: -8, autoAlpha: 1, transformOrigin: "0% 100%" });
        gsap.set(q(".box"), { autoAlpha: 0, scale: 0.92, transformOrigin: "50% 50%" });
        gsap.set(q(".cell"), { autoAlpha: 0 });
        gsap.set(q(".board"), { autoAlpha: 1 });
        gsap.set(q(".cap"), { autoAlpha: 0, y: 24 });
        gsap.set(q(".cap-1"), { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: mobile ? "+=320%" : "+=380%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        const cap = (n: number, t: number) => {
          tl.to(q(".cap"), { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" }, t);
          tl.fromTo(q(`.cap-${n}`), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, t + 0.3);
        };

        // 1 — rice & fillings
        tl.to(q(".rice-bed"), { autoAlpha: 1, duration: 0.6 }, 0.2)
          .to(q(".grain-dot"), { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.in", stagger: { each: 0.006, from: "random" } }, 0)
          .to(q(".filling"), { scaleX: 1, duration: 0.55, ease: "power2.out", stagger: 0.12 }, 0.9);

        // roll it up
        tl.to(q(".mat-slats"), { scaleY: 0.9, transformOrigin: "50% 100%", duration: 0.3 }, 1.6)
          .to(q(".flat"), { scaleY: 0.04, y: 60, duration: 0.8, ease: "power3.in" }, 1.7)
          .to(q(".flat"), { autoAlpha: 0, duration: 0.2 }, 2.4)
          .to(sides, { scaleY: 1, duration: 0.7, ease: "back.out(1.6)" }, 2.0)
          .fromTo(q(".roll-sheen"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 2.2);

        // 2 — the knife
        cap(2, 2.6);
        const knife = q(".knife");
        const hover = -230;
        tl.to(knife, { x: ROLL.x + PW - 6, y: hover, rotate: -4, duration: 0.45, ease: "power2.out" }, 2.65);
        for (let k = 1; k < N; k++) {
          const t = T_CUT0 + (k - 1) * T_CUT;
          const cx = ROLL.x + PW * k;
          tl.to(knife, { x: cx - 6, duration: 0.14, ease: "power1.inOut" }, t - 0.14)
            .to(knife, { y: 2, x: cx - 12, duration: 0.22, ease: "power2.in" }, t)
            .to(cuts[k - 1], { autoAlpha: 1, scaleY: 1, duration: 0.18, ease: "power1.in" }, t + 0.04)
            .to(knife, { y: hover, x: cx - 6, duration: 0.2, ease: "power2.out" }, t + 0.26);
        }
        tl.to(knife, { x: 1700, y: -500, rotate: 10, duration: 0.5, ease: "power2.in" }, T_CUT0 + (N - 1) * T_CUT);

        // pieces separate
        tl.to(pieces, { x: (i) => (i - (N - 1) / 2) * SPREAD, duration: 0.6, ease: "power2.out" }, 7.6).to(cuts, { autoAlpha: 0, duration: 0.3 }, 7.7);

        // 3 — turn to face
        cap(3, 8.1);
        tl.to(sides, { scaleX: 0, duration: 0.3, ease: "power2.in", stagger: 0.08, transformOrigin: "50% 50%" }, 8.3)
          .to(faces, { scaleX: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.08 }, 8.6)
          .to(q(".board"), { autoAlpha: 0, y: 40, duration: 0.5 }, 9.3);

        // into the box
        tl.to(q(".box"), { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" }, 9.5)
          .to(q(".cell"), { autoAlpha: 1, duration: 0.3, stagger: 0.04 }, 9.7)
          .to(
            pieces,
            {
              x: (i) => cellX(i % 4) - (ROLL.x + PW * i + PW / 2),
              y: (i) => cellY(Math.floor(i / 4)) - CY,
              rotate: 0,
              duration: 0.8,
              ease: "power3.inOut",
              stagger: 0.07,
            },
            9.9
          )
          .fromTo(q(".logo-glow"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 11.1)
          .to({}, { duration: 0.8 }, 11.2);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="craft" className="relative h-screen-l w-full overflow-hidden bg-ink" aria-label="How we make it: rolled, cut and boxed">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 58%, rgba(244,119,59,0.10), transparent 70%)" }} aria-hidden="true" />

      {/* Captions */}
      <div className="absolute inset-x-0 top-[9svh] z-10 px-5 text-center md:top-[8vh]">
        {[
          { n: "01", t: "Rolled by hand", s: "Seasoned rice, fresh fish, one tight roll." },
          { n: "02", t: "Cut to order", s: "Eight even pieces, one clean stroke each." },
          { n: "03", t: "Boxed for you", s: "Every bento packed the same way since 2001." },
        ].map((c, i) => (
          <div key={c.n} className={`cap cap-${i + 1} absolute inset-x-0 ${i === 0 ? "" : "invisible"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-salmon">{c.n} / 03</p>
            <h2 className="mt-3 font-serif text-[9vw] leading-[1.02] md:text-[4.6vw]">{c.t}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-rice/60 md:text-base">{c.s}</p>
          </div>
        ))}
      </div>

      <svg
        className="absolute inset-x-0 top-[23svh] mx-auto h-[74svh] w-full md:top-[22vh] md:h-[78vh]"
        viewBox={vertical ? "500 -140 600 1280" : "150 200 1300 620"}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rs-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C7A06F" />
            <stop offset="1" stopColor="#9B7247" />
          </linearGradient>
          <linearGradient id="rs-nori" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A2A24" />
            <stop offset="0.35" stopColor="#1F1714" />
            <stop offset="1" stopColor="#120D0B" />
          </linearGradient>
          <linearGradient id="rs-steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F2F4F5" />
            <stop offset="0.55" stopColor="#C4CBCF" />
            <stop offset="1" stopColor="#8E979C" />
          </linearGradient>
          <linearGradient id="rs-handle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E3CFAE" />
            <stop offset="1" stopColor="#B99A6E" />
          </linearGradient>
          <radialGradient id="rs-glow">
            <stop offset="0" stopColor="#F4773B" stopOpacity="0.55" />
            <stop offset="1" stopColor="#F4773B" stopOpacity="0" />
          </radialGradient>
          {/* The blade disappears into the roll instead of passing in front of it. */}
          <clipPath id="rs-knife-clip" clipPathUnits="userSpaceOnUse">
            <path clipRule="evenodd" d={`M0 0H1600V900H0Z M${ROLL.x} ${ROLL.y + 6}H${ROLL.x + ROLL.w}V${ROLL.y + ROLL.h}H${ROLL.x}Z`} />
          </clipPath>
        </defs>

        <g transform={vertical ? "rotate(90 800 500)" : undefined}>
        {/* Bento box (drawn first so the pieces land inside it) */}
        <g className="box invisible">
          <rect x="400" y="240" width="800" height="420" rx="26" fill="#0B0908" stroke="#2C2623" strokeWidth="3" />
          <rect x="410" y="250" width="780" height="400" rx="20" fill="none" stroke="#8E2316" strokeOpacity="0.8" strokeWidth="2" />
          <text x="800" y="700" textAnchor="middle" display={vertical ? "none" : undefined} fill="#F7F2EA" fillOpacity="0.4" fontSize="18" letterSpacing="9" className="font-sans">SUSHI BENTO · SINCE 2001</text>
        </g>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} className="cell invisible" x={cellX(i % 4) - 88} y={cellY(Math.floor(i / 4)) - 88} width="176" height="176" rx="16" fill="#5C150D" stroke="#8E2316" strokeWidth="1.5" />
        ))}
        <circle className="logo-glow invisible" cx={cellX(3)} cy={cellY(0)} r="130" fill="url(#rs-glow)" />

        {/* Cutting board */}
        <g className="board">
          <rect x="180" y={ROLL.y + ROLL.h} width="1240" height="66" rx="10" fill="url(#rs-wood)" />
          <g stroke="#8A6440" strokeOpacity=".35" fill="none">
            <path d={`M200 ${ROLL.y + ROLL.h + 20} C 500 ${ROLL.y + ROLL.h + 14}, 900 ${ROLL.y + ROLL.h + 28}, 1400 ${ROLL.y + ROLL.h + 18}`} />
            <path d={`M200 ${ROLL.y + ROLL.h + 42} C 600 ${ROLL.y + ROLL.h + 50}, 1000 ${ROLL.y + ROLL.h + 36}, 1400 ${ROLL.y + ROLL.h + 46}`} />
          </g>
          <rect x="180" y={ROLL.y + ROLL.h + 66} width="1240" height="10" rx="5" fill="#000" fillOpacity=".35" />
        </g>

        {/* Flat assembly on the bamboo mat */}
        <g className="flat">
          <g className="mat-slats">
            <rect x="320" y="300" width="960" height="390" rx="8" fill="#C9B48A" />
            <g stroke="#9E8960" strokeWidth="2">
              {Array.from({ length: 60 }, (_, k) => (
                <line key={k} x1={328 + k * 16} y1="304" x2={328 + k * 16} y2="686" />
              ))}
            </g>
            <line x1="320" y1="380" x2="1280" y2="380" stroke="#6F5D3D" strokeWidth="2" />
            <line x1="320" y1="610" x2="1280" y2="610" stroke="#6F5D3D" strokeWidth="2" />
          </g>
          <rect x="350" y="330" width="900" height="270" rx="4" fill="#1C1A16" />
          <rect className="rice-bed" x="370" y="350" width="860" height="230" rx="10" fill="#FBF7EF" />
          <g fill="#E6DED0">
            {GRAINS.map((g, k) => (
              <ellipse key={k} className="grain-dot" cx={g.x} cy={g.y} rx="7" ry="3.4" transform={`rotate(${g.r} ${g.x} ${g.y})`} />
            ))}
          </g>
          <rect className="filling" x="400" y="436" width="800" height="34" rx="10" fill="#F4773B" />
          <rect className="filling" x="400" y="472" width="800" height="22" rx="8" fill="#A9C46C" />
          <rect className="filling" x="400" y="496" width="800" height="16" rx="6" fill="#5E9440" />
        </g>

        {/* The roll — eight pieces, each with a side view and a face view */}
        {Array.from({ length: N }, (_, i) => {
          const x0 = ROLL.x + PW * i;
          const cx = x0 + PW / 2;
          const first = i === 0;
          const last = i === N - 1;
          return (
            <g key={i} className="piece">
              <g className="piece-side">
                <path d={sidePath(i)} fill="url(#rs-nori)" />
                {/* rice peeking out at the rounded ends */}
                {first && <rect x={x0 + 3} y={ROLL.y + 22} width={8} height={ROLL.h - 44} rx={4} fill="#F3ECDF" fillOpacity=".8" />}
                {last && <rect x={x0 + PW - 11} y={ROLL.y + 22} width={8} height={ROLL.h - 44} rx={4} fill="#F3ECDF" fillOpacity=".8" />}
                <rect className="roll-sheen" x={x0} y={ROLL.y + 18} width={PW} height={10} fill="#fff" fillOpacity=".07" />
                <g stroke="#000" strokeOpacity=".25">
                  <line x1={x0 + 30} y1={ROLL.y + 40} x2={x0 + 70} y2={ROLL.y + 130} />
                  <line x1={x0 + 80} y1={ROLL.y + 30} x2={x0 + 104} y2={ROLL.y + 90} />
                </g>
              </g>
              <g transform={`translate(${cx} ${CY})`}>
                <g className="piece-face">
                  <Face i={i} />
                </g>
              </g>
            </g>
          );
        })}

        {/* Cut lines */}
        {Array.from({ length: N - 1 }, (_, k) => (
          <rect key={k} className="cut-line" x={ROLL.x + PW * (k + 1) - 1.5} y={ROLL.y} width="3" height={ROLL.h} fill="#F7F2EA" fillOpacity=".85" />
        ))}

        {/* Yanagiba — tip down, positioned by its tip */}
        <g clipPath="url(#rs-knife-clip)">
          <g className="knife" style={{ transformBox: "view-box" }}>
            <g transform={`translate(0 ${ROLL.y + ROLL.h})`}>
              <path d="M0 0 C 6 -40, 14 -120, 16 -360 L 64 -360 L 62 -60 C 58 -30, 40 -8, 0 0 Z" fill="url(#rs-steel)" />
              <path d="M16 -360 L 22 -40" stroke="#ffffff" strokeOpacity=".6" strokeWidth="2" />
              <path d="M40 -340 C 44 -240, 46 -120, 30 -30" stroke="#7D868B" strokeOpacity=".5" strokeWidth="1.5" fill="none" />
              <rect x="12" y="-392" width="56" height="34" rx="4" fill="#4A403B" />
              <rect x="12" y="-392" width="56" height="5" rx="2" fill="#fff" fillOpacity=".2" />
              <rect x="14" y="-610" width="52" height="222" rx="12" fill="url(#rs-handle)" />
              <path d="M24 -600 L 24 -400" stroke="#fff" strokeOpacity=".25" strokeWidth="3" />
            </g>
          </g>
        </g>
        </g>
      </svg>

      <p className="sr-only">
        Animation: rice and salmon are laid on nori, rolled up, cut into eight pieces with a yanagiba knife, and packed into a bento box. One of the pieces is the Sushi Bento logo.
      </p>
    </section>
  );
}
