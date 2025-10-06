# Dataset Detective

A production‑ready Next.js application for fast, visual Exploratory Data Analysis (EDA) on any CSV file. It features a polished glassmorphic UI, smooth micro‑interactions, and exportable analysis reports designed for clarity, performance, and reliability.

## Highlights

- Any‑Dataset EDA
  - Robust CSV parsing with tolerant type inference (numeric vs categorical) and unioning of columns across rows
  - Missingness metrics per column and overall completeness
  - Numeric statistics: count, mean, median, std; categorical: uniques and frequency insights
  - Correlation matrix with top correlations
  - Per‑numeric histograms for distribution analysis
- Beautiful, Responsive UI/UX
  - Glass cards, subtle neon accents, animated borders for upload and actions
  - Splash intro and graceful transitions
  - Accessible components with clear focus states and high contrast
- Exportable Reports
  - One‑click PNG export of the interactive analysis (html-to-image with `skipFonts: true` to avoid cross‑origin CSS issues)
- Performance & Stability
  - Memoized computations, careful rendering of chart subsets, and CSS-only animations where possible

## Tech Stack

- Framework: Next.js (App Router), React 19, TypeScript
- Styling: Tailwind CSS v4, shadcn/ui
- Charts: Recharts
- CSV Parsing: PapaParse
- Export: html-to-image

## Getting Started

Prerequisites: Node.js 18+ and your package manager of choice (pnpm or npm).

Install:
- pnpm install
- or: npm install

Run:
- pnpm dev
- or: npm run dev
Open http://localhost:3000

Build:
- pnpm build && pnpm start
- or: npm run build && npm start

## Project Structure

- app/ — App Router pages and layout
- components/ — Feature components (upload, phase-one, phase-two, charts, etc.)
- components/ui/ — shadcn/ui primitives
- public/ — Static assets (icons, images)
- scripts/ — Utility scripts (e.g., detective.py for offline EDA)
- styles/ — Additional global CSS

## Key Implementation Notes

- Export Reliability: `html-to-image` is configured with `skipFonts: true` and a safe font stack during capture to avoid SecurityErrors from cross‑origin fonts.
- Dataset Agnostic EDA: Numeric detection accepts numeric strings; correlations compute only from rows where both columns are valid numbers; missingness computed against total rows.
- Accessibility: Semantic landmarks, aria labels, keyboard focus support, and tabular numerals for key metrics.

## Customization

- Branding: Update tokens and typography in `app/globals.css` and titles/icons in `app/layout.tsx`.
- Icons: Replace `/public/icon.jpg` and `/public/apple-touch-icon.jpg` with your logo.
- Splash & Greeting: Tweak timings and copy in `components/splash.tsx` and `components/welcome-greeting.tsx`.

## Deployment

- GitHub: Commit and push. The repository is clean of build artifacts; `user_read_only_context/` is gitignored.
- Vercel: Import the GitHub repo and deploy. No special environment variables are required for the base CSV workflow.

## Troubleshooting

- PNG export fails with “cssRules” error:
  - Ensure `skipFonts: true` remains set in the export function.
  - Retry after closing browser extensions that inject styles.
- Styling issues:
  - Confirm Tailwind v4 is active and your tokens are present in globals.

## License

MIT
