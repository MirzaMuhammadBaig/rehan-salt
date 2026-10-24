"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme-script";

export type Theme = "light" | "dark";
// The initial theme is applied before paint by THEME_INIT_SCRIPT (lib/theme-script.ts) in the layout.

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): Theme | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === "light" || s === "dark" ? s : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  // Briefly disable CSS transitions so the whole page switches at once.
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  window.getComputedStyle(document.body).opacity; // force a reflow before re-enabling transitions
  requestAnimationFrame(() => style.remove());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The init script already set data-theme; start from "light" for a stable server render, then sync.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setThemeState(current === "dark" ? "dark" : "light");

    // Follow the OS setting until the visitor picks a theme themselves.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (readStored()) return;
      const next = systemTheme();
      apply(next);
      setThemeState(next);
    };
    // Keep several open tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = readStored() ?? systemTheme();
      apply(next);
      setThemeState(next);
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode: the theme still applies for this visit */
    }
    apply(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current === "dark" ? "light" : "dark");
  }, [setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
