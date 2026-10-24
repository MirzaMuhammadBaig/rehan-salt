import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import type { Category, TitleText } from "@/lib/content";
import { SITE, waLink } from "@/lib/site";

export function PageHero({ crumb, eyebrow, title, text, img = "page-hero.jpg" }: {
  crumb: string; eyebrow: string; title: string; text: string; img?: string;
}) {
  const t = useTranslations();
  return (
    <section className="page-hero">
      <div className="page-hero__media">
        <Image src={`/images/${img}`} alt="" fill preload fetchPriority="high" sizes="100vw" />
      </div>
      <div className="container">
        {/* Above the fold: CSS-only entrance (never hidden while JavaScript loads). */}
        <div className="page-hero__inner enter">
          <nav className="breadcrumb" aria-label={t("nav.breadcrumb")}>
            <Link href="/">{t("common.home")}</Link><span aria-hidden="true">/</span><span>{crumb}</span>
          </nav>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title, text }: { title?: string; text?: string }) {
  const t = useTranslations();
  return (
    <section className="section cta-band">
      <Reveal className="container">
        <span className="eyebrow">{t("cta.eyebrow")}</span>
        <h2>{title ?? t("cta.title")}</h2>
        <p>{text ?? t("cta.text")}</p>
        <div className="btn-row">
          <Link className="btn btn--salt" href="/contact/">{t("common.requestQuote")}</Link>
          <a className="btn btn--whatsapp" href={waLink(t("whatsapp.default"))} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> <span className="ltr">{t("cta.whatsapp", { phone: SITE.phoneDisplay })}</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, center = false }: {
  eyebrow: string; title: string; lead?: string; center?: boolean;
}) {
  return (
    <Reveal className={`section-head${center ? " section-head--center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}

export function StepList({ steps, four = false }: { steps: TitleText[]; four?: boolean }) {
  return (
    <ol className={`process${four ? " process--4" : ""}`}>
      {steps.map(({ title, text }, i) => (
        <Reveal as="li" key={title} className="process__step" delay={i * 0.08}>
          <span className="process__num">{i + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function ProcessSection() {
  const t = useTranslations("process");
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <StepList steps={t.raw("steps") as TitleText[]} />
      </div>
    </section>
  );
}

export function CategoryCard({ category: c, index }: { category: Category; index: number }) {
  const t = useTranslations();
  const href = `/products/#${c.id}`;
  return (
    <Reveal as="article" className="cat-card" delay={(index % 4) * 0.07}>
      <Link className="cat-card__media" href={href} tabIndex={-1} aria-hidden="true">
        <span className="cat-card__tag">{t(`categories.${c.id}.tag`)}</span>
        <Image src={`/images/${c.img}`} alt="" fill sizes="(min-width: 1000px) 25vw, (min-width: 620px) 50vw, 100vw" style={{ objectPosition: c.pos }} />
      </Link>
      <div className="cat-card__body">
        <h3><Link href={href}>{t(`categories.${c.id}.name`)}</Link></h3>
        <p>{t(`categories.${c.id}.card`)}</p>
        <Link className="link-arrow" href={href}>{t("common.viewRange")} <ArrowRight aria-hidden="true" /></Link>
      </div>
    </Reveal>
  );
}

export function Globe({ label, city }: { label: string; city: string }) {
  const arcs = [
    "M262 172 Q215 90 150 112", "M262 172 Q160 70 70 150", "M262 172 Q245 150 228 186",
    "M262 172 Q320 160 330 240", "M262 172 Q220 200 190 262", "M262 172 Q160 150 100 238",
  ];
  const dots: [number, number][] = [[150, 112], [70, 150], [228, 186], [330, 240], [190, 262], [100, 238]];
  return (
    <svg className="globe" viewBox="0 0 400 400" role="img" aria-label={label}>
      <defs>
        <radialGradient id="globeFill" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#14596a" />
          <stop offset="1" stopColor="#06222a" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="170" fill="url(#globeFill)" stroke="rgba(246,184,165,.45)" />
      <g fill="none" stroke="rgba(166,194,200,.18)">
        <ellipse cx="200" cy="200" rx="45" ry="170" />
        <ellipse cx="200" cy="200" rx="105" ry="170" />
        <ellipse cx="200" cy="200" rx="150" ry="170" />
        <path d="M30 200h340M53 115h294M53 285h294M115 53h170M115 347h170" />
      </g>
      <g fill="none" stroke="#f6b8a5" strokeWidth="1.6" strokeLinecap="round">
        {arcs.map((d) => <path key={d} className="arc" d={d} />)}
      </g>
      <g fill="#eef6f7">
        {dots.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}
      </g>
      <circle className="pulse" cx="262" cy="172" r="8" fill="none" stroke="#e0745c" strokeWidth="2" />
      <circle cx="262" cy="172" r="6" fill="#e0745c" />
      <text x="274" y="160" fill="#eef6f7" fontFamily="var(--font-body)" fontSize="12" fontWeight="700" letterSpacing="1">{city}</text>
    </svg>
  );
}
