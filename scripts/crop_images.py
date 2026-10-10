"""Cut dish photos out of Sushi Bento's existing menu pages (sushibento.gravitymenu.site).

Coordinates are in the page's "preview" frame: the page scaled to fit 1100x1500.
Run:  python3 scripts/crop_images.py   ->  public/menu/<id>.webp
"""
import os
import urllib.request
from PIL import Image

BASE = "https://sushibento.gravitymenu.site/wp-content/uploads/"
PAGES = {
    1: "2026/07/1001816645-1-scaled.jpg", 2: "2026/07/1001816647-scaled.jpg",
    3: "2026/07/1001816646-scaled.jpg", 4: "2026/07/1001816644-scaled.jpg",
    5: "2024/07/IMG-20240726-WA0148.jpg", 8: "2026/07/IMG_1911.jpg", 9: "2026/07/IMG_1912.jpg",
    10: "2023/11/7.jpeg", 11: "2023/11/8.jpeg", 12: "2023/11/9.jpeg",
    13: "2026/07/IMG-20260727-WA0070.jpg", 14: "2026/07/IMG-20260727-WA0073.jpg",
    15: "2026/07/IMG-20260727-WA0071.jpg", 16: "2023/11/14.jpg",
    17: "2026/07/IMG-20260728-WA0172.jpg", 18: "2026/07/IMG-20260728-WA0174.jpg",
    19: "2026/07/IMG-20260728-WA0176.jpg", 20: "2026/07/IMG-20260728-WA0171.jpg",
    21: "2023/11/18.jpeg", 22: "2024/09/IMG-20240830-WA0246.jpg", 23: "2024/09/IMG-20240830-WA0247.jpg",
    24: "2026/07/IMG-20260728-WA0170.jpg", 25: "2024/07/IMG-20240726-WA0155.jpg",
    26: "2023/11/19.jpeg", 27: "2026/07/IMG-20260727-WA0072.jpg", 28: "2023/11/21.jpg",
    31: "2026/07/IMG-20260728-WA0169.jpg", 32: "2026/07/IMG-20260728-WA0168.jpg",
}

