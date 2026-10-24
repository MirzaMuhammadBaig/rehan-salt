import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="section cta-band not-found">
      <div className="container">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2>{t("title")}</h2>
        <p>{t("text")}</p>
        <div className="btn-row">
          <Link className="btn btn--salt" href="/">{t("home")}</Link>
          <Link className="btn btn--ghost-light" href="/products/">{t("products")}</Link>
        </div>
      </div>
    </section>
  );
}
