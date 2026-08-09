// ─── ABTalks Mock Data ────────────────────────────────────────────────────────
// No backend, no auth. This file is the single source of truth for all UI states.
// Three edge cases are explicitly modelled and exported at the bottom.

// ─── Types ───────────────────────────────────────────────────────────────────

export type Track = 'fullstack' | 'dsa' | 'aiml' | 'devops'

export type DayStatus =
  | 'completed'   // Submitted on time — solid chain link
  | 'recovered'   // Submitted within 24h grace window — repaired link (gold seam)
  | 'missed'      // Grace window expired — cracked link (permanent scar)
  | 'today'       // Current day, not yet submitted — pulsing link
  | 'upcoming'    // Future days — empty outline link

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface DayTask {
  day: number
  date: string               // ISO date string
  status: DayStatus
  title: string
  briefSummary: string       // One-line summary for the dashboard card
  description: string        // Full task description for /day/[id]
  difficulty: Difficulty
  tags: string[]
  // What to build — structured requirements for /day/[id]
  requirements: string[]
  // Proof of work (populated when status is completed/recovered)
  githubUrl?: string
  linkedinUrl?: string
  submittedAt?: string
  // Recovery Grace Window — set when status moves to missed, lasts 24h
  recoveryDeadline?: string  // ISO datetime — if set and in future, recovery is possible
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string               // Phosphor icon name
  unlockedAt?: string        // ISO date — undefined means locked
}

export interface StudentProfile {
  id: string
  name: string
  handle: string             // @username
  avatar: string             // URL
  college: string
  city: string
  track: Track
  trackLabel: string
  startDate: string          // ISO date — Day 1
  github: string
  linkedin: string
  bio: string
}

export interface StreakStats {
  current: number            // Consecutive days (recovered days count)
  longest: number            // All-time best streak
  totalCompleted: number     // completed + recovered
  totalMissed: number        // missed (grace expired)
  totalRecovered: number     // Days saved via recovery window
  completionPercent: number  // (totalCompleted / 60) * 100
  totalDays: number          // Always 60
}

export interface MockData {
  student: StudentProfile
  streak: StreakStats
  days: DayTask[]
  achievements: Achievement[]
}

// ─── Student Profile ─────────────────────────────────────────────────────────

export const student: StudentProfile = {
  id: 'stu_arjun_001',
  name: 'Arjun Mehta',
  handle: '@arjunbuilds',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  college: 'HKBK College of Engineering',
  city: 'Bengaluru',
  track: 'fullstack',
  trackLabel: 'Full Stack Dev',
  startDate: '2026-07-28',   // Day 1 was July 28 — Day 12 is Aug 8
  github: 'https://github.com/arjunbuilds',
  linkedin: 'https://linkedin.com/in/arjunbuilds',
  bio: 'Building in public. 3rd year CSE. Obsessed with making things that actually work.',
}

// ─── Day Tasks — Full Stack Track ─────────────────────────────────────────────
// Days 1–11: historical (mix of completed, one missed→recovered, one missed)
// Day 12: today (pending submission)
// Days 13–15: upcoming (teaser)

