"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type Item, menu } from "@/lib/menu";
import { clamp, type PhotoMap, type PhotoSetting } from "@/lib/photos";
import { DishImg, Plate, resolvePhoto } from "../Dish";
import { LogoMark } from "../Logo";

type Setup = { password: boolean; storage: boolean };

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Something went wrong.");
  return data as T;
}

/** Resize in the browser before upload: max 1600px, WebP (JPEG where the browser can't write WebP). */
async function compress(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, fail) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => fail(new Error("This photo can't be opened. Try a JPG or PNG."));
      i.src = url;
    });
    const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * k);
    canvas.height = Math.round(img.naturalHeight * k);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const as = (type: string, q: number) => new Promise<Blob | null>((ok) => canvas.toBlob(ok, type, q));
    const webp = await as("image/webp", 0.86);
    if (webp && webp.type === "image/webp") return webp;
    const jpg = await as("image/jpeg", 0.88);
    if (!jpg) throw new Error("Couldn't process this photo.");
    return jpg;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function Admin() {
  const [state, setState] = useState<"loading" | "login" | "ready">("loading");
  const [setup, setSetup] = useState<Setup>({ password: true, storage: true });
  const [photos, setPhotos] = useState<PhotoMap>({});
  const [editing, setEditing] = useState<Item | null>(null);

  const load = async () => {
    const s = await api<{ authed: boolean; setup: Setup }>("/api/admin/login/");
    setSetup(s.setup);
    if (!s.authed) return setState("login");
    const p = await api<{ photos: PhotoMap }>("/api/photos/");
    setPhotos(p.photos);
    setState("ready");
  };

  useEffect(() => {
    load().catch(() => setState("login"));
  }, []);

  if (state === "loading") return <Shell><p className="py-24 text-center text-rice/50">Loading…</p></Shell>;

  return (
    <Shell onLogout={state === "ready" ? async () => (await api("/api/admin/login/", { method: "DELETE" }), setState("login")) : undefined}>
      {(!setup.password || !setup.storage) && <SetupNotice setup={setup} />}
      {state === "login" ? (
        <Login onDone={() => load()} disabled={!setup.password} />
      ) : (
        <>
          <PhotoList photos={photos} onPick={setEditing} />
          {editing && <Editor item={editing} current={photos[editing.id]} onClose={() => setEditing(null)} onSaved={(m) => (setPhotos(m), setEditing(null))} />}
        </>
      )}
    </Shell>
  );
}

