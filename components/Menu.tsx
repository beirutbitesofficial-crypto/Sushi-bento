"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type Category, type Item, menu, money } from "@/lib/menu";
import AddButton from "./AddButton";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function priceLabel(item: Item) {
  if (!item.variants) return money(item.price);
  const ps = item.variants.map((v) => v.price);
  const lo = Math.min(...ps);
  const hi = Math.max(...ps);
  return lo === hi ? money(lo) : `${money(lo)} – ${money(hi)}`;
}

function Tag({ tag }: { tag?: Item["tag"] }) {
  if (!tag) return null;
  const color = tag === "Spicy" ? "bg-[#C42F45] text-rice" : tag === "Chef's pick" ? "bg-salmon text-ink" : "bg-rice/10 text-rice/80";
  return <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${color}`}>{tag}</span>;
}

function PhotoCard({ item }: { item: Item }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] bg-ink-2 ring-1 ring-rice/5 transition-colors hover:ring-salmon/30">
      <div className="dish-stage relative grid aspect-[4/3] place-items-center overflow-hidden">
        {item.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/menu/${item.img}.webp`} alt={item.name} loading="lazy" className="dish relative h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.06]" />
        ) : (
          <span className="font-script text-5xl text-salmon/30">{item.name}</span>
        )}
        <div className="absolute left-3 top-3">
          <Tag tag={item.tag} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-serif text-xl leading-tight">{item.name}</h4>
          <span className="shrink-0 font-serif text-lg text-salmon">{priceLabel(item)}</span>
        </div>
        {item.desc && <p className="text-[13px] leading-relaxed text-rice/55">{item.desc}</p>}
        <div className="mt-auto pt-3">
          <AddButton item={item} />
        </div>
      </div>
    </article>
  );
}

