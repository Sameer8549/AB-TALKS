'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import Link from 'next/link'

// ─── Chain data — 18 entries for the demo student ────────────────────────────
const CHAIN = [
  { day: 1,  status: 'completed' as const, task: 'Dev environment setup' },
  { day: 2,  status: 'completed' as const, task: 'HTML + CSS fundamentals' },
  { day: 3,  status: 'completed' as const, task: 'JavaScript DOM' },
  { day: 4,  status: 'completed' as const, task: 'Fetch API + REST basics' },
  { day: 5,  status: 'completed' as const, task: 'React fundamentals' },
  { day: 6,  status: 'completed' as const, task: 'Tailwind CSS layout' },
  { day: 7,  status: 'recovered' as const, task: 'Node.js + Express' },
  { day: 8,  status: 'completed' as const, task: 'MongoDB + Mongoose' },
  { day: 9,  status: 'completed' as const, task: 'JWT Authentication' },
  { day: 10, status: 'completed' as const, task: 'React Router' },
  { day: 11, status: 'completed' as const, task: 'Full stack connect' },
  { day: 12, status: 'today'     as const, task: 'Error handling' },
  { day: 13, status: 'upcoming'  as const, task: null },
  { day: 14, status: 'upcoming'  as const, task: null },
  { day: 15, status: 'upcoming'  as const, task: null },
  { day: 16, status: 'upcoming'  as const, task: null },
  { day: 17, status: 'upcoming'  as const, task: null },
  { day: 18, status: 'upcoming'  as const, task: null },
]

type Entry = (typeof CHAIN)[number]

