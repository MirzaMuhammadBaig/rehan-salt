import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Every page is pre-rendered at build time (static), and Vercel / Netlify run
// Next.js natively, which also gives automatic WebP/AVIF image optimisation.
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Hide the floating "N" Next.js dev-tools button (it only ever shows in `npm run dev`).
  devIndicators: false,
  poweredByHeader: false,
  // Basic security headers for every page.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

// Wires up next-intl (reads i18n/request.ts) for the translated pages.
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
