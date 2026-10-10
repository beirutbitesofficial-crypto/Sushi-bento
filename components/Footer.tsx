import { site } from "@/lib/site";
import { LogoMark } from "./Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-5 pb-28 pt-16 md:px-12 md:pb-10 md:pt-24">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-5">
          <LogoMark className="h-16 w-16 md:h-24 md:w-24" />
          <p className="font-sans text-[12vw] font-extralight uppercase leading-none tracking-[0.12em] md:text-[6vw]">
            <span className="text-salmon">Sushi</span> Bento
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-[0.35em] text-rice/70">
            {[
              ["Menu", "#menu"],
              ["Signatures", "#signatures"],
              ["Our story", "#story"],
              ["Visit", "#visit"],
            ].map(([l, h]) => (
              <li key={l}>
                <a href={h} className="inline-flex min-h-11 items-center hover:text-salmon">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-dashed border-rice/15 pt-6 text-[11px] uppercase tracking-[0.35em] text-rice/45">
        <span>
          © {site.name} · {site.area}, {site.city}
        </span>
        <span className="font-jp text-base tracking-[0.5em] text-rice/30">寿司 弁当</span>
      </div>
    </footer>
  );
}
