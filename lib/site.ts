/**
 * Central place for brand content & links.
 * ⚠️ Fill in the real WhatsApp number / phone / Instagram before going live.
 */
export const site = {
  name: "Sushi Bento",
  tagline: "Rolled by hand in Saida",
  area: "Hlaliyeh",
  city: "Saida",
  /** WhatsApp number in international format, digits only — e.g. "9613123456". Empty = customer picks the chat. */
  whatsapp: "",
  /** Phone for the "Call" button, e.g. "+961 1 234 567". Empty hides it. */
  phone: "",
  /** Full Instagram URL. Empty hides it. */
  instagram: "",
  directionsUrl: "https://maps.app.goo.gl/r618vavGJ2VWFnNk6",
  /** Google Maps embed (plus code H99V+RP2, Hlaliyeh). */
  mapEmbed: "https://maps.google.com/maps?q=H99V%2BRP2%20Sushi%20Bento%2C%20Hlaliyeh%2C%20Lebanon&z=16&output=embed",
  currency: "USD",
  /** Preview mode: keeps Google from indexing the site. Set to false once the client approves. */
  preview: true,
};

export function whatsappLink(text: string) {
  const to = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
