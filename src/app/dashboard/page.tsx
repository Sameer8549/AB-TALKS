'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import StreakCard from '@/components/StreakCard'
import { student, streak, days, achievements } from '@/data/mockData'
import type { Achievement, DayTask } from '@/data/mockData'

// ─── Data slices ──────────────────────────────────────────────────────────────
const todayTask = days.find(d => d.status === 'today')!
const pastDays  = days
  .filter(d => d.status === 'completed' || d.status === 'recovered')
  .slice()
  .reverse()
  .slice(0, 5)

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DiffBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    easy:   { label: 'Easy',   color: '#22C55E', bg: 'rgba(34,197,94,0.10)'   },
    medium: { label: 'Medium', color: 'var(--signal)', bg: 'var(--signal-faint)' },
    hard:   { label: 'Hard',   color: '#EF4444', bg: 'rgba(239,68,68,0.10)'   },
  }
  const { label, color, bg } = map[level] ?? map.medium
  return (
    <span
      className="font-mono uppercase inline-block"
      style={{
        fontSize: 9, letterSpacing: '0.18em',
        color, background: bg,
        padding: '2px 8px', borderRadius: 99,
        border: `1px solid ${color}33`,
      }}
    >
      {label}
    </span>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    completed: { label: 'Done',      color: '#22C55E' },
    recovered: { label: 'Recovered', color: 'var(--signal)' },
    missed:    { label: 'Missed',    color: '#EF4444' },
  }
  const { label, color } = map[status] ?? { label: status, color: 'var(--ash)' }
  return (
    <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color, textTransform: 'uppercase' }}>
      {label}
    </span>
  )
}

// ─── Today task submission form ───────────────────────────────────────────────
function SubmitForm({ task }: { task: DayTask }) {
  const [github,   setGithub]   = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  const canSubmit = github.trim().startsWith('https://') && linkedin.trim().startsWith('https://')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1100))   // Simulate request
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-5 rounded-card p-4 flex flex-col items-center gap-2 text-center"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.5 9.5L7 13L14.5 5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <p className="font-display font-bold text-chalk" style={{ fontSize: 15 }}>Day {task.day} submitted!</p>
        <p className="font-body text-ash" style={{ fontSize: 12 }}>Your proof is locked in. Chain holds.</p>
        <div className="flex gap-3 mt-1">
          <a href={github} target="_blank" rel="noopener noreferrer" className="font-mono text-signal hover:underline" style={{ fontSize: 11 }}>GitHub →</a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-signal hover:underline" style={{ fontSize: 11 }}>LinkedIn →</a>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
      <p className="font-mono text-ash uppercase" style={{ fontSize: 9, letterSpacing: '0.18em' }}>
        Submit Proof
      </p>

      {/* GitHub input */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-ash" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
          GitHub commit / repo URL
        </label>
        <input
          id="github-url"
          type="url"
          placeholder="https://github.com/username/repo"
          value={github}
          onChange={e => setGithub(e.target.value)}
          className="w-full rounded-[8px] px-3 py-2.5 font-mono text-chalk placeholder-ash/40 bg-transparent focus:outline-none transition-colors"
          style={{
            fontSize: 12,
            border: '1px solid var(--rim)',
            background: 'var(--graphite)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--signal)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--rim)' }}
        />
      </div>

      {/* LinkedIn input */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-ash" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
          LinkedIn post URL
        </label>
        <input
          id="linkedin-url"
          type="url"
          placeholder="https://linkedin.com/posts/..."
          value={linkedin}
          onChange={e => setLinkedin(e.target.value)}
          className="w-full rounded-[8px] px-3 py-2.5 font-mono text-chalk placeholder-ash/40 bg-transparent focus:outline-none transition-colors"
          style={{
            fontSize: 12,
            border: '1px solid var(--rim)',
            background: 'var(--graphite)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--signal)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--rim)' }}
        />
      </div>

      <motion.button
        id="submit-proof-btn"
        type="submit"
        disabled={!canSubmit || loading}
        className="mt-1 rounded-pill py-2.5 font-display font-bold transition-all"
        style={{
          fontSize: 13,
          background: canSubmit ? 'var(--signal)' : 'var(--graphite)',
          color: canSubmit ? 'var(--ink)' : 'var(--ash)',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          border: 'none',
        }}
        whileTap={canSubmit ? { scale: 0.97 } : {}}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="inline-block w-3.5 h-3.5 rounded-full border-2"
              style={{ borderColor: 'var(--ink)', borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            />
            Locking it in…
          </span>
        ) : 'Lock in Day ' + task.day}
      </motion.button>
    </form>
  )
}

