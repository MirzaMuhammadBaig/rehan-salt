import type { MetadataRoute } from "next";
import { localizedPath, routing } from "@/i18n/routing";
import { NAV, SITE } from "@/lib/site";

export const dynamic = "force-static";

// One entry per page and language, each listing all its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  return NAV.flatMap(({ href }) =>
    routing.locales.map((locale) => ({
      url: `${SITE.url}${localizedPath(locale, href)}`,
      changeFrequency: "monthly" as const,
      priority: href === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}${localizedPath(l, href)}`])),
      },
    })),
  );
}
