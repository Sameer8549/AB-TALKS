'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import StreakCard from '@/components/StreakCard'
import ProofCard from '@/components/ProofCard'
import { ACH_ICONS } from '@/components/AchievementIcons'
import {
  student as normalStudent, streak as normalStreak,
  days as normalDays, achievements as normalAchievements,
  edgeCase_emptyProfile, edgeCase_missedDay,
} from '@/data/mockData'
import type { Achievement, DayTask } from '@/data/mockData'

// ─── Demo state ───────────────────────────────────────────────────────────────
type DemoState = 'normal' | 'new' | 'missed'

const DATA_SOURCES: Record<DemoState, {
  student: typeof normalStudent
  streak: typeof normalStreak
  days: typeof normalDays
  achievements: Achievement[]
}> = {
  normal: { student: normalStudent, streak: normalStreak, days: normalDays, achievements: normalAchievements },
  new:    { student: edgeCase_emptyProfile.student, streak: edgeCase_emptyProfile.streak, days: edgeCase_emptyProfile.days, achievements: edgeCase_emptyProfile.achievements },
  missed: { student: edgeCase_missedDay.student,    streak: edgeCase_missedDay.streak,    days: edgeCase_missedDay.days,    achievements: edgeCase_missedDay.achievements },
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountUp(target: number, delay = 0.5, duration = 1.1) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(0)
    let raf: number
    const t = setTimeout(() => {
      const startTime = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / (duration * 1000), 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * target))
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay * 1000)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [target, delay, duration])
  return value
}

