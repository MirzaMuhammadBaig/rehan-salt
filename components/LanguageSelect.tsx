"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { getPathname, usePathname } from "@/i18n/navigation";
import { LOCALE_NAMES, routing, type Locale } from "@/i18n/routing";

/**
 * Language menu: opens the same page in the chosen language.
 * It does a normal page load (not a client-side transition) so the new language gets a fresh
 * <html lang/dir> document — this keeps the theme intact and avoids React re-creating <head> scripts.
 */
export function LanguageSelect({ id, className }: { id: string; className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  return (
    <label className={`lang-select${className ? ` ${className}` : ""}`} htmlFor={id}>
      <Globe aria-hidden="true" />
      <span className="sr-only">{t("language")}</span>
      <select
        id={id}
        value={locale}
        disabled={busy}
        onChange={(e) => {
          const next = e.target.value as Locale;
          setBusy(true);
          // Remember the choice (the proxy reads this cookie for URLs without a language prefix).
          document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
          const path = getPathname({ href: pathname, locale: next });
          window.location.assign(path + window.location.search + window.location.hash);
        }}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l}>{LOCALE_NAMES[l]}</option>
        ))}
      </select>
    </label>
  );
}
