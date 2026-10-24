import type { ReactNode } from "react";
import "./globals.css";

// The real <html>/<body> layout is app/[locale]/layout.tsx (it needs the language).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
