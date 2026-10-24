"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/theme";

export function ThemeToggle() {
  const t = useTranslations("nav");
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      className="icon-btn theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      aria-pressed={isDark}
    >
      {/* Both icons render; CSS shows the right one from [data-theme] so there is no flash before hydration. */}
      <Moon className="icon-moon" aria-hidden="true" />
      <Sun className="icon-sun" aria-hidden="true" />
    </button>
  );
}
