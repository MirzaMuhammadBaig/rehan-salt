import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 "proxy" (formerly middleware): picks the language from the URL,
// a saved choice, or the browser, and routes to the right translated page.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, icons, sitemap.xml...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
