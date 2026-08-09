'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import ProofSubmitForm from '@/components/ProofSubmitForm'
import { days } from '@/data/mockData'
import type { DayTask } from '@/data/mockData'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function DiffBadge({ level }: { level: string }) {
  const cfg: Record<string, [string, string]> = {
    easy:   ['#22C55E', 'rgba(34,197,94,0.10)'],
    medium: ['var(--signal)', 'var(--signal-faint)'],
    hard:   ['#EF4444', 'rgba(239,68,68,0.10)'],
  }
  const [color, bg] = cfg[level] ?? cfg.medium
  return (
    <span className="font-mono uppercase inline-flex items-center"
      style={{ fontSize: 8.5, letterSpacing: '0.16em', color, background: bg, padding: '2px 7px', borderRadius: 99, border: `1px solid ${color}33` }}>
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, [string, string, string]> = {
    completed: ['#22C55E', 'rgba(34,197,94,0.10)', 'Done'],
    recovered: ['var(--signal)', 'var(--signal-faint)', 'Recovered'],
    missed:    ['#EF4444', 'rgba(239,68,68,0.10)', 'Missed'],
    today:     ['var(--signal)', 'var(--signal-faint)', 'Today'],
    upcoming:  ['var(--ash)', 'var(--graphite)', 'Upcoming'],
  }
  const [color, bg, label] = cfg[status] ?? cfg.upcoming
  return (
    <span className="font-mono uppercase inline-flex items-center gap-1"
      style={{ fontSize: 8.5, letterSpacing: '0.14em', color, background: bg, padding: '2px 8px', borderRadius: 99, border: `1px solid ${color}33` }}>
      {status === 'today' && (
        <motion.span style={{ width: 4, height: 4, borderRadius: '50%', background: color, display: 'inline-block' }}
          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
      )}
      {label}
    </span>
  )
}

// ─── Proof links (for completed / recovered days) ─────────────────────────────
function ProofPanel({ day }: { day: DayTask }) {
  const hasProof = day.githubUrl || day.linkedinUrl

  return (
    <div className="rounded-card overflow-hidden"
      style={{ background: 'var(--coal)', border: `1px solid ${day.status === 'recovered' ? 'rgba(244,185,66,0.3)' : 'rgba(34,197,94,0.25)'}` }}>
      {/* Header bar */}
      <div className="h-[3px]"
        style={{ background: day.status === 'recovered'
          ? 'linear-gradient(90deg, #7A5010, #C07820, #7A5010)'
          : 'linear-gradient(90deg, #15803D, #22C55E, #15803D)' }}
      />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <motion.div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: day.status === 'recovered' ? 'rgba(244,185,66,0.15)' : 'rgba(34,197,94,0.15)' }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.2 }}>
            {day.status === 'recovered' ? (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6.5L5 9.5L10 3" stroke="var(--signal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6.5L5 9.5L10 3" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </motion.div>
          <p className="font-mono uppercase" style={{
            fontSize: 9, letterSpacing: '0.18em',
            color: day.status === 'recovered' ? 'var(--signal)' : '#22C55E'
          }}>
            {day.status === 'recovered' ? 'Recovered — Gold Seam' : 'Proof Submitted'}
          </p>
        </div>

        {day.submittedAt && (
          <p className="font-mono text-ash mb-4" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
            Submitted {new Date(day.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        )}

        {hasProof ? (
          <div className="flex flex-col gap-2.5">
            {day.githubUrl && (
              <a href={day.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-[8px] px-4 py-3 transition-all hover:brightness-110 group"
                style={{ background: 'var(--graphite)', border: '1px solid var(--rim)', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--chalk)" opacity={0.8}>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-chalk truncate" style={{ fontSize: 11.5 }}>
                    {day.githubUrl.replace('https://github.com/', 'github.com/')}
                  </p>
                  <p className="font-mono text-ash" style={{ fontSize: 9, letterSpacing: '0.08em' }}>GitHub Commit / Repo</p>
                </div>
                <span className="font-mono text-ash group-hover:text-signal transition-colors" style={{ fontSize: 11 }}>↗</span>
              </a>
            )}
            {day.linkedinUrl && (
              <a href={day.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-[8px] px-4 py-3 transition-all hover:brightness-110 group"
                style={{ background: 'var(--graphite)', border: '1px solid var(--rim)', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-chalk truncate" style={{ fontSize: 11.5 }}>
                    {day.linkedinUrl.replace('https://www.linkedin.com/', 'linkedin.com/')}
                  </p>
                  <p className="font-mono text-ash" style={{ fontSize: 9, letterSpacing: '0.08em' }}>LinkedIn Post</p>
                </div>
                <span className="font-mono text-ash group-hover:text-signal transition-colors" style={{ fontSize: 11 }}>↗</span>
              </a>
            )}
          </div>
        ) : (
          <p className="font-body text-ash" style={{ fontSize: 12 }}>No proof links recorded.</p>
        )}
      </div>
    </div>
  )
}

// ─── Submission form delegated to ProofSubmitForm component ──────────────────
// ─── Missed / Upcoming states ─────────────────────────────────────────────────
function MissedPanel({ day }: { day: DayTask }) {
  const expired = day.recoveryDeadline
    ? new Date(day.recoveryDeadline).getTime() < Date.now()
    : true

  return (
    <div className="rounded-card overflow-hidden"
      style={{ background: 'var(--coal)', border: '1px solid rgba(239,68,68,0.3)' }}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #7F1D1D, #EF4444, #7F1D1D)' }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <svg width="32" height="18" viewBox="0 0 48 24" fill="none">
            <ellipse cx="12" cy="12" rx="10" ry="6.5" stroke="#EF4444" strokeWidth="3.5" fill="none" />
            <ellipse cx="36" cy="12" rx="10" ry="6.5" stroke="#EF4444" strokeWidth="3.5" fill="none" opacity="0.5"/>
            <path d="M22 12 L24 8 L25 14 L27 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="font-mono font-bold" style={{ fontSize: 11, color: '#EF4444', letterSpacing: '0.08em' }}>
              {expired ? 'Recovery window expired' : 'Day missed — chain cracked'}
            </p>
            {!expired && day.recoveryDeadline && (
              <p className="font-mono text-ash" style={{ fontSize: 9.5 }}>
                Repair by {new Date(day.recoveryDeadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </div>
        </div>
        {expired ? (
          <p className="font-body text-ash leading-relaxed" style={{ fontSize: 12 }}>
            The recovery window has closed. This day is a permanent scar on your chain — but your chain continues from here.
          </p>
        ) : (
          <Link href="/dashboard"
            className="rounded-pill py-2.5 font-display font-bold text-center transition-all hover:brightness-110"
            style={{ fontSize: 12, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.35)', display: 'block' }}>
            Go to dashboard to repair →
          </Link>
        )}
      </div>
    </div>
  )
}

function UpcomingPanel() {
  return (
    <div className="rounded-card p-6 flex flex-col items-center gap-3 text-center"
      style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--ash)" strokeWidth="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="var(--ash)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <p className="font-display font-bold text-chalk" style={{ fontSize: 15 }}>Task locked</p>
        <p className="font-body text-ash mt-1" style={{ fontSize: 12 }}>
          This task will be revealed when you reach this day. Keep your chain alive to unlock it.
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DayDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const dayNum  = parseInt(params.id as string, 10)
  const [reqOpen, setReqOpen] = useState(true)

  // Find the day
  const day = days.find(d => d.day === dayNum)

  // Navigation
  const prevDay = days.find(d => d.day === dayNum - 1)
  const nextDay = days.find(d => d.day === dayNum + 1)

  // Not found
  if (!day) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--ink)' }}>
        <NavBar />
        <p className="font-display font-bold text-chalk" style={{ fontSize: 24 }}>Day {dayNum} not found</p>
        <Link href="/dashboard" className="font-mono text-signal hover:text-chalk transition-colors" style={{ fontSize: 13 }}>
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  const isUpcoming  = day.status === 'upcoming'
  const isToday     = day.status === 'today'
  const isMissed    = day.status === 'missed'
  const isCompleted = day.status === 'completed' || day.status === 'recovered'

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <NavBar />

      {/* ── Top navigation bar ────────────────────────────────────────── */}
      <motion.div
        className="pt-16"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ background: 'var(--coal)', borderBottom: '1px solid var(--rim)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            {/* Back */}
            <Link href="/dashboard"
              className="flex items-center gap-2 font-mono text-ash hover:text-chalk transition-colors"
              style={{ fontSize: 11, letterSpacing: '0.08em' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Dashboard
            </Link>

            {/* Day nav */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => prevDay && router.push(`/day/${prevDay.day}`)}
                disabled={!prevDay}
                whileTap={prevDay ? { scale: 0.94 } : {}}
                className="w-8 h-8 rounded-[6px] flex items-center justify-center transition-all"
                style={{ background: 'var(--graphite)', border: '1px solid var(--rim)', cursor: prevDay ? 'pointer' : 'not-allowed', opacity: prevDay ? 1 : 0.35 }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="var(--chalk)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>

              <div className="font-mono text-chalk text-center flex-shrink-0" style={{ fontSize: 11, letterSpacing: '0.1em', minWidth: 56 }}>
                <span className="text-signal font-semibold">{dayNum}</span>
                <span className="text-ash"> / 60</span>
              </div>

              <motion.button
                onClick={() => nextDay && router.push(`/day/${nextDay.day}`)}
                disabled={!nextDay}
                whileTap={nextDay ? { scale: 0.94 } : {}}
                className="w-8 h-8 rounded-[6px] flex items-center justify-center transition-all"
                style={{ background: 'var(--graphite)', border: '1px solid var(--rim)', cursor: nextDay ? 'pointer' : 'not-allowed', opacity: nextDay ? 1 : 0.35 }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="var(--chalk)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Page content ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-signal font-semibold" style={{ fontSize: 11, letterSpacing: '0.16em' }}>
              DAY {day.day} OF 60
            </span>
            <DiffBadge level={day.difficulty} />
            <StatusBadge status={day.status} />
          </div>

          <h1 className="font-display font-bold text-chalk"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
            {isUpcoming ? `Day ${day.day}` : day.title}
          </h1>

          {day.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {day.tags.map(tag => (
                <span key={tag} className="font-mono"
                  style={{ fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--ash)', background: 'var(--graphite)', border: '1px solid var(--rim)', padding: '3px 9px', borderRadius: 99 }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* LEFT: task content */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.5 }}
          >

            {/* Description */}
            <div className="rounded-card p-5 sm:p-6"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
              <p className="font-mono text-ash uppercase mb-3" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>
                {isUpcoming ? 'Status' : isCompleted ? 'Your Work' : 'Today’s Task'}
              </p>
              <p className="font-body text-chalk leading-relaxed" style={{ fontSize: 14 }}>
                {day.description}
              </p>
            </div>

            {/* Requirements */}
            {!isUpcoming && day.requirements.length > 0 && (
              <div className="rounded-card overflow-hidden"
                style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
                <button
                  id={`toggle-req-${day.day}`}
                  onClick={() => setReqOpen(o => !o)}
                  className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-graphite"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: reqOpen ? '1px solid var(--rim)' : 'none' }}>
                  <div className="flex items-center gap-2">
                    <motion.span animate={{ rotate: reqOpen ? 90 : 0 }} transition={{ duration: 0.18 }}
                      style={{ fontSize: 9, color: 'var(--signal)' }}>▶</motion.span>
                    <span className="font-mono text-signal uppercase" style={{ fontSize: 9, letterSpacing: '0.18em' }}>
                      Requirements ({day.requirements.length})
                    </span>
                  </div>
                  <span className="font-mono text-ash" style={{ fontSize: 9, letterSpacing: '0.08em' }}>
                    {isCompleted ? 'Completed ✓' : isToday ? 'In progress' : ''}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {reqOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <ol className="px-5 py-4 flex flex-col gap-3">
                        {day.requirements.map((req, i) => (
                          <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }} className="flex items-start gap-3" style={{ listStyle: 'none' }}>
                            <div className="flex-shrink-0 w-[22px] h-[22px] rounded-[5px] flex items-center justify-center mt-px"
                              style={{
                                background: isCompleted ? 'rgba(34,197,94,0.12)' : 'var(--graphite)',
                                border: isCompleted ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--rim)',
                              }}>
                              {isCompleted
                                ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L5 9.5L10 3" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                : <span className="font-mono text-signal" style={{ fontSize: 9, lineHeight: 1 }}>{i + 1}</span>
                              }
                            </div>
                            <span className="font-body leading-relaxed"
                              style={{ fontSize: 13.5, color: isCompleted ? 'var(--ash)' : 'var(--chalk)' }}>
                              {req}
                            </span>
                          </motion.li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* RIGHT: action panel */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {isCompleted && <ProofPanel day={day} />}
            {isToday && <ProofSubmitForm dayNumber={day.day} mode="today" />}
            {isMissed && <MissedPanel day={day} />}
            {isUpcoming && <UpcomingPanel />}

            {/* Day context card */}
            {!isUpcoming && (
              <div className="rounded-card p-4 flex flex-col gap-2.5"
                style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Day Info</p>
                {[
                  ['Track', 'Full Stack Dev'],
                  ['Date',  day.date ? new Date(day.date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'],
                  ['Difficulty', day.difficulty.charAt(0).toUpperCase() + day.difficulty.slice(1)],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-mono text-ash" style={{ fontSize: 10.5 }}>{label}</span>
                    <span className="font-mono text-chalk" style={{ fontSize: 10.5 }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Bottom pagination ── */}
        <motion.div
          className="mt-10 pt-6 flex items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--rim)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {prevDay ? (
            <Link href={`/day/${prevDay.day}`}
              className="flex items-center gap-2.5 rounded-card px-4 py-3 transition-all hover:brightness-110"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)', textDecoration: 'none', maxWidth: '45%' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="var(--ash)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="min-w-0">
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8, letterSpacing: '0.14em' }}>Day {prevDay.day}</p>
                <p className="font-body text-chalk truncate" style={{ fontSize: 12 }}>{prevDay.title}</p>
              </div>
            </Link>
          ) : <div />}

          {nextDay ? (
            <Link href={`/day/${nextDay.day}`}
              className="flex items-center gap-2.5 rounded-card px-4 py-3 transition-all hover:brightness-110 ml-auto"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)', textDecoration: 'none', maxWidth: '45%' }}>
              <div className="min-w-0 text-right">
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8, letterSpacing: '0.14em' }}>Day {nextDay.day}</p>
                <p className="font-body text-chalk truncate" style={{ fontSize: 12 }}>{nextDay.title}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="var(--ash)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ) : <div />}
        </motion.div>
      </div>
    </div>
  )
}
