# test changed
# <img src="public/icon.jpg" alt="Dataset Detective Logo" width="40" height="40" style="vertical-align:middle;margin-right:8px;"> Dataset Detective

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen?style=flat-square)](https://dataset-detective.vercel.app/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Dataset--Detector-black?style=flat-square)](https://github.com/sai-AIstacker/Dataset-Detector)

---

**Dataset Detective** is a production-grade web application for automated, visual Exploratory Data Analysis (EDA) on any CSV file  
Designed for rapid insight, it features a glassmorphic interface, micro-interactions, and exportable analysis reports.  
Access the live application: [dataset-detective.vercel.app](https://dataset-detective.vercel.app/)

---

## Approach

As an AI/ML learner, my focus is on automating the EDA workflow.  
Dataset Detective enables instant, code-free analysis of any dataset, surfacing key metrics, correlations, and distributions.  
The platform is engineered for reliability, clarity, and performance, supporting both quick exploration and in-depth reporting.

---

## Features

- Universal CSV parsing with tolerant type inference and column unioning
- Missingness metrics per column and overall completeness
- Numeric statistics: count, mean, median, standard deviation
- Categorical insights: unique values and frequency analysis
- Correlation matrix with top relationships
- Per-numeric histograms for distribution visualization
- Glassmorphic UI with animated transitions and accessibility support
- One-click export of interactive analysis as PNG (cross-origin safe)
- Optimized rendering and memoized computations for stability

---

## Usage

Visit [dataset-detective.vercel.app](https://dataset-detective.vercel.app/)  
Upload your CSV file and immediately explore your data with automated EDA tools.  
Export your analysis as a PNG report for sharing or documentation.

---

## Project Structure

```
app/           App Router pages and layout
components/    Feature components (upload, EDA phases, charts, etc.)
components/ui/ shadcn/ui primitives
public/        Static assets (icons, images)
scripts/       Utility scripts (detective.py for offline EDA)
styles/        Global CSS
```

---

## Implementation Notes

- Export uses `html-to-image` with `skipFonts: true` and a safe font stack to avoid cross-origin font errors.
- Numeric detection accepts numeric strings; correlations computed only from valid rows; missingness computed against total rows.
- Accessibility: semantic landmarks, aria labels, keyboard focus support, and tabular numerals for key metrics.

---

## Customization

- Branding: Update tokens and typography in `app/globals.css` and titles/icons in `app/layout.tsx`.
- Icons: Replace `/public/icon.jpg` and `/public/apple-touch-icon.jpg` with your logo.
- Splash & Greeting: Tweak timings and copy in `components/splash.tsx` and `components/welcome-greeting.tsx`.

---

## Deployment

- Vercel: Deploy directly from GitHub. No special environment variables required for base CSV workflow.

---

## Troubleshooting

- PNG export fails with “cssRules” error:
  - Ensure `skipFonts: true` remains set in the export function.
  - Retry after closing browser extensions that inject styles.
- Styling issues:
  - Confirm Tailwind v4 is active and your tokens are present in globals.

---

## License

MIT

---

## Author

**Sai**  
AI/ML Learner & Full Stack Developer  
GitHub: [sai-AIstacker](https://github.com/sai-AIstacker)  
Live App: [dataset-detective.vercel.app](https://dataset-detective.vercel.app/)

---