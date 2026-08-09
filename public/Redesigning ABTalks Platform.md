# Chat Conversation

Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

### User Input

Repo: https://github.com/Sameer8549/AB-TALKS

Build a mobile-first redesign of "ABTalks" — a platform where Indian college
students do a 60-day coding challenge, picking a track and submitting daily
proof of work (a GitHub commit + a LinkedIn post) to build a public streak.
Students use this mostly on their phones, late at night, often tired, trying
to keep a habit alive. The current product works but has never been designed.
Your job is to design and build it well — genuinely well, not "AI template" well.

STACK: Next.js (App Router) + React + Tailwind CSS. Single deployable app,
ready for Vercel.

=== DESIGN FILES ===

Design reference files already exist in the project folder. Use them as the
source of truth for the visual direction — colors, typography, layout,
spacing — and build the UI to match them closely rather than inventing a new
direction from scratch.

Do NOT commit these design files to GitHub. Before the first commit, add
them to .gitignore (e.g. /design, /designs, *.fig, *.psd, *.sketch — match
whatever the actual files/folder are). Confirm they're excluded by running
`git status` before every commit and checking they don't appear as tracked
or staged files.

If a design file needs to inform naming (e.g. component names, color
variable names), that's fine — the influence can show up in the code, just
not the raw files themselves in the repo.

=== DESIGN DIRECTION (if not fully specified by the design files) ===

Do NOT produce the generic AI-generated look. Specifically avoid:
- NO purple/violet gradients or purple as an accent color, anywhere
- NO warm cream background + serif display + terracotta/orange accent combo
- NO near-black background with a single neon-green or acid accent
- NO generic "SaaS landing page" layout (giant centered headline, 3 feature
  cards with icons, gradient blob backgrounds)
- NO numbered 01/02/03 step markers unless they represent a real sequence
- NO overuse of rounded-2xl cards with soft shadows everywhere
- Don't default to generic "developer/coder dark mode" without justifying
  why it's actually right for this subject (grinding, discipline, momentum,
  late-night focus, streaks, small daily proof)

Think like a design studio building a real identity for this product:
- A palette: 4-6 named hex colors tied to the feeling of "daily discipline /
  momentum / a streak you don't want to break"
- Typography: a real display + body face pairing with personality, not
  generic tech-startup defaults
- One signature visual element the design would be remembered by — something
  that embodies "a streak, daily proof of work, momentum" in a non-obvious
  way. Spend your one creative risk here, keep everything else disciplined
  and quiet
- Structure should encode real meaning — if showing day-by-day progress, the
  visual structure should reflect an actual timeline, not decoration
- Motion used deliberately and sparingly — one well-placed reveal or
  micro-interaction beats scattered animation everywhere

=== ROUTES — BUILD EXACTLY THESE 3 ===

1. `/` — Landing page
   First impression for a student who has never heard of ABTalks. Build
   trust, clarity, and motivation fast enough that a stranger commits to a
   60-day challenge. Clear CTA into the flow.

2. `/dashboard` — Student home screen after "login"
   Show: current streak, today's task, progress through the 60-day
   challenge, overall completion %, student standing/achievements.
   Design these edge cases thoughtfully, not as broken/blank states:
   - First day, streak = 0
   - A missed day (no shame-based UI — frame it as recoverable)
   - An empty profile (brand new student)

3. `/day/12` — Single challenge day detail
   Student reads the day's task, understands what needs to be built, and
   submits proof of work — a GitHub link field and a LinkedIn post link
   field (no real auth/backend, just UI + mock submit).

DATA: No real backend, no auth, no database. Single mocked JSON/TS file with
realistic data: student profile, streak, 12+ days of tasks, progress,
standing. Bake the 3 edge cases above directly into the mock data so all
states are actually viewable.

REQUIRED: introduce at least ONE genuinely thoughtful UX idea that goes
beyond visuals — a real functional/behavioral improvement to how students
experience momentum, setbacks, or motivation. Not decoration.

OUT OF SCOPE: authentication, real user accounts, production database,
recruiter dashboard, admin panel, matching ABTalks' existing tech stack.

CODE QUALITY: Clean component structure, readable naming, minimal
duplication — this needs to be understood and extended live under time
pressure later, so prioritize clarity over cleverness.

=== COMMIT WORKFLOW — READ CAREFULLY, THIS MATTERS FOR JUDGING ===

This hackathon runs an automated authenticity check on repository history.
The following will trigger manual review or disqualification, so avoid all
of them:
- Repository created before official kickoff
- First commit already containing most of the project (looks imported)
- Little/no commit activity during development, followed by one large final
  commit
- AI usage log not corresponding to what was actually built
- Prompt history that's incomplete, generic, or unrelated to the project

