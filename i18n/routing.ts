import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "es", "fr", "de", "ru", "zh"],
  defaultLocale: "en",
  // English lives at "/", other languages at "/ar/", "/es/", ...
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** Native names shown in the language menu. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  zh: "中文",
};

export const RTL_LOCALES: Locale[] = ["ar"];

/** Path for a page in a given locale, e.g. ("ar", "/about/") -> "/ar/about/". */
export function localizedPath(locale: Locale, path: string) {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}
