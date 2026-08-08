'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ─── Full 60-day chain data ───────────────────────────────────────────────────
const DATA: Record<number, { status: 'completed' | 'recovered' | 'today' | 'upcoming'; task: string | null }> = {
  1:  { status: 'completed', task: 'Dev environment setup' },
  2:  { status: 'completed', task: 'HTML + CSS fundamentals' },
  3:  { status: 'completed', task: 'JavaScript DOM' },
  4:  { status: 'completed', task: 'Fetch API + REST basics' },
  5:  { status: 'completed', task: 'React fundamentals' },
  6:  { status: 'completed', task: 'Tailwind CSS layout' },
  7:  { status: 'recovered', task: 'Node.js + Express' },
  8:  { status: 'completed', task: 'MongoDB + Mongoose' },
  9:  { status: 'completed', task: 'JWT Authentication' },
  10: { status: 'completed', task: 'React Router' },
  11: { status: 'completed', task: 'Full stack connect' },
  12: { status: 'today',     task: 'Error handling' },
}

const CHAIN = Array.from({ length: 60 }, (_, i) => {
  const day = i + 1
  return { day, ...(DATA[day] ?? { status: 'upcoming' as const, task: null }) }
})

// ─── Individual day cell ──────────────────────────────────────────────────────
function DayCell({
  day, status, task, index,
}: {
  day: number
  status: string
  task: string | null
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const isActive   = status !== 'upcoming'
  const isToday    = status === 'today'
  const isRecov    = status === 'recovered'
  const isDone     = status === 'completed'
  const row        = Math.floor(index / 10)   // 0–5

  // Background radial gradient: simulates molten metal depth
  const bg = isToday
    ? 'radial-gradient(circle at 38% 32%, #FFFAE0 0%, #FFD050 20%, #F4B942 55%, #C07820 100%)'
    : isRecov
      ? 'radial-gradient(circle at 38% 32%, #E8C870 0%, #C49030 50%, #7A5010 100%)'
      : isDone
        ? 'radial-gradient(circle at 38% 32%, #FFE080 0%, #F4B942 40%, #C07820 100%)'
        : undefined

  const glow = isToday
    ? '0 0 0 1.5px #F4B942, 0 0 10px rgba(244,185,66,0.65), 0 0 22px rgba(244,185,66,0.28)'
    : isRecov
      ? '0 0 0 1px rgba(196,144,48,0.45), 0 0 5px rgba(196,144,48,0.22)'
      : isDone
        ? '0 0 0 1px rgba(244,185,66,0.45), 0 0 7px rgba(244,185,66,0.28)'
        : 'none'

  const hoverGlow = isToday
    ? '0 0 0 2px #F4B942, 0 0 16px rgba(244,185,66,0.85), 0 0 32px rgba(244,185,66,0.4)'
    : isActive
      ? '0 0 0 1.5px rgba(244,185,66,0.7), 0 0 12px rgba(244,185,66,0.5), 0 0 22px rgba(244,185,66,0.2)'
      : 'none'

  return (
    <motion.div
      className="relative overflow-visible"
      style={{ aspectRatio: '1' }}
      /* Forge-in: completed cells stagger from day 1 → 12, upcoming fade in quickly */
      initial={{ opacity: 0, scale: 0.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: isActive ? index * 0.048 : 0.65 + (index - 12) * 0.003,
        duration: isActive ? 0.55 : 0.2,
        ease: isActive ? [0.32, 0.72, 0, 1] : 'easeOut',
      }}
      onMouseEnter={() => isActive && setHovered(true)}
      onMouseLeave={() => setHovered(null as unknown as boolean)}
    >
      {/* Cell */}
      <motion.div
        className="w-full h-full rounded-[3px]"
        animate={{
          scale: hovered ? 1.22 : 1,
          boxShadow: hovered ? hoverGlow : glow,
        }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        style={{
          background: bg ?? 'var(--graphite)',
          cursor: isActive ? 'pointer' : 'default',
          // Recovered: dashed boundary to signal "chain was repaired here"
          outline: isRecov ? '1px dashed rgba(196,144,48,0.55)' : undefined,
          outlineOffset: isRecov ? '2px' : undefined,
        }}
      />

      {/* Today: pulsing ring that breathes outward */}
      {isToday && (
        <motion.div
          className="absolute rounded-[4px] pointer-events-none"
          style={{ inset: -2 }}
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(244,185,66,0.75)',
              '0 0 0 6px rgba(244,185,66,0)',
            ],
          }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Tooltip — positioned below for row 0, above for all others */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute z-50 pointer-events-none"
            style={
              row === 0
                ? { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' }
                : { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' }
            }
            initial={{ opacity: 0, scale: 0.9, y: row === 0 ? -4 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
          >
            <div
              className="whitespace-nowrap rounded-[8px] px-2.5 py-1.5"
              style={{
                background: 'var(--coal)',
                border: '1px solid var(--rim)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              }}
            >
              <p
                className="font-mono text-signal uppercase"
                style={{ fontSize: 8.5, letterSpacing: '0.14em' }}
              >
                Day {day}
                {isToday ? ' · Today' : isRecov ? ' · Recovered' : ''}
              </p>
              {task && (
                <p className="font-body text-ash mt-0.5" style={{ fontSize: 10 }}>
                  {task}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── The Streak Card ──────────────────────────────────────────────────────────
export default function StreakCard() {
  const currentStreak = 12
  const bestStreak    = 11
  const totalDone     = 11   // completed days (not counting active today)
  const pct           = (currentStreak / 60) * 100

  return (
    <div
      id="streak-card"
      className="rounded-card overflow-visible select-none"
      style={{
        background: 'var(--coal)',
        border: '1px solid var(--rim)',
        boxShadow: 'var(--shadow-card, 0 0 0 1px var(--rim))',
        width: 'clamp(280px, 100%, 344px)',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
        <div>
          <p
            className="font-mono text-ash uppercase"
            style={{ fontSize: 8.5, letterSpacing: '0.2em' }}
          >
            60-Day Chain
          </p>
          <p
            className="font-display font-bold text-chalk"
            style={{ fontSize: 14, letterSpacing: '-0.025em', lineHeight: 1.3 }}
          >
            Full Stack Dev
          </p>
        </div>
        <div className="text-right">
          <motion.p
            className="font-display font-bold text-signal"
            style={{ fontSize: 22, letterSpacing: '-0.04em', lineHeight: 1 }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {currentStreak}
          </motion.p>
          <p
            className="font-mono text-ash"
            style={{ fontSize: 8, letterSpacing: '0.12em' }}
          >
            of 60 days
          </p>
        </div>
      </div>

      {/* ── Grid — 10 × 6 = 60 cells ───────────────────────────────────── */}
      <div
        className="px-3 pb-2.5 overflow-visible"
        style={{ isolation: 'auto' }}
      >
        <div
          className="grid overflow-visible"
          style={{
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '3.5px',
          }}
        >
          {CHAIN.map((d, i) => (
            <DayCell
              key={d.day}
              day={d.day}
              status={d.status}
              task={d.task}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="px-3 pb-3">
        <div
          className="h-[3px] rounded-pill overflow-hidden"
          style={{ background: 'var(--graphite)' }}
        >
          <motion.div
            className="h-full rounded-pill"
            style={{
              background: 'linear-gradient(to right, #C07820, #F4B942, #FFD060)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.7, duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <p className="font-mono text-ash/50" style={{ fontSize: 7.5, letterSpacing: '0.1em' }}>
            Day 1
          </p>
          <p className="font-mono text-ash/50" style={{ fontSize: 7.5, letterSpacing: '0.1em' }}>
            Day 60
          </p>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ height: 1, background: 'var(--rim)', margin: '0 12px' }} />

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 py-3">
        {/* Current streak */}
        <div
          className="flex flex-col items-center justify-center gap-0.5 border-r"
          style={{ borderColor: 'var(--rim)' }}
        >
          <span
            className="font-display font-bold text-chalk"
            style={{ fontSize: 20, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            {currentStreak}
          </span>
          <span
            className="font-mono text-ash uppercase"
            style={{ fontSize: 7.5, letterSpacing: '0.15em' }}
          >
            Current
          </span>
        </div>

        {/* Best streak */}
        <div
          className="flex flex-col items-center justify-center gap-0.5 border-r"
          style={{ borderColor: 'var(--rim)' }}
        >
          <span
            className="font-display font-bold text-signal"
            style={{ fontSize: 20, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            {bestStreak}
          </span>
          <span
            className="font-mono text-ash uppercase"
            style={{ fontSize: 7.5, letterSpacing: '0.15em' }}
          >
            Best
          </span>
        </div>

        {/* Total done */}
        <div className="flex flex-col items-center justify-center gap-0.5">
          <span
            className="font-display font-bold text-chalk"
            style={{ fontSize: 20, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            {totalDone}
          </span>
          <span
            className="font-mono text-ash uppercase"
            style={{ fontSize: 7.5, letterSpacing: '0.15em' }}
          >
            Done
          </span>
        </div>
      </div>

      {/* ── Footer label ─────────────────────────────────────────────────── */}
      <div
        className="px-4 pb-3 pt-0.5 flex items-center gap-1.5"
        style={{ borderTop: '1px solid var(--rim)' }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-signal flex-shrink-0"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <p
          className="font-mono text-ash"
          style={{ fontSize: 9, letterSpacing: '0.08em' }}
        >
          Commit proof daily — GitHub + LinkedIn
        </p>
      </div>
    </div>
  )
}