function ListRow({ item }: { item: Item }) {
  return (
    <li className="flex flex-col gap-3 border-b border-dashed border-rice/10 py-5 sm:flex-row sm:items-center sm:gap-6">
      {item.img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/menu/${item.img}.webp`} alt="" loading="lazy" className="hidden h-16 w-16 shrink-0 rounded-2xl bg-black object-contain p-1 sm:block" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h4 className="font-serif text-lg leading-tight md:text-xl">{item.name}</h4>
          <span className="mb-1 hidden flex-1 border-b border-dotted border-rice/20 sm:block" aria-hidden="true" />
          <span className="ml-auto shrink-0 font-serif text-lg text-salmon sm:ml-0">{priceLabel(item)}</span>
        </div>
        {item.desc && <p className="mt-1 text-[13px] leading-relaxed text-rice/55">{item.desc}</p>}
        {item.options && <p className="mt-1 text-[12px] text-rice/40">{item.options.join(" · ")}</p>}
      </div>
      <AddButton item={item} className="self-start sm:self-center" />
    </li>
  );
}

function PlatterCard({ item }: { item: Item }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[26px] bg-rice text-ink">
      {item.img && (
        <div className="dish-stage grid aspect-[16/9] place-items-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/menu/${item.img}.webp`} alt={item.name} loading="lazy" className="dish relative h-full w-full object-contain p-4" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-serif text-2xl leading-tight">{item.name}</h4>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-salmon-deep">{item.pieces} pieces</p>
          </div>
          <span className="font-serif text-3xl text-salmon-deep">{money(item.price)}</span>
        </div>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {item.contents?.map((c) => (
            <li key={c} className="rounded-full bg-ink/[0.06] px-2.5 py-1 text-[12px] text-ink/75">
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <AddButton item={item} tone="light" />
        </div>
      </div>
    </article>
  );
}

function CategoryBlock({ cat, items }: { cat: Category; items: Item[] }) {
  const groups = useMemo(() => {
    const g: { name?: string; items: Item[] }[] = [];
    items.forEach((it) => {
      const last = g[g.length - 1];
      if (last && last.name === it.group) last.items.push(it);
      else g.push({ name: it.group, items: [it] });
    });
    return g;
  }, [items]);

  return (
    <section id={`cat-${cat.id}`} data-cat={cat.id} className="scroll-mt-36 pt-16 md:pt-24">
      <header className="mb-8 flex items-end gap-5 md:mb-10">
        {cat.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/menu/${cat.cover}.webp`} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-full bg-black object-contain p-1.5 ring-2 ring-salmon/40 md:h-20 md:w-20" />
        )}
        <div className="min-w-0">
          <p className="font-script text-3xl leading-none text-salmon md:text-4xl">{cat.script}</p>
          <h3 className="font-serif text-4xl leading-tight md:text-5xl">{cat.title}</h3>
          {cat.note && <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-rice/45">{cat.note}</p>}
        </div>
      </header>

      {cat.layout === "photo" && (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <PhotoCard key={it.id} item={it} />
          ))}
        </div>
      )}

      {cat.layout === "platter" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((it) => (
            <PlatterCard key={it.id} item={it} />
          ))}
        </div>
      )}

      {(cat.layout === "list" || !cat.layout) && (
        <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {groups.map((g, i) => (
              <div key={i} className={i ? "mt-8" : ""}>
                {g.name && <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-salmon">{g.name}</p>}
                <ul>
                  {g.items.map((it) => (
                    <ListRow key={it.id} item={it} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {cat.cover && (
            <div className="dish-stage sticky top-40 hidden aspect-square self-start overflow-hidden rounded-[28px] lg:grid lg:place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/menu/${cat.cover}.webp`} alt="" loading="lazy" className="dish relative h-full w-full object-contain p-6" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default function Menu() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(menu[0].id);
  const bar = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return menu.map((c) => ({ cat: c, items: c.items }));
    return menu
      .map((c) => ({
        cat: c,
        items: c.items.filter((i) => norm([i.name, i.desc, i.group, c.title, ...(i.options ?? []), ...(i.contents ?? [])].join(" ")).includes(q)),
      }))
      .filter((x) => x.items.length);
  }, [query]);

  // Highlight the category in view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-cat]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.cat!);
        });
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  // Keep the active chip visible in the bar.
  useEffect(() => {
    const chip = bar.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!chip || !bar.current) return;
    const b = bar.current;
    b.scrollTo({ left: chip.offsetLeft - b.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <section id="menu" className="relative bg-ink px-5 pb-32 pt-28 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-salmon">Order online</p>
            <h2 className="mt-4 font-serif text-[16vw] leading-[0.95] md:text-[7vw]">
              The <em className="text-salmon">Menu</em>
            </h2>
          </div>
          <label className="relative block w-full md:w-96">
            <span className="sr-only">Search the menu</span>
            <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rice/40" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search salmon, dragon, spicy…"
              className="min-h-12 w-full rounded-full border border-rice/15 bg-ink-2 pl-11 pr-5 text-sm text-rice placeholder:text-rice/35 focus:border-salmon/60 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Sticky category bar */}
      <div className="sticky top-0 z-30 -mx-5 mt-10 border-b border-rice/10 bg-ink/85 backdrop-blur-md md:-mx-12">
        <div ref={bar} className="no-scrollbar mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-5 py-3 md:px-12">
          {filtered.map(({ cat }) => (
            <a
              key={cat.id}
              data-chip={cat.id}
              href={`#cat-${cat.id}`}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                active === cat.id ? "bg-salmon text-ink" : "text-rice/60 hover:text-rice"
              }`}
            >
              {cat.title}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        {filtered.length === 0 && (
          <p className="py-24 text-center font-serif text-2xl text-rice/60">
            Nothing matches “{query}”. <button type="button" className="text-salmon underline" onClick={() => setQuery("")}>Clear search</button>
          </p>
        )}
        {filtered.map(({ cat, items }) => (
          <CategoryBlock key={cat.id} cat={cat} items={items} />
        ))}
      </div>
    </section>
  );
}