export const days: DayTask[] = [
  {
    day: 1,
    date: '2026-07-28',
    status: 'completed',
    title: 'Dev environment setup',
    briefSummary: 'Set up your local dev environment from scratch.',
    description:
      'Every strong build starts with a solid foundation. Today you set up your development environment — Node.js, Git, VS Code, and a working "Hello World" deployed to Vercel. No tutorials, just the real setup.',
    difficulty: 'easy',
    tags: ['setup', 'git', 'vercel', 'node'],
    requirements: [
      'Install Node.js (LTS) and verify with node --version',
      'Configure Git with your name and email',
      'Install VS Code with at least 3 extensions that improve your workflow',
      'Create a public GitHub repo named day-01-setup',
      'Deploy a simple HTML page to Vercel',
      'Link your GitHub commit in your LinkedIn post with a short reflection',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-01-setup',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day1',
    submittedAt: '2026-07-28T22:14:00+05:30',
  },
  {
    day: 2,
    date: '2026-07-29',
    status: 'completed',
    title: 'HTML + CSS fundamentals',
    briefSummary: 'Build a personal card component from scratch.',
    description:
      'No frameworks. No shortcuts. Build a responsive personal card component using only HTML and CSS. This is the foundation everything else rests on — get the semantics right.',
    difficulty: 'easy',
    tags: ['html', 'css', 'responsive', 'semantics'],
    requirements: [
      'Use semantic HTML5 elements (header, main, section, article)',
      'Build a card that displays: name, role, college, and two social links',
      'Make it responsive at 390px and 1280px without using a framework',
      'Achieve a Lighthouse accessibility score of 90+',
      'Host on GitHub Pages',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-02-card',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day2',
    submittedAt: '2026-07-29T23:01:00+05:30',
  },
  {
    day: 3,
    date: '2026-07-30',
    status: 'completed',
    title: 'JavaScript DOM manipulation',
    briefSummary: 'Build a todo list — no libraries, pure JS.',
    description:
      'The classic, but done right. Build a todo list using vanilla JavaScript — add, complete, delete. No frameworks. The goal is DOM fluency: you should be able to do this without looking anything up by end of week.',
    difficulty: 'easy',
    tags: ['javascript', 'dom', 'vanilla', 'crud'],
    requirements: [
      'Add a task with Enter key and a button',
      'Mark tasks complete with a click (toggles, does not delete)',
      'Delete tasks individually',
      'Persist tasks to localStorage so they survive a refresh',
      'No jQuery, no React — pure DOM API only',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-03-todo',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day3',
    submittedAt: '2026-07-30T21:45:00+05:30',
  },
  {
    day: 4,
    date: '2026-07-31',
    status: 'completed',
    title: 'Fetch API + REST basics',
    briefSummary: 'Consume a public API and render the data.',
    description:
      'APIs are the connective tissue of the web. Today you fetch real data from a public REST API, handle loading/error states gracefully, and render it. No SDK, no wrapper — just fetch().',
    difficulty: 'medium',
    tags: ['javascript', 'api', 'fetch', 'async'],
    requirements: [
      'Use the GitHub Users API (api.github.com/users/{username})',
      'Show a loading skeleton while the request is in flight',
      'Handle and display errors (bad username, network failure)',
      'Display: avatar, name, bio, followers, public repos',
      'Debounce the search input — no request on every keystroke',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-04-github-finder',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day4',
    submittedAt: '2026-07-31T22:58:00+05:30',
  },
  {
    day: 5,
    date: '2026-08-01',
    status: 'completed',
    title: 'React fundamentals',
    briefSummary: 'Re-build Day 3\'s todo in React — notice the difference.',
    description:
      'Now that you\'ve felt the pain of vanilla DOM manipulation, rebuild the todo list in React. Focus on: state, props, lifting state up, and why components are better than copy-pasting DOM code.',
    difficulty: 'medium',
    tags: ['react', 'state', 'components', 'hooks'],
    requirements: [
      'Create with Vite (not CRA)',
      'Components: App, TodoList, TodoItem, AddTodo',
      'Use useState — no useReducer yet',
      'Lift state up correctly — no prop drilling beyond 2 levels',
      'Persist to localStorage using useEffect',
      'Write a one-para LinkedIn post comparing it to the vanilla version',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-05-react-todo',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day5',
    submittedAt: '2026-08-01T23:30:00+05:30',
  },
  {
    day: 6,
    date: '2026-08-02',
    status: 'completed',
    title: 'Tailwind CSS layout',
    briefSummary: 'Build a responsive nav + hero section.',
    description:
      'Tailwind is not just utility classes — it\'s a constraint system that forces layout decisions. Build a full-width nav and a hero section that works at 390px, 768px, and 1280px. Think about spacing relationships, not just colors.',
    difficulty: 'medium',
    tags: ['tailwind', 'responsive', 'layout', 'css'],
    requirements: [
      'Mobile hamburger menu that works on 390px',
      'Desktop nav with links on one line at 1024px+',
      'Hero: headline, subtext, one primary CTA, one secondary CTA',
      'Hero must fit in the initial viewport (no scroll to see CTA)',
      'No hardcoded pixel values — use Tailwind spacing scale only',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-06-tailwind-layout',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day6',
    submittedAt: '2026-08-02T22:10:00+05:30',
  },
  {
    day: 7,
    date: '2026-08-03',
    status: 'recovered',  // ← Missed, then submitted within recovery window
    title: 'Node.js + Express basics',
    briefSummary: 'Build your first REST API with Express.',
    description:
      'The other half of full stack. Build a simple Express server with CRUD endpoints for a notes resource. No database yet — just in-memory. Focus on routing, middleware, and request/response handling.',
    difficulty: 'medium',
    tags: ['nodejs', 'express', 'rest', 'api'],
    requirements: [
      'GET /notes — return all notes',
      'POST /notes — create a note (validate: title required)',
      'PUT /notes/:id — update a note',
      'DELETE /notes/:id — delete a note',
      'Add a simple request logger middleware',
      'Test all endpoints with Postman or Thunder Client',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-07-express-api',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day7',
    submittedAt: '2026-08-04T18:30:00+05:30', // Submitted next day — recovery
    recoveryDeadline: '2026-08-04T23:59:00+05:30',
  },
  {
    day: 8,
    date: '2026-08-04',
    status: 'completed',
    title: 'MongoDB + Mongoose',
    briefSummary: 'Connect your Express API to a real database.',
    description:
      'In-memory data dies when the server restarts. Today you connect yesterday\'s Express API to MongoDB using Mongoose. Real schema, real persistence, real queries.',
    difficulty: 'medium',
    tags: ['mongodb', 'mongoose', 'database', 'backend'],
    requirements: [
      'Set up a free MongoDB Atlas cluster',
      'Define a Mongoose schema for your notes (title, body, createdAt)',
      'Replace in-memory array with actual DB queries',
      'Add .env for connection string — never commit secrets',
      'Handle connection errors gracefully (don\'t let the server crash)',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-08-mongodb',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day8',
    submittedAt: '2026-08-04T23:05:00+05:30',
  },
  {
    day: 9,
    date: '2026-08-05',
    status: 'completed',
    title: 'JWT Authentication',
    briefSummary: 'Add login and protected routes to your API.',
    description:
      'Authentication is the gate. Build a full register/login flow using JWT. Protect your notes routes so only the owner can see and modify their notes. No third-party auth libraries — just jsonwebtoken and bcrypt.',
    difficulty: 'hard',
    tags: ['jwt', 'auth', 'security', 'bcrypt'],
    requirements: [
      'POST /auth/register — hash password with bcrypt, store user',
      'POST /auth/login — verify password, return JWT',
      'Protect /notes routes with a verifyToken middleware',
      'Notes are scoped to the logged-in user (userId on schema)',
      'JWT expiry: 7 days',
      'Explain in your LinkedIn post why you should never store plain passwords',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-09-jwt-auth',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day9',
    submittedAt: '2026-08-05T22:44:00+05:30',
  },
  {
    day: 10,
    date: '2026-08-06',
    status: 'completed',
    title: 'React Router + protected routes',
    briefSummary: 'Add client-side routing with auth guards.',
    description:
      'Single Page Apps live and die by their routing. Add React Router to your frontend, create a login/register page, and protect routes behind an auth check. Your JWT from the backend is now driving the frontend too.',
    difficulty: 'hard',
    tags: ['react-router', 'auth', 'spa', 'protected-routes'],
    requirements: [
      'Routes: /, /login, /register, /dashboard (protected)',
      'Redirect unauthenticated users from /dashboard to /login',
      'Store JWT in memory (not localStorage — explain why in your post)',
      'Handle token expiry — redirect to login, clear state',
      'Add a loading spinner during auth check on mount',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-10-react-router',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day10',
    submittedAt: '2026-08-06T21:55:00+05:30',
  },
  {
    day: 11,
    date: '2026-08-07',
    status: 'completed',
    title: 'Full stack connect',
    briefSummary: 'Wire React frontend to your Express + MongoDB backend.',
    description:
      'The full stack moment. Connect your React app to your Express API. Real login, real notes, real database. Fix the CORS errors, handle the async states properly, and deploy both to Render.',
    difficulty: 'hard',
    tags: ['fullstack', 'cors', 'deployment', 'render'],
    requirements: [
      'Configure CORS on Express to allow your frontend origin',
      'Login flow: form → POST /auth/login → store token → redirect to dashboard',
      'Dashboard: fetch /notes on mount, display all user notes',
      'Create, update, delete notes — UI updates optimistically',
      'Deploy backend to Render, frontend to Vercel',
      'Both must be live — submit two URLs',
    ],
    githubUrl: 'https://github.com/arjunbuilds/day-11-fullstack',
    linkedinUrl: 'https://linkedin.com/posts/arjunbuilds_day11',
    submittedAt: '2026-08-07T22:22:00+05:30',
  },
  {
    day: 12,
    date: '2026-08-08',
    status: 'today',     // ← Current day — pending submission
    title: 'Error handling + loading states',
    briefSummary: 'Make your app handle failure gracefully.',
    description:
      'Your app works when everything goes right. Today you make it work when things go wrong. Proper error boundaries in React, meaningful error messages (not "Something went wrong"), retry logic, and skeleton screens instead of spinners.',
    difficulty: 'medium',
    tags: ['error-handling', 'ux', 'loading-states', 'react'],
    requirements: [
      'Add an ErrorBoundary component that catches render errors gracefully',
      'Replace all generic spinners with skeleton screens matching the actual content shape',
      'Show meaningful error messages — tell the user what failed and what to do',
      'Add retry logic for failed API calls (max 3 retries with exponential backoff)',
      'Handle offline state — detect network loss and surface a recovery UI',
      'Test by throttling to Slow 3G in DevTools and forcing 400/500 responses',
    ],
  },
  {
    day: 13,
    date: '2026-08-09',
    status: 'upcoming',
    title: 'React Query / TanStack Query',
    briefSummary: 'Replace useEffect data fetching with proper server state.',
    description:
      'useEffect for data fetching is a known footgun. React Query solves: caching, stale-while-revalidate, background refetching, and mutation with optimistic updates. This is what production apps use.',
    difficulty: 'hard',
    tags: ['react-query', 'tanstack', 'server-state', 'caching'],
    requirements: [
      'Install and configure TanStack Query with QueryClient',
      'Replace all useEffect+fetch patterns with useQuery',
      'Replace POST/PUT/DELETE calls with useMutation',
      'Configure staleTime: 60_000 for notes query',
      'Add optimistic updates on note creation',
      'Show background refetch indicator in the UI',
    ],
  },
  {
    day: 14,
    date: '2026-08-10',
    status: 'upcoming',
    title: 'Form validation with Zod',
    briefSummary: 'Schema-validate every form, front and back.',
    description:
      'Trust no input. Use Zod to define schemas that validate on the client (fast UX feedback) and the same schema on the server (real security). One schema, two environments.',
    difficulty: 'medium',
    tags: ['zod', 'validation', 'forms', 'typescript'],
    requirements: [
      'Define Zod schemas for: registerSchema, loginSchema, noteSchema',
      'Use react-hook-form + zodResolver on all forms',
      'Show inline validation errors as the user types (not on submit)',
      'Reuse the same Zod schemas in your Express route handlers',
      'Add custom error messages — no default "String must contain at least 1 character"',
    ],
  },
  {
    day: 15,
    date: '2026-08-11',
    status: 'upcoming',
    title: 'File uploads with Cloudinary',
    briefSummary: 'Add image upload to notes with preview and progress.',
    description:
      'Real apps deal with files. Add image attachment support to your notes using Cloudinary. Multipart upload, progress indicator, and graceful fallback if the upload fails.',
    difficulty: 'hard',
    tags: ['cloudinary', 'file-upload', 'multer', 'react'],
    requirements: [
      'Add multer middleware on the Express route',
      'Upload to Cloudinary and store the URL on the note document',
      'Show upload progress percentage in the UI',
      'Preview the image before it\'s uploaded (FileReader API)',
      'Limit: 5MB, jpg/png/webp only — validate on both client and server',
      'If upload fails, the note should still save without the image',
    ],
  },
]

// ─── Streak Stats (derived from days array, baked in for quick access) ────────

export const streak: StreakStats = {
  current: 12,         // Days 1–7 (recovered) + 8–12 (today counts)
  longest: 12,
  totalCompleted: 11,  // 10 completed + 1 recovered (day 7)
  totalMissed: 0,      // No expired grace windows
  totalRecovered: 1,   // Day 7 saved via grace window
  completionPercent: Math.round((11 / 60) * 100), // ~18%
  totalDays: 60,
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export const achievements: Achievement[] = [
  {
    id: 'ach_first_commit',
    title: 'First Link',
    description: 'Submitted your very first day.',
    icon: 'GitCommit',
    unlockedAt: '2026-07-28',
  },
  {
    id: 'ach_week_one',
    title: 'Week One',
    description: 'Completed 7 days in the challenge.',
    icon: 'CalendarCheck',
    unlockedAt: '2026-08-03',
  },
  {
    id: 'ach_recovered',
    title: 'Repaired',
    description: 'Used a Recovery Grace Window to save your streak.',
    icon: 'Wrench',
    unlockedAt: '2026-08-04',
  },
  {
    id: 'ach_hard_done',
    title: 'Hard Mode',
    description: 'Completed a day rated Hard difficulty.',
    icon: 'Fire',
    unlockedAt: '2026-08-05',
  },
  {
    id: 'ach_fullstack',
    title: 'Full Stack',
    description: 'Connected frontend to backend — both running live.',
    icon: 'Stack',
    unlockedAt: '2026-08-07',
  },
  {
    id: 'ach_halfway',
    title: 'Halfway',
    description: 'Reach Day 30.',
    icon: 'Medal',
    unlockedAt: undefined,  // Locked
  },
  {
    id: 'ach_no_miss',
    title: 'Clean Chain',
    description: 'Complete 30 days with no missed days.',
    icon: 'Link',
    unlockedAt: undefined,  // Locked
  },
  {
    id: 'ach_finisher',
    title: 'Finisher',
    description: 'Complete all 60 days.',
    icon: 'Trophy',
    unlockedAt: undefined,  // Locked
  },
]

// ─── Edge Case Data ───────────────────────────────────────────────────────────
// These are standalone data objects for explicitly rendering edge-case UI states.
// Import and use them in stories, Storybook, or edge-case route params.

// EDGE CASE 1: Brand new student — zero streak, no submissions yet
export const edgeCase_emptyProfile: MockData = {
  student: {
    id: 'stu_new_001',
    name: 'Priya Sharma',
    handle: '@priyabuilds',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    college: 'Sapthagiri College of Engineering',
    city: 'Bengaluru',
    track: 'dsa',
    trackLabel: 'Data Structures & Algorithms',
    startDate: '2026-08-08', // Just joined today
    github: 'https://github.com/priyabuilds',
    linkedin: 'https://linkedin.com/in/priyabuilds',
    bio: '',  // No bio yet
  },
  streak: {
    current: 0,
    longest: 0,
    totalCompleted: 0,
    totalMissed: 0,
    totalRecovered: 0,
    completionPercent: 0,
    totalDays: 60,
  },
  days: [
    {
      day: 1,
      date: '2026-08-08',
      status: 'today',
      title: 'Arrays and Two Pointers',
      briefSummary: 'Solve 3 two-pointer problems from scratch.',
      description:
        'Two pointers is one of the most powerful patterns in DSA — and most students never really understand why it works. Today you solve 3 problems using it, explain your approach, and commit clean code.',
      difficulty: 'easy',
      tags: ['arrays', 'two-pointers', 'leetcode'],
      requirements: [
        'Solve: Two Sum (LeetCode #1)',
        'Solve: Container With Most Water (LeetCode #11)',
        'Solve: 3Sum (LeetCode #15)',
        'Write comments explaining the time complexity of each solution',
        'Push all 3 solutions to a public GitHub repo',
        'Post on LinkedIn: what the two-pointer pattern actually is, in plain English',
      ],
    },
    // Days 2–60 are upcoming
    ...Array.from({ length: 59 }, (_, i) => ({
      day: i + 2,
      date: '',
      status: 'upcoming' as DayStatus,
      title: `Day ${i + 2} — Coming soon`,
      briefSummary: 'Task revealed on the day.',
      description: 'This task will be revealed when you reach this day.',
      difficulty: 'medium' as Difficulty,
      tags: [],
      requirements: [],
    })),
  ],
  achievements: [
    {
      id: 'ach_first_commit',
      title: 'First Link',
      description: 'Submitted your very first day.',
      icon: 'GitCommit',
      unlockedAt: undefined,
    },
    {
      id: 'ach_week_one',
      title: 'Week One',
      description: 'Complete 7 consecutive days.',
      icon: 'CalendarCheck',
      unlockedAt: undefined,
    },
    {
      id: 'ach_recovered',
      title: 'Repaired',
      description: 'Use a Recovery Grace Window to save your streak.',
      icon: 'Wrench',
      unlockedAt: undefined,
    },
    {
      id: 'ach_hard_done',
      title: 'Hard Mode',
      description: 'Complete a day rated Hard difficulty.',
      icon: 'Fire',
      unlockedAt: undefined,
    },
    {
      id: 'ach_fullstack',
      title: 'Full Stack',
      description: 'Connected frontend to backend — both running live.',
      icon: 'Stack',
      unlockedAt: undefined,
    },
    {
      id: 'ach_halfway',
      title: 'Halfway',
      description: 'Reach Day 30.',
      icon: 'Medal',
      unlockedAt: undefined,
    },
    {
      id: 'ach_no_miss',
      title: 'Clean Chain',
      description: 'Complete 30 days with no missed days.',
      icon: 'Link',
      unlockedAt: undefined,
    },
    {
      id: 'ach_finisher',
      title: 'Finisher',
      description: 'Complete all 60 days.',
      icon: 'Trophy',
      unlockedAt: undefined,
    },
  ],
}

// ─── Rahul Nair — Missed Day student persona ─────────────────────────────────
// DevOps track, Chennai, 4 days in, missed Day 5, recovery window open
const studentRahul: StudentProfile = {
  id: 'stu_rahul_001',
  name: 'Rahul Nair',
  handle: '@rahulops',
  avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
  college: 'SRM Institute of Science and Technology',
  city: 'Chennai',
  track: 'devops',
  trackLabel: 'DevOps Engineering',
  startDate: '2026-08-04',
  github: 'https://github.com/rahulops',
  linkedin: 'https://linkedin.com/in/rahulops',
  bio: 'Infrastructure obsessed. CI/CD pipelines by day, Docker containers by night.',
}

const achievementsRahul: Achievement[] = [
  {
    id: 'ach_first_commit',
    title: 'First Link',
    description: 'Submitted your very first day.',
    icon: 'GitCommit',
    unlockedAt: '2026-08-04',
  },
  // All others locked — only 4 days in and one already missed
  {
    id: 'ach_week_one',
    title: 'Week One',
    description: 'Complete 7 consecutive days.',
    icon: 'CalendarCheck',
    unlockedAt: undefined,
  },
  {
    id: 'ach_recovered',
    title: 'Repaired',
    description: 'Use a Recovery Grace Window to save your streak.',
    icon: 'Wrench',
    unlockedAt: undefined,  // Will unlock if he repairs Day 5
  },
  {
    id: 'ach_hard_done',
    title: 'Hard Mode',
    description: 'Complete a day rated Hard difficulty.',
    icon: 'Fire',
    unlockedAt: undefined,
  },
  {
    id: 'ach_fullstack',
    title: 'Full Stack',
    description: 'Connected frontend to backend — both running live.',
    icon: 'Stack',
    unlockedAt: undefined,
  },
  {
    id: 'ach_halfway',
    title: 'Halfway',
    description: 'Reach Day 30.',
    icon: 'Medal',
    unlockedAt: undefined,
  },
  {
    id: 'ach_no_miss',
    title: 'Clean Chain',
    description: 'Complete 30 days with no missed days.',
    icon: 'Link',
    unlockedAt: undefined,
  },
  {
    id: 'ach_finisher',
    title: 'Finisher',
    description: 'Complete all 60 days.',
    icon: 'Trophy',
    unlockedAt: undefined,
  },
]

// EDGE CASE 2: Missed day — streak at risk, recovery window active
export const edgeCase_missedDay: MockData = {
  student: studentRahul,
  streak: {
    current: 4,
    longest: 4,
    totalCompleted: 4,
    totalMissed: 1,
    totalRecovered: 0,
    completionPercent: Math.round((4 / 60) * 100),
    totalDays: 60,
  },
  days: [
    {
      day: 1,
      date: '2026-08-04',
      status: 'completed',
      title: 'Linux + Terminal basics',
      briefSummary: 'Navigate the terminal without a mouse — all day.',
      description:
        'Every DevOps engineer lives in the terminal. Today you master basic Linux navigation, file permissions, and write your first Bash script that actually does something useful.',
      difficulty: 'easy',
      tags: ['linux', 'bash', 'terminal'],
      requirements: [
        'Navigate the full filesystem using only terminal commands',
        'Create and manage files/dirs with mkdir, touch, cp, mv, rm',
        'Write a Bash script that auto-creates a project folder structure',
        'Set file permissions correctly with chmod',
        'Push your script to a public GitHub repo',
      ],
      githubUrl: 'https://github.com/rahulops/day-01-linux',
      linkedinUrl: 'https://linkedin.com/posts/rahulops_day1',
      submittedAt: '2026-08-04T21:30:00+05:30',
    },
    {
      day: 2,
      date: '2026-08-05',
      status: 'completed',
      title: 'Docker fundamentals',
      briefSummary: 'Containerise a Node.js app from scratch.',
      description:
        'Containers changed everything. Today you write a Dockerfile, build an image, run a container, and push it to Docker Hub. No Docker Desktop GUI — CLI only.',
      difficulty: 'medium',
      tags: ['docker', 'containers', 'node'],
      requirements: [
        'Write a production-grade Dockerfile for a Node.js Express app',
        'Build and tag the image locally',
        'Run the container and verify it serves on port 3000',
        'Push the image to Docker Hub',
        'Document the build and run commands in your README',
      ],
      githubUrl: 'https://github.com/rahulops/day-02-docker',
      linkedinUrl: 'https://linkedin.com/posts/rahulops_day2',
      submittedAt: '2026-08-05T23:10:00+05:30',
    },
    {
      day: 3,
      date: '2026-08-06',
      status: 'completed',
      title: 'Git workflows',
      briefSummary: 'Branch, rebase, and resolve conflicts like a senior.',
      description:
        'Git is not just commit and push. Today you work through feature branching, rebasing, cherry-picking, and intentional merge conflicts — then resolve them cleanly.',
      difficulty: 'easy',
      tags: ['git', 'branching', 'rebase'],
      requirements: [
        'Create a feature branch, make changes, then merge back to main',
        'Rebase a branch onto main — do not use merge',
        'Intentionally create and then resolve a merge conflict',
        'Cherry-pick a single commit from one branch to another',
        'Write a .gitignore that covers Node.js, Python, and OS artifacts',
      ],
      githubUrl: 'https://github.com/rahulops/day-03-git',
      linkedinUrl: 'https://linkedin.com/posts/rahulops_day3',
      submittedAt: '2026-08-06T22:00:00+05:30',
    },
    {
      day: 4,
      date: '2026-08-07',
      status: 'completed',
      title: 'CI with GitHub Actions',
      briefSummary: 'Write a pipeline that lints, tests, and builds on every push.',
      description:
        'CI is the backbone of modern engineering. Today you write a GitHub Actions workflow that runs on every push: lints your code, runs tests, and builds the Docker image.',
      difficulty: 'medium',
      tags: ['ci', 'github-actions', 'yaml'],
      requirements: [
        'Create a .github/workflows/ci.yml file from scratch',
        'Trigger on push to main and on every pull request',
        'Run ESLint or a linter of your choice',
        'Run at least one test (even a simple health-check script)',
        'Build the Docker image and report success/failure',
      ],
      githubUrl: 'https://github.com/rahulops/day-04-ci',
      linkedinUrl: 'https://linkedin.com/posts/rahulops_day4',
      submittedAt: '2026-08-07T22:45:00+05:30',
    },
    {
      day: 5,
      date: '2026-08-08',
      status: 'missed',
      title: 'Nginx reverse proxy',
      briefSummary: 'Route traffic through Nginx — no direct port exposure.',
      description:
        'Nginx is the front door of the internet. Today you configure it as a reverse proxy, pointing at your Dockerised app, with SSL termination via a self-signed cert.',
      difficulty: 'medium',
      tags: ['nginx', 'reverse-proxy', 'ssl'],
      requirements: [
        'Install and start Nginx on an EC2 instance or local VM',
        'Configure a server block that proxies to your Docker app on port 3000',
        'Generate a self-signed SSL cert and enable HTTPS',
        'Test with curl — no browser, raw HTTP only',
        'Document your nginx.conf with comments explaining each directive',
      ],
      recoveryDeadline: '2026-08-09T23:59:00+05:30',
    },
    {
      day: 6,
      date: '2026-08-09',
      status: 'today',
      title: 'Docker Compose',
      briefSummary: 'Orchestrate a multi-container app with one command.',
      description:
        'Real apps are never one container. Today you write a docker-compose.yml that runs your Node app, a MongoDB database, and a Redis cache — all networked together.',
      difficulty: 'medium',
      tags: ['docker-compose', 'mongodb', 'redis'],
      requirements: [
        'Write a docker-compose.yml with 3 services: app, mongo, redis',
        'Use named volumes for data persistence',
        'Define a custom bridge network — no default networking',
        'Add health checks to the mongo and redis services',
        'Confirm all services start with docker compose up -d',
      ],
    },
    ...Array.from({ length: 54 }, (_, i) => ({
      day: i + 7,
      date: '',
      status: 'upcoming' as DayStatus,
      title: `Day ${i + 7}`,
      briefSummary: 'Task revealed on the day.',
      description: 'This task will be revealed when you reach this day.',
      difficulty: 'medium' as Difficulty,
      tags: [],
      requirements: [],
    })),
  ],
  achievements: achievementsRahul,
}

// EDGE CASE 3: Zero streak — first day of the challenge
// (same as emptyProfile but with streak = 0 explicitly foregrounded)
export const edgeCase_zeroStreak: MockData = edgeCase_emptyProfile

// ─── Main export ──────────────────────────────────────────────────────────────

const mockData: MockData = {
  student,
  streak,
  days,
  achievements,
}

export default mockData
