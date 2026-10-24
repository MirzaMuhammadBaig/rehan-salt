import { Lamp, Leaf, Sprout, Utensils } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { CategoryCard, CtaBand, Globe, ProcessSection, SectionHead } from "@/components/sections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { CATEGORIES, type TitleText } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

const INDUSTRY_ICONS = [Utensils, Leaf, Lamp, Sprout];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const facts = t.raw("hero.facts") as { label: string; value: string }[];
  const stats = t.raw("stats") as { value: string; label: string }[];
  const industries = t.raw("industries.items") as TitleText[];
  const reasons = t.raw("why.items") as TitleText[];
  const regions = t.raw("world.regions") as { name: string; detail: string }[];

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rehan Salt",
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    description: "Pink Himalayan salt manufacturer and exporter based in Jhelum, Pakistan.",
    email: SITE.email,
    telephone: SITE.phoneTel,
    address: { "@type": "PostalAddress", streetAddress: "Small Industrial Estate", addressLocality: "Jhelum", addressRegion: "Punjab", addressCountry: "PK" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      <section className="hero">
        <div className="hero__media">
          <Image src="/images/hero.jpg" alt="" fill preload fetchPriority="high" sizes="100vw" />
        </div>
        <div className="container hero__inner">
          {/* Above the fold: CSS-only entrance (never hidden while JavaScript loads). */}
          <div className="hero__content enter">
            <span className="eyebrow">{t("hero.eyebrow")}</span>
            <h1>{t("hero.titleStart")} <em>{t("hero.titleEm")}</em></h1>
            <p className="hero__lead">{t("hero.lead")}</p>
            <div className="btn-row">
              <Link className="btn btn--salt" href="/contact/">{t("hero.ctaQuote")}</Link>
              <Link className="btn btn--ghost-light" href="/products/">{t("hero.ctaExplore")}</Link>
            </div>
          </div>
          <dl className="hero__facts enter enter--late">
            {facts.map(({ label, value }) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container stats">
          {stats.map(({ value, label }, i) => (
            <Reveal key={label} className="stat" delay={i * 0.08}>
              <div className="stat__num">{value}</div>
              <div className="stat__label">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section--alt" id="categories">
        <div className="container">
          <SectionHead eyebrow={t("categories.eyebrow")} title={t("categories.title")} lead={t("categories.lead")} />
          <div className="cat-grid">
            {CATEGORIES.map((c, i) => <CategoryCard key={c.id} category={c} index={i} />)}
          </div>
          <Reveal className="center-cta">
            <p>{t("categories.moreText")}</p>
            <Link className="btn btn--primary" href="/products/">{t("categories.moreButton")}</Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container offer-grid">
          <Reveal as="article" className="offer-card">
            <div className="offer-card__media"><Image src="/images/rock-salt.jpg" alt="" fill sizes="(min-width: 860px) 50vw, 100vw" /></div>
            <span className="eyebrow">{t("offers.wholesale.eyebrow")}</span>
            <h3>{t("offers.wholesale.title")}</h3>
            <p>{t("offers.wholesale.text")}</p>
            <Link className="link-underline" href="/contact/?product=edible-salt">{t("offers.wholesale.link")}</Link>
          </Reveal>
          <Reveal as="article" className="offer-card" delay={0.1}>
            <div className="offer-card__media"><Image src="/images/private-label.jpg" alt="" fill sizes="(min-width: 860px) 50vw, 100vw" /></div>
            <span className="eyebrow">{t("offers.privateLabel.eyebrow")}</span>
            <h3>{t("offers.privateLabel.title")}</h3>
            <p>{t("offers.privateLabel.text")}</p>
            <Link className="link-underline" href="/private-label/">{t("offers.privateLabel.link")}</Link>
          </Reveal>
        </div>
      </section>

      <ProcessSection />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t("industries.eyebrow")} title={t("industries.title")} lead={t("industries.lead")} />
          <div className="industry-grid">
            {industries.map(({ title, text }, i) => {
              const Icon = INDUSTRY_ICONS[i % INDUSTRY_ICONS.length];
              return (
                <Reveal as="article" key={title} className="industry" delay={i * 0.08}>
                  <div className="industry__icon"><Icon aria-hidden="true" /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split">
          <Reveal className="split__media">
            <Image src="/images/salt-mine.jpg" alt={t("why.imageAlt")} fill sizes="(min-width: 960px) 45vw, 100vw" />
            <div className="split__badge"><strong>{t("why.badgeTitle")}</strong><span>{t("why.badgeText")}</span></div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">{t("why.eyebrow")}</span>
            <h2>{t("why.title")}</h2>
            <p className="lead">{t("why.lead")}</p>
            <ol className="num-list">
              {reasons.map(({ title, text }) => (
                <li key={title}><div><h3>{title}</h3><p>{text}</p></div></li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container world">
          <Reveal>
            <span className="eyebrow">{t("world.eyebrow")}</span>
            <h2>{t("world.titleStart")} <em>{t("world.titleEm")}</em></h2>
            <p className="lead">{t("world.lead")}</p>
            <ul className="region-list">
              {regions.map(({ name, detail }) => (
                <li key={name}><strong>{name}</strong><span>{detail}</span></li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}><Globe label={t("world.globeLabel")} city={t("world.jhelum")} /></Reveal>
        </div>
      </section>

      <FaqSection />

      <CtaBand />
    </>
  );
}

async function FaqSection() {
  const t = await getTranslations("faq");
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} center />
        <Reveal><Faq /></Reveal>
      </div>
    </section>
  );
}
