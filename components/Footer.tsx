import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Brand } from "@/components/Brand";
import { WhatsAppIcon } from "@/components/icons";
import { LanguageSelect } from "@/components/LanguageSelect";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/lib/content";
import { NAV, SITE, waLink } from "@/lib/site";

export function Footer() {
  const t = useTranslations();
  const wa = waLink(t("whatsapp.default"));
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="footer-about">{t("site.footerAbout")}</p>
            <a className="btn btn--whatsapp" href={wa} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> {t("site.whatsappUs")}
            </a>
          </div>
          <div>
            <h3>{t("site.ourProducts")}</h3>
            <ul className="footer-links">
              {CATEGORIES.map((c) => (
                <li key={c.id}><Link href={`/products/#${c.id}`}>{t(`categories.${c.id}.nav`)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t("site.quickLinks")}</h3>
            <ul className="footer-links">
              {NAV.map(({ href, key }) => (
                <li key={href}><Link href={href}>{t(`nav.${key}`)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t("site.contactUs")}</h3>
            <ul className="footer-contact">
              <li><Phone aria-hidden="true" /><a className="ltr" href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></li>
              <li>
                <WhatsAppIcon />
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  {t("site.whatsappLabel", { phone: SITE.phoneDisplay })}
                </a>
              </li>
              <li><Mail aria-hidden="true" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><MapPin aria-hidden="true" /><span>{t("site.address")}</span></li>
              <li><Clock aria-hidden="true" /><span>{t("site.hours")}</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t("site.rights", { year: new Date().getFullYear() })}</span>
          <LanguageSelect id="lang-footer" />
        </div>
      </div>
      {/* Fixed-position, but kept inside the footer landmark for screen readers. */}
      <WhatsAppFloat />
    </footer>
  );
}

export function WhatsAppFloat() {
  const t = useTranslations();
  return (
    <a className="wa-float" href={waLink(t("whatsapp.default"))} target="_blank" rel="noopener noreferrer" aria-label={t("nav.whatsappFloat")}>
      <WhatsAppIcon />
    </a>
  );
}
