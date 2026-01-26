This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Explain This Formula — Web App & API

This repository contains the backend API and web UI for Explain This Formula.

The app generates plain-English explanations for mathematical formulas and equations using AI and exposes them as shareable pages.
It is primarily used by the companion Chrome extension, but can also be accessed directly in the browser.

Live app:
https://explain-this-formula.vercel.app

What this app does

Accepts formula context (text or image metadata)

Uses AI to explain the formula in plain English

Returns a structured explanation

Stores the explanation and generates a unique slug

Renders a public page for each explanation

Each explanation can be opened directly or shared via URL.

How it is used

A user selects a formula (text or equation image)

The Chrome extension sends context to the API

The API generates an explanation using AI

The result is stored in the database

A page is available at /f/[slug] to view the explanation

The same flow works if the API is called directly.

API response format

All explanations follow this structure:

{
  "explanation": {
    "description": "short plain English summary",
    "function": "what the formula does",
    "inputs": "what variables or values it depends on",
    "result": "what the final result represents"
  },
  "slug": "abc123"
}

Tech stack

Next.js (App Router)

TypeScript

Gemini AI (@google/genai)

Supabase (PostgreSQL)

Sharp (image conversion)

Vercel (deployment)

Local development

Clone the repository:

git clone https://github.com/purva-khandeparkar/explain-this-formula
cd explain-this-formula


Install dependencies:

npm install


Create a .env.local file:

GEMINI_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key


Run the app locally:

npm run dev

Notes

Image-based equations are supported by converting SVG images to PNG before AI processing

The app does not track users or run background processes

All requests are explicitly triggered by the user