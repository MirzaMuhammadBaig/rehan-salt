"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const TAGS = { div: motion.div, article: motion.article, li: motion.li, section: motion.section };

type RevealProps = {
  as?: keyof typeof TAGS;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
};

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ as = "div", delay = 0, children, ...rest }: RevealProps) {
  const Tag = TAGS[as] as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