// ─── Achievement badge ────────────────────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  GitCommit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12h6M16 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  CalendarCheck: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 2v4M16 2v4M3 10h18M9 15l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Wrench: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Fire: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 7 6 7 12a5 5 0 0010 0c0-2-.5-3.5-2-5 0 0 .5 2-1 3.5-1-1-2-3.5-2-5.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Stack: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Medal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M8.21 3h7.58L19 9H5L8.21 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  Link: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Trophy: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h12v8a6 6 0 01-12 0V2z" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 4H3a2 2 0 00-2 2v2a4 4 0 004 4M18 4h3a2 2 0 012 2v2a4 4 0 01-4 4M12 16v4M9 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
}

function AchievementBadge({ ach, index }: { ach: Achievement; index: number }) {
  const unlocked = !!ach.unlockedAt
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="rounded-card p-3 flex flex-col items-center gap-1.5 text-center"
      style={{
        background: 'var(--coal)',
        border: `1px solid ${unlocked ? 'var(--signal-glow)' : 'var(--rim)'}`,
        opacity: unlocked ? 1 : 0.45,
        boxShadow: unlocked ? 'var(--shadow-card, none)' : 'none',
        minWidth: 0,
      }}
      title={ach.description}
    >
      <span style={{ color: unlocked ? 'var(--signal)' : 'var(--ash)' }}>
        {ICONS[ach.icon] ?? <span style={{ fontSize: 18 }}>◆</span>}
      </span>
      <p className="font-display font-bold text-chalk" style={{ fontSize: 10, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
        {ach.title}
      </p>
    </motion.div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [reqOpen, setReqOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <NavBar />

      {/* ── Profile header ─────────────────────────────────────────────── */}
      <motion.div
        className="pt-16"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      >
        <div
          className="border-b"
          style={{ borderColor: 'var(--rim)', background: 'var(--coal)' }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

            {/* Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-signal/30 ring-offset-1 ring-offset-coal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(1.05)' }}
              />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h1
                  className="font-display font-bold text-chalk"
                  style={{ fontSize: 20, letterSpacing: '-0.025em' }}
                >
                  {student.name}
                </h1>
                <span className="font-mono text-ash" style={{ fontSize: 12 }}>
                  {student.handle}
                </span>
              </div>
              <p className="font-body text-ash mt-0.5 truncate" style={{ fontSize: 12 }}>
                {student.college} · {student.city} ·{' '}
                <span className="text-signal">{student.trackLabel}</span>
              </p>
            </div>

            {/* Streak badge */}
            <div
              className="flex-shrink-0 flex items-center gap-3 rounded-card px-4 py-2"
              style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}
            >
              <div className="text-center">
                <motion.p
                  className="font-display font-bold text-signal"
                  style={{ fontSize: 28, letterSpacing: '-0.04em', lineHeight: 1 }}
                  animate={{ opacity: [1, 0.65, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {streak.current}
                </motion.p>
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8, letterSpacing: '0.18em' }}>
                  day streak
                </p>
              </div>
              <div
                className="h-8 w-px"
                style={{ background: 'var(--rim)' }}
              />
              <div className="text-center">
                <p className="font-display font-bold text-chalk" style={{ fontSize: 18, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {streak.totalCompleted}
                </p>
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8, letterSpacing: '0.18em' }}>
                  done
                </p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-chalk" style={{ fontSize: 18, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {streak.longest}
                </p>
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8, letterSpacing: '0.18em' }}>
                  best
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_352px] gap-6 items-start">

        {/* ── LEFT: Today's task + history ─────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Today's task card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-card overflow-hidden"
            style={{
              background: 'var(--coal)',
              border: '1px solid var(--rim)',
              boxShadow: 'var(--shadow-card, none)',
            }}
          >
            {/* Signal top bar — indicates urgency / today */}
            <motion.div
              className="h-[3px]"
              style={{ background: 'linear-gradient(to right, #C07820, #F4B942, #FFD060, #F4B942)' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            <div className="p-5 sm:p-6">
              {/* Day + difficulty header */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="font-mono text-signal font-semibold"
                  style={{ fontSize: 11, letterSpacing: '0.14em' }}
                >
                  DAY {todayTask.day}
                </span>
                <DiffBadge level={todayTask.difficulty} />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--ash)' }}
                >
                  · TODAY
                </span>
              </div>

              {/* Task title */}
              <h2
                className="font-display font-bold text-chalk"
                style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
              >
                {todayTask.title}
              </h2>

              {/* Description */}
              <p className="font-body text-ash mt-3 leading-relaxed" style={{ fontSize: 13 }}>
                {todayTask.description}
              </p>

              {/* Requirements — expandable */}
              <div className="mt-4">
                <button
                  id="toggle-requirements"
                  onClick={() => setReqOpen(r => !r)}
                  className="flex items-center gap-2 font-mono text-signal hover:text-chalk transition-colors"
                  style={{ fontSize: 11, letterSpacing: '0.1em', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <motion.span
                    animate={{ rotate: reqOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▶
                  </motion.span>
                  REQUIREMENTS ({todayTask.requirements.length})
                </button>

                <AnimatePresence initial={false}>
                  {reqOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 flex flex-col gap-2">
                        {todayTask.requirements.map((req, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-start gap-2.5"
                            style={{ listStyle: 'none' }}
                          >
                            <span
                              className="flex-shrink-0 w-4 h-4 rounded-sm mt-0.5 flex items-center justify-center"
                              style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}
                            >
                              <span className="font-mono text-ash" style={{ fontSize: 7, lineHeight: 1 }}>
                                {i + 1}
                              </span>
                            </span>
                            <span className="font-body text-ash leading-relaxed" style={{ fontSize: 12.5 }}>
                              {req}
                            </span>
                          </motion.li>
                        ))}
                      </div>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {todayTask.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-mono"
                    style={{
                      fontSize: 9, letterSpacing: '0.1em',
                      color: 'var(--ash)',
                      background: 'var(--graphite)',
                      border: '1px solid var(--rim)',
                      padding: '2px 8px',
                      borderRadius: 99,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="my-5 h-px" style={{ background: 'var(--rim)' }} />

              {/* Submission form */}
              <SubmitForm task={todayTask} />
            </div>
          </motion.div>

          {/* Recent history */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-card overflow-hidden"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)', boxShadow: 'var(--shadow-card, none)' }}
          >
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--rim)' }}>
              <p className="font-mono text-ash uppercase" style={{ fontSize: 9, letterSpacing: '0.2em' }}>
                Recent History
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--rim)' }}>
              {pastDays.map((d, i) => (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="px-5 py-3.5 flex items-center gap-4"
                >
                  <span
                    className="font-mono text-signal flex-shrink-0"
                    style={{ fontSize: 11, letterSpacing: '0.1em', minWidth: 40 }}
                  >
                    Day {d.day}
                  </span>
                  <p className="font-body text-chalk flex-1 truncate" style={{ fontSize: 13 }}>
                    {d.title}
                  </p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <DiffBadge level={d.difficulty} />
                    <StatusBadge status={d.status} />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--rim)' }}>
              <Link
                href="#"
                className="font-mono text-signal hover:text-chalk transition-colors"
                style={{ fontSize: 11, letterSpacing: '0.08em' }}
              >
                View all {days.filter(d => d.status === 'completed' || d.status === 'recovered').length} completed days →
              </Link>
            </div>
          </motion.div>

        </div>

        {/* ── RIGHT sidebar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Streak card — reuse landing page component */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          >
            <StreakCard />
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-card overflow-hidden"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)', boxShadow: 'var(--shadow-card, none)' }}
          >
            <div className="px-4 py-3.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--rim)' }}>
              <p className="font-mono text-ash uppercase" style={{ fontSize: 9, letterSpacing: '0.2em' }}>
                Achievements
              </p>
              <span className="font-mono text-signal" style={{ fontSize: 11 }}>
                {achievements.filter(a => a.unlockedAt).length} / {achievements.length}
              </span>
            </div>
            <div className="p-3 grid grid-cols-4 gap-2">
              {achievements.map((ach, i) => (
                <AchievementBadge key={ach.id} ach={ach} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-card p-4 flex flex-col gap-2"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}
          >
            <p className="font-mono text-ash uppercase mb-1" style={{ fontSize: 9, letterSpacing: '0.2em' }}>
              Social
            </p>
            <a
              href={student.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-body text-ash hover:text-chalk transition-colors"
              style={{ fontSize: 12 }}
            >
              <span className="font-mono text-signal" style={{ fontSize: 10 }}>GH</span>
              {student.github.replace('https://', '')}
            </a>
            <a
              href={student.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-body text-ash hover:text-chalk transition-colors"
              style={{ fontSize: 12 }}
            >
              <span className="font-mono text-signal" style={{ fontSize: 10 }}>LI</span>
              {student.linkedin.replace('https://', '')}
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
