'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

// ─── Chain preview data ───────────────────────────────────────────────────────
// Simulates an in-progress student at Day 12.
// Day 7 = recovered (used the Grace Window), Day 12 = today (pending).
const PREVIEW_LINKS = [
  'completed', 'completed', 'completed', 'completed', 'completed',
  'completed', 'recovered', 'completed', 'completed', 'completed',
  'completed', 'today',
  'upcoming', 'upcoming', 'upcoming',
] as const

type LinkStatus = (typeof PREVIEW_LINKS)[number]

// ─── Chain dimensions ─────────────────────────────────────────────────────────
const LG = { w: 40, h: 22, rx: 11, stroke: 3, gap: 12 }
const SM = { w: 28, h: 14, rx: 7, stroke: 2, gap: 8 }

// Status → visual properties
function linkStyle(status: LinkStatus) {
  switch (status) {
    case 'completed': return { stroke: '#F4B942', fill: 'rgba(244,185,66,0.14)' }
    case 'recovered': return { stroke: '#C49030', fill: 'rgba(196,144,48,0.12)' }
    case 'today':     return { stroke: '#F4B942', fill: 'transparent' }
    case 'upcoming':  return { stroke: '#2A2D42', fill: 'transparent' }
  }
}

// ─── Single chain link SVG group ─────────────────────────────────────────────
function ChainLink({
  status,
  index,
  isLast,
  dims,
}: {
  status: LinkStatus
  index: number
  isLast: boolean
  dims: typeof LG
}) {
  const { w, h, rx, stroke, gap } = dims
  const y = index * (h + gap)
  const { stroke: strokeColor, fill } = linkStyle(status)
  const connectorColor =
    status === 'completed' || status === 'recovered' ? strokeColor : '#2A2D42'

  return (
    <motion.g
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.07,
        duration: 0.4,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {/* Link body */}
      <rect
        x={1.5}
        y={y + 1.5}
        width={w - 3}
        height={h - 3}
        rx={rx - 1}
        fill={fill}
        stroke={strokeColor}
        strokeWidth={stroke}
      />

      {/* Today — pulsing amber dot */}
      {status === 'today' && (
        <motion.circle
          cx={w / 2}
          cy={y + h / 2}
          r={stroke + 0.5}
          fill="#F4B942"
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Recovered — dashed gold repair seam */}
      {status === 'recovered' && (
        <line
          x1={w * 0.22}
          y1={y + h / 2}
          x2={w * 0.78}
          y2={y + h / 2}
          stroke="#F4B942"
          strokeWidth={1}
          strokeDasharray="2 2"
          opacity={0.6}
        />
      )}

      {/* Connector to next link */}
      {!isLast && (
        <line
          x1={w / 2}
          y1={y + h}
          x2={w / 2}
          y2={y + h + gap}
          stroke={connectorColor}
          strokeWidth={stroke - 0.5}
          strokeLinecap="round"
        />
      )}
    </motion.g>
  )
}

// ─── Chain preview SVG ────────────────────────────────────────────────────────
function ChainPreview({ count, dims }: { count: number; dims: typeof LG }) {
  const { w, h, gap } = dims
  const links = PREVIEW_LINKS.slice(0, count)
  const totalH = links.length * (h + gap) - gap + 4

  return (
    <svg
      width={w + 4}
      height={totalH}
      viewBox={`0 0 ${w + 4} ${totalH}`}
      aria-hidden="true"
    >
      {links.map((status, i) => (
        <ChainLink
          key={i}
          status={status}
          index={i}
          isLast={i === links.length - 1}
          dims={dims}
        />
      ))}
    </svg>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="min-h-[100dvh] pt-16 flex items-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-14 sm:py-20">
        <div className="flex items-start gap-5 sm:gap-12">

          {/* ── Text column ────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Eyebrow */}
            <motion.p
              className="font-mono text-2xs uppercase tracking-[0.22em] text-ash mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              60-day coding challenge
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="font-display font-bold leading-[1.05] tracking-tight text-chalk mb-6 text-[2.6rem] sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
            >
              60 days.
              <br />
              Build proof.
              <br />
              <span className="text-signal">Every day.</span>
            </motion.h1>

            {/* Subtext — max 20 words */}
            <motion.p
              className="font-body text-ash leading-relaxed mb-10 max-w-[22rem] text-base sm:text-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              Pick a track. Commit daily. Post proof. The challenge where Indian
              college students build habits that actually stick.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex items-center gap-5 flex-wrap"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-signal text-ink font-display font-bold text-sm sm:text-base px-6 py-3 sm:px-7 sm:py-3.5 rounded-pill hover:opacity-90 transition-all duration-200 active:scale-[0.97]"
              >
                Start Day 1
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#how-it-works"
                className="font-body text-sm sm:text-base text-ash hover:text-chalk transition-colors duration-200"
              >
                How it works
              </a>
            </motion.div>
          </div>

          {/* ── Chain preview column ────────────────────────────────────────── */}
          <motion.div
            className="flex-shrink-0 flex flex-col items-center gap-3 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            {/* Mobile: 8 links at small dimensions */}
            <div className="block sm:hidden">
              <ChainPreview count={8} dims={SM} />
            </div>
            {/* Desktop: 15 links at full dimensions */}
            <div className="hidden sm:block">
              <ChainPreview count={15} dims={LG} />
            </div>

            {/* Day counter label */}
            <p className="font-mono text-[10px] text-ash tracking-wider text-center leading-relaxed">
              Day 12
              <br />
              <span className="text-signal/60">of 60</span>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
