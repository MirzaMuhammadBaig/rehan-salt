import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { PageHero, SectionHead } from "@/components/sections";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { SITE, waLink } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, "contact", "/contact/");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const mapLang = locale === "zh" ? "zh-CN" : locale;

  return (
    <>
      <PageHero crumb={t("contact.hero.crumb")} eyebrow={t("contact.hero.eyebrow")} title={t("contact.hero.title")} text={t("contact.hero.text")} />

      <section className="section">
        <div className="container contact-layout">
          <Reveal>
            <span className="eyebrow">{t("contact.details.eyebrow")}</span>
            <h2>{t("contact.details.title")}</h2>
            <p className="lead" style={{ marginBottom: 28 }}>{t("contact.details.lead")}</p>
            <div className="contact-cards">
              <a className="contact-card contact-card--wa" href={waLink(t("whatsapp.default"))} target="_blank" rel="noopener noreferrer">
                <span className="contact-card__icon"><WhatsAppIcon /></span>
                <div><h3>{t("contact.details.whatsapp")}</h3><p className="ltr">{SITE.phoneDisplay}</p></div>
              </a>
              <a className="contact-card" href={`tel:${SITE.phoneTel}`}>
                <span className="contact-card__icon"><Phone aria-hidden="true" /></span>
                <div><h3>{t("contact.details.phone")}</h3><p className="ltr">{SITE.phoneDisplay} <span className="muted">({SITE.phoneLocal})</span></p></div>
              </a>
              <a className="contact-card" href={`mailto:${SITE.email}`}>
                <span className="contact-card__icon"><Mail aria-hidden="true" /></span>
                <div><h3>{t("contact.details.email")}</h3><p>{SITE.email}</p></div>
              </a>
              <div className="contact-card">
                <span className="contact-card__icon"><MapPin aria-hidden="true" /></span>
                <div><h3>{t("contact.details.address")}</h3><p>{t("site.address")}</p></div>
              </div>
              <div className="contact-card">
                <span className="contact-card__icon"><Clock aria-hidden="true" /></span>
                <div><h3>{t("contact.details.hours")}</h3><p>{t("site.hours")}</p></div>
              </div>
            </div>
          </Reveal>

          <Reveal className="form-card" delay={0.1}>
            <h2>{t("contact.formTitle")}</h2>
            <p className="muted">{t("contact.requiredNote")}</p>
            {/* useSearchParams (product preselect) needs a Suspense boundary on a statically rendered page. */}
            <Suspense fallback={null}>
              <QuoteForm />
            </Suspense>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt section--tight">
        <div className="container">
          <SectionHead eyebrow={t("contact.map.eyebrow")} title={t("site.addressShort")} />
          <Reveal className="map">
            <iframe
              title={t("contact.map.iframeTitle")}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=14&hl=${mapLang}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
