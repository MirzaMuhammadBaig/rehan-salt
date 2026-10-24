"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/components/theme";

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster position="top-center" richColors closeButton theme={theme} />;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* Respect the visitor's "reduce motion" OS setting for every animation. */}
      <MotionConfig reducedMotion="user">
        {children}
        <ThemedToaster />
      </MotionConfig>
    </ThemeProvider>
  );
}
