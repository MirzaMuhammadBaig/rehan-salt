import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Rubik } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeScript } from "@/components/ThemeScript";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { routing, RTL_LOCALES } from "@/i18n/routing";
import { SITE } from "@/lib/site";

// Rubik covers Latin, Cyrillic and Arabic; Inter covers Latin and Cyrillic. Chinese uses system fonts.
// All script files are self-hosted; `subsets` only picks what is *preloaded*. Preloading just Latin keeps
// the hero image first in line — Arabic/Cyrillic files still load on demand (unicode-range) on those pages.
const display = Rubik({ subsets: ["latin"], variable: "--font-rubik", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t("siteTitle"), template: "%s | Rehan Salt" },
    description: t("siteDescription"),
    openGraph: { type: "website", siteName: "Rehan Salt", locale, description: t("siteDescription"), images: ["/images/hero.jpg"] },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfb" },
    { media: "(prefers-color-scheme: dark)", color: "#061b21" },
  ],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={RTL_LOCALES.includes(locale) ? "rtl" : "ltr"}
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
