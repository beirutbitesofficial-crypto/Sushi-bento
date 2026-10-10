/**
 * Sushi Bento menu — transcribed from the printed menu on sushibento.gravitymenu.site.
 * Prices in USD. Photos are cut from the same menu pages by scripts/crop_images.py.
 *
 * Edit freely: add `soldOut: true` to hide the add button, change a price, add an item.
 */

import { aiPhotos } from "./ai-photos";

export type Variant = { label: string; price: number };

export type Item = {
  id: string;
  name: string;
  desc?: string;
  price: number;
  /** /menu/<img>.webp */
  img?: string;
  /** Sub-heading inside a category (e.g. "Teppanyaki"). */
  group?: string;
  /** Pick one of these when adding (flavours, sizes without a price change). */
  options?: string[];
  /** Different prices per size. Overrides `price`. */
  variants?: Variant[];
  /** Contents list for sets & boats. */
  contents?: string[];
  pieces?: number;
  tag?: "Chef's pick" | "New" | "Spicy" | "Sharing";
  soldOut?: boolean;
};

export type Category = {
  id: string;
  title: string;
  /** Handwritten subtitle, like on the printed menu. */
  script: string;
  note?: string;
  /** Cover photo for the category header. */
  cover?: string;
  layout?: "photo" | "list" | "platter";
  items: Item[];
};

const roll = (id: string, name: string, desc: string, price: number, img: string | undefined = id): Item => ({
  id,
  name,
  desc,
  price,
  img,
});