We are NOT going to run all commits at once or in a burst. Go through this
process ONE STEP AT A TIME. After each step, STOP and wait for my
confirmation before moving to the next. Do not proceed automatically.

For each step:
1. Show me exactly what will be included in this commit (files
   changed/added).
2. Stage and commit ONLY that step's files with the exact commit message
   given below.
3. Push to GitHub.
4. Tell me what to manually check/test in the running app (npm run dev)
   before I confirm we move on.
5. Wait for me to say "next" before continuing.

Do not batch multiple steps into one commit. Do not skip the verification
prompt. Do not proceed without my confirmation.

STEP SEQUENCE:

Step 1 — chore: initialize Next.js project
Only package.json, next.config.js, tsconfig.json, base folder scaffold, and
.gitignore (must exclude design files). No pages, no components, no data yet.

Step 2 — chore: add Tailwind config and base layout
tailwind.config.js (design tokens), globals.css, layout.tsx (fonts/metadata
only).

Step 3 — feat: add mock data (student, streak, tasks, edge cases)
Mock data file only.

Step 4 — feat: build landing page (/)
page.tsx and any components it directly depends on — only what's needed.

Step 5 — feat: build dashboard page (/dashboard)
dashboard/page.tsx, StudentHeader.tsx, TodayTask.tsx.

Step 6 — feat: handle dashboard edge cases (zero streak, missed day, empty profile)
Any changes specifically for edge-case rendering logic.

Step 7 — feat: add signature visual component
The signature component (e.g. streak visualization) and its integration
point.

Step 8 — feat: add [UX idea name] UX improvement
The UX-improvement component and its integration point.

Step 9 — feat: build day detail page (/day/12)
day/[id]/page.tsx, ProofSubmitForm.tsx.

Step 10 — style: polish responsiveness at 390px across all 3 routes
Any CSS/layout tweaks made after reviewing on mobile viewport.

Step 11 — fix: [bug fixes found during review]
Only include this if real issues were actually found and fixed during
testing — do not fabricate this step if nothing needed fixing.

Step 12 — docs: finalize README with route map
README.md only. Use this exact structure, filling in bracketed parts with
real details from what was actually built (live URL once deployed, the
actual UX idea description, actual palette tokens):

---
# ABTalks — Redesigned

A mobile-first redesign of ABTalks, the platform where Indian college
students run a 60-day coding challenge — picking a track, building daily,
and keeping a public streak alive through GitHub commits and LinkedIn posts.

**Live demo:** [fill in Vercel URL]

**Problem statement:** Redesign ABTalks — reimagine the platform students
are standing on. The product works. It has never been designed.

---

## Route Map

| Route | Screen |
|---|---|
| `/` | Landing page — first impression for a student who's never heard of ABTalks |
| `/dashboard` | Student home — streak, today's task, progress, standing |
| `/day/12` | Challenge day detail — task, requirements, submission |

---

## What this redesign does

- Mobile-first at 390px, desktop as a secondary consideration
- Handles real edge cases: zero streak, a missed day, an empty profile —
  designed intentionally, not left broken
- Introduces one deliberate UX improvement: [fill in real name] — [fill in
  one real sentence on what it actually does and why]
- Mocked data only — no auth, no database, no backend

---

## Design

- Palette: [fill in actual named tokens from tailwind.config.js, with one
  line on what they represent]
- Typography: [fill in actual fonts used]
- Signature element: [fill in actual component name] — [one real sentence
  on what it is and why it represents the product]

---

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Deployed on Vercel

---

## Running locally

```bash
git clone https://github.com/Sameer8549/AB-TALKS.git
cd AB-TALKS
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## AI Usage

Full prompt history and AI-assisted development log is in
[`PROMPTS.md`](./PROMPTS.md).

---

## Team — 404 Found Us

- Abdul Sameer (Leader) — HKBK College of Engineering
- Mahendra Selvan — HKBK College of Engineering
- Pavithra V — Sapthagiri College of Engineering

Built for the ABTalks Vibe Code Hackathon, Aug 7–9, 2026.
---

Step 13 — docs: update PROMPTS.md with full AI usage log
PROMPTS.md — must accurately reflect what was actually asked/used/changed
at each step above, not a pre-filled generic log. Write entries matching
Steps 1-12 as they actually happened: what was asked, what was suggested,
what was used, what was manually changed, which files were affected.

Step 14 — chore: final polish pass
Any last small adjustments after full review.

=== START ===

Start by proposing your color palette, type pairing, and signature design
element (cross-checked against the design files provided) BEFORE writing
any code, and briefly justify why each choice fits THIS product
specifically. Wait for my confirmation on the design direction. Then begin
Step 1, then stop and wait for me.
