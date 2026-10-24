"use client";

import { useSyncExternalStore } from "react";
import { THEME_INIT_SCRIPT } from "@/lib/theme-script";

const noopSubscribe = () => () => {};

/**
 * Inline script that applies the saved/system theme before first paint.
 * It is rendered only in the server HTML (and matched during hydration). On any later client-side
 * render it renders nothing, so React never creates a <script> element in the browser — that is what
 * triggers React's "Encountered a script tag while rendering React component" warning.
 */
export function ThemeScript() {
  const serverOrHydrating = useSyncExternalStore(noopSubscribe, () => false, () => true);
  if (!serverOrHydrating) return null;
  return <script id="theme-init" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
