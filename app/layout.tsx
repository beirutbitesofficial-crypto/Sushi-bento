import type { Metadata, Viewport } from "next";
import { Manrope, Mrs_Saint_Delafield, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";

const serif = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
const script = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], variable: "--font-script-face", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "Sushi Bento — Sushi in Achrafieh, Beirut · Since 2001",
  description:
    "Sushi Bento rolls sushi by hand in Achrafieh, Beirut since 2001. Browse the full menu — maki, sashimi, dragons, boats and bento sets — and order on WhatsApp.",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "Sushi Bento — Rolled by hand since 2001",
    description: "The full Sushi Bento menu. Order in a few taps.",
    type: "website",
    images: [{ url: "/menu/tatuna.webp", alt: "TaTuna — tuna sashimi with our special sauce" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0C0B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${script.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so intro elements can start hidden without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="bg-ink font-sans text-rice antialiased">
        <CartProvider>{children}</CartProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
