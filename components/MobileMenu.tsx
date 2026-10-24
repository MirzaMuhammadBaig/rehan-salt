"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Building2, ChevronDown, ChevronRight, House, Mail, MessageSquareText, Moon, Package, Phone, Sun, Tag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { WhatsAppIcon } from "@/components/icons";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useTheme } from "@/components/theme";
import { Link, usePathname } from "@/i18n/navigation";
import { RTL_LOCALES, type Locale } from "@/i18n/routing";
import { CATEGORIES } from "@/lib/content";
import { isActivePath, NAV, SITE, waLink } from "@/lib/site";

const ICONS = { home: House, about: Building2, products: Package, privateLabel: Tag, contact: MessageSquareText } as const;

/**
 * Mobile/tablet menu: a side drawer built on Radix Dialog, which provides the focus trap,
 * Escape-to-close, background scroll lock and screen-reader semantics.
 */
export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const rtl = RTL_LOCALES.includes(locale);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [productsOpen, setProductsOpen] = useState(false);

  // Start with the product list expanded when the visitor is already on the products page.
  useEffect(() => {
    if (open) setProductsOpen(isActivePath(pathname, "/products/"));
  }, [open, pathname]);

  const close = () => onOpenChange(false);
  const offscreen = rtl ? "-100%" : "100%";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="drawer-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              // Return keyboard focus to the hamburger button (it lives in the header, outside this dialog).
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus({ preventScroll: true });
              }}
            >
              <motion.div
                id="mobile-nav"
                className="drawer"
                initial={{ x: offscreen }}
                animate={{ x: 0 }}
                exit={{ x: offscreen }}
                transition={{ type: "spring", damping: 34, stiffness: 340, mass: 0.9 }}
              >
                <Dialog.Title className="sr-only">{t("nav.menu")}</Dialog.Title>

                <div className="drawer__head">
                  <div onClick={close}><Brand /></div>
                  <Dialog.Close className="icon-btn" aria-label={t("nav.closeMenu")}>
                    <X aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <div className="drawer__body">
                  <nav aria-label={t("nav.mainNav")}>
                    <ul className="drawer__nav">
                      {NAV.map(({ href, key }, i) => {
                        const Icon = ICONS[key];
                        const active = isActivePath(pathname, href);
                        return (
                          <motion.li
                            key={href}
                            initial={{ opacity: 0, x: rtl ? -14 : 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 + i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {key === "products" ? (
                              <>
                                <button
                                  type="button"
                                  className={`drawer__link${active ? " is-active" : ""}`}
                                  aria-expanded={productsOpen}
                                  aria-controls="drawer-products"
                                  onClick={() => setProductsOpen((o) => !o)}
                                >
                                  <span className="drawer__icon"><Icon aria-hidden="true" /></span>
                                  <span className="drawer__label">{t(`nav.${key}`)}</span>
                                  <ChevronDown className="drawer__chev" aria-hidden="true" />
                                </button>
                                <AnimatePresence initial={false}>
                                  {productsOpen && (
                                    <motion.div
                                      id="drawer-products"
                                      className="drawer__sub"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                      <ul className="drawer__cats">
                                        {CATEGORIES.map((c) => (
                                          <li key={c.id}>
                                            <Link href={`/products/#${c.id}`} onClick={close}>
                                              <Image src={`/images/${c.img}`} alt="" width={40} height={40} style={{ objectPosition: c.pos }} />
                                              <span>{t(`categories.${c.id}.nav`)}</span>
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                      <Link className="drawer__all link-arrow" href="/products/" onClick={close}>
                                        {t("nav.viewAllProducts")} <ArrowRight aria-hidden="true" />
                                      </Link>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            ) : (
                              <Link
                                className={`drawer__link${active ? " is-active" : ""}`}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                onClick={close}
                              >
                                <span className="drawer__icon"><Icon aria-hidden="true" /></span>
                                <span className="drawer__label">{t(`nav.${key}`)}</span>
                                <ChevronRight className="drawer__chev drawer__chev--end" aria-hidden="true" />
                              </Link>
                            )}
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="drawer__section">
                    <p className="drawer__heading">{t("nav.language")}</p>
                    <LanguageSelect id="lang-menu" className="lang-select--panel" />

                    <p className="drawer__heading">{t("nav.appearance")}</p>
                    <div className="segmented" role="radiogroup" aria-label={t("nav.appearance")}>
                      <button type="button" role="radio" aria-checked={theme === "light"} onClick={() => setTheme("light")}>
                        <Sun aria-hidden="true" /> {t("nav.light")}
                      </button>
                      <button type="button" role="radio" aria-checked={theme === "dark"} onClick={() => setTheme("dark")}>
                        <Moon aria-hidden="true" /> {t("nav.dark")}
                      </button>
                    </div>
                  </div>

                  <div className="drawer__section">
                    <p className="drawer__heading">{t("site.contactUs")}</p>
                    <a className="drawer__chip" href={`tel:${SITE.phoneTel}`}>
                      <Phone aria-hidden="true" /> <span className="ltr">{SITE.phoneDisplay}</span>
                    </a>
                    <a className="drawer__chip" href={`mailto:${SITE.email}`}>
                      <Mail aria-hidden="true" /> <span>{SITE.email}</span>
                    </a>
                  </div>
                </div>

                <div className="drawer__foot">
                  <Link className="btn btn--primary" href="/contact/" onClick={close}>{t("nav.requestQuote")}</Link>
                  <a className="btn btn--whatsapp" href={waLink(t("whatsapp.default"))} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> {t("nav.chatWhatsApp")}
                  </a>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
