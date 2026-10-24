# Rehan Salt website

Built with Next.js 16 (React 19) and TypeScript, in **7 languages**. Every page in every language is pre-rendered to static HTML.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000, with live reload
npm run build      # production build
npm start          # serve the production build
npm run lint       # TypeScript type-check (also checks every translation key)
```
On Windows PowerShell, if `npm` is blocked by the execution policy, use `npm.cmd run dev`.

## Languages
| Language | URL |
|---|---|
| English (default) | `/`, `/about/`, `/products/` ... |
| العربية (Arabic, right-to-left) | `/ar/...` |
| Español | `/es/...` |
| Français | `/fr/...` |
| Deutsch | `/de/...` |
| Русский | `/ru/...` |
| 中文 | `/zh/...` |

- On a visitor's first visit, the site picks the language from their browser and remembers their choice from the language menu.
- Each language has its own URL with `hreflang` tags and sitemap entries, so Google can index every language.

### Editing text
All text lives in `messages/<language>.json`, for example `messages/en.json` and `messages/ar.json`.
When you change text in `en.json`, change the same key in the other six files too.
`npm run lint` reports any key that is missing or misspelled.

### Adding a language
1. Add its code to `locales` and `LOCALE_NAMES` in `i18n/routing.ts`.
2. Copy `messages/en.json` to `messages/<code>.json` and translate the values (not the keys).

## Libraries
| Library | Used for |
|---|---|
| **next** | Routing, pre-rendering, SEO metadata, sitemap/robots, image optimisation, self-hosted fonts |
| **next-intl** | Translations, language URLs, language switcher, right-to-left Arabic |
| **motion** (Framer Motion) | Scroll-reveal animations, mobile menu and FAQ transitions |
| **react-hook-form** + **zod** | Quote form and translated validation messages |
| **@radix-ui/react-dialog** | Accessible "check your details" confirmation popup |
| **sonner** | Toast messages after the form is sent |
| **lucide-react** | Icons |

## Project structure
```
app/[locale]/   pages: home, about, products, private-label, contact (one copy per language)
app/globals.css all styles: colour tokens for light/dark at the top, layout supports RTL
components/     Header, Footer, LanguageSelect, QuoteForm, Faq, CategoryNav, sections, ...
i18n/           language list, routing and locale-aware Link
messages/       translations (one JSON file per language)
lib/site.ts     phone, WhatsApp, email (edit contact details here)
lib/content.ts  product images and ids (the text is in messages/)
public/images/  photos (replace with real product photos and keep the same file names)
proxy.ts        sends each visitor to the right language
```

## Theme
- **Colours:** deep teal (`--teal-*`), Himalayan salt pink (`--salt`) and coral (`--coral`), defined at the top of `app/globals.css`.
- **Fonts:** Rubik for headings and Inter for body text, both self-hosted by Next.js.
- **Light/dark:** the toggle sits in the header (`components/theme.tsx`).
  - It follows the visitor's system setting until they choose, then remembers their choice.
  - A tiny inline script (`components/ThemeScript.tsx`) applies the theme before the page paints, so there's no flash.

## Quote form
- **Where enquiries go:** every enquiry is emailed to **raja.jabir100@gmail.com** through FormSubmit (free, no account needed).
- **Before sending:** a confirmation popup shows the visitor's email address and a summary of their enquiry. They choose "Yes, send" or "Edit details". It also catches common email typos such as `gmial.com → gmail.com`.
- **What each email contains:** the product's English name, the visitor's language, and a reply-to address. Pressing **Reply** in Gmail answers the customer directly.
- **One-time activation (required):** after the site is live, submit the form once yourself. FormSubmit emails an **activation link** to raja.jabir100@gmail.com. Click it, and from then on every enquiry is delivered.
  - Until you activate, visitors see an error with a WhatsApp fallback, so no lead is lost.
  - Check the Spam folder the first time.
- **Optional:** the FormSubmit activation email offers a random "alias" address. Replace the email in `formEndpoint` in `lib/site.ts` with that alias so the address isn't visible in the page code.
- **WhatsApp:** the "Send via WhatsApp" button works with no setup.

## Deploy to Netlify
1. Push this folder to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repo. The settings are read from `netlify.toml`: build `npm run build`, publish `.next`, Node 22.
3. Until you connect a domain, canonical links and the sitemap use your Netlify address (for example `https://rehan-salt.netlify.app`) automatically. After connecting your own domain, add the environment variable `NEXT_PUBLIC_SITE_URL` (for example `https://www.rehansalt.com`) and redeploy.
4. Submit the quote form once and click the FormSubmit activation email (see above).

## Placeholders to replace with real details
| What | Where |
|---|---|
| Stats: 15+ years, 25+ countries, 500 MT/month, 120+ products | `home.stats` in every `messages/*.json` |
| Established 2010, capacity, markets | `about.who.facts` in every `messages/*.json` |
| MOQ, lead times, payment terms | `faq.items` in every `messages/*.json` |
| Business hours | `site.hours` in every `messages/*.json` |
| Product photos (free Unsplash stock) | `public/images/` |
| Certifications, social media links | not added yet |
