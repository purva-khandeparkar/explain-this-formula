# Explain This Formula — Web App & API

This repository contains the backend API and web UI for **Explain This Formula**.

The app generates plain english explanations for mathematical formulas and equations using AI and exposes them as shareable pages.  
It is primarily used by the companion Chrome extension, but can also be accessed directly in the browser.

---

## Chrome Extension
🔗 https://github.com/purva-khandeparkar/explain-this-formula-chrome-extension

---

## Live App

🔗 https://explain-this-formula.vercel.app

---

## What This App Does

- Accepts formula context (text or image metadata)
- Uses AI to explain the formula in plain English
- Returns a structured explanation
- Stores the explanation and generates a unique slug
- Renders a public page for each explanation
- Each explanation can be opened directly or shared via URL

---

## How It Is Used

1. A user selects a formula (text or equation image)
2. The Chrome extension sends context to the API
3. The API generates an explanation using AI
4. The result is stored in the database
5. A page is available at `/f/[slug]` to view the explanation

The same flow works if the API is called directly.

---

## API Response Format

All explanations follow this structure:

  ```bash
  {
    "explanation": {
      "description": "short plain English summary",
      "function": "what the formula does",
      "inputs": "what variables or values it depends on",
      "result": "what the final result represents"
    },
    "slug": "abc123"
  }
  ```

---

## Tech Stack

Next.js (App Router)

TypeScript

Gemini AI (@google/genai)

Supabase (PostgreSQL)

Sharp (image conversion)

Vercel (deployment)

---

## Local Development
### Clone the Repository
  ```bash
  git clone https://github.com/purva-khandeparkar/explain-this-formula
  cd explain-this-formula
  ```

### Install Dependencies
  ```bash
  npm install
  ```

### Create a .env.local File
  ```bash
  GEMINI_API_KEY=your_key_here
  SUPABASE_URL=your_supabase_url
  SUPABASE_ANON_KEY=your_supabase_key
  ```

### Run the App Locally
  ```bash
  npm run dev
  ```

---

## Notes

 - Image-based equations are supported by converting SVG images to PNG before AI processing
 - The app does not track users or run background processes
 - All requests are explicitly triggered by the user