export const menu: Category[] = [
  {
    id: "starters",
    title: "Starters",
    script: "to begin",
    cover: "dynamite-shrimps",
    layout: "photo",
    items: [
      { id: "edamame", name: "Edamame", desc: "Steamed and salted — or tossed spicy.", price: 5, img: "edamame", options: ["Classic", "Spicy"] },
      { id: "shrimp-dumplings", name: "Shrimp Dumplings", desc: "4 pieces, steamed in bamboo.", price: 8, img: "shrimp-dumplings" },
      { id: "dynamite-shrimps", name: "Dynamite Shrimps", desc: "Crispy shrimps in creamy dynamite sauce.", price: 10.5, img: "dynamite-shrimps", tag: "Spicy" },
      { id: "chilli-shrimps", name: "Chilli Shrimps", desc: "Seared shrimps in sweet chilli glaze.", price: 12, img: "chilli-shrimps", tag: "Spicy" },
      { id: "shrimp-tempura", name: "Shrimp Tempura", desc: "4 pieces, with sweet chilli dip.", price: 10, img: "shrimp-tempura" },
      { id: "spring-rolls", name: "Spring Rolls", desc: "2 pieces, with sweet chilli dip.", price: 4, img: "spring-rolls" },
      { id: "prawn-crackers", name: "Prawn Crackers", desc: "Light, airy, made for sharing.", price: 5, img: "prawn-crackers" },
      { id: "dynamite-chicken", name: "Dynamite Chicken", desc: "Crispy chicken bites in dynamite sauce.", price: 10, img: "dynamite-chicken", tag: "Spicy" },
    ],
  },
  {
    id: "signatures",
    title: "Bento Signatures",
    script: "sashimi & tartars",
    cover: "tatuna",
    layout: "photo",
    items: [
      {
        id: "hazels-salmon",
        name: "Hazel's Salmon",
        desc: "Salmon sashimi with our special sauce.",
        price: 16.5,
        img: "hazels-salmon",
        variants: [
          { label: "Large", price: 16.5 },
          { label: "Small", price: 9 },
        ],
        tag: "Chef's pick",
      },
      { id: "tatuna", name: "TaTuna", desc: "Tuna sashimi with our special sauce.", price: 18.5, img: "tatuna", tag: "Chef's pick" },
      { id: "scallopos", name: "Scallopos", desc: "Scallops sashimi with our special sauce.", price: 22, img: "scallopos" },
      { id: "sweet-tuna", name: "Sweet Tuna", desc: "Tuna tartar, avocado, dressed with our signature sauce.", price: 16, img: "sweet-tuna" },
      { id: "salmon-tartar", name: "Salmon Tartar", desc: "Salmon, avocado, dressed with our signature sauce.", price: 16, img: "salmon-tartar" },
      {
        id: "volcano-hill",
        name: "Volcano Hill",
        desc: "Shrimp tempura, crab, cucumber, avocado, spicy sauce, wrapped with nori and topped with spicy sauce, teriyaki, chives and sesame.",
        price: 10,
        img: "volcano-hill",
        tag: "Chef's pick",
      },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    script: "fresh & bright",
    cover: "salad-sashimi",
    layout: "photo",
    items: [
      { id: "salad-sashimi", name: "Sashimi Salad", desc: "Salmon and tuna sashimi over lemon.", price: 16, img: "salad-sashimi" },
      { id: "salad-crazy", name: "Crazy Salad", desc: "Shredded crab, cucumber, carrots, crispy and ebiko.", price: 10, img: "salad-crazy" },
      { id: "salad-marinated-salmon", name: "Marinated Salmon", desc: "Marinated salmon, crispy, ebiko, iceberg.", price: 14.5, img: "salad-marinated-salmon" },
      { id: "salad-seaweed", name: "Seaweed Salad", desc: "Wakame, sesame, lemon.", price: 8, img: "salad-seaweed" },
      { id: "salad-smoked-salmon", name: "Smoked Salmon", desc: "Smoked salmon roses over lemon.", price: 19, img: "salad-smoked-salmon" },
      { id: "salad-exotic", name: "Exotic Salad", desc: "Crab, mango, avocado, carrots.", price: 12, img: "salad-exotic" },
      { id: "salad-marinated-tuna", name: "Marinated Tuna", desc: "Marinated tuna, crispy, ebiko, iceberg.", price: 16, img: "salad-marinated-tuna" },
    ],
  },
  {
    id: "hot",
    title: "Hot Dishes",
    script: "from the wok",
    cover: "tep-seafood",
    layout: "list",
    items: [
      { id: "miso-soup", group: "Soup", name: "Miso Soup", desc: "Tofu cubes, wakame, spring onions.", price: 6.5 },
      { id: "seafood-soup", group: "Soup", name: "Seafood Soup", desc: "Salmon, tuna, white fish, octopus and shrimp.", price: 10.5 },
      { id: "fried-rice-shrimps", group: "Fried Rice", name: "Fried Rice with Shrimps", desc: "White rice fried with soy sauce, vegetables and shrimps.", price: 8 },
      { id: "fried-rice-veg", group: "Fried Rice", name: "Fried Rice with Vegetables", desc: "White rice fried with soy sauce, vegetables and eggs.", price: 6 },
      { id: "tep-veg", group: "Teppanyaki", name: "Vegetables Teppanyaki", desc: "Grilled vegetables with soy sauce and lemon.", price: 7.5 },
      { id: "tep-chicken", group: "Teppanyaki", name: "Chicken Teppanyaki", desc: "Grilled chicken with vegetables, soy sauce and lemon.", price: 10.5 },
      { id: "tep-beef", group: "Teppanyaki", name: "Beef Teppanyaki", desc: "Grilled beef with vegetables, soy sauce and lemon.", price: 12.5 },
      { id: "tep-seafood", group: "Teppanyaki", name: "Seafood Teppanyaki", desc: "Grilled tuna, salmon, white fish, shrimp with vegetables, soy sauce and lemon.", price: 15 },
      { id: "oyster-chicken", group: "Oyster Sauce", name: "Oyster Chicken", desc: "With grilled vegetables and steamed rice.", price: 15 },
      { id: "oyster-beef", group: "Oyster Sauce", name: "Oyster Beef", desc: "With grilled vegetables and steamed rice.", price: 16 },
      { id: "oyster-shrimp", group: "Oyster Sauce", name: "Oyster Shrimp", desc: "With grilled vegetables and steamed rice.", price: 18 },
      { id: "egg-noodles", group: "Noodles", name: "Egg Noodles", desc: "Egg noodles with grilled vegetables.", price: 8.5 },
      { id: "yaki-udon", group: "Noodles", name: "Yaki-Udon", desc: "Noodles with chicken.", price: 13.5 },
      { id: "yaki-soba", group: "Noodles", name: "Yaki-Soba", desc: "Noodles with shrimps, broccoli, cauliflower, baby corn and mixed bell peppers.", price: 15, img: "yaki-soba" },
      { id: "chicken-teriyaki", group: "Mains", name: "Chicken Teriyaki", desc: "Crispy chicken with teriyaki sauce and rice.", price: 15 },
      { id: "shrimps-teriyaki", group: "Mains", name: "Shrimps Teriyaki", desc: "Crispy shrimps with teriyaki sauce and rice.", price: 18 },
      { id: "mongolian-beef", group: "Mains", name: "Mongolian Beef", desc: "Crispy beef with our special Mongolian sauce, vegetables and rice.", price: 16 },
      { id: "mongolian-chicken", group: "Mains", name: "Mongolian Chicken", desc: "Crispy chicken with our special Mongolian sauce, vegetables and rice.", price: 14.5 },
      { id: "grilled-salmon", group: "Mains", name: "Grilled Salmon", desc: "150g grilled salmon, steamed broccoli and cauliflower, lemon sauce.", price: 18, img: "grilled-salmon" },
    ],
  },
  {
    id: "sashimi",
    title: "Sashimi",
    script: "just the fish",
    note: "1 piece per order",
    cover: "sashimi-tuna",
    layout: "photo",
    items: [
      { id: "sashimi-salmon", name: "Salmon", price: 2.5 },
      { id: "sashimi-tuna", name: "Tuna", price: 3 },
      { id: "sashimi-white-fish", name: "White Fish", price: 3 },
      { id: "sashimi-scallops", name: "Scallops", price: 3.5 },
      { id: "sashimi-shrimps", name: "Shrimps", price: 2 },
      { id: "sashimi-octopus", name: "Octopus", price: 2 },
      { id: "sashimi-crab", name: "Crab", price: 1.5 },
    ],
  },
  {
    id: "sushi",
    title: "Sushi",
    script: "nigiri",
    note: "1 piece per order",
    cover: "sushi-salmon",
    layout: "list",
    items: [
      { id: "sushi-salmon", name: "Salmon", price: 2.75 },
      { id: "sushi-tuna", name: "Tuna", price: 3.25 },
      { id: "sushi-white-fish", name: "White Fish", price: 3.25 },
      { id: "sushi-scallops", name: "Scallops", price: 3.75 },
      { id: "sushi-shrimp", name: "Shrimp", price: 2.25 },
      { id: "sushi-octopus", name: "Octopus", price: 2.25 },
      { id: "sushi-crab", name: "Crab", price: 1.5 },
    ],
  },
  {
    id: "hoso",
    title: "Hoso Maki",
    script: "thin rolls",
    note: "2 pieces per order",
    layout: "list",
    items: [
      { id: "hoso-kappa", name: "Kappa", desc: "Cucumber.", price: 1.5 },
      { id: "hoso-avocado", name: "Avocado", price: 2.5 },
      { id: "hoso-crab", name: "Crab", price: 2.5 },
      { id: "hoso-salmon", name: "Salmon", price: 3 },
      { id: "hoso-tuna", name: "Tuna", price: 3 },
      { id: "hoso-spicy-shrimp", name: "Spicy Shrimp", price: 3 },
      { id: "hoso-spicy-salmon", name: "Spicy Salmon", price: 3.5 },
      { id: "hoso-spicy-tuna", name: "Spicy Tuna", price: 3.5 },
      { id: "hoso-funky", name: "Funky", price: 3.5 },
    ],
  },
  {
    id: "ura",
    title: "Ura Maki",
    script: "inside out",
    note: "4 pieces per order",
    cover: "rainbow",
    layout: "photo",
    items: [
      roll("special-california", "Special California", "Crab sticks, avocado, cucumber with ebiko wrap.", 6),
      roll("california", "California", "Crab sticks, avocado, cucumber with sesame seeds wrap.", 5),
      roll("crazy", "Crazy", "Crazy filling with sesame seeds wrap.", 5.5),
      roll("alaska", "Alaska", "Fried crab, ebiko, avocado with cheese wrap.", 8),
      roll("naked", "Naked", "Salmon, avocado with ebiko wrap.", 8),
      roll("volcano", "Volcano", "Salmon, tuna, white fish, shrimps with ebiko wrap and spicy dressing.", 8),
      roll("grilled-ura", "Grilled Ura", "Spicy shrimp, avocado, grilled salmon wrap topped with teriyaki sauce and sesame.", 8),
      roll("flying", "Flying", "Crazy filling with salmon wrap.", 8),
      roll("funky-ura", "Funky Ura", "Salmon, tuna, white fish, cucumber, avocado with salmon wrap.", 8),
      roll("wild-geisha", "Wild Geisha", "Avocado, cheese, onion, lemon pulp wrapped with smoked salmon.", 7.5),
      roll("rainbow", "Rainbow", "Volcano filling wrapped with salmon, tuna and avocado.", 8),
      roll("geisha", "Geisha", "Volcano filling wrapped with avocado.", 8),
      roll("temptation", "Temptation", "Salmon, crab wrapped with avocado.", 7.5),
      roll("shrimp-wrap", "Shrimp Wrap", "Spicy salmon, avocado, shredded crab wrapped with shrimp.", 8),
      roll("kim", "Kim", "Salmon skin, avocado, spicy, wrapped with shrimp.", 8),
      roll("rich", "Rich", "Spicy salmon, crispy powder wrapped with nori.", 7),
      roll("hot-spicy", "Hot & Spicy", "Spicy shrimp, avocado, wrapped with ebiko, shredded crab and togarashi.", 7.5),
      roll("crab-wrap", "Crab Wrap", "Smoked salmon, philly cheese, shrimp, avocado, wrapped with crab.", 7),
    ],
  },
  {
    id: "crispy",
    title: "Crispy Wrap",
    script: "golden & crunchy",
    note: "4 pieces per order",
    cover: "crispy-california",
    layout: "photo",
    items: [
      roll("crispy-spicy-salmon", "Crispy Spicy Salmon", "Crab sticks, avocado, cucumber.", 6.5),
      roll("crispy-california", "Crispy California", "Crab sticks, avocado, cucumber.", 5),
      roll("crispy-crazy", "Crispy Crazy", "Crazy filling.", 5.5),
      roll("philly", "Philly", "Smoked salmon, philly cheese and avocado.", 6.5),
      roll("wamaki", "Wamaki", "Spicy mix of tuna, salmon, shrimp and white fish.", 7),
      roll("crispy-spicy-shrimp", "Crispy Spicy Shrimp", "Spicy shrimp.", 6.5),
      roll("spicy-tuna-crispy", "Spicy Tuna", "Spicy tuna.", 7),
      roll("shrimp-tempura-roll", "Shrimp Tempura", "Shrimp tempura, ebiko.", 6.5),
    ],
  },
  {
    id: "special",
    title: "Special Maki",
    script: "the house rolls",
    note: "4 pieces per order",
    cover: "passion-rainbow",
    layout: "photo",
    items: [
      roll("bluefin", "Bluefin", "Tuna, cucumber, creamy spicy sauce, wrapped with tuna, avocado and topped with cheese, chives and black sesame.", 8),
      roll("green-paradise", "Green Paradise", "Salmon, crabsticks, cucumber, creamy spicy sauce, wrapped with avocado, topped with creamy spicy sauce and black sesame.", 6.5),
      roll("fried-maki", "Fried Maki", "Tempura, crazy mix, avocado, wrapped with crispy, and topped with sweet sauce.", 6),
      roll("salmon-philly", "Salmon Philly", "Philadelphia cheese, wrapped with salmon and topped with rocca.", 10),
      roll("glory-roll", "Glory Roll", "Shrimp tempura, avocado, cucumber, creamy spicy sauce, wrapped with salmon, topped with creamy spicy sauce and ebiko.", 6.5),
      roll("mango-paradise", "Mango Paradise", "Cucumber, avocado, green apple, wrapped with mango, topped with spicy sauce, edamame and black sesame.", 6),
      roll("passion-rainbow", "Passion Rainbow", "Salmon, cucumber, avocado, spicy sauce wrapped with tuna, salmon, shrimp, white fish, topped with spicy sauce and black sesame.", 8),
      roll("dynamite", "Dynamite", "Salmon, crispy, creamy spicy sauce wrapped with avocado, topped with creamy spicy sauce, black sesame, ikura and layu oil.", 7),
      roll("mango-wrap", "Mango Wrap", "Salmon, cheese, avocado wrapped with mango.", 7),
      roll("flying-spirit", "Flying Spirit", "White fish, cucumber, avocado wrapped with salmon.", 9),
      roll("naked-eyeroll", "Naked Eyeroll", "Smoked salmon, crab, avocado, cheese wrapped with crab.", 7.5),
      roll("chef-special", "Chef Special Roll", "Spicy shrimps, avocado wrapped with crispy and spicy grilled salmon.", 10),
      roll("smoky", "Smoky", "Avocado, eel, shrimp tempura, grilled fish wrapped with smoked salmon.", 8),
      roll("zamorai", "Zamorai", "Tempura, crispy, ebiko, wrapped with avocado and topped with sweet sauce.", 6.5),
      roll("kanji", "Kanji", "Shrimp tempura, ebiko wrapped with avocado and eel, topped with teriyaki sauce.", 8),
      roll("summer-wrap", "Summer Wrap", "Spicy shrimp wrapped with avocado and iceberg.", 7),
      roll("exotic-makki", "Exotic Makki", "Crazy filling, cucumber, mango, pineapple wrapped with mango and crab.", 8),
      roll("nori-wrap", "Nori Wrap", "Tuna, avocado, cheese, wrapped with nori powder and topped with cheese.", 8),
      roll("maguro", "Maguro", "Crazy filling, togarashi, cucumber, wrapped with tuna.", 8),
      roll("tazuna", "Tazuna", "Crazy filling wrapped with salmon, tuna and avocado.", 8),
      roll("sasuki", "Sasuki", "Spicy tuna and crispy, wrapped with salmon and avocado.", 7),
      roll("green-gem", "Green Gem", "Grilled tuna, young corn wrapped with boiled broccoli.", 7),
      roll("tokyo-roll", "Tokyo Roll", "Crab sticks, avocado, cucumber, ginger, wrapped with scallop, ebiko and spicy sauce.", 9.5),
      roll("phantom", "Phantom", "Tuna, avocado, cheese, wrapped with mango, topped with cheese and ikura.", 8),
      roll("fire-engine", "Fire Engine", "Shrimp tempura, cucumber, creamy spicy sauce, wrapped with tuna and black ebiko.", 7.5),
      roll("ashmoon", "Ashmoon", "Salmon, avocado, wrapped with togarashi and ebiko.", 6.5),
      roll("sidon", "Sidon", "Salmon, avocado wrapped with crab and avocado.", 6.5),
      roll("zireh", "Zireh", "Crab, avocado, wrapped with mango, and topped with creamy mango.", 6.5),
      roll("lobster-roll", "Lobster Roll", "Crab, cucumber, spicy sauce, wrapped with black and white sesame, topped with lobster, mayo, ebiko and teriyaki sauce.", 8),
      roll("yakusa-roll", "Yakusa Roll", "White fish, salmon, wrapped with tuna, white fish, cucumber and ceviche sauce.", 7),
      roll("naked-salmon", "Naked Salmon", "Mango wrapped with salmon, topped with salmon, mango and special sweet sauce.", 8),
      roll("ginger-roll", "Ginger Roll", "Tuna, cucumber, carrots, crab, wrapped with ginger.", 7),
      roll("shogan-special", "Shogan", "Crazy filling, avocado, wrapped with tuna, shrimp and cucumber.", 7),
      roll("caramelized-salmon", "Caramelized Salmon", "Salmon, cucumber, creamy spicy sauce, wrapped with salmon and topped with creamy spicy sauce and ebiko.", 9),
      roll("wild-crispy-special", "Wild Crispy", "Crazy filling, togarashi, wrapped with crispy and topped with salmon.", 7.5),
      roll("pineapple-roll", "Pineapple Roll", "Salmon, pineapple, cheese, wrapped with crispy.", 7),
      roll("lava-wrap", "Lava Wrap", "Salmon, avocado, cheese, wrapped with togarashi, ebiko and shredded crab.", 7),
    ],
  },
  {
    id: "bento-specials",
    title: "Bento Specials",
    script: "plated",
    cover: "cherry-blossom",
    layout: "photo",
    items: [
      roll("flames", "Flames", "Torched salmon sushi topped with our special sauce and ebiko.", 10),
      roll("wild-crispy", "Wild Crispy", "Crazy, togarashi, wrapped with crispy and topped with salmon.", 7),
      roll("tropical", "Tropical", "Crab, avocado topped with our special marinated shrimps.", 9.5),
      roll("cherry-blossom", "Cherry Blossom", "Crab, avocado, cucumber, wrapped with tuna and topped with spicy sauce, crazy mix and corn.", 7),
      roll("salmon-crunch", "Salmon Crunch", "California filling, special sauce, topped with crunchy salmon.", 9),
      roll("new-york-roll", "New York Roll", "Shrimp tempura, avocado, cheese, eel wrapped with sesame and topped with sweet sauce.", 8.5),
      roll("ohayo", "Ohayo", "Shrimp tempura, ebiko, cucumber, avocado wrapped with eel, smoked salmon, sweet mayo.", 8),
      roll("shogan", "Shogan Plate", "Crab, avocado, wrapped with tuna, cucumber and shrimps.", 9),
      roll("masago-roll", "Masago Roll", "Salmon, cheese, avocado, wrapped with salmon and topped with creamy spicy sauce, ikura and masago.", 8),
    ],
  },
  {
    id: "dragons",
    title: "Dragons",
    script: "eight pieces long",
    note: "8 pieces per order",
    cover: "dragon",
    layout: "photo",
    items: [
      { id: "bento-dragon", name: "Bento Dragon", desc: "Shrimp tempura, ebiko and avocado, wrapped with eel and avocado, topped with our signature spicy sauces.", price: 18, img: "dragon", tag: "Chef's pick" },
      { id: "wild-dragon", name: "Wild Dragon", desc: "Shrimp tempura, ebiko and avocado, wrapped with salmon and avocado, topped with our signature spicy sauces.", price: 18 },
      { id: "rocket-dragon", name: "Rocket Dragon", desc: "Shrimp tempura, ebiko and avocado, wrapped with avocado, topped with dynamite sauce.", price: 17 },
      { id: "virgin-dragon", name: "Virgin Dragon", desc: "Shrimp tempura, crazy mix, cream cheese, wrapped with mango and avocado, topped with our special bento sauce.", price: 15 },
    ],
  },
  {
    id: "gunkan",
    title: "Gunkan",
    script: "battleship",
    note: "1 piece per order",
    cover: "gunkan-ikura",
    layout: "photo",
    items: [
      { id: "gunkan-ikura", name: "Ikura", desc: "Salmon roe.", price: 4.5, img: "gunkan-ikura" },
      { id: "gunkan-spicy-salmon", name: "Spicy Salmon", price: 3.5, img: "gunkan-spicy-salmon" },
      { id: "gunkan-ebico", name: "Ebiko", desc: "Shrimp roe.", price: 3.5, img: "gunkan-ebico" },
      { id: "gunkan-crazy", name: "Crazy", price: 3, img: "gunkan-crazy" },
      { id: "gunkan-spicy-tuna", name: "Spicy Tuna", price: 3.5 },
      { id: "gunkan-scallop", name: "Scallop", price: 4.5 },
    ],
  },
  {
    id: "temaki",
    title: "Temaki",
    script: "hand rolls",
    note: "1 piece per order — or make your own",
    cover: "temaki-salmon",
    layout: "photo",
    items: [
      { id: "temaki-salmon", name: "Salmon", price: 5.5, img: "temaki-salmon", variants: [
        { label: "Salmon", price: 5.5 },
        { label: "Grilled Salmon", price: 5.5 },
        { label: "Spicy Salmon", price: 5 },
        { label: "Salmon Skin", price: 4.5 },
      ] },
      { id: "temaki-shrimp", name: "Shrimp", price: 5, img: "temaki-shrimp", variants: [
        { label: "Spicy Shrimp", price: 5 },
        { label: "Shrimp Tempura", price: 5.5 },
      ] },
      { id: "temaki-crab", name: "Crab", price: 4, img: "temaki-crab", variants: [
        { label: "California", price: 4 },
        { label: "Crazy", price: 4.5 },
      ] },
      { id: "temaki-scallops", name: "Scallops", price: 7, img: "temaki-scallops", variants: [
        { label: "Scallops", price: 7 },
        { label: "Spicy Scallops", price: 7 },
      ] },
      { id: "temaki-tuna", name: "Tuna", price: 5.5, img: "temaki-tuna", variants: [
        { label: "Spicy Tuna", price: 5.5 },
        { label: "Grilled Tuna", price: 5.5 },
      ] },
    ],
  },
  {
    id: "poke",
    title: "Poke Bowl",
    script: "make your own",
    note: "Rice, shredded carrots, avocado, mango, red cabbage, edamame and our special dressing",
    cover: "poke",
    layout: "list",
    items: [
      { id: "poke-salmon", name: "Marinated Salmon Poke", price: 15, img: "poke" },
      { id: "poke-tuna", name: "Marinated Tuna Poke", price: 15 },
      { id: "poke-shrimp", name: "Shrimp Poke", price: 13 },
      { id: "poke-crab", name: "Crazy Crab Poke", price: 13 },
    ],
  },
  {
    id: "sets",
    title: "Sets",
    script: "bento boxes",
    cover: "sushi-board",
    layout: "platter",
    items: [
      { id: "set-soft", name: "Soft Bento", pieces: 16, price: 16.5, contents: ["4 × California", "4 × Crazy", "3 × Kappa Hoso", "3 × Avocado Hoso", "2 × Crab Sushi"] },
      { id: "set-xpress", name: "Xpress Maki Bento", pieces: 18, price: 24.5, contents: ["4 × California", "4 × Crazy", "4 × Philly", "3 × Salmon Hoso", "3 × Crab Hoso"] },
      { id: "set-chilli", name: "Chilli Bento", pieces: 16, price: 26.5, tag: "Spicy", contents: ["4 × Wamaki", "4 × Volcano", "3 × Spicy Salmon Hoso", "3 × Spicy Shrimp Hoso", "2 × Salmon Sushi"] },
      { id: "set-crunchy", name: "Crunchy Bento", pieces: 20, price: 27.5, contents: ["4 × Crispy California", "4 × Crispy Crazy", "4 × Crispy Philly", "4 × Crispy Spicy Shrimp", "4 × Crispy Spicy Salmon"] },
      { id: "set-salmon", name: "Salmon Bento", pieces: 18, price: 28.5, contents: ["4 × Flying", "4 × Philly", "3 × Salmon Hoso", "3 × Spicy Salmon Hoso", "2 × Salmon Sashimi", "2 × Salmon Sushi"] },
      { id: "set-royal", name: "Royal Bento", pieces: 26, price: 33, contents: ["3 × Mango Wrap", "3 × Chef Special Roll", "3 × Summer Wrap", "3 × Naked Eyed Roll", "3 × Salmon Hoso", "3 × Crispy Crazy", "1 × Shrimp Sushi", "1 × Salmon Sashimi", "2 × Salmon Sushi", "4 × Flying"] },
      { id: "set-funky", name: "Funky Bento", pieces: 23, price: 36.5, contents: ["4 × Funky Ura", "4 × Volcano", "4 × Geisha", "4 × Philly", "4 × Wamaki", "3 × Funky Hoso"] },
      { id: "set-premium", name: "Premium Bento", pieces: 23, price: 39, contents: ["Rich", "Wild Geisha", "Temptation", "3 × Exotic Maki", "3 × Zamorai", "3 × Hoso Salmon", "2 × Alaska"] },
      { id: "set-emperor", name: "Emperor Bento", pieces: 50, price: 75, tag: "Sharing", contents: ["4 × Special California", "4 × California", "4 × Crazy", "4 × Funky Ura", "4 × Naked", "3 × Tuna Sushi", "3 × Salmon Sushi", "3 × Crab Sushi", "3 × Salmon Sashimi", "3 × White Fish Sashimi", "3 × Crispy Spicy Shrimp", "3 × Ozaka", "3 × Salmon Hoso", "3 × Sidon", "3 × Shrimp Hoso"] },
    ],
  },
  {
    id: "boats",
    title: "Boats",
    script: "for the whole table",
    cover: "boat-big",
    layout: "platter",
    items: [
      { id: "boat-mini", name: "Mini Boat", pieces: 35, price: 55, img: "boat-mini", tag: "Sharing", contents: ["4 × Special California", "4 × Shrimp Wrap", "4 × Geisha", "3 × Shrimp Hoso", "3 × Tokyo", "3 × Smoky", "3 × Tazuna", "2 × Hot & Spicy", "2 × Salmon Sashimi", "2 × Salmon Sushi", "2 × Zireh", "1 × Scallop Sushi", "1 × Tuna Sushi", "1 × Crab Sushi"] },
      { id: "boat-medium", name: "Medium Boat", pieces: 75, price: 105, img: "boat-medium", tag: "Sharing", contents: ["6 × Kim", "6 × Sea Roll", "6 × Crab Hoso", "6 × Wild Crispy", "6 × Ashmoon", "4 × Tuna Hoso", "4 × Salmon Hoso", "4 × Tuna Sashimi", "4 × Salmon Sashimi", "4 × Salmon Sushi", "4 × Tuna Sushi", "4 × Shrimp Sushi", "4 × Nori Naked", "4 × Ohayo", "4 × Shogan", "3 × White Fish Sashimi", "2 × Mackerel Sashimi"] },
      { id: "boat-big", name: "Big Boat", pieces: 120, price: 165, img: "boat-big", tag: "Sharing", contents: ["8 × California", "8 × Volcano", "8 × Flying", "8 × Shrimp Wrap", "8 × Salmon Sushi", "8 × Tuna Sushi", "8 × Crab Sushi", "8 × Crazy", "8 × Salmon Sashimi", "6 × Kappa Hoso", "6 × Avocado Hoso", "6 × Funky Hoso", "6 × Crab Hoso", "6 × Salmon Hoso", "6 × Tuna Hoso", "6 × Tuna Sashimi", "6 × Crab Sashimi"] },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    script: "something sweet",
    layout: "list",
    items: [
      { id: "creme-brulee", name: "Crème Brûlée", price: 10 },
      { id: "fondant", name: "Fondant au Chocolat", price: 10 },
      { id: "brownies", name: "Brownies with Ice Cream", price: 10 },
      { id: "mochi", name: "Mochi", desc: "Pick a flavour.", price: 5, options: ["Chocolate Mint", "Mango Coconut", "Tiramisu", "Cookies and Cream", "Chocolate Banana", "Blueberry Yogurt"] },
    ],
  },
  {
    id: "drinks",
    title: "Beverages",
    script: "to drink",
    layout: "list",
    items: [
      { id: "soft-drink", name: "Soft Drink", price: 2.5, options: ["Pepsi", "Diet Pepsi", "7up", "Diet 7up", "Mirinda"] },
      { id: "ice-tea", name: "Lipton Ice Tea", price: 2.5, options: ["Peach", "Diet Peach", "Red Fruits"] },
      { id: "water", name: "Water", price: 1.5, variants: [
        { label: "Small", price: 1.5 },
        { label: "Large", price: 3 },
      ] },
      { id: "tea", name: "Tea", price: 3 },
      { id: "espresso", name: "Espresso", price: 3 },
    ],
  },
];

// AI-generated photos (scripts/use_ai_images.py) replace the menu-page cut-outs when present.
for (const c of menu) {
  for (const i of c.items) if (aiPhotos.includes(i.id)) i.img = `ai/${i.id}`;
  if (c.cover && aiPhotos.includes(c.cover)) c.cover = `ai/${c.cover}`;
}

export const allItems = menu.flatMap((c) => c.items.map((i) => ({ ...i, category: c.id })));
export const itemCount = allItems.reduce((n, i) => n + (i.variants?.length ?? 1), 0);

export function findItem(id: string) {
  return allItems.find((i) => i.id === id);
}

export const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")}`;

/** Hero dishes for the horizontal "signatures" track. */
export const showcase = ["volcano-hill", "tatuna", "hazels-salmon", "bento-dragon", "salmon-tartar", "scallopos", "flames", "boat-big"];
