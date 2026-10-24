import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, ProcessSection, SectionHead } from "@/components/sections";
import type { Locale } from "@/i18n/routing";
import type { TitleText } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/about/");
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const facts = t.raw("who.facts") as { label: string; value: string }[];
  const values = t.raw("values.items") as TitleText[];

  return (
    <>
      <PageHero crumb={t("hero.crumb")} eyebrow={t("hero.eyebrow")} title={t("hero.title")} text={t("hero.text")} />

      <section className="section">
        <div className="container split">
          <Reveal className="split__media">
            <Image src="/images/rock-salt.jpg" alt={t("who.imageAlt")} fill loading="eager" sizes="(min-width: 960px) 45vw, 100vw" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">{t("who.eyebrow")}</span>
            <h2>{t("who.title")}</h2>
            <div className="prose">
              <p>{t("who.p1")}</p>
              <p>{t("who.p2")}</p>
              <p>{t("who.p3")}</p>
            </div>
            <dl className="fact-card">
              {facts.map(({ label, value }) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split split--reverse">
          <Reveal className="split__media">
            <Image src="/images/salt-mine.jpg" alt={t("himalayan.imageAlt")} fill sizes="(min-width: 960px) 45vw, 100vw" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">{t("himalayan.eyebrow")}</span>
            <h2>{t("himalayan.title")}</h2>
            <div className="prose">
              <p>{t("himalayan.p1")}</p>
              <p>{t("himalayan.p2")}</p>
              <p>{t("himalayan.p3")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t("values.eyebrow")} title={t("values.title")} />
          <div className="feature-grid">
            {values.map(({ title, text }, i) => (
              <Reveal as="article" key={title} className="feature" delay={(i % 3) * 0.08}>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />

      <CtaBand title={t("cta.title")} text={t("cta.text")} />
    </>
  );
}
