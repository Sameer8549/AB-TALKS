'use client'

import { motion } from 'motion/react'

// ─── Shared palette ───────────────────────────────────────────────────────────
const G = '#F4B942'    // gold
const GB = '#FFE080'   // bright gold
const GD = '#C07820'   // deep gold
const BR = '#7A4810'   // bronze
const glow = 'rgba(244,185,66,0.55)'

type P = { active: boolean; size?: number }

// ─── Glow wrapper ─────────────────────────────────────────────────────────────
function Wrap({ active, size, children }: P & { children: React.ReactNode }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      filter: active
        ? `drop-shadow(0 0 5px ${glow}) drop-shadow(0 0 10px rgba(244,185,66,0.3))`
        : 'grayscale(1) brightness(0.22)',
      transition: 'filter 0.4s ease',
    }}>
      {children}
    </div>
  )
}

// ─── 1. FIRST LINK — golden chain link with orbiting shine ────────────────────
export function IconFirstLink({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        {/* Link body */}
        <ellipse cx="24" cy="24" rx="17" ry="10.5"
          stroke={GD} strokeWidth="7" fill="none" />
        <ellipse cx="24" cy="24" rx="17" ry="10.5"
          stroke={G}  strokeWidth="5" fill="none" />
        {/* Bright inner rim */}
        <ellipse cx="24" cy="24" rx="14" ry="7.5"
          stroke={GB} strokeWidth="1.5" fill="none" strokeOpacity="0.5" />
        {/* Orbiting bright spot */}
        <motion.ellipse
          cx="24" cy="24" rx="17" ry="10.5"
          stroke={GB} strokeWidth="3.5" fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.14 0.86"
          animate={active ? { strokeDashoffset: [0, -1] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </Wrap>
  )
}

// ─── 2. WEEK ONE — calendar with days lighting up one-by-one ─────────────────
const DOTS = [
  [12, 20], [20, 20], [28, 20], [36, 20],
  [12, 30], [20, 30], [28, 30],
]

export function IconWeekOne({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        {/* Calendar frame */}
        <rect x="6" y="10" width="36" height="32" rx="4" stroke={G} strokeWidth="2.5" />
        <rect x="6" y="10" width="36" height="10" rx="4" fill={GD} />
        {/* Page lines */}
        <line x1="6" y1="20" x2="42" y2="20" stroke={G} strokeWidth="2" />
        {/* Binding pegs */}
        <circle cx="16" cy="10" r="2.5" fill={GB} />
        <circle cx="32" cy="10" r="2.5" fill={GB} />
        {/* 7 day dots — light up in sequence */}
        {DOTS.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r="3.5"
            fill={G}
            initial={{ opacity: 0.12, scale: 0.6 }}
            animate={active ? {
              opacity: [0.12, 1, 1],
              scale: [0.6, 1.2, 1],
            } : {}}
            transition={{
              delay: i * 0.18,
              duration: 0.4,
              repeat: Infinity,
              repeatDelay: DOTS.length * 0.18 + 1.2,
              ease: 'backOut',
            }}
          />
        ))}
      </svg>
    </Wrap>
  )
}

