import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { CategoryNav } from "@/components/CategoryNav";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero } from "@/components/sections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { CATEGORIES } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { waLink } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadata(locale, "products", "/products/");
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHero
        crumb={t("products.hero.crumb")}
        eyebrow={t("products.hero.eyebrow")}
        title={t("products.hero.title")}
        text={t("products.hero.text")}
        img="edible-salt.jpg"
      />
      <CategoryNav />

      <section>
        <div className="container">
          {CATEGORIES.map((c, i) => {
            const name = t(`categories.${c.id}.name`);
            const formats = t.raw(`categories.${c.id}.formats`) as string[];
            const packing = t.raw(`categories.${c.id}.packing`) as string[];
            return (
              <article className="product-block" id={c.id} key={c.id}>
                <Reveal className="product-block__media">
                  <Image src={`/images/${c.img}`} alt={name} fill sizes="(min-width: 900px) 50vw, 100vw" preload={i === 0} style={{ objectPosition: c.pos }} />
                </Reveal>
                <Reveal delay={0.1}>
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")} · {t(`categories.${c.id}.tag`)}</span>
                  <h2>{name}</h2>
                  <p>{t(`categories.${c.id}.long`)}</p>
                  <div className="spec">
                    <div>
                      <h3>{t("common.formatsTitle")}</h3>
                      <ul className="chips">{formats.map((f) => <li key={f}>{f}</li>)}</ul>
                    </div>
                    <div>
                      <h3>{t("common.packingTitle")}</h3>
                      <ul className="chips">{packing.map((f) => <li key={f}>{f}</li>)}</ul>
                    </div>
                  </div>
                  <div className="btn-row">
                    <Link className="btn btn--primary" href={`/contact/?product=${c.id}`}>{t("common.requestQuote")}</Link>
                    <a className="btn btn--outline" href={waLink(t("whatsapp.product", { product: name }))} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon /> {t("common.askWhatsApp")}
                    </a>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand title={t("products.cta.title")} text={t("products.cta.text")} />
    </>
  );
}
