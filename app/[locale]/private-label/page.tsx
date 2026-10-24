import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead, StepList } from "@/components/sections";
import type { Locale } from "@/i18n/routing";
import type { TitleText } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, "privateLabel", "/private-label/");
}

export default async function PrivateLabelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privateLabel");
  const handled = t.raw("intro.items") as string[];
  const formats = t.raw("formats.items") as TitleText[];
  const steps = t.raw("steps.items") as TitleText[];

  return (
    <>
      <PageHero crumb={t("hero.crumb")} eyebrow={t("hero.eyebrow")} title={t("hero.title")} text={t("hero.text")} img="private-label.jpg" />

      <section className="section">
        <div className="container split">
          <Reveal className="split__media">
            <Image src="/images/private-label.jpg" alt={t("intro.imageAlt")} fill loading="eager" sizes="(min-width: 960px) 45vw, 100vw" />
            <div className="split__badge"><strong>{t("intro.badgeTitle")}</strong><span>{t("intro.badgeText")}</span></div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">{t("intro.eyebrow")}</span>
            <h2>{t("intro.title")}</h2>
            <p className="lead">{t("intro.lead")}</p>
            <ul className="check-list">
              {handled.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHead eyebrow={t("formats.eyebrow")} title={t("formats.title")} />
          <div className="feature-grid">
            {formats.map(({ title, text }, i) => (
              <Reveal as="article" key={title} className="feature" delay={(i % 3) * 0.08}>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t("steps.eyebrow")} title={t("steps.title")} />
          <StepList steps={steps} four />
        </div>
      </section>

      <CtaBand title={t("cta.title")} text={t("cta.text")} />
    </>
  );
}