// ─── 3. REPAIRED — wrench oscillating like it's tightening ───────────────────
export function IconRepaired({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        <motion.g
          style={{ originX: '60%', originY: '60%' }}
          animate={active ? { rotate: [-18, 18, -12, 12, -6, 6, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        >
          {/* Wrench handle */}
          <path d="M16 38L32 18" stroke={GD} strokeWidth="7" strokeLinecap="round" />
          <path d="M16 38L32 18" stroke={G}  strokeWidth="5" strokeLinecap="round" />
          {/* Wrench head - open end */}
          <path d="M28 14 C24 8 36 6 36 12 L34 16 L28 14Z" fill={G} />
          <path d="M30 22 C36 26 38 14 32 14 L30 18 L30 22Z" fill={G} />
          {/* Nut hex shape in jaw */}
          <polygon points="32,14 34,12 36,14 35,16.5 33,16.5"
            fill={GD} opacity="0.7" />
        </motion.g>
        {/* Sparks that fly off at peak of rotation */}
        {active && [[-2, -2], [4, -4], [-4, 2]].map(([dx, dy], i) => (
          <motion.circle key={i}
            cx={34 + dx} cy={12 + dy} r="1.5"
            fill={GB}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], x: [0, dx * 2], y: [0, dy * 2] }}
            transition={{ delay: i * 0.12, duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}
      </svg>
    </Wrap>
  )
}

// ─── 4. HARD MODE — flickering layered flame ──────────────────────────────────
export function IconHardMode({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        {/* Outer flame (slower flicker) */}
        <motion.path
          d="M24 6 C24 6 13 16 13 27 C13 34 18 40 24 40 C30 40 35 34 35 27 C35 20 30 12 26 8 C26 8 28 17 24 22 C22 18 20 12 24 6Z"
          fill={BR}
          animate={active ? { scaleY: [1, 1.07, 0.96, 1.04, 1], scaleX: [1, 0.97, 1.03, 0.98, 1] } : {}}
          style={{ transformOrigin: '24px 40px' }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Mid flame */}
        <motion.path
          d="M24 12 C24 12 16 20 16 28 C16 34 19.5 38 24 38 C28.5 38 32 34 32 28 C32 23 28 17 26 14 C26 14 27 21 24 25 C22 21 21 17 24 12Z"
          fill={GD}
          animate={active ? { scaleY: [1, 1.1, 0.93, 1.06, 1] } : {}}
          style={{ transformOrigin: '24px 38px' }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
        />
        {/* Inner bright flame */}
        <motion.path
          d="M24 18 C24 18 19 24 19 29.5 C19 33.5 21 37 24 37 C27 37 29 33.5 29 29.5 C29 26 27 21 25.5 19 C25.5 19 26 24.5 24 27 C22.5 24.5 22 21 24 18Z"
          fill={G}
          animate={active ? { opacity: [1, 0.8, 1, 0.85, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
        />
        {/* White-hot core */}
        <motion.ellipse
          cx="24" cy="31" rx="3.5" ry="4.5"
          fill={GB}
          animate={active ? { opacity: [0.9, 0.5, 1, 0.6, 0.9], ry: [4.5, 3.5, 5, 3.8, 4.5] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </Wrap>
  )
}

// ─── 5. FULL STACK — 3 floating layers with shimmer ──────────────────────────
const LAYERS = [
  { y: 10, w: 36, fill: GD, delay: 0 },
  { y: 20, w: 28, fill: G,  delay: 0.15 },
  { y: 30, w: 20, fill: GB, delay: 0.30 },
]

export function IconFullStack({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        {LAYERS.map((l, i) => (
          <motion.g key={i}
            animate={active ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
          >
            {/* Layer slab */}
            <rect x={(48 - l.w) / 2} y={l.y} width={l.w} height="7" rx="3.5" fill={l.fill} />
            {/* Shine sweep on each layer */}
            <motion.rect
              x={(48 - l.w) / 2} y={l.y} width={6} height="7" rx="3.5"
              fill={GB} opacity="0.6"
              animate={active ? { x: [(48 - l.w) / 2 - 6, (48 - l.w) / 2 + l.w + 6] } : {}}
              transition={{ duration: 1.8, repeat: Infinity, delay: l.delay + 0.4,
                ease: 'easeInOut', repeatDelay: 1.2 }}
            />
          </motion.g>
        ))}
      </svg>
    </Wrap>
  )
}

// ─── 6. HALFWAY — medal with diagonal shine sweep ─────────────────────────────
export function IconHalfway({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        {/* Ribbon tabs */}
        <path d="M18 8 L22 16 L26 16 L30 8 Z" fill={GD} />
        <path d="M19 8 L24 14 L29 8" fill={G} strokeWidth="0.5" stroke={GB} />
        {/* Medal circle */}
        <circle cx="24" cy="30" r="14" fill={GD} />
        <circle cx="24" cy="30" r="14" stroke={G} strokeWidth="2.5" fill="none" />
        <circle cx="24" cy="30" r="10.5" stroke={GB} strokeWidth="1" fill="none" strokeOpacity="0.4" />
        {/* "30" text approximated with shapes */}
        <text x="24" y="35" textAnchor="middle" fill={GB}
          fontSize="11" fontWeight="bold" fontFamily="monospace">30</text>
        {/* Shine sweep */}
        <clipPath id="medal-clip">
          <circle cx="24" cy="30" r="14" />
        </clipPath>
        <motion.rect
          x="-20" y="16" width="14" height="30"
          fill={GB} opacity="0.35"
          style={{ transform: 'rotate(-30deg)', transformOrigin: '24px 30px' }}
          animate={active ? { x: [-20, 60] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
          clipPath="url(#medal-clip)"
        />
      </svg>
    </Wrap>
  )
}

// ─── 7. CLEAN CHAIN — pulse traveling through 3 connected links ──────────────
export function IconCleanChain({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        {/* 3 horizontal oval links */}
        {[10, 24, 38].map((cx, i) => (
          <g key={i}>
            <ellipse cx={cx} cy="24" rx="8.5" ry="5.5"
              stroke={GD} strokeWidth="4.5" fill="none" />
            <ellipse cx={cx} cy="24" rx="8.5" ry="5.5"
              stroke={G} strokeWidth="3" fill="none" />
          </g>
        ))}
        {/* Connecting bars */}
        <line x1="18.5" y1="24" x2="15.5" y2="24" stroke={G} strokeWidth="3.5" />
        <line x1="32.5" y1="24" x2="29.5" y2="24" stroke={G} strokeWidth="3.5" />
        {/* Traveling pulse dot */}
        <motion.circle
          r="3" fill={GB}
          animate={active ? { cx: [2, 46, 2] } : { cx: 2 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          cy="24"
        />
      </svg>
    </Wrap>
  )
}

// ─── 8. FINISHER — trophy with orbiting stars ─────────────────────────────────
function Star({ cx, cy, r = 3.5 }: { cx: number; cy: number; r?: number }) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const innerAngle = outerAngle + (2 * Math.PI) / 10
    return `${cx + r * Math.cos(outerAngle)},${cy + r * Math.sin(outerAngle)} ${cx + r * 0.4 * Math.cos(innerAngle)},${cy + r * 0.4 * Math.sin(innerAngle)}`
  }).join(' ')
  return <polygon points={pts} fill={GB} />
}

export function IconFinisher({ active, size = 36 }: P) {
  return (
    <Wrap active={active} size={size}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        {/* Trophy cup body */}
        <path d="M16 8 H32 V26 C32 32 28 35 24 35 C20 35 16 32 16 26 Z"
          fill={GD} stroke={G} strokeWidth="2" />
        <path d="M17 9 H31 V25 C31 31 27.5 34 24 34 C20.5 34 17 31 17 25 Z"
          fill={G} />
        {/* Handles */}
        <path d="M16 14 C10 14 10 22 16 22" stroke={G} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M32 14 C38 14 38 22 32 22" stroke={G} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Base stem */}
        <rect x="20" y="35" width="8" height="4" rx="1" fill={GD} />
        <rect x="17" y="39" width="14" height="3" rx="1.5" fill={G} />
        {/* Star on cup */}
        <Star cx={24} cy={23} r={4} />
        {/* Orbiting sparkle stars */}
        {[0, 1, 2].map(i => (
          <motion.g key={i}
            style={{ transformOrigin: '24px 24px' }}
            animate={active ? { rotate: [i * 120, i * 120 + 360] } : {}}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
          >
            <motion.circle
              cx={24} cy={5} r="2.2" fill={GB}
              animate={active ? { opacity: [0.3, 1, 0.3], r: [1.5, 2.5, 1.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            />
          </motion.g>
        ))}
      </svg>
    </Wrap>
  )
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
export const ACH_ICONS: Record<string, (props: P) => React.ReactElement> = {
  GitCommit:     IconFirstLink,
  CalendarCheck: IconWeekOne,
  Wrench:        IconRepaired,
  Fire:          IconHardMode,
  Stack:         IconFullStack,
  Medal:         IconHalfway,
  Link:          IconCleanChain,
  Trophy:        IconFinisher,
}
