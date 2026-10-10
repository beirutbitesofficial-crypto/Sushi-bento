/**
 * Central place for brand content & links.
 * ⚠️ Fill in the real WhatsApp number / phone / Instagram before going live.
 */
export const site = {
  name: "Sushi Bento",
  tagline: "Rolled by hand since 2001",
  area: "Achrafieh",
  city: "Beirut",
  since: 2001,
  /** WhatsApp number in international format, digits only — e.g. "9613123456". Empty = customer picks the chat. */
  whatsapp: "",
  /** Phone for the "Call" button, e.g. "+961 1 234 567". Empty hides it. */
  phone: "",
  /** Full Instagram URL. Empty hides it. */
  instagram: "",
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=Sushi+Bento+Achrafieh+Beirut",
  currency: "USD",
};

export function whatsappLink(text: string) {
  const to = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
