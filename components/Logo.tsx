/** The Sushi Bento mark: a maki cross-section — nori ring, rice, salmon. */
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <rect className="logo-nori" x="4" y="4" width="92" height="92" rx="30" fill="#45191A" />
      <rect className="logo-rice" x="12.5" y="12.5" width="75" height="75" rx="23" fill="#FFFDF9" />
      <rect className="logo-salmon" x="29" y="29" width="42" height="42" rx="13" fill="#F4773B" />
    </svg>
  );
}

export function Wordmark({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`font-sans font-light uppercase tracking-[0.18em] ${className}`}>
      <span className="text-salmon">Sushi</span> <span className={dark ? "text-nori" : "text-rice"}>Bento</span>
    </span>
  );
}

export default function Logo({ className = "", markClass = "h-9 w-9" }: { className?: string; markClass?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className={markClass} />
      <Wordmark className="text-sm" />
    </span>
  );
}