# id: (page, x0, y0, x1, y1, max_long_side)
CROPS = {
    # Starters
    "edamame": (1, 150, 175, 390, 385, 520), "shrimp-dumplings": (1, 600, 165, 940, 385, 520),
    "dynamite-shrimps": (1, 140, 495, 410, 720, 520), "chilli-shrimps": (1, 675, 485, 935, 725, 520),
    "shrimp-tempura": (1, 140, 855, 440, 1040, 520), "spring-rolls": (1, 640, 855, 940, 1040, 520),
    "prawn-crackers": (1, 140, 1165, 405, 1400, 520), "dynamite-chicken": (1, 635, 1190, 940, 1370, 520),
    # Signatures (large)
    "hazels-salmon": (2, 320, 170, 740, 1345, 1400), "tatuna": (3, 0, 110, 700, 850, 1400),
    "scallopos": (3, 90, 560, 760, 1420, 1400), "sweet-tuna": (5, 60, 150, 640, 660, 1200),
    "salmon-tartar": (5, 330, 830, 810, 1265, 1200), "volcano-hill": (21, 60, 600, 900, 1460, 1400),
    # Salads
    "salad-sashimi": (4, 105, 285, 370, 555, 520), "salad-crazy": (4, 565, 245, 840, 505, 520),
    "salad-marinated-salmon": (4, 385, 625, 655, 895, 520), "salad-seaweed": (4, 60, 800, 325, 1075, 520),
    "salad-smoked-salmon": (4, 630, 850, 900, 1120, 520), "salad-exotic": (4, 80, 1170, 340, 1450, 520),
    "salad-marinated-tuna": (4, 405, 1160, 680, 1445, 520),
    # Hot
    "yaki-soba": (8, 268, 212, 574, 515, 700), "grilled-salmon": (9, 55, 755, 445, 1180, 700),
    # Boards
    "sashimi-board": (10, 165, 360, 890, 1085, 1100), "sushi-board": (11, 160, 375, 880, 1110, 1100),
    "hoso-board": (12, 300, 230, 800, 1000, 900),
    # Ura I
    "special-california": (13, 85, 140, 270, 265, 420), "california": (13, 350, 140, 535, 265, 420),
    "crazy": (13, 620, 140, 830, 270, 420), "alaska": (13, 90, 430, 265, 550, 420),
    "naked": (13, 345, 440, 535, 550, 420), "volcano": (13, 610, 430, 810, 555, 420),
    "grilled-ura": (13, 85, 710, 270, 830, 420), "flying": (13, 345, 700, 535, 835, 420),
    "funky-ura": (13, 600, 710, 815, 850, 420), "wild-geisha": (13, 340, 1015, 540, 1140, 420),
    # Ura II
    "rainbow": (14, 70, 220, 290, 360, 420), "geisha": (14, 340, 230, 545, 365, 420),
    "temptation": (14, 615, 225, 840, 380, 420), "shrimp-wrap": (14, 195, 550, 415, 695, 420),
    "kim": (14, 500, 555, 700, 700, 420), "rich": (14, 65, 870, 290, 1005, 420),
    "hot-spicy": (14, 335, 890, 535, 1025, 420), "crab-wrap": (14, 630, 895, 830, 1030, 420),
    # Crispy
    "crispy-spicy-salmon": (15, 90, 245, 305, 395, 420), "crispy-california": (15, 370, 260, 585, 400, 420),
    "crispy-crazy": (15, 645, 255, 870, 410, 420), "philly": (15, 95, 540, 300, 690, 420),
    "wamaki": (15, 360, 545, 575, 695, 420), "crispy-spicy-shrimp": (15, 645, 555, 850, 690, 420),
    "spicy-tuna-crispy": (15, 195, 855, 410, 990, 420), "shrimp-tempura-roll": (15, 490, 845, 715, 985, 420),
    # Specials
    "bluefin": (16, 395, 185, 560, 310, 420), "green-paradise": (16, 790, 255, 970, 380, 420),
    "fried-maki": (16, 95, 420, 310, 560, 420), "salmon-philly": (16, 785, 705, 950, 855, 420),
    "glory-roll": (16, 420, 680, 585, 835, 420), "mango-paradise": (16, 100, 975, 295, 1115, 420),
    "passion-rainbow": (16, 680, 1040, 855, 1190, 420), "dynamite": (16, 340, 1295, 505, 1450, 420),
    "mango-wrap": (17, 105, 235, 255, 390, 420), "flying-spirit": (17, 480, 140, 640, 280, 420),
    "naked-eyeroll": (17, 430, 460, 580, 590, 420), "chef-special": (17, 705, 570, 860, 715, 420),
    "smoky": (17, 50, 650, 200, 790, 420), "zamorai": (17, 110, 990, 260, 1115, 420),
    "kanji": (17, 520, 945, 665, 1065, 420),
    "summer-wrap": (18, 205, 125, 330, 260, 420), "exotic-makki": (18, 565, 145, 725, 265, 420),
    "nori-wrap": (18, 425, 440, 570, 560, 420), "maguro": (18, 80, 450, 215, 570, 420),
    "tazuna": (18, 640, 610, 765, 725, 420), "sasuki": (18, 130, 760, 280, 900, 420),
    "green-gem": (18, 415, 860, 555, 975, 420), "tokyo-roll": (18, 160, 1135, 320, 1270, 420),
    "phantom": (19, 485, 120, 630, 235, 420), "fire-engine": (19, 160, 305, 300, 415, 420),
    "ashmoon": (19, 620, 445, 750, 565, 420), "sidon": (19, 345, 655, 470, 770, 420),
    "zireh": (19, 170, 925, 320, 1050, 420), "lobster-roll": (19, 635, 840, 780, 985, 420),
    "yakusa-roll": (20, 80, 125, 210, 235, 420), "naked-salmon": (20, 520, 80, 665, 225, 420),
    "ginger-roll": (20, 250, 295, 395, 410, 420), "shogan-special": (20, 625, 395, 765, 515, 420),
    "caramelized-salmon": (20, 100, 590, 245, 705, 420), "wild-crispy-special": (20, 455, 655, 580, 775, 420),
    "lava-wrap": (20, 155, 880, 300, 1000, 420), "pineapple-roll": (20, 485, 985, 615, 1105, 420),
    # Bento specials (plates)
    "flames": (22, 250, 170, 690, 500, 900), "wild-crispy": (22, 290, 520, 700, 850, 900),
    "tropical": (22, 230, 880, 730, 1200, 900), "cherry-blossom": (23, 300, 190, 720, 520, 900),
    "salmon-crunch": (23, 220, 580, 720, 880, 900), "new-york-roll": (23, 130, 960, 700, 1270, 900),
    "ohayo": (24, 230, 130, 600, 410, 900), "shogan": (24, 300, 480, 650, 760, 900),
    "masago-roll": (24, 360, 840, 700, 1080, 900),
    "dragon": (25, 330, 815, 1000, 1240, 1100),
    # Gunkan / temaki / poke / boats
    "gunkan-ikura": (26, 525, 100, 740, 330, 420), "gunkan-spicy-salmon": (26, 175, 480, 400, 715, 420),
    "gunkan-ebico": (26, 560, 685, 820, 930, 420), "gunkan-crazy": (26, 240, 1110, 455, 1390, 420),
    "temaki-salmon": (28, 255, 175, 700, 350, 520), "temaki-shrimp": (28, 280, 435, 680, 670, 520),
    "temaki-crab": (28, 290, 700, 710, 915, 520), "temaki-scallops": (28, 280, 945, 680, 1165, 520),
    "temaki-tuna": (28, 295, 1240, 700, 1430, 520),
    "poke": (27, 200, 385, 740, 925, 1000),
    "boat-mini": (31, 210, 160, 590, 350, 900), "boat-medium": (31, 100, 680, 665, 835, 1100),
    "boat-big": (32, 90, 370, 730, 630, 1200),
}

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, ".cache")
OUT = os.path.join(HERE, "..", "public", "menu")


def page(n):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f"{n:02d}.jpg")
    if not os.path.exists(path):
        urllib.request.urlretrieve(BASE + PAGES[n], path)
    return Image.open(path).convert("RGB")


def main():
    os.makedirs(OUT, exist_ok=True)
    loaded = {}
    for key, (n, x0, y0, x1, y1, size) in CROPS.items():
        im = loaded.setdefault(n, page(n))
        w, h = im.size
        s = min(1.0, 1100 / w, 1500 / h)  # preview frame (never upscaled) -> original pixels
        box = tuple(round(v / s) for v in (x0, y0, x1, y1))
        crop = im.crop(box)
        crop.thumbnail((size, size), Image.LANCZOS)
        crop.save(os.path.join(OUT, f"{key}.webp"), quality=80, method=6)
    print(f"{len(CROPS)} images -> public/menu/")


if __name__ == "__main__":
    main()