function useCountdown(deadline: string | undefined): string | null {
  const calc = (): string | null => {
    if (!deadline) return null
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff <= 0) return null
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h}h ${m}m`
  }
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  useEffect(() => {
    setTimeLeft(calc())
    const id = setInterval(() => setTimeLeft(calc()), 60000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline])
  return timeLeft
}

// ─── Avatar with fallback ─────────────────────────────────────────────────────
function Avatar({ src, name, size = 44 }: { src: string; name: string; size?: number }) {
  const [err, setErr] = useState(false)
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  if (err) {
    return (
      <div className="rounded-full flex items-center justify-center font-display font-bold flex-shrink-0"
        style={{ width: size, height: size, background: 'var(--graphite)', border: '2px solid var(--rim)', color: 'var(--signal)', fontSize: size * 0.35 }}>
        {initials}
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} width={size} height={size} onError={() => setErr(true)}
      className="rounded-full ring-2 ring-signal/25 ring-offset-1 ring-offset-coal flex-shrink-0"
      style={{ width: size, height: size, objectFit: 'cover' }}
    />
  )
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
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

// ─── Recovery Banner ──────────────────────────────────────────────────────────
function RecoveryBanner({ day, onRepairClick }: { day: DayTask; onRepairClick: () => void }) {
  const timeLeft = useCountdown(day.recoveryDeadline)
  const expired = !timeLeft

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

        {/* Row 1 on mobile: icon + text */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Cracked chain icon */}
          <div className="flex-shrink-0">
            <svg width="36" height="20" viewBox="0 0 48 24" fill="none">
              <ellipse cx="12" cy="12" rx="10" ry="6.5" stroke="#EF4444" strokeWidth="3.5" fill="none" />
              <ellipse cx="36" cy="12" rx="10" ry="6.5" stroke="#EF4444" strokeWidth="3.5" fill="none" opacity="0.5" />
              <path d="M22 12 L24 8 L25 14 L27 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Text */}
          <div className="min-w-0">
            <p className="font-display font-bold" style={{ fontSize: 13, color: '#EF4444' }}>
              Day {day.day} missed — your chain is cracked
            </p>
            <p className="font-mono text-ash" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
              {expired
                ? 'Recovery window expired — the crack becomes a permanent scar'
                : `Repair window: ${timeLeft} remaining`}
            </p>
          </div>
        </div>

        {/* Row 2 on mobile: countdown + button */}
        {!expired && (
          <div className="flex items-center gap-2.5 flex-shrink-0 sm:flex-shrink-0">
            <motion.div
              className="font-mono font-bold"
              style={{ fontSize: 14, color: '#EF4444', letterSpacing: '-0.02em' }}
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {timeLeft}
            </motion.div>
            <button
              id="repair-now-btn"
              onClick={onRepairClick}
              className="font-display font-bold px-4 py-2 rounded-pill flex-shrink-0 transition-all hover:brightness-110"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.35)', fontSize: 12, cursor: 'pointer', minHeight: 36 }}
            >
              Repair Now →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Recovery form (submit proof for a missed day) ────────────────────────────
function RecoveryForm({ day }: { day: DayTask }) {
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const valid = github.startsWith('https://') && linkedin.startsWith('https://')

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
        className="mt-4 rounded-card p-4 flex flex-col items-center gap-2.5 text-center"
        style={{ background: 'rgba(244,185,66,0.07)', border: '1px solid rgba(244,185,66,0.25)' }}>
        <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(244,185,66,0.15)', border: '2px solid rgba(244,185,66,0.4)' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 10.5L8 14.5L16 6" stroke="var(--signal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <div>
          <p className="font-display font-bold text-chalk" style={{ fontSize: 14 }}>Chain repaired.</p>
          <p className="font-body text-ash mt-0.5" style={{ fontSize: 11 }}>Day {day.day} is marked as recovered — the crack now shows a gold seam, not a break.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={async e => { e.preventDefault(); if (!valid) return; setLoading(true); await new Promise(r => setTimeout(r, 1200)); setLoading(false); setDone(true) }}
      className="mt-4 flex flex-col gap-2.5">
      <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Submit Repair Proof — Day {day.day}</p>
      {(['github', 'linkedin'] as const).map(field => (
        <div key={field} className="flex flex-col gap-0.5">
          <label className="font-mono text-ash" style={{ fontSize: 9.5, letterSpacing: '0.08em' }}>
            {field === 'github' ? 'GitHub commit / repo URL' : 'LinkedIn post URL'}
          </label>
          <input type="url"
            value={field === 'github' ? github : linkedin}
            onChange={e => field === 'github' ? setGithub(e.target.value) : setLinkedin(e.target.value)}
            placeholder={field === 'github' ? 'https://github.com/...' : 'https://linkedin.com/posts/...'}
            className="w-full rounded-[8px] px-3 py-2 font-mono text-chalk placeholder-ash/40 focus:outline-none transition-all"
            style={{ fontSize: 11.5, border: '1px solid var(--rim)', background: 'var(--graphite)' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; e.currentTarget.style.background = 'var(--coal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--rim)'; e.currentTarget.style.background = 'var(--graphite)' }}
          />
        </div>
      ))}
      <motion.button type="submit" disabled={!valid || loading}
        whileTap={valid ? { scale: 0.97 } : {}}
        className="mt-0.5 rounded-pill py-2.5 font-display font-bold transition-all"
        style={{
          fontSize: 12, background: valid ? 'rgba(239,68,68,0.85)' : 'var(--graphite)',
          color: valid ? '#fff' : 'var(--ash)', border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
        }}
      >
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <motion.span className="inline-block w-3 h-3 rounded-full border-2 border-t-transparent"
                style={{ borderColor: '#fff', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }} transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }} />
              Repairing…
            </span>
          : `Repair Day ${day.day} — Seal the crack`
        }
      </motion.button>
    </form>
  )
}

// ─── Submit form (for today's task) ──────────────────────────────────────────
function SubmitForm({ day, onSuccess }: { day: DayTask; onSuccess?: () => void }) {
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const valid = github.startsWith('https://') && linkedin.startsWith('https://')

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
        className="mt-5 rounded-card p-5 flex flex-col items-center gap-3 text-center"
        style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.22)' }}>
        <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.14)', border: '2px solid rgba(34,197,94,0.4)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10.5L8 14.5L16 6" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <div>
          <p className="font-display font-bold text-chalk" style={{ fontSize: 16 }}>Day {day.day} locked in!</p>
          <p className="font-body text-ash mt-1" style={{ fontSize: 12 }}>Chain holds. Come back tomorrow.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={async e => { e.preventDefault(); if (!valid) return; setLoading(true); await new Promise(r => setTimeout(r, 1200)); setLoading(false); setDone(true); onSuccess?.() }}
      className="mt-5 flex flex-col gap-3">
      <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Submit Your Proof</p>
      {(['github', 'linkedin'] as const).map(field => (
        <div key={field} className="flex flex-col gap-1">
          <label className="font-mono text-ash" style={{ fontSize: 9.5, letterSpacing: '0.08em' }}>
            {field === 'github' ? 'GitHub commit / repo URL' : 'LinkedIn post URL'}
          </label>
          <input type="url"
            value={field === 'github' ? github : linkedin}
            onChange={e => field === 'github' ? setGithub(e.target.value) : setLinkedin(e.target.value)}
            placeholder={field === 'github' ? 'https://github.com/...' : 'https://linkedin.com/posts/...'}
            className="w-full rounded-[8px] px-3 py-2.5 font-mono text-chalk placeholder-ash/40 focus:outline-none transition-all"
            style={{ fontSize: 12, border: '1px solid var(--rim)', background: 'var(--graphite)' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--signal)'; e.currentTarget.style.background = 'var(--coal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--rim)'; e.currentTarget.style.background = 'var(--graphite)' }}
          />
        </div>
      ))}
      <motion.button id="submit-proof-btn" type="submit" disabled={!valid || loading}
        whileTap={valid ? { scale: 0.97 } : {}}
        className="mt-1 rounded-pill py-3 font-display font-bold transition-all"
        style={{ fontSize: 13, background: valid ? 'var(--signal)' : 'var(--graphite)', color: valid ? 'var(--ink)' : 'var(--ash)', border: 'none', cursor: valid ? 'pointer' : 'not-allowed' }}
      >
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <motion.span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'var(--ink)', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }} transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }} />
              Locking in…
            </span>
          : `Lock in Day ${day.day}`
        }
      </motion.button>
    </form>
  )
}

// ─── Achievement badge ────────────────────────────────────────────────────────
function AchBadge({ ach, i }: { ach: Achievement; i: number }) {
  const on = !!ach.unlockedAt
  const Icon = ACH_ICONS[ach.icon]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35 + i * 0.06, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      whileHover={on ? { scale: 1.06 } : {}}
      title={ach.description}
      className="rounded-card p-2.5 flex flex-col items-center gap-1.5 text-center"
      style={{
        background: on ? 'var(--graphite)' : 'var(--coal)',
        border: `1px solid ${on ? 'rgba(244,185,66,0.25)' : 'var(--rim)'}`,
        boxShadow: on ? '0 0 12px rgba(244,185,66,0.08)' : 'none',
        cursor: on ? 'pointer' : 'default',
      }}
    >
      {Icon ? <Icon active={on} size={38} /> : <span style={{ fontSize: 20 }}>◆</span>}
      <p className="font-mono leading-none" style={{ fontSize: 8, letterSpacing: '0.04em', color: on ? 'var(--chalk)' : 'var(--ash)' }}>
        {ach.title}
      </p>
    </motion.div>
  )
}

// ─── Demo switcher ────────────────────────────────────────────────────────────
function DemoSwitcher({ state, onChange }: { state: DemoState; onChange: (s: DemoState) => void }) {
  const labels: [DemoState, string, string][] = [
    ['normal', 'Normal',      'Normal'],
    ['new',    'New',         'New Student'],
    ['missed', 'Missed',      'Missed Day'],
  ]
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 sm:bottom-5 z-50 flex flex-col items-center sm:items-end gap-1.5">
      <p className="font-mono text-ash" style={{ fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Preview State</p>
      <div className="flex gap-1 rounded-card px-2 py-1.5"
        style={{ background: 'var(--coal)', border: '1px solid var(--rim)', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
        {labels.map(([s, shortLabel, longLabel]) => (
          <button key={s} onClick={() => onChange(s)}
            className="font-mono px-2.5 py-1 rounded-[6px] transition-all"
            style={{
              fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none',
              background: state === s ? (s === 'missed' ? 'rgba(239,68,68,0.85)' : 'var(--signal)') : 'transparent',
              color: state === s ? (s === 'missed' ? '#fff' : 'var(--ink)') : 'var(--ash)',
              cursor: 'pointer',
              minHeight: 32,
            }}
            title={longLabel}
          >
            {/* Short label on mobile, full on desktop */}
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{longLabel}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [demoState, setDemoState] = useState<DemoState>('normal')
  const [reqOpen, setReqOpen] = useState(true)
  const [showRepair, setShowRepair] = useState(false)
  const [todaySubmitted, setTodaySubmitted] = useState(false)
  const repairRef = { current: null as HTMLDivElement | null }

  // Data source — switches with demo state
  const { student, streak, days, achievements } = DATA_SOURCES[demoState]

  const todayTask    = days.find(d => d.status === 'today')
  const missedDay    = days.find(d => d.status === 'missed' && !!d.recoveryDeadline)
  const pastDays     = days.filter(d => d.status === 'completed' || d.status === 'recovered').slice().reverse().slice(0, 5)
  const upcomingDays = days.filter(d => d.status === 'upcoming').slice(0, 3)

  const isNewStudent = streak.current === 0

  // ⚠️ Always call hooks unconditionally — Rules of Hooks
  // useCountdown must fire every render regardless of missedDay state
  const recoveryTimeLeft = useCountdown(missedDay?.recoveryDeadline)
  const hasMissedDay = !!missedDay && !!recoveryTimeLeft

  // Count-up animations
  const streakCount  = useCountUp(streak.current, 0.55, 1.1)
  const longestCount = useCountUp(streak.longest, 0.65, 1.0)
  const doneCount    = useCountUp(streak.totalCompleted, 0.75, 0.9)
  const dayPct       = Math.round((streak.current / 60) * 100)

  // Build chainDays for StreakCard from the current data
  type CellStatus = 'completed' | 'recovered' | 'today' | 'upcoming' | 'missed'
  const chainDays = days.slice(0, 60).map((d) => ({
    day: d.day,
    status: d.status as CellStatus,
    task: d.title || null,
  }))
  // Pad to 60 if needed
  while (chainDays.length < 60) {
    chainDays.push({ day: chainDays.length + 1, status: 'upcoming' as CellStatus, task: null })
  }

  // Chain window for ProofCard — 7 links centred on today's task day
  const todayNum      = todayTask?.day ?? 1
  const pcStart       = Math.max(1, todayNum - 3)
  const pcEnd         = Math.min(60, pcStart + 6)
  const proofChainWindow = Array.from({ length: pcEnd - pcStart + 1 }, (_, i) => {
    const d     = pcStart + i
    const found = days.find(x => x.day === d)
    return {
      day: d,
      status: (found?.status ?? 'upcoming') as 'completed' | 'recovered' | 'today' | 'upcoming' | 'missed',
    }
  })

  const handleRepairClick = () => {
    setShowRepair(true)
    setTimeout(() => {
      document.getElementById('recovery-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  // Reset repair panel when switching demo state
  useEffect(() => {
    setShowRepair(false)
    setReqOpen(true)
    setTodaySubmitted(false)
    sessionStorage.setItem('abtalks_demo_state', demoState)
  }, [demoState])

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <NavBar />

      {/* ── RECOVERY BANNER (missed day state) ────────────────────────────── */}
      {missedDay && (
        <div className="pt-16">
          <RecoveryBanner day={missedDay} onRepairClick={handleRepairClick} />
        </div>
      )}

      {/* ── MOTIVATIONAL HEADER ──────────────────────────────────────────── */}
      <motion.div
        className={missedDay ? '' : 'pt-16'}
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      >
        <div style={{ background: 'var(--coal)', borderBottom: '1px solid var(--rim)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

              {/* Avatar + identity */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Avatar src={student.avatar} name={student.name} size={44} />
                <div>
                  <p className="font-display font-bold text-chalk" style={{ fontSize: 15, letterSpacing: '-0.02em' }}>
                    {student.name}
                  </p>
                  <p className="font-mono text-ash" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
                    {student.trackLabel} · {student.city}
                  </p>
                  {/* Empty profile notice */}
                  {!student.bio && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                      className="font-mono" style={{ fontSize: 9, color: 'rgba(244,185,66,0.6)', letterSpacing: '0.08em', marginTop: 2 }}>
                      Add a bio to your profile →
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Motivational copy + progress */}
              <div className="flex-1 min-w-0">
                {isNewStudent ? (
                  /* ── ZERO STREAK: begin state ── */
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <p className="font-display font-bold text-chalk"
                      style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '-0.025em' }}>
                      Your chain starts <span className="text-signal">today.</span>
                    </p>
                    <p className="font-body text-ash mt-1" style={{ fontSize: 12 }}>
                      The chain starts with a single link. Day 1 is the hardest one to build.
                    </p>
                  </motion.div>
                ) : (
                  /* ── ACTIVE STREAK: progress state ── */
                  <>
                    <motion.p className="font-display font-bold text-chalk"
                      style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '-0.025em' }}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                      Day {streak.current}.{' '}
                      <span className={missedDay ? 'text-red-400' : 'text-signal'}>
                        {missedDay ? 'Repair the crack.' : "Don't break the chain."}
                      </span>
                    </motion.p>
                    <div className="flex items-center gap-2.5 mt-2">
                      <div className="flex-1 h-[5px] rounded-pill overflow-hidden" style={{ background: 'var(--graphite)' }}>
                        <motion.div className="h-full rounded-pill"
                          style={{ background: 'linear-gradient(to right, #C07820, #F4B942, #FFE080)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${dayPct}%` }}
                          transition={{ delay: 0.7, duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
                        />
                      </div>
                      <span className="font-mono text-ash flex-shrink-0" style={{ fontSize: 9.5, letterSpacing: '0.08em' }}>
                        {streak.current}/60
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Stats badge (or "begin" badge for zero streak) */}
              {isNewStudent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-shrink-0 rounded-card px-4 py-3 text-center"
                  style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}>
                  <motion.p className="font-display font-bold text-signal" style={{ fontSize: 22, letterSpacing: '-0.04em', lineHeight: 1 }}
                    animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    Day 1
                  </motion.p>
                  <p className="font-mono text-ash uppercase mt-1" style={{ fontSize: 7.5, letterSpacing: '0.16em' }}>Begins now</p>
                </motion.div>
              ) : (
                <div className="flex items-center gap-4 flex-shrink-0 rounded-card px-4 py-3"
                  style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}>
                  <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C12 2 7 6.5 7 12a5 5 0 0010 0c0-2.5-.8-4-2.5-5.5 0 0 .5 2.5-1.5 4-1-1.5-1-4-1-6.5z"
                        fill={missedDay ? '#EF4444' : 'var(--signal)'}
                        stroke={missedDay ? '#EF4444' : 'var(--signal)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                  {[
                    { val: streakCount,  label: 'Streak' },
                    { val: longestCount, label: 'Best'   },
                    { val: doneCount,    label: 'Done'    },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <motion.p className="font-display font-bold text-signal"
                        style={{ fontSize: 22, letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {s.val}
                      </motion.p>
                      <p className="font-mono text-ash uppercase" style={{ fontSize: 7.5, letterSpacing: '0.16em' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>

      {/* ── MAIN GRID ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_344px] gap-6 items-start">

        {/* LEFT */}
        <div className="flex flex-col gap-5">

          {/* ── RECOVERY CARD (shown when repair button clicked) ── */}
          <AnimatePresence>
            {showRepair && missedDay && (
              <motion.div
                id="recovery-card"
                ref={repairRef}
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-card overflow-hidden"
                style={{ background: 'var(--coal)', border: '1px solid rgba(239,68,68,0.35)', boxShadow: '0 0 24px rgba(239,68,68,0.08)' }}
              >
                {/* Red top bar */}
                <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #7F1D1D, #EF4444, #7F1D1D)' }} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="font-mono font-semibold" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#EF4444' }}>
                      DAY {missedDay.day} — REPAIR
                    </span>
                    <DiffBadge level={missedDay.difficulty} />
                  </div>
                  <h3 className="font-display font-bold text-chalk" style={{ fontSize: 18, letterSpacing: '-0.025em' }}>
                    {missedDay.title}
                  </h3>
                  <p className="font-body text-ash mt-2" style={{ fontSize: 13 }}>{missedDay.briefSummary}</p>
                  <div className="my-4 h-px" style={{ background: 'rgba(239,68,68,0.2)' }} />
                  <RecoveryForm day={missedDay} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TODAY'S TASK CARD ── */}
          {todayTask ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-card overflow-hidden"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}
            >
              {/* Shimmer bar */}
              <div className="h-[3px] relative overflow-hidden" style={{ background: 'var(--graphite)' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #C07820, #F4B942 50%, #C07820)' }} />
                <motion.div className="absolute inset-y-0"
                  style={{ width: '60%', background: 'linear-gradient(90deg, transparent 0%, #FFE080 50%, transparent 100%)', zIndex: 1 }}
                  animate={{ left: ['-60%', '160%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-signal font-semibold" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
                      DAY {todayTask.day}
                    </span>
                    <DiffBadge level={todayTask.difficulty} />
                    <motion.span className="flex items-center gap-1 font-mono"
                      style={{ fontSize: 8.5, letterSpacing: '0.14em', color: 'var(--ash)', textTransform: 'uppercase' }}
                      animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                      Today
                    </motion.span>
                  </div>
                  <span className="font-mono text-ash flex-shrink-0" style={{ fontSize: 9.5 }}>Submit by midnight</span>
                </div>
                <h2 className="font-display font-bold text-chalk"
                  style={{ fontSize: 'clamp(1.2rem, 2.8vw, 1.65rem)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                  {/* Personalized copy for new student */}
                  {isNewStudent ? 'Begin your chain.' : todayTask.title}
                </h2>
                <p className="font-body text-ash mt-3 leading-relaxed" style={{ fontSize: 13 }}>
                  {isNewStudent
                    ? 'Set up your environment and build your first thing. Every expert was once here.'
                    : todayTask.description}
                </p>
                {todayTask.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {todayTask.tags.map(tag => (
                      <span key={tag} className="font-mono"
                        style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--ash)', background: 'var(--graphite)', border: '1px solid var(--rim)', padding: '2px 8px', borderRadius: 99 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Requirements */}
                {todayTask.requirements.length > 0 && (
                  <div className="mt-5">
                    <button id="toggle-requirements" onClick={() => setReqOpen(r => !r)}
                      className="flex items-center gap-2 transition-colors"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <motion.span animate={{ rotate: reqOpen ? 90 : 0 }} transition={{ duration: 0.18 }}
                        style={{ fontSize: 9, color: 'var(--signal)' }}>▶</motion.span>
                      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--signal)' }}>
                        Requirements ({todayTask.requirements.length})
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {reqOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}>
                          <ol className="mt-3 flex flex-col gap-2.5">
                            {todayTask.requirements.map((req, i) => (
                              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.045 }} className="flex items-start gap-3" style={{ listStyle: 'none' }}>
                                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-[4px] flex items-center justify-center mt-px"
                                  style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}>
                                  <span className="font-mono text-signal" style={{ fontSize: 8, lineHeight: 1 }}>{i + 1}</span>
                                </span>
                                <span className="font-body text-ash leading-relaxed" style={{ fontSize: 13 }}>{req}</span>
                              </motion.li>
                            ))}
                          </ol>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <div className="my-5 h-px" style={{ background: 'var(--rim)' }} />
                <SubmitForm day={todayTask} onSuccess={() => setTimeout(() => setTodaySubmitted(true), 1500)} />
              </div>
            </motion.article>
          ) : (
            /* ── NO TODAY TASK (shouldn't happen with good data, but guard it) ── */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-card p-8 flex flex-col items-center gap-3 text-center"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
              <p className="font-display font-bold text-chalk" style={{ fontSize: 18 }}>All caught up</p>
              <p className="font-body text-ash" style={{ fontSize: 13 }}>No task is pending today. Check back tomorrow.</p>
            </motion.div>
          )}

          {/* ProofCard — slides in after successful submission */}
          {todaySubmitted && todayTask && (
            <ProofCard
              dayNumber={todayTask.day}
              dayTitle={isNewStudent ? 'First link in the chain.' : todayTask.title}
              studentName={student.name}
              trackLabel={student.trackLabel}
              streakCount={streak.current + 1}
              chainWindow={proofChainWindow}
            />
          )}

          {/* ── RECENT HISTORY ── */}
          {pastDays.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="rounded-card overflow-hidden"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
              <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--rim)' }}>
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Recent History</p>
              </div>
              {pastDays.map((d, i) => (
                <Link key={d.day} href={`/day/${d.day}`}
                  className="px-5 py-3 flex items-center gap-4 transition-all hover:bg-graphite"
                  style={{ borderBottom: i < pastDays.length - 1 ? '1px solid var(--rim)' : 'none', textDecoration: 'none', display: 'flex' }}>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.28 + i * 0.06 }}
                    className="font-mono text-signal flex-shrink-0" style={{ fontSize: 10.5, letterSpacing: '0.1em', minWidth: 40 }}>
                    D{d.day}
                  </motion.span>
                  <p className="font-body text-chalk flex-1 truncate" style={{ fontSize: 13 }}>{d.title}</p>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <DiffBadge level={d.difficulty} />
                    <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.12em',
                      color: d.status === 'recovered' ? 'var(--signal)' : '#22C55E' }}>
                      {d.status === 'recovered' ? 'Recovered' : 'Done'}
                    </span>
                  </div>
                </Link>
              ))}
              <div className="px-5 py-3" style={{ borderTop: '1px solid var(--rim)' }}>
                <Link href="/day/1" className="font-mono text-signal hover:text-chalk transition-colors" style={{ fontSize: 11 }}>
                  View all {days.filter(d => d.status === 'completed' || d.status === 'recovered').length} completed →
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── ZERO STREAK: no history yet ── */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-card p-5 flex items-center gap-4"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)', opacity: 0.7 }}>
              <div className="w-10 h-10 rounded-card flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}>
                <span style={{ fontSize: 16 }}>📋</span>
              </div>
              <div>
                <p className="font-body text-ash" style={{ fontSize: 12 }}>Each completed day becomes a link in your chain — your history will appear here.</p>
                <p className="font-mono text-ash/50 mt-0.5" style={{ fontSize: 10 }}>Submit Day 1 to lay the first link.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-5">

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.6 }}>
            <StreakCard
              chainDays={chainDays}
              stats={{ current: streak.current, bestStreak: streak.longest, totalDone: streak.totalCompleted }}
            />
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55 }}
            className="rounded-card overflow-hidden"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--rim)' }}>
              <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Achievements</p>
              <span className="font-mono text-signal" style={{ fontSize: 11 }}>
                {achievements.filter(a => a.unlockedAt).length}/{achievements.length}
              </span>
            </div>
            {achievements.length > 0 ? (
              <div className="p-3 grid grid-cols-4 gap-2">
                {achievements.map((a, i) => <AchBadge key={a.id} ach={a} i={i} />)}
              </div>
            ) : (
              <div className="px-4 py-5 flex flex-col items-center gap-2 text-center">
                <p className="font-mono text-ash/50" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
                  Submit your first day to unlock achievements.
                </p>
              </div>
            )}
          </motion.div>


          {/* Upcoming */}
          {upcomingDays.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="rounded-card overflow-hidden"
              style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--rim)' }}>
                <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Coming Up</p>
              </div>
              {upcomingDays.map((d, i) => (
                <div key={d.day} className="px-4 py-3 flex items-center gap-3"
                  style={{ borderBottom: i < upcomingDays.length - 1 ? '1px solid var(--rim)' : 'none', opacity: 0.5 + i * 0.1 }}>
                  <span className="font-mono text-ash flex-shrink-0" style={{ fontSize: 10, letterSpacing: '0.08em' }}>D{d.day}</span>
                  <p className="font-body text-ash flex-1 truncate" style={{ fontSize: 12 }}>{d.title}</p>
                  <DiffBadge level={d.difficulty} />
                </div>
              ))}
            </motion.div>
          )}

          {/* Social links */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="rounded-card p-4 flex flex-col gap-2.5"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}>
            <p className="font-mono text-ash uppercase mb-0.5" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Social</p>
            {[
              { label: 'GH', href: student.github, display: student.github.replace('https://', '') },
              { label: 'LI', href: student.linkedin, display: student.linkedin.replace('https://', '') },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-body text-ash hover:text-chalk transition-colors"
                style={{ fontSize: 12 }}>
                <span className="font-mono text-signal font-semibold flex-shrink-0" style={{ fontSize: 9.5, width: 18 }}>{s.label}</span>
                <span className="truncate">{s.display}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── DEMO SWITCHER ─────────────────────────────────────────────────── */}
      <DemoSwitcher state={demoState} onChange={setDemoState} />
    </div>
  )
}
