# Sushi Bento — website

Cinematic one-page site + full online menu for **Sushi Bento** (Hlaliyeh, Saida).
Next.js (App Router) · React · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger. Same stack and style as BASST CUT / 24i.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production (Vercel deploys it automatically on push)
```

## Before going live — fill these in `lib/site.ts`

| Field | What |
| --- | --- |
| `whatsapp` | Number that receives orders, digits only with country code (e.g. `9613123456`). Empty = the customer picks the chat. |
| `phone` | Shown as a "Call" button. Empty hides it. |
| `instagram` | Full Instagram URL. Empty hides it. |
| `directionsUrl` | Google Maps link to the shop. |
| `preview` | `true` = hidden from Google (noindex). Set to `false` when the client approves and the site goes live. |

## Structure

| File | What it does |
| --- | --- |
| `components/Hero.tsx` | Intro: the logo assembles like a maki (nori → rice → salmon), letter reveals, parallax |
| `components/RollScene.tsx` | Pinned, scroll-scrubbed scene: rice on nori → rolled → yanagiba makes 7 cuts → pieces turn to face you (one is the logo) → packed in a bento box. Timeline map at the top of the file. Turns 90° on portrait phones. |
| `components/Story.tsx` | Scrubbed word reveal + numbers |
| `components/Signatures.tsx` | Desktop: pinned horizontal track. Mobile: swipe carousel |
| `components/Menu.tsx` | Full menu — sticky category bar, search, photo cards / price lists / platters |
| `components/Cart.tsx` | Floating cart + drawer → order sent as a pre-filled WhatsApp message |
| `lib/menu.ts` | **The menu** — every item, price and photo. Edit here. |
| `scripts/crop_images.py` | Cuts the dish photos out of the current menu pages into `public/menu/` |

Menu and photos come from the printed menu on sushibento.gravitymenu.site (34 pages).
One price to confirm: **Chef Special Roll** — the page says 7$ but a 10$ label is printed on the photo; the site uses 10$.

## AI photos (optional)

`docs/image-prompts.md` has one professional food-photo prompt per item (175), all in the same black-background style
(regenerate with `npx tsx scripts/image_prompts.mts`). Generate them in ChatGPT (one prompt per message, same chat for a consistent look), save as `ai-images/<id>.png`,
then run `python3 scripts/use_ai_images.py` — the site swaps those items to the new photos.

## Admin panel — `/admin`

Phone-friendly page to change any dish photo: choose from the photo library, drag to position, zoom, "fill frame" / "show whole",
and "restore original". Changes show on the live menu within seconds — no redeploy.

One-time setup on Vercel (project → …):
1. **Storage → Create → Blob** → connect it to this project (adds `BLOB_READ_WRITE_TOKEN` automatically).
2. **Settings → Environment Variables** → `ADMIN_PASSWORD` = a password of 6+ characters.
3. **Deployments → ⋯ → Redeploy**.

Photos are resized in the browser (max 1600px) and stored in Vercel Blob; the settings live in `config/photos.json` there.
Local testing: `LOCAL_STORAGE=1 ADMIN_PASSWORD=test1234 npm run build && npm start` (stores in `.data/`).

The site is no longer a plain static export (the admin needs a server): deploy on Vercel, or any Node host with `npm run build && npm start`.
