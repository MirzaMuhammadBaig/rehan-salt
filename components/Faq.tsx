"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

type FaqItem = { q: string; a: string };

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="faq">
      {items.map(({ q, a }, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-${i}`;
        return (
          <div className={`faq__item${isOpen ? " is-open" : ""}`} key={q}>
            <h3 className="faq__q">
              <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : i)}>
                {q}
                <span className="faq__icon" aria-hidden="true" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  className="faq__a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
