# Clinics by Prob N Tech: the marketing website

This is a standalone copy of the public website only. It has six pages: Home (`/`), Products (`/products`), Success stories (`/success-stories`), Pricing (`/pricing`), FAQ (`/faq`) and Contact (`/contact`). The clinic app, sign-in and the admin panel are not included.

Every requirement given for the site so far is listed in [`requirements.txt`](requirements.txt). It lists requirements, not npm packages (those are in `package.json`).

## Run it

You need Node.js 20 or newer (we use 24).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Before you send your work back, check that it builds:

```bash
npm run typecheck
npm run build
```

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, GSAP (animations) and Lenis (smooth scrolling).

## What works differently in this copy

- **The demo form doesn't save anything.** `app/(marketing)/contact/actions.ts` is a stand-in: it checks the form and answers "Thank you", but nothing is sent.
- **"Sign in" and other app links open a "Page not found" page.** The app isn't in this copy.
- **Files marked `STAND-IN` at the top replace parts of the real app:**
  - `app/(marketing)/contact/actions.ts`, `lib/auth.ts`, `lib/role-home.ts`, `lib/call-action.ts`, `components/forget-previous-session.tsx`;
  - the error and not-found pages in `app/`.

  You can read them, but don't change their names or what they export.

## Chatbot

The dock at the bottom right is one pill with "Ask Chatbot" and WhatsApp side by side. "Ask Chatbot" opens a small assistant that answers from the website's own content only: plans and prices, the FAQ, the products and the contact details. It uses Google Gemini, called from the server (`app/api/chat/route.ts`), so the key never reaches the browser.

- **Get a key:** open [Google AI Studio](https://aistudio.google.com), choose **Get API key**, and create one.
- **Set it up:** copy `.env.example` to `.env.local` and fill in `GEMINI_API_KEY`. Never commit `.env.local`.
  - `GEMINI_MODEL` defaults to `gemini-flash-lite-latest` (on 2026-10-27 that was `gemini-3.5-flash-lite`).
  - `gemini-flash-latest` was often overloaded, and the 2.5 models are closed to new keys.
  - Any free Flash or Flash-Lite model listed in AI Studio works.
- **Speed:** Gemini's answer time varies a lot (we measured 3 to 40 seconds on 2026-10-27), so the route avoids waiting where it can:
  - greetings ("hi", "salam") and acknowledgements ("ok", "thanks", "theek hai") are answered on the server, instantly;
  - short questions (up to 4 words) that match a known topic ("price?", "me baat krun?") get the site's own answer at once;
  - if Gemini hasn't answered in 5 seconds, or is busy, a second request races the first;
  - the whole wait is capped at 15 seconds.
- **History:** each message is sent with only the previous exchange, the visitor's last question and the bot's answer (3 messages in all).
- **Without a key** (or when Gemini is busy or fails) the bot still answers common questions from the site's own text (prices, trial, plans, features, contact), picked by the words in the question, in English or Urdu.
- **Language:** the bot replies in Urdu script only to a question in Urdu script; English and Roman Urdu get English.
- **Free-tier limits change often.** Check your project's rate-limit page in AI Studio. The route also allows each visitor about 10 messages a minute (per server instance).
- **Privacy:** on the free tier, Google may use prompts to improve its products. The bot never asks for patient data, and messages that look like patient details (a CNIC, a patient's phone number) are answered on the server without being sent to Google. Nothing visitors write is logged or stored.
- **Terms:** check Google's Gemini API terms for commercial use and availability in your region before going live.
- **Its knowledge** is built in `lib/chat-knowledge.ts` from the same data the pages use, so changing a price or an FAQ answer there updates the bot too.

## Where things are

| What | File |
|---|---|
| Home page (the order of its sections) | `app/(marketing)/page.tsx` |
| Other pages | `app/(marketing)/{products,success-stories,pricing,faq,contact}/page.tsx` |
| Home hero (the scroll story) | `components/hero/scroll-hero.tsx` |
| Sections: navbar, specialties, how it works, FAQ, call-to-action band, demo form, footer | `components/marketing/*` |
| Prices and plan limits (the real app uses the same values) | `lib/billing.ts` |
| Plans on /pricing | `components/marketing/pricing-plans.ts` |
| Products on /products | `components/marketing/products-data.ts` |
| FAQ questions and answers (English and Urdu) | `components/marketing/faq-data.ts` |
| Sample success stories | `components/marketing/stories-data.ts` |
| Brand name and contact details | `components/marketing/brand.ts` |
| Chatbot: panel, dock, server route, knowledge | `components/marketing/chat-panel.tsx`, `chat-widget.tsx`, `app/api/chat/route.ts`, `lib/chat-knowledge.ts` |
| Logo | `components/brand/*` |
| Colours, fonts, shadows, radius (design tokens), light and dark | `ui/src/styles/globals.css` |
| Website-only styles and animations | `styles/marketing.css` |
| Urdu text (Noto Nastaliq Urdu) | `components/urdu.tsx`, `styles/urdu.css` |
| Buttons, inputs, dialogs (shared with the app) | `ui/src/components/*` |
| Screenshots of the app and fonts | `public/marketing/*`, `public/fonts/*` |

## Rules, so your changes can go into the real site

1. **Colours come from the design tokens only.** Use `bg-primary`, `text-muted-foreground`, `bg-brand-deep`, `text-brand-deep-foreground` and the others in `ui/src/styles/globals.css`.
   - No hex, rgb or hsl colours in the components. The real project has a test that fails on them.
   - The only exceptions: the WhatsApp green `#25d366` and the three window dots `#ff5f57`, `#ffbd2e`, `#28c840`.
   - Text must stay readable: a contrast of at least 4.5:1, in light and in dark mode.
2. **Light is the default theme, and dark mode must keep working.** Use the toggle in the navbar to check every change in both.
3. **Check at three widths:**
   - phone, 390px;
   - laptop, 1280px;
   - wide, 1920px.
   - Nothing may scroll sideways, nothing may be cut off, and buttons must be easy to tap on a phone.
4. **Content must show without animations.** An animation may move things, but must never start them invisible. Respect "reduce motion" (`prefers-reduced-motion`).
5. **Words:**
   - write in sentence case ("Book a free demo", not "Book A Free Demo");
   - the demo button is always "Book a free demo";
   - the sign-in link is always "Sign in";
   - the brand is "Clinics by Prob N Tech";
   - no em dashes or en dashes: a hyphen for ranges ("2-5 doctors"), a comma or colon in sentences;
   - say only what is true about the product.
6. **Accessibility:**
   - every image has an `alt` text;
   - every field has a label;
   - everything works with the keyboard;
   - keep the `id`s and labels of the demo form fields.
7. **Ask before adding a package** to `package.json`.
8. **Don't change the stand-in files,** or `ui/src/components/*` beyond what a page needs. Those are shared with the app.

## Sending your work back

Zip the whole folder without `node_modules` and `.next`, and list in a short note which files you changed and why.
