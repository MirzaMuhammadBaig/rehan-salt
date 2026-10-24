"use client";

import { ArrowRight, ChevronDown, Mail, Menu, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { LanguageSelect } from "@/components/LanguageSelect";
import { MobileMenu } from "@/components/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { CATEGORIES } from "@/lib/content";
import { isActivePath, NAV, SITE } from "@/lib/site";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating, or when the screen grows to desktop size.
  // (Escape, focus trap and background scroll lock are handled by the Radix dialog.)
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onResize = () => window.innerWidth >= 1200 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const current = (href: string) => (isActivePath(pathname, href) ? "page" : undefined);

  return (
    <>
      <a className="skip-link" href="#main">{t("nav.skipToContent")}</a>
      <section className="topbar" aria-label={t("site.contactUs")}>
        <div className="container topbar__inner">
          <div className="topbar__contacts">
            <a href={`mailto:${SITE.email}`}>
              <Mail aria-hidden="true" />
              <span className="topbar__email-text">{SITE.email}</span>
              <span className="sr-only">{t("nav.email")}</span>
            </a>
            <a href={`tel:${SITE.phoneTel}`}>
              <Phone aria-hidden="true" />
              {SITE.phoneDisplay}
            </a>
          </div>
          <LanguageSelect id="lang-top" />
        </div>
      </section>

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container site-header__inner">
          <Brand />
          <nav className="main-nav" aria-label={t("nav.mainNav")}>
            <ul className="main-nav__list">
              {NAV.map(({ href, key }) =>
                key === "products" ? (
                  <li key={href} className="has-dropdown">
                    <Link className="main-nav__link" href={href} aria-current={current(href)}>
                      {t(`nav.${key}`)} <ChevronDown aria-hidden="true" />
                    </Link>
                    <div className="dropdown">
                      {CATEGORIES.map((c) => (
                        <Link key={c.id} href={`/products/#${c.id}`}>
                          <Image src={`/images/${c.img}`} alt="" width={48} height={48} style={{ objectPosition: c.pos }} />
                          <span>
                            <strong>{t(`categories.${c.id}.nav`)}</strong>
                            <small>{t(`categories.${c.id}.tag`)}</small>
                          </span>
                        </Link>
                      ))}
                      <Link className="dropdown__all link-arrow" href="/products/">
                        {t("nav.viewAllProducts")} <ArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  </li>
                ) : (
                  <li key={href}>
                    <Link className="main-nav__link" href={href} aria-current={current(href)}>{t(`nav.${key}`)}</Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <Link className="btn btn--primary" href="/contact/">{t("nav.getQuote")}</Link>
            <button
              className="icon-btn menu-toggle"
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("nav.openMenu")}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