// ─── SVG ring-path (even-odd fill = hollow center = real chain link) ──────────
// Creates two stacked ellipses that combine via evenodd to form a ring.
function ring(
  cx: number, cy: number,
  rx: number, ry: number,
  irx: number, iry: number,
): string {
  return [
    // Outer ellipse — clockwise
    `M ${cx - rx} ${cy}`,
    `A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
    `A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`,
    // Inner ellipse — counter-clockwise (creates the hole)
    `M ${cx - irx} ${cy}`,
    `A ${irx} ${iry} 0 0 0 ${cx + irx} ${cy}`,
    `A ${irx} ${iry} 0 0 0 ${cx - irx} ${cy}`,
    'Z',
  ].join(' ')
}

// ─── Vertical chain (desktop) ─────────────────────────────────────────────────
const V = {
  lw: 50, lh: 27,     // link dimensions
  irx: 17, iry: 8,    // inner (hole) dimensions
  gap: 11,            // gap between links
  pad: 14,            // SVG overflow padding
}

function VerticalChain() {
  const [hovered, setHovered] = useState<number | null>(null)
  const cx = V.lw / 2 + V.pad

  const totalH = CHAIN.length * (V.lh + V.gap) - V.gap + V.pad * 2
  const svgW   = V.lw + V.pad * 2

  return (
    <div className="relative select-none">

      {/* Tooltip — floats to the LEFT of the chain */}
      <AnimatePresence>
        {hovered !== null && (() => {
          const entry = CHAIN.find(e => e.day === hovered)
          if (!entry || entry.status === 'upcoming') return null
          const idx   = CHAIN.findIndex(e => e.day === hovered)
          const tipTop = V.pad + idx * (V.lh + V.gap) + V.lh / 2 - 22
          return (
            <motion.div
              key="tip"
              className="absolute right-full mr-3 pointer-events-none z-30"
              style={{ top: tipTop }}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.13 }}
            >
              <div
                className="rounded-card px-3 py-2 whitespace-nowrap"
                style={{
                  background: '#181B2A',
                  border: '1px solid rgba(244,185,66,0.28)',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.55), 0 0 10px rgba(244,185,66,0.08)',
                }}
              >
                <p
                  className="font-mono text-signal uppercase"
                  style={{ fontSize: 9, letterSpacing: '0.14em' }}
                >
                  DAY {entry.day}
                  {entry.status === 'today'     && ' · TODAY'}
                  {entry.status === 'recovered' && ' · RECOVERED'}
                </p>
                {entry.task && (
                  <p className="font-body text-ash mt-0.5" style={{ fontSize: 11 }}>
                    {entry.task}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* Chain SVG */}
      <svg
        width={svgW}
        height={totalH}
        viewBox={`0 0 ${svgW} ${totalH}`}
        style={{
          // Fade the chain out at the bottom — suggests the journey continues
          maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 100%)',
          overflow: 'visible',
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Metallic gold gradient — top-left highlight, bottom-right shadow */}
          <linearGradient id="v-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFF0A0" />
            <stop offset="25%"  stopColor="#F4B942" />
            <stop offset="65%"  stopColor="#C07820" />
            <stop offset="100%" stopColor="#7A4810" />
          </linearGradient>

          {/* Brighter gold for today */}
          <linearGradient id="v-today" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFFBE0" />
            <stop offset="20%"  stopColor="#FFD060" />
            <stop offset="55%"  stopColor="#F4B942" />
            <stop offset="100%" stopColor="#C07820" />
          </linearGradient>

          {/* Dimmed gold for recovered */}
          <linearGradient id="v-recovered" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#E8C878" />
            <stop offset="45%"  stopColor="#C49030" />
            <stop offset="100%" stopColor="#7A5010" />
          </linearGradient>

          {/* Upcoming links — uses CSS vars so light/dark mode both look correct */}
          <linearGradient id="v-steel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   style={{ stopColor: 'var(--chain-upcoming-a)' }} />
            <stop offset="50%"  style={{ stopColor: 'var(--chain-upcoming-b)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--chain-upcoming-b)' }} />
          </linearGradient>

          {/* Completed: warm amber bloom */}
          <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%"
            colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1.2 0.3 0 0 0   0.7 0.25 0 0 0   0 0 0 0 0   0 0 0 1 0"
              result="amber-bloom" />
            <feMerge>
              <feMergeNode in="amber-bloom" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Today: strong blazing glow */}
          <filter id="glow-today" x="-80%" y="-80%" width="260%" height="260%"
            colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1.8 0.4 0 0 0.05   1.1 0.3 0 0 0.02   0 0 0 0 0   0 0 0 1.4 0"
              result="blaze" />
            <feMerge>
              <feMergeNode in="blaze" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {CHAIN.map((entry, i) => {
          const cy = V.pad + i * (V.lh + V.gap) + V.lh / 2
          const isHot      = entry.status !== 'upcoming'
          const isToday    = entry.status === 'today'
          const isRecov    = entry.status === 'recovered'
          const isHovered  = hovered === entry.day

          const fill = isToday   ? 'url(#v-today)'
            : isRecov             ? 'url(#v-recovered)'
            : isHot               ? 'url(#v-gold)'
            :                       'url(#v-steel)'

          const filter = isToday ? 'url(#glow-today)'
            : isHot               ? 'url(#glow-amber)'
            :                       'none'

          const linkPath = ring(cx, cy, V.lw / 2, V.lh / 2, V.irx, V.iry)

          return (
            <motion.g
              key={entry.day}
              initial={{ opacity: 0, scaleY: 0.15 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{
                delay: i * 0.065,
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1],
              }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              onMouseEnter={() => isHot && setHovered(entry.day)}
              onMouseLeave={() => setHovered(null)}
              cursor={isHot ? 'pointer' : 'default'}
            >
              {/* Connector line to previous link */}
              {i > 0 && (
                <line
                  x1={cx} y1={cy - V.lh / 2}
                  x2={cx} y2={cy - V.lh / 2 - V.gap}
                  stroke={isHot ? 'rgba(196,120,32,0.8)' : 'rgba(42,45,66,0.7)'}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              )}

              {/* Main ring — metallic */}
              <path
                d={linkPath}
                fillRule="evenodd"
                fill={fill}
                filter={filter}
                opacity={
                  entry.status === 'upcoming' ? 0.35
                  : isHovered                 ? 1
                  :                             0.9
                }
              />

              {/* Hover: brighten overlay */}
              {isHovered && isHot && (
                <path
                  d={linkPath}
                  fillRule="evenodd"
                  fill="rgba(255,242,160,0.22)"
                />
              )}

              {/* Recovered: dashed gold repair seam across center */}
              {isRecov && (
                <line
                  x1={cx - 11} y1={cy}
                  x2={cx + 11} y2={cy}
                  stroke="#F4D060"
                  strokeWidth={1}
                  strokeDasharray="2.5 2"
                  opacity={0.75}
                />
              )}

              {/* Today: pulsing white-hot center dot */}
              {isToday && (
                <motion.circle
                  cx={cx} cy={cy} r={3.5}
                  fill="#FFF8E0"
                  animate={{ opacity: [1, 0.1, 1], r: [3.5, 4.5, 3.5] }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Day number — subtle, inside the ring hole */}
              <text
                x={cx} y={cy + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHot ? 'rgba(255,235,150,0.55)' : 'rgba(90,100,145,0.4)'}
                fontFamily="'JetBrains Mono', monospace"
                fontSize={6.5}
                fontWeight="500"
                letterSpacing="0.3"
                pointerEvents="none"
              >
                {entry.day}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Horizontal mini-chain (mobile) ──────────────────────────────────────────
const H = { lw: 30, lh: 17, irx: 10, iry: 5, gap: 5, pad: 8 }

function HorizontalChain() {
  const SHOW = 12
  const links = CHAIN.slice(0, SHOW)
  const cy    = H.lh / 2 + H.pad
  const svgW  = SHOW * (H.lw + H.gap) - H.gap + H.pad * 2

  return (
    <svg
      width={svgW} height={H.lh + H.pad * 2}
      viewBox={`0 0 ${svgW} ${H.lh + H.pad * 2}`}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="h-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFF0A0" />
          <stop offset="40%"  stopColor="#F4B942" />
          <stop offset="100%" stopColor="#7A4810" />
        </linearGradient>
        <linearGradient id="h-steel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   style={{ stopColor: 'var(--chain-upcoming-a)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--chain-upcoming-b)' }} />
        </linearGradient>
        <filter id="h-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {links.map((entry, i) => {
        const cx   = H.pad + i * (H.lw + H.gap) + H.lw / 2
        const isHot   = entry.status !== 'upcoming'
        const isToday = entry.status === 'today'
        const fill = isHot ? 'url(#h-gold)' : 'url(#h-steel)'

        return (
          <motion.g
            key={entry.day}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.055, duration: 0.35 }}
          >
            {i > 0 && (
              <line
                x1={cx - H.lw / 2} y1={cy}
                x2={cx - H.lw / 2 - H.gap} y2={cy}
                stroke={isHot ? 'rgba(196,120,32,0.7)' : 'rgba(42,45,66,0.6)'}
                strokeWidth={2} strokeLinecap="round"
              />
            )}
            <path
              d={ring(cx, cy, H.lw / 2, H.lh / 2, H.irx, H.iry)}
              fillRule="evenodd"
              fill={fill}
              filter={isHot ? 'url(#h-glow)' : 'none'}
              opacity={entry.status === 'upcoming' ? 0.32 : 1}
            />
            {isToday && (
              <motion.circle
                cx={cx} cy={cy} r={2.5}
                fill="#FFF8E0"
                animate={{ opacity: [1, 0.1, 1] }}
                transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.g>
        )
      })}
    </svg>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="min-h-[100dvh] pt-16 flex items-center relative overflow-hidden">

      {/* Chain's own light source — a warm amber radial halo on the right */}
      <div
        className="hidden sm:block absolute top-0 right-0 bottom-0 pointer-events-none"
        style={{
          width: 360,
          background:
            'radial-gradient(ellipse 90% 70% at 75% 50%, rgba(244,185,66,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-14 sm:py-20">
        <div className="flex items-start gap-8 sm:gap-14">

          {/* ── LEFT: Headline + CTA ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <motion.h1
              className="font-display font-bold text-chalk"
              style={{ lineHeight: 0.9, letterSpacing: '-0.04em' }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            >
              <span className="block" style={{ fontSize: 'clamp(3.6rem, 11.5vw, 8rem)' }}>BUILD</span>
              <span className="block" style={{ fontSize: 'clamp(3.6rem, 11.5vw, 8rem)' }}>PROOF.</span>
            </motion.h1>

            <motion.p
              className="font-display font-bold text-signal mt-4"
              style={{ fontSize: 'clamp(1.3rem, 3.8vw, 2.6rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.6 }}
            >
              Every. Single. Day.
            </motion.p>

            {/* Mobile chain */}
            <motion.div
              className="block sm:hidden mt-8 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <HorizontalChain />
              <div className="flex justify-between mt-2">
                <span className="font-mono text-ash" style={{ fontSize: 8, letterSpacing: '0.12em' }}>DAY 1</span>
                <span className="font-mono text-signal" style={{ fontSize: 8, letterSpacing: '0.12em' }}>DAY 12 · TODAY</span>
              </div>
            </motion.div>

            <motion.p
              className="font-body text-ash leading-relaxed mt-8 mb-9 max-w-xs text-base sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              Pick a track. Commit daily. Post proof. The challenge where Indian
              college students build habits that actually stick.
            </motion.p>

            <motion.div
              className="flex items-center gap-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
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
                className="font-body text-sm text-ash hover:text-chalk transition-colors duration-200"
              >
                How it works
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Vertical chain (desktop only) ─────────────────────── */}
          <motion.div
            className="hidden sm:flex flex-col items-center gap-2 flex-shrink-0"
            style={{ marginTop: '-1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.9 }}
          >
            <VerticalChain />
            <p
              className="font-mono text-ash"
              style={{ fontSize: 8, letterSpacing: '0.14em' }}
            >
              DAY 12 / 60
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
