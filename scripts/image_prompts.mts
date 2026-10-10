/**
 * Writes one AI food-photography prompt per menu item → docs/image-prompts.md + docs/image-prompts.csv
 * Run: npx tsx scripts/image_prompts.mts
 *
 * Every prompt shares the same studio look so the menu reads as one shoot:
 * pure black background, matte black plate, warm side light, 3/4 angle, no text.
 */
import { writeFileSync } from "node:fs";
import { type Category, type Item, menu } from "../lib/menu";

const STYLE =
  "professional studio food photography for a high-end Japanese restaurant menu, isolated on a pure black background, " +
  "dramatic warm soft key light from the left with a subtle orange rim light, glossy natural highlights, " +
  "45-degree three-quarter angle, shallow depth of field, ultra sharp focus on the food, photorealistic, 8k detail, " +
  "centered composition with empty black space around the dish, no text, no logo, no hands, no props";

const lower = (s?: string) =>
  s ? s.replace(/\.$/, "").replace(/\bour (signature |special )?/g, "a signature ").replace(/^./, (c) => c.toLowerCase()) : "";

function subject(cat: Category, item: Item): string {
  const d = lower(item.desc);
  switch (cat.id) {
    case "starters":
      return `${item.name}${d ? `: ${d}` : ""}, served on a small matte black ceramic plate`;
    case "signatures":
      return item.id === "volcano-hill"
        ? `"Volcano Hill": a tall stacked tower of nori-wrapped sushi roll pieces filled with shrimp tempura, crab, cucumber and avocado, drizzled with spicy orange mayo and teriyaki, topped with a whole shrimp tempura, chives and sesame, on a black slate`
        : `${item.name}: ${d}, elegantly plated on a long matte black rectangular plate`;
    case "salads":
      return `${item.name}: ${d}, in a white shallow ceramic bowl`;
    case "hot":
      return `${item.name} (${lower(item.group)}): ${d}, served hot with light steam rising, in a matte black ceramic bowl or plate`;
    case "sashimi":
      return `one single slice of fresh ${item.name.toLowerCase()} sashimi, glistening and perfectly cut, on a small matte black stone plate with a tiny shiso leaf`;
    case "sushi":
      return `one single ${item.name.toLowerCase()} nigiri sushi: hand-pressed seasoned rice topped with fresh ${item.name.toLowerCase()}, on a small matte black stone plate`;
    case "hoso":
      return `two pieces of ${item.name.toLowerCase()} hosomaki (thin sushi roll with nori seaweed outside)${d ? `, filling: ${d}` : ""}, cut side facing the camera showing the filling, on a small matte black plate`;
    case "ura":
    case "crispy":
    case "special":
      return `four pieces of the "${item.name}" ${cat.id === "crispy" ? "crispy tempura-fried uramaki" : "uramaki (inside-out sushi roll)"}: ${d}, two pieces standing showing the cross-section of the filling and two lying showing the outside, on a matte black rectangular plate`;
    case "bento-specials":
      return `"${item.name}" signature sushi plate: ${d}, a row of pieces artfully plated with sauce drizzles on a long matte black rectangular plate`;
    case "dragons":
      return `"${item.name}" dragon sushi roll, eight pieces in a long curving line like a dragon: ${d}, on a long white rectangular plate with sauce zigzags`;
    case "gunkan":
      return `one single ${item.name.toLowerCase()} gunkan maki (battleship sushi: rice wrapped in a band of nori, topped with ${item.desc ? lower(item.desc) : item.name.toLowerCase()}), with a small green bamboo leaf garnish`;
    case "temaki":
      return `one ${item.name.toLowerCase()} temaki hand roll (cone of crisp nori filled with sushi rice and ${item.variants?.map((v) => v.label.toLowerCase()).join(" or ") ?? item.name.toLowerCase()}), lying on its side with a small green bamboo leaf`;
    case "poke":
      return `${item.name}: a black bowl of sushi rice topped with ${item.name.replace(/ Poke$/, "").toLowerCase()} in the center, surrounded by shredded carrots, avocado cubes, mango cubes, red cabbage and edamame, drizzled with creamy dressing and sesame, shot from above`;
    case "sets":
      return `"${item.name}" sushi bento set of ${item.pieces} pieces neatly arranged in a black lacquer bento box with red interior: ${item.contents?.join(", ")}`;
    case "boats":
      return `"${item.name}" — a large wooden sushi boat platter with ${item.pieces} pieces of assorted sushi, maki rolls, nigiri and sashimi, garnished with carved vegetable flowers and green leaves`;
    case "desserts":
      return item.id === "mochi"
        ? `an assortment of colorful Japanese mochi ice cream balls (chocolate mint, mango coconut, tiramisu, cookies and cream, chocolate banana, blueberry yogurt), dusted with powder, on a matte black plate`
        : `${item.name}, an elegant restaurant dessert plated on a matte black plate`;
    case "drinks":
      return {
        "soft-drink": "an ice-cold unbranded soda can and a tall glass of cola with ice and condensation droplets",
        "ice-tea": "a tall glass of peach iced tea with ice cubes and a slice of peach, condensation droplets",
        water: "a clear glass bottle of still mineral water next to a glass of water, condensation droplets, no label",
        tea: "a Japanese ceramic cup of hot green tea with gentle steam rising, next to a small cast-iron teapot",
        espresso: "a small espresso cup with rich crema on a saucer",
      }[item.id]!;
    default:
      return `${item.name}${d ? `: ${d}` : ""}`;
  }
}

const rows = menu.flatMap((cat) => cat.items.map((item) => ({ cat, item, file: `${item.id}.png`, prompt: `${subject(cat, item)}. ${STYLE}.` })));

const md = [
  "# Sushi Bento — AI photo prompts",
  "",
  `${rows.length} prompts, one per menu item. Same style for all of them so the menu looks like one photoshoot.`,
  "",
  "**How to use**",
  "1. Generate each image (Midjourney, Ideogram, ChatGPT/DALL·E, Flux…), **square 1:1**. Midjourney: add `--ar 1:1 --style raw --v 7`.",
  "2. Save it with the exact file name shown (e.g. `california.png`) into the `ai-images/` folder.",
  "3. Run `python3 scripts/use_ai_images.py` — it converts them and the site uses them automatically instead of the old photos.",
  "",
  "Tip: AI can get rolls slightly wrong — compare with the real dish before publishing.",
  "",
  ...menu.flatMap((cat) => [
    `## ${cat.title}`,
    "",
    ...rows
      .filter((r) => r.cat.id === cat.id)
      .flatMap((r) => [`**${r.item.name}** → \`${r.file}\``, "", "```", r.prompt, "```", ""]),
  ]),
].join("\n");

const csv = ["category,item,file,prompt", ...rows.map((r) => [r.cat.title, r.item.name, r.file, r.prompt].map((v) => `"${v.replace(/"/g, '""')}"`).join(","))].join("\n");

writeFileSync(new URL("../docs/image-prompts.md", import.meta.url), md);
writeFileSync(new URL("../docs/image-prompts.csv", import.meta.url), csv);
console.log(`${rows.length} prompts → docs/image-prompts.md, docs/image-prompts.csv`);
