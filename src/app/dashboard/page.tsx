'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import StreakCard from '@/components/StreakCard'
import { ACH_ICONS } from '@/components/AchievementIcons'
import { student, streak, days, achievements } from '@/data/mockData'
import type { Achievement } from '@/data/mockData'

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, delay = 0.5, duration = 1.1) {
  const [value, setValue] = useState(0)
  useEffect(() => {
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const todayTask = days.find(d => d.status === 'today')!
const pastDays  = days
  .filter(d => d.status === 'completed' || d.status === 'recovered')
  .reverse()
  .slice(0, 5)

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
      style={{ fontSize: 8.5, letterSpacing: '0.16em', color, background: bg,
        padding: '2px 7px', borderRadius: 99, border: `1px solid ${color}33` }}>
      {level}
    </span>
  )
}

// ─── Submit form ──────────────────────────────────────────────────────────────
function SubmitForm() {
  const [github,   setGithub]   = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  const valid = github.startsWith('https://') && linkedin.startsWith('https://')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

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
          <p className="font-display font-bold text-chalk" style={{ fontSize: 16 }}>Day {todayTask.day} locked in!</p>
          <p className="font-body text-ash mt-1" style={{ fontSize: 12 }}>Chain holds. Come back tomorrow.</p>
        </div>
        <div className="flex gap-4 mt-1">
          <a href={github} target="_blank" rel="noopener noreferrer" className="font-mono text-signal hover:underline" style={{ fontSize: 11 }}>GitHub ↗</a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-signal hover:underline" style={{ fontSize: 11 }}>LinkedIn ↗</a>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3">
      <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Submit Your Proof</p>
      {(['github', 'linkedin'] as const).map((field) => (
        <div key={field} className="flex flex-col gap-1">
          <label className="font-mono text-ash" style={{ fontSize: 9.5, letterSpacing: '0.08em' }}>
            {field === 'github' ? 'GitHub commit / repo URL' : 'LinkedIn post URL'}
          </label>
          <input
            id={`${field}-url`}
            type="url"
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
      <motion.button
        id="submit-proof-btn"
        type="submit"
        disabled={!valid || loading}
        whileTap={valid ? { scale: 0.97 } : {}}
        className="mt-1 rounded-pill py-3 font-display font-bold transition-all relative overflow-hidden"
        style={{
          fontSize: 13,
          background: valid ? 'var(--signal)' : 'var(--graphite)',
          color: valid ? 'var(--ink)' : 'var(--ash)',
          border: 'none',
          cursor: valid ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-t-transparent"
              style={{ borderColor: 'var(--ink)', borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
            />
            Locking in…
          </span>
        ) : `Lock in Day ${todayTask.day}`}
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
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {Icon ? <Icon active={on} size={38} /> : <span style={{ fontSize: 20 }}>◆</span>}
      <p className="font-mono leading-none"
        style={{ fontSize: 8, letterSpacing: '0.04em', color: on ? 'var(--chalk)' : 'var(--ash)' }}>
        {ach.title}
      </p>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [reqOpen, setReqOpen] = useState(true)

  // Count-up animations
  const streakCount  = useCountUp(streak.current,  0.55, 1.1)
  const longestCount = useCountUp(streak.longest,   0.65, 1.0)
  const doneCount    = useCountUp(streak.totalCompleted, 0.75, 0.9)

  // Motivational copy
  const dayPct = Math.round((streak.current / 60) * 100)

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <NavBar />

      {/* ── MOTIVATIONAL HEADER ──────────────────────────────────────────── */}
      <motion.div
        className="pt-16"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      >
        <div style={{ background: 'var(--coal)', borderBottom: '1px solid var(--rim)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

              {/* Avatar + identity */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={student.avatar} alt={student.name}
                  className="w-11 h-11 rounded-full ring-2 ring-signal/25 ring-offset-1 ring-offset-coal flex-shrink-0"
                  style={{ objectFit: 'cover' }}
                />
                <div>
                  <p className="font-display font-bold text-chalk" style={{ fontSize: 15, letterSpacing: '-0.02em' }}>
                    {student.name}
                  </p>
                  <p className="font-mono text-ash" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
                    {student.trackLabel} · {student.city}
                  </p>
                </div>
              </div>

              {/* Motivational copy + progress */}
              <div className="flex-1 min-w-0">
                <motion.p
                  className="font-display font-bold text-chalk"
                  style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '-0.025em' }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  Day {streak.current}.{' '}
                  <span className="text-signal">Don't break the chain.</span>
                </motion.p>

                {/* Progress bar */}
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="flex-1 h-[5px] rounded-pill overflow-hidden" style={{ background: 'var(--graphite)' }}>
                    <motion.div
                      className="h-full rounded-pill"
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
              </div>

              {/* Streak badge */}
              <div
                className="flex items-center gap-4 flex-shrink-0 rounded-card px-4 py-3"
                style={{ background: 'var(--graphite)', border: '1px solid var(--rim)' }}
              >
                {/* Flame icon */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C12 2 7 6.5 7 12a5 5 0 0010 0c0-2.5-.8-4-2.5-5.5 0 0 .5 2.5-1.5 4-1-1.5-1-4-1-6.5z"
                      fill="var(--signal)" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>

                {/* Three stats */}
                {[
                  { val: streakCount,  label: 'Streak' },
                  { val: longestCount, label: 'Best'   },
                  { val: doneCount,    label: 'Done'    },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <motion.p
                      className="font-display font-bold text-signal"
                      style={{ fontSize: 22, letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      {s.val}
                    </motion.p>
                    <p className="font-mono text-ash uppercase" style={{ fontSize: 7.5, letterSpacing: '0.16em' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      {/* ── MAIN GRID ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-14 grid grid-cols-1 lg:grid-cols-[1fr_344px] gap-6 items-start">

        {/* LEFT */}
        <div className="flex flex-col gap-5">

          {/* Today's task */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-card overflow-hidden"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)', boxShadow: 'var(--shadow-card, none)' }}
          >
            {/* Animated shimmer bar */}
            <div className="h-[3px] relative overflow-hidden" style={{ background: 'var(--graphite)' }}>
              <motion.div
                className="absolute inset-y-0"
                style={{
                  width: '60%',
                  background: 'linear-gradient(90deg, transparent 0%, #F4B942 40%, #FFE080 50%, #F4B942 60%, transparent 100%)',
                }}
                animate={{ left: ['-60%', '160%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #C07820, #F4B942 50%, #C07820)' }} />
            </div>

            <div className="p-5 sm:p-6">

              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-signal font-semibold" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
                    DAY {todayTask.day}
                  </span>
                  <DiffBadge level={todayTask.difficulty} />
                  <motion.span
                    className="flex items-center gap-1 font-mono"
                    style={{ fontSize: 8.5, letterSpacing: '0.14em', color: 'var(--ash)', textTransform: 'uppercase' }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                    Today
                  </motion.span>
                </div>
                <span className="font-mono text-ash flex-shrink-0" style={{ fontSize: 9.5 }}>
                  Submit by midnight
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display font-bold text-chalk"
                style={{ fontSize: 'clamp(1.2rem, 2.8vw, 1.65rem)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                {todayTask.title}
              </h2>

              {/* Description */}
              <p className="font-body text-ash mt-3 leading-relaxed" style={{ fontSize: 13 }}>
                {todayTask.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {todayTask.tags.map(tag => (
                  <span key={tag} className="font-mono"
                    style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--ash)',
                      background: 'var(--graphite)', border: '1px solid var(--rim)',
                      padding: '2px 8px', borderRadius: 99 }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Requirements */}
              <div className="mt-5">
                <button
                  id="toggle-requirements"
                  onClick={() => setReqOpen(r => !r)}
                  className="flex items-center gap-2 transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: reqOpen ? 'var(--chalk)' : 'var(--signal)' }}
                >
                  <motion.span
                    className="font-mono"
                    animate={{ rotate: reqOpen ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ fontSize: 9, color: 'var(--signal)' }}
                  >
                    ▶
                  </motion.span>
                  <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--signal)' }}>
                    Requirements ({todayTask.requirements.length})
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
                      <ol className="mt-3 flex flex-col gap-2.5">
                        {todayTask.requirements.map((req, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.045 }}
                            className="flex items-start gap-3"
                            style={{ listStyle: 'none' }}
                          >
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

              {/* Divider */}
              <div className="my-5 h-px" style={{ background: 'var(--rim)' }} />

              {/* Submit form */}
              <SubmitForm />
            </div>
          </motion.article>

          {/* Recent history */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-card overflow-hidden"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)', boxShadow: 'var(--shadow-card, none)' }}
          >
            <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--rim)' }}>
              <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>
                Recent History
              </p>
            </div>
            {pastDays.map((d, i) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 + i * 0.06 }}
                className="px-5 py-3 flex items-center gap-4"
                style={{ borderBottom: i < pastDays.length - 1 ? '1px solid var(--rim)' : 'none' }}
              >
                <span className="font-mono text-signal flex-shrink-0" style={{ fontSize: 10.5, letterSpacing: '0.1em', minWidth: 40 }}>
                  D{d.day}
                </span>
                <p className="font-body text-chalk flex-1 truncate" style={{ fontSize: 13 }}>
                  {d.title}
                </p>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <DiffBadge level={d.difficulty} />
                  <span className="font-mono uppercase" style={{
                    fontSize: 8.5,
                    color: d.status === 'recovered' ? 'var(--signal)' : '#22C55E',
                    letterSpacing: '0.12em'
                  }}>
                    {d.status === 'recovered' ? 'Recovered' : 'Done'}
                  </span>
                </div>
              </motion.div>
            ))}
            <div className="px-5 py-3" style={{ borderTop: '1px solid var(--rim)' }}>
              <Link href="#" className="font-mono text-signal hover:text-chalk transition-colors" style={{ fontSize: 11 }}>
                View all {days.filter(d => d.status === 'completed' || d.status === 'recovered').length} completed →
              </Link>
            </div>
          </motion.div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-5">

          {/* Streak heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          >
            <StreakCard />
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-card overflow-hidden"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)', boxShadow: 'var(--shadow-card, none)' }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--rim)' }}>
              <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Achievements</p>
              <span className="font-mono text-signal" style={{ fontSize: 11 }}>
                {achievements.filter(a => a.unlockedAt).length}/{achievements.length}
              </span>
            </div>
            <div className="p-3 grid grid-cols-4 gap-2">
              {achievements.map((a, i) => <AchBadge key={a.id} ach={a} i={i} />)}
            </div>
          </motion.div>

          {/* Upcoming preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="rounded-card overflow-hidden"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--rim)' }}>
              <p className="font-mono text-ash uppercase" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>Coming Up</p>
            </div>
            {days.filter(d => d.status === 'upcoming').slice(0, 3).map((d, i) => (
              <div key={d.day} className="px-4 py-3 flex items-center gap-3"
                style={{ borderBottom: i < 2 ? '1px solid var(--rim)' : 'none', opacity: 0.5 + i * 0.1 }}>
                <span className="font-mono text-ash flex-shrink-0" style={{ fontSize: 10, letterSpacing: '0.08em' }}>D{d.day}</span>
                <p className="font-body text-ash flex-1 truncate" style={{ fontSize: 12 }}>{d.title}</p>
                <DiffBadge level={d.difficulty} />
              </div>
            ))}
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="rounded-card p-4 flex flex-col gap-2.5"
            style={{ background: 'var(--coal)', border: '1px solid var(--rim)' }}
          >
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
    </div>
  )
}
