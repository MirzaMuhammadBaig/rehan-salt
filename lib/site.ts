/**
 * Public address of the site, used for canonical links, hreflang, sitemap and social previews.
 * 1. NEXT_PUBLIC_SITE_URL — set this once your own domain is live (e.g. https://www.rehansalt.com).
 * 2. Otherwise Netlify's built-in URL (e.g. https://rehan-salt.netlify.app), or Vercel's production URL.
 * So search engines never get pointed at a domain that isn't live yet.
 */
function siteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL || // Netlify
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return (fromEnv || "http://localhost:3000").replace(/\/+$/, "");
}

export const SITE = {
  name: "Rehan Salt",
  url: siteUrl(),
  phoneDisplay: "+92 336 4421916",
  phoneLocal: "0336 4421916",
  phoneTel: "+923364421916",
  whatsapp: "923364421916",
  email: "raja.jabir100@gmail.com",
  formEndpoint: "https://formsubmit.co/ajax/raja.jabir100@gmail.com",
  mapQuery: "Small Industrial Estate, Jhelum, Pakistan",
} as const;

export function waLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Main navigation; labels come from messages "nav.<key>". */
export const NAV = [
  { href: "/", key: "home" },
  { href: "/about/", key: "about" },
  { href: "/products/", key: "products" },
  { href: "/private-label/", key: "privateLabel" },
  { href: "/contact/", key: "contact" },
] as const;

/** True when `pathname` is the page for `href` (or inside it). Ignores trailing slashes. */
export function isActivePath(pathname: string, href: string) {
  const norm = (s: string) => s.replace(/\/+$/, "") || "/";
  const p = norm(pathname);
  const h = norm(href);
  return h === "/" ? p === "/" : p === h || p.startsWith(h + "/");
}
