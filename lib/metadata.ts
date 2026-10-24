import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedPath, routing, type Locale } from "@/i18n/routing";

type PageKey = "home" | "about" | "products" | "privateLabel" | "contact";

/** Per-page title/description plus canonical and hreflang links for every language. */
export async function pageMetadata(locale: Locale, page: PageKey, path: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = page === "home" ? t("siteTitle") : t(`${page}Title`);
  const description = page === "home" ? t("siteDescription") : t(`${page}Description`);
  const languages: Record<string, string> = { "x-default": path };
  for (const l of routing.locales) languages[l] = localizedPath(l, path);

  return {
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: localizedPath(locale, path), languages },
    openGraph: {
      title: page === "home" ? title : `${title} | Rehan Salt`,
      description,
      url: localizedPath(locale, path),
      siteName: "Rehan Salt",
      type: "website",
      locale,
      images: ["/images/hero.jpg"],
    },
  };
}
