import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./Cart";

export default function Visit() {
  const links = [
    site.whatsapp && { label: "WhatsApp", href: whatsappLink(`Hello ${site.name}!`) },
    site.phone && { label: `Call ${site.phone}`, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.instagram && { label: "Instagram", href: site.instagram },
    { label: "Directions", href: site.directionsUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section id="visit" className="relative overflow-hidden bg-salmon px-5 py-24 text-ink md:px-12 md:py-32">
      <div className="pointer-events-none absolute -right-24 -top-24 font-jp text-[38vw] leading-none text-ink/[0.06] md:text-[24vw]" aria-hidden="true">
        弁当
      </div>
      <div className="relative mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-ink/70">Hungry?</p>
          <h2 className="mt-4 font-serif text-[15vw] leading-[0.92] md:text-[7.5vw]">
            Rolled now,
            <br />
            <em>at your door</em> soon.
          </h2>
          <a href="#menu" className="mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-ink px-8 text-xs font-bold uppercase tracking-[0.28em] text-rice transition-transform hover:-translate-y-0.5">
            <WhatsAppIcon className="h-5 w-5 text-salmon" />
            Start an order
          </a>
        </div>
        <div className="rounded-[32px] bg-ink p-8 text-rice md:p-10">
          <p className="font-script text-4xl text-salmon">find us</p>
          <p className="mt-2 font-serif text-4xl">
            {site.area}, {site.city}
          </p>
          <p className="mt-3 text-sm text-rice/55">Delivery and pickup. Since {site.since}.</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-rice/20 px-5 text-xs font-semibold uppercase tracking-[0.22em] transition-colors hover:border-salmon hover:text-salmon">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
