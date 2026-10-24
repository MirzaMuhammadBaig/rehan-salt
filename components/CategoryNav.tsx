"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/content";

/** Sticky chip bar on the products page; highlights the category currently in view. */
export function CategoryNav() {
  const t = useTranslations();
  const [active, setActive] = useState<CategoryId>(CATEGORIES[0].id);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id as CategoryId)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    CATEGORIES.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Keep the active chip centred in the horizontal chip bar.
  // Only the bar itself is scrolled: scrollIntoView() would also scroll the page, which cancels the
  // visitor's momentum scrolling on phones and makes the page "stop" at every new product.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!list || !link) return;
    const l = link.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    const delta = l.left + l.width / 2 - (b.left + b.width / 2); // same sign in LTR and RTL
    if (Math.abs(delta) > 4) list.scrollBy({ left: delta, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="cat-nav" aria-label={t("products.navLabel")}>
      <div className="container">
        <div className="cat-nav__list" ref={listRef}>
          {CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={active === c.id ? "is-active" : undefined} aria-current={active === c.id ? "true" : undefined}>
              {t(`categories.${c.id}.nav`)}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