function Shell({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  return (
    <div className="min-h-screen bg-ink text-rice">
      <header className="sticky top-0 z-30 border-b border-rice/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-3">
            <LogoMark className="h-8 w-8" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rice/70">Admin · Photos</span>
          </a>
          {onLogout && (
            <button type="button" onClick={onLogout} className="min-h-10 rounded-full border border-rice/20 px-4 text-xs uppercase tracking-[0.2em] text-rice/70">
              Log out
            </button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-24">{children}</main>
    </div>
  );
}

function SetupNotice({ setup }: { setup: Setup }) {
  return (
    <div className="mt-6 rounded-2xl border border-salmon/40 bg-salmon/10 p-5 text-sm leading-relaxed">
      <p className="font-semibold text-salmon">Finish setup on Vercel</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-rice/80">
        {!setup.storage && (
          <li>
            Storage: Vercel → project → <b>Storage</b> → <b>Create</b> → <b>Blob</b> → connect it to this project.
          </li>
        )}
        {!setup.password && (
          <li>
            Password: Vercel → project → <b>Settings → Environment Variables</b> → add <code>ADMIN_PASSWORD</code> (6+ characters).
          </li>
        )}
        <li>Then redeploy (Deployments → ⋯ → Redeploy).</li>
      </ul>
    </div>
  );
}

function Login({ onDone, disabled }: { onDone: () => void; disabled: boolean }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mx-auto mt-16 max-w-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr("");
        try {
          await api("/api/admin/login/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
          onDone();
        } catch (e) {
          setErr((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h1 className="font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-rice/55">Manage the menu photos.</p>
      <input
        type="password"
        autoComplete="current-password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Password"
        disabled={disabled}
        className="mt-6 min-h-12 w-full rounded-2xl border border-rice/15 bg-ink-2 px-4 text-base focus:border-salmon/60 focus:outline-none"
      />
      {err && <p className="mt-3 text-sm text-[#FF8A7A]">{err}</p>}
      <button disabled={busy || disabled || !pw} className="mt-4 min-h-12 w-full rounded-full bg-salmon text-xs font-bold uppercase tracking-[0.25em] text-ink disabled:opacity-40">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function PhotoList({ photos, onPick }: { photos: PhotoMap; onPick: (i: Item) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return menu
      .filter((c) => cat === "all" || c.id === cat)
      .map((c) => ({ c, items: c.items.filter((i) => !s || i.name.toLowerCase().includes(s)) }))
      .filter((x) => x.items.length);
  }, [q, cat]);
  const custom = Object.keys(photos).length;

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Menu photos</h1>
          <p className="text-sm text-rice/50">Tap a dish to change or adjust its photo. {custom > 0 && `${custom} customised.`}</p>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search dishes…"
          className="min-h-11 w-full rounded-full border border-rice/15 bg-ink-2 px-4 text-base sm:w-64"
        />
      </div>
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {[{ id: "all", title: "All" }, ...menu].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${cat === c.id ? "bg-salmon text-ink" : "bg-ink-2 text-rice/60"}`}
          >
            {c.title}
          </button>
        ))}
      </div>
      {shown.map(({ c, items }) => (
        <section key={c.id} className="mt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.4em] text-salmon">{c.title}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((it) => {
              const photo = resolvePhoto(it.img, photos[it.id]);
              return (
                <button key={it.id} type="button" onClick={() => onPick(it)} className="overflow-hidden rounded-2xl bg-ink-2 text-left ring-1 ring-rice/5 active:scale-[0.98]">
                  <div className="dish-stage relative aspect-[4/3] overflow-hidden">
                    {photo ? <Plate photo={photo} width="w-[68%]" pad="p-2" /> : <span className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.2em] text-rice/30">No photo</span>}
                    {photos[it.id] && <span className="absolute right-2 top-2 rounded-full bg-salmon px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-ink">Custom</span>}
                  </div>
                  <p className="truncate px-3 py-2.5 text-sm">{it.name}</p>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Editor({ item, current, onClose, onSaved }: { item: Item; current?: PhotoSetting; onClose: () => void; onSaved: (m: PhotoMap) => void }) {
  const [draft, setDraft] = useState<PhotoSetting>({ ...current });
  const [file, setFile] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    if (!file) return;
    return () => URL.revokeObjectURL(file.url);
  }, [file]);

  const preview = resolvePhoto(item.img, { ...draft, src: file?.url ?? draft.src });
  const zoom = draft.zoom ?? 1;
  const x = draft.x ?? 50;
  const y = draft.y ?? 50;
  const fit = preview?.fit ?? "cover";

  const set = (p: Partial<PhotoSetting>) => setDraft((d) => ({ ...d, ...p }));

  const pick = async (f?: File) => {
    if (!f) return;
    setErr("");
    try {
      const blob = await compress(f);
      setFile({ blob, url: URL.createObjectURL(blob) });
      setDraft({ fit: "cover" }); // new photo starts centred
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  // Drag the photo to choose what part shows.
  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x, y };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = frame.current;
    if (!d || !el) return;
    const k = 100 / zoom;
    set({ x: clamp(d.x - ((e.clientX - d.px) / el.clientWidth) * k, 0, 100), y: clamp(d.y - ((e.clientY - d.py) / el.clientHeight) * k, 0, 100) });
  };
  const onUp = () => (drag.current = null);

  const save = async (reset = false) => {
    setBusy(true);
    setErr("");
    try {
      let setting: PhotoSetting | null = reset ? null : { ...draft };
      if (!reset && file) {
        const { url } = await api<{ url: string }>(`/api/admin/upload/?id=${encodeURIComponent(item.id)}`, { method: "POST", headers: { "Content-Type": file.blob.type }, body: file.blob });
        setting = { ...draft, src: url };
      }
      const res = await api<{ photos: PhotoMap }>("/api/admin/photos/", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, setting }) });
      onSaved(res.photos);
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  const slider = "h-11 w-full accent-[#F4773B]";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink" role="dialog" aria-modal="true" aria-label={`Edit photo: ${item.name}`}>
      <header className="flex items-center justify-between border-b border-rice/10 px-4 py-3">
        <button type="button" onClick={onClose} className="min-h-10 px-2 text-sm text-rice/70">
          Cancel
        </button>
        <p className="truncate px-2 font-serif text-lg">{item.name}</p>
        <button type="button" disabled={busy} onClick={() => save()} className="min-h-10 rounded-full bg-salmon px-5 text-xs font-bold uppercase tracking-[0.2em] text-ink disabled:opacity-40">
          {busy ? "Saving…" : "Save"}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-4 py-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-rice/45">Menu photo · drag to position</p>
          <div
            ref={frame}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="plate relative mx-auto aspect-square w-[min(100%,420px)] cursor-grab touch-none overflow-hidden rounded-full bg-black active:cursor-grabbing"
          >
            {preview ? <DishImg photo={preview} eager pad="p-4" /> : <span className="absolute inset-0 grid place-items-center text-sm text-rice/40">No photo yet — choose one below</span>}
          </div>

          <div className="mt-4 flex items-center gap-4">
                        <div className="dish-stage relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-salmon/40">{preview && <DishImg photo={preview} pad="p-1.5" />}</div>
            <p className="text-xs text-rice/45">Small preview: list thumbnail and category icon.</p>
          </div>

          <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => (pick(e.target.files?.[0]), (e.target.value = ""))} />
          <button type="button" onClick={() => input.current?.click()} className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-salmon/60 text-sm font-semibold text-salmon">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <circle cx="9" cy="10" r="2" />
              <path d="M21 16l-5-5-8 8" />
            </svg>
            {file ? "Choose another photo" : "Choose photo from library"}
          </button>

          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-1 rounded-full bg-ink-2 p-1">
              {(["cover", "contain"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => set({ fit: f })}
                  className={`min-h-10 rounded-full text-xs font-bold uppercase tracking-[0.2em] ${fit === f ? "bg-salmon text-ink" : "text-rice/60"}`}
                >
                  {f === "cover" ? "Fill frame" : "Show whole"}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="flex justify-between text-xs uppercase tracking-[0.25em] text-rice/55">
                Zoom <span>{zoom.toFixed(2)}×</span>
              </span>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => set({ zoom: +e.target.value })} className={slider} />
            </label>
            <label className="block">
              <span className="flex justify-between text-xs uppercase tracking-[0.25em] text-rice/55">
                Left ↔ Right <span>{Math.round(x)}%</span>
              </span>
              <input type="range" min={0} max={100} step={0.5} value={x} onChange={(e) => set({ x: +e.target.value })} className={slider} />
            </label>
            <label className="block">
              <span className="flex justify-between text-xs uppercase tracking-[0.25em] text-rice/55">
                Up ↕ Down <span>{Math.round(y)}%</span>
              </span>
              <input type="range" min={0} max={100} step={0.5} value={y} onChange={(e) => set({ y: +e.target.value })} className={slider} />
            </label>
          </div>

          {err && <p className="mt-4 text-sm text-[#FF8A7A]">{err}</p>}

          <div className="mt-8 flex flex-wrap gap-3 border-t border-rice/10 pt-6">
            <button type="button" onClick={() => setDraft({ src: draft.src })} className="min-h-11 rounded-full border border-rice/20 px-5 text-xs uppercase tracking-[0.2em] text-rice/70">
              Reset position
            </button>
            {current && (
              <button type="button" disabled={busy} onClick={() => confirm("Go back to the original photo?") && save(true)} className="min-h-11 rounded-full border border-[#FF8A7A]/40 px-5 text-xs uppercase tracking-[0.2em] text-[#FF8A7A]">
                Restore original
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
