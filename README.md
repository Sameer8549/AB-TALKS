# ABTalks — Redesigned

> **"A chain you don't want to break."**
> 
> *Re-architecting habit formation for Indian college developers — through context-aware UI, Recovery Grace, and physicalized streak mechanics.*

[![Live Demo](https://img.shields.io/badge/Live_App-abtalksredesign.vercel.app-F4B942?style=for-the-badge&logo=vercel&logoColor=0C0E14)](https://abtalksredesign.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js_15_•_React_19_•_Tailwind_CSS-0C0E14?style=for-the-badge&logo=nextdotjs&logoColor=DDE1EA)](https://nextjs.org)
[![Hackathon](https://img.shields.io/badge/Event-ABTalks_Vibe_Code_Hackathon_2026-C49030?style=for-the-badge)](https://abtalksredesign.vercel.app)

---

## ⚡ The Elevator Pitch

ABTalks runs a 60-day coding challenge for Indian college students: **pick a track, build daily, post proof (GitHub + LinkedIn), keep the chain unbroken.** 

Most students use ABTalks late at night on their phones — exhausted after classes, fighting fatigue, trying to hold onto a habit. The original product mechanics worked, but its interface was friction-heavy and unforgiving. 

**This redesign transforms ABTalks from a rigid discipline tracker into an adaptive, context-reading platform.**

---

## 🗺️ Route Map & Judge Walkthrough

| Route | View | Core Value Proposition & Judge Focus |
|---|---|---|
| [`/`](https://abtalksredesign.vercel.app/) | **Landing Page** | The first 10 seconds: converts visitors with immediate clarity on the 4-step loop (`Pick` → `Build` → `Prove` → `Repair`). |
| [`/dashboard`](https://abtalksredesign.vercel.app/dashboard) | **Student Command Center** | Daily hub featuring the **StreakChain**, live midnight countdown, adaptive time-aware copy, and **Preview-State Switcher**. |
| [`/day/12`](https://abtalksredesign.vercel.app/day/12) | **Day Detail & Proof Engine** | Interactive task spec, structured requirements checklist, **LinkedIn PNG Proof Card** & **Official A4 PDF Certificate Generator**. |

---

## 🧠 The Core Thesis: Context Over Punishment

Standard habit apps punish failure instantly. Miss one day, and your 30-day streak resets to **0**. That zero-reset moment is mathematically where 80%+ of students quit permanently, because starting from zero feels heavier than giving up.

**ABTalks Redesign operates on a fundamentally different human principle:**

> *The system should know what time it is, and it should know when you're tired.*

```
   TRADITIONAL STREAK APPS:
   [ Day 29: Done ] ──► [ Day 30: Missed ] ──► [ Day 31: RESET TO 0 ]  ❌ (Student quits)

   ABTALKS REDESIGN (RECOVERY GRACE):
   [ Day 29: Done ] ──► [ Day 30: Missed ] ──► [ 24h Grace Window ] ──► [ Gold Seam Link ] ☀️ (Streak Saved)
```

### Key Behavioral Innovations

* 🌙 **Time-Aware Interface**: At 11 PM, demanding UI language softens into encouraging, low-friction copy. 
* ⌛ **Live Midnight Countdown**: As 12:00 AM approaches, a live `HH:MM:SS` timer creates urgency without anxiety.
* 📈 **Personal-Best Nudge**: When approaching your longest personal streak, the UI nudges your history — never comparing you against others on a toxic leaderboard.
* 🩹 **Recovery Grace & Gold Seams**: Missed a day? A 24-hour repair window opens. Submitting late doesn't erase the slip — it seals the link with a **Gold Seam**. The scar is public proof of resilience.
* 🎴 **Dual Proof Export (PNG Social Card + Official PDF Certificate)**: Submitting proof generates both a high-resolution 1200×628 PNG image for LinkedIn posts AND an official A4 landscape **PDF Build Proof Certificate** with verification tracking IDs.

---

## 🎛️ Edge Cases, Built On Purpose

We built a live **Preview State Switcher** floating on the dashboard so judges can audit every edge case instantly:

1. **`Normal State`**: Active student mid-challenge (12-day streak, active chain, history populated).
2. **`New Student`**: Zero streak, Day 1 initialization, zero history — designed to welcome, not shame.
3. **`Missed Day`**: Live Recovery Grace banner, 24h countdown, repair form, and cracked link visualization.

---

## 🎨 Design System: Ink & Signal

Designed specifically for late-night mobile viewing. Avoids hostile bright white backgrounds and generic startup aesthetics.

```
┌────────────────────────────────────────────────────────────────────────┐
│  INK (#0C0E14)        COAL (#13151F)      GRAPHITE (#1E2133)           │
│  Base canvas          Card surfaces       Elevated elements            │
├────────────────────────────────────────────────────────────────────────┤
│  RIM (#2A2D42)        ASH (#6B7191)       CHALK (#DDE1EA)              │
│  Hairlines & borders  Muted typography    Primary text                 │
├────────────────────────────────────────────────────────────────────────┤
│  SIGNAL (#F4B942)     SIGNAL-DIM (#C49030) GOLD SEAM (#FFD700)         │
│  Amber streak heat    Recovered links     Repaired fracture seam       │
└────────────────────────────────────────────────────────────────────────┘
```

* **Typography**: 
  * `Space Grotesk` (Display) — Bold, geometric header authority.
  * `Outfit` (Body) — High-legibility sans-serif built for tired eyes.
  * `JetBrains Mono` (Data/Monospace) — Precision terminal & metadata representation.
* **Signature Component**: **StreakChain** — A physicalized 60-link chain that pulses, glows, cracks, and repairs rather than a generic GitHub contribution grid.

---

## 🛠️ Architecture & Tech Stack

* **Framework**: Next.js 15 (App Router, Client & Server Components)
* **Styling**: Tailwind CSS with CSS Variables (`rgb(var(--c-token) / <alpha>)`) for seamless theme modulation
* **Animations**: Motion (Framer Motion v12) for spring physics & link-forging transitions
* **Export Engine**: Dual client-side Canvas 2D PNG generator + native A4 Landscape PDF Certificate engine
* **Icons**: `@phosphor-icons/react`

---

## 🚀 Quickstart & Local Setup

```bash
# Clone the repository
git clone https://github.com/Sameer8549/AB-TALKS.git

# Enter project directory
cd AB-TALKS

# Install dependencies
npm install

# Launch development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) or test the live production build at [**abtalksredesign.vercel.app**](https://abtalksredesign.vercel.app).

---

## 📄 Hackathon Submission & AI Logs

* **Full Commit Log & AI History**: [`PROMPTS.md`](./PROMPTS.md)
* **Raw Prompt Chat Transcript (3,137 lines)**: 👉 **[`public/Redesigning ABTalks Platform.md`](./public/Redesigning%20ABTalks%20Platform.md)**
* **Live Web Browser Prompt Viewer**: 👉 **[`https://abtalksredesign.vercel.app/prompts`](https://abtalksredesign.vercel.app/prompts)**
* **Product Architecture Notes**: [`NOTES.md`](./NOTES.md)

---

## 👥 Team 404 Foundation Us

* **Abdul Sameer** (Team Lead) — *HKBK College of Engineering*
* **Mahendra Selvan** — *HKBK College of Engineering*
* **Pavithra V** — *Sapthagiri College of Engineering*

---
*Built with passion for the ABTalks Vibe Code Hackathon (Aug 7–9, 2026).*
