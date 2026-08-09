'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChainLink {
  day: number
  status: 'completed' | 'recovered' | 'today' | 'upcoming' | 'missed'
}

interface ProofCardProps {
  dayNumber: number
  dayTitle: string
  studentName: string
  trackLabel: string
  streakCount: number
  /** A 7-link window of chain days to show — caller decides the slice */
  chainWindow: ChainLink[]
}

// ─── Colour palette (mirrored from CSS vars for canvas) ───────────────────────
const C = {
  ink:      '#0D0D0D',
  coal:     '#111111',
  graphite: '#1A1A1A',
  chalk:    '#F0EDE6',
  ash:      '#6B6B6B',
  signal:   '#F4B942',
  green:    '#22C55E',
  red:      '#EF4444',
  rim:      '#242424',
}

// ─── Mini chain strip (rendered in DOM, not canvas) ───────────────────────────
function MiniChain({ links }: { links: ChainLink[] }) {
  return (
    <div className="flex items-center gap-[5px]">
      {links.map((link, i) => {
        const isLast = i === links.length - 1
        const color =
          link.status === 'completed' ? C.green
          : link.status === 'recovered' ? C.signal
          : link.status === 'today'    ? C.signal
          : link.status === 'missed'   ? C.red
          : C.rim

        const isFilled = link.status === 'completed' || link.status === 'recovered' || link.status === 'today'

        return (
          <div key={link.day} className="flex items-center gap-[5px]">
            {/* Link circle */}
            <div
              className="relative flex items-center justify-center flex-shrink-0"
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: isFilled ? `${color}22` : 'transparent',
                border: `2px solid ${color}`,
                boxShadow: link.status === 'today' ? `0 0 8px ${color}60` : 'none',
              }}
            >
              {isFilled && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                  }}
                />
              )}
              {/* Gold seam for recovered */}
              {link.status === 'recovered' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `1.5px solid ${C.signal}`,
                    opacity: 0.6,
                  }}
                />
              )}
            </div>
            {/* Connector (not after last) */}
            {!isLast && (
              <div
                style={{
                  width: 8,
                  height: 2,
                  borderRadius: 1,
                  background: isFilled ? `${color}55` : `${C.rim}`,
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Canvas-based download ─────────────────────────────────────────────────────
// Draws the card data onto a 2x-resolution canvas and triggers a PNG download.
// No external deps — pure Canvas 2D API.
async function downloadCard(props: ProofCardProps) {
  const W = 600
  const H = 320
  const SCALE = 2  // retina

  const canvas = document.createElement('canvas')
  canvas.width  = W * SCALE
  canvas.height = H * SCALE
  const ctx = canvas.getContext('2d')!
  ctx.scale(SCALE, SCALE)

  // ── Background ──
  ctx.fillStyle = C.coal
  roundRect(ctx, 0, 0, W, H, 16)
  ctx.fill()

  // ── Gold top bar ──
  const bar = ctx.createLinearGradient(0, 0, W, 0)
  bar.addColorStop(0,   '#C07820')
  bar.addColorStop(0.5, '#F4B942')
  bar.addColorStop(1,   '#C07820')
  ctx.fillStyle = bar
  roundRect(ctx, 0, 0, W, 4, { tl: 16, tr: 16, bl: 0, br: 0 })
  ctx.fill()

  // ── ABTalks brand (top-left) ──
  ctx.font = 'bold 13px "Inter", system-ui, sans-serif'
  ctx.fillStyle = C.chalk
  ctx.fillText('AB', 28, 36)
  ctx.fillStyle = C.signal
  ctx.fillText('TALKS', 28 + ctx.measureText('AB').width, 36)

  // ── "60-Day Challenge" (top-right) ──
  ctx.font = '10px monospace'
  ctx.fillStyle = C.ash
  ctx.textAlign = 'right'
  ctx.fillText('60-DAY CHALLENGE', W - 28, 36)
  ctx.textAlign = 'left'

  // ── Day number (large) ──
  ctx.font = 'bold 72px "Inter", system-ui, sans-serif'
  ctx.fillStyle = C.chalk
  ctx.fillText(`Day ${props.dayNumber}`, 28, 130)

  // ── Day title ──
  ctx.font = '14px "Inter", system-ui, sans-serif'
  ctx.fillStyle = C.ash
  ctx.fillText(truncate(props.dayTitle, 55), 28, 154)

  // ── Mini chain ──
  const chainY = 188
  const linkR  = 9
  const gap    = 6
  let cx = 28
  props.chainWindow.forEach((link, i) => {
    const color =
      link.status === 'completed' ? C.green
      : link.status === 'recovered' ? C.signal
      : link.status === 'today'    ? C.signal
      : link.status === 'missed'   ? C.red
      : C.rim
    const filled = ['completed', 'recovered', 'today'].includes(link.status)

    // connector
    if (i > 0) {
      ctx.fillStyle = filled ? `${color}55` : C.rim
      ctx.fillRect(cx - gap, chainY - 1, gap, 2)
    }

    // circle ring
    ctx.beginPath()
    ctx.arc(cx + linkR, chainY, linkR, 0, Math.PI * 2)
    ctx.strokeStyle = color
    ctx.lineWidth   = 1.8
    ctx.stroke()

    // inner dot
    if (filled) {
      ctx.beginPath()
      ctx.arc(cx + linkR, chainY, linkR * 0.42, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    // glow for today
    if (link.status === 'today') {
      ctx.beginPath()
      ctx.arc(cx + linkR, chainY, linkR + 3, 0, Math.PI * 2)
      ctx.strokeStyle = `${color}30`
      ctx.lineWidth   = 3
      ctx.stroke()
    }

    cx += linkR * 2 + gap
  })

  // ── Divider ──
  ctx.fillStyle = C.rim
  ctx.fillRect(28, 218, W - 56, 1)

  // ── Student name + track ──
  ctx.font = 'bold 15px "Inter", system-ui, sans-serif'
  ctx.fillStyle = C.chalk
  ctx.fillText(props.studentName, 28, 246)

  ctx.font = '11px monospace'
  ctx.fillStyle = C.ash
  ctx.fillText(props.trackLabel.toUpperCase(), 28, 262)

  // ── Streak badge (right side) ──
  const badgeX = W - 28 - 88
  roundRect(ctx, badgeX, 228, 88, 42, 8)
  ctx.fillStyle = `${C.signal}11`
  ctx.fill()
  roundRect(ctx, badgeX, 228, 88, 42, 8)
  ctx.strokeStyle = `${C.signal}33`
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.font = 'bold 26px "Inter", system-ui, sans-serif'
  ctx.fillStyle = C.signal
  ctx.textAlign = 'center'
  ctx.fillText(`${props.streakCount}`, badgeX + 44, 252)

  ctx.font = '8px monospace'
  ctx.fillStyle = C.ash
  ctx.fillText('DAY STREAK', badgeX + 44, 264)
  ctx.textAlign = 'left'

  // ── Footer ──
  ctx.font = '9px monospace'
  ctx.fillStyle = `${C.ash}88`
  ctx.fillText('abtalks.vercel.app · Build in public, every day.', 28, H - 18)

  // ── Trigger download ──
  const dataUrl = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.download = `abtalks-day-${props.dayNumber}-proof.png`
  a.href = dataUrl
  a.click()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number | { tl: number; tr: number; bl: number; br: number }
) {
  const tl = typeof r === 'number' ? r : r.tl
  const tr = typeof r === 'number' ? r : r.tr
  const br = typeof r === 'number' ? r : r.br
  const bl = typeof r === 'number' ? r : r.bl
  ctx.beginPath()
  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + w - tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
  ctx.lineTo(x + w, y + h - br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
  ctx.lineTo(x + bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
  ctx.lineTo(x, y + tl)
  ctx.quadraticCurveTo(x, y, x + tl, y)
  ctx.closePath()
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProofCard(props: ProofCardProps) {
  const { dayNumber, dayTitle, studentName, trackLabel, streakCount, chainWindow } = props
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadCard(props)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col gap-3"
    >
      {/* ── Card (the visual artifact) ────────────────────────────────── */}
      <div
        ref={cardRef}
        id="proof-card"
        className="rounded-card overflow-hidden"
        style={{
          background: C.coal,
          border: `1px solid ${C.signal}33`,
          boxShadow: `0 0 32px ${C.signal}0D`,
        }}
      >
        {/* Gold top bar */}
        <div
          className="h-[3px] relative overflow-hidden"
          style={{ background: `linear-gradient(90deg, #C07820, #F4B942 50%, #C07820)` }}
        />

        <div className="p-5 sm:p-6">
          {/* Top row: brand + badge */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="font-display font-bold text-chalk" style={{ fontSize: 13, letterSpacing: '-0.01em' }}>
                AB<span style={{ color: C.signal }}>TALKS</span>
              </p>
              <p className="font-mono text-ash uppercase mt-0.5" style={{ fontSize: 8, letterSpacing: '0.18em' }}>
                60-Day Challenge
              </p>
            </div>
            {/* Streak badge */}
            <div
              className="flex flex-col items-center px-3 py-2 rounded-card flex-shrink-0"
              style={{ background: `${C.signal}11`, border: `1px solid ${C.signal}30` }}
            >
              <p className="font-display font-bold" style={{ fontSize: 22, color: C.signal, lineHeight: 1 }}>
                {streakCount}
              </p>
              <p className="font-mono text-ash uppercase mt-0.5" style={{ fontSize: 7.5, letterSpacing: '0.14em' }}>
                day streak
              </p>
            </div>
          </div>

          {/* Day number */}
          <p
            className="font-display font-bold text-chalk"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.04em' }}
          >
            Day {dayNumber}
          </p>
          <p className="font-body text-ash mt-2 leading-snug" style={{ fontSize: 13 }}>
            {dayTitle}
          </p>

          {/* Mini chain strip */}
          <div className="mt-5 mb-5">
            <p className="font-mono text-ash uppercase mb-2" style={{ fontSize: 7.5, letterSpacing: '0.18em' }}>
              Your chain
            </p>
            <MiniChain links={chainWindow} />
          </div>

          {/* Divider */}
          <div className="h-px mb-4" style={{ background: C.rim }} />

          {/* Student info */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display font-bold text-chalk" style={{ fontSize: 14, letterSpacing: '-0.02em' }}>
                {studentName}
              </p>
              <p className="font-mono text-ash uppercase mt-0.5" style={{ fontSize: 8.5, letterSpacing: '0.12em' }}>
                {trackLabel}
              </p>
            </div>
            <p className="font-mono text-ash/40 text-right" style={{ fontSize: 8, letterSpacing: '0.1em' }}>
              abtalks.vercel.app
            </p>
          </div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <motion.button
          id="download-proof-card"
          onClick={handleDownload}
          disabled={downloading}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-pill py-3 font-display font-bold transition-all"
          style={{
            fontSize: 13,
            background: downloading ? 'var(--graphite)' : C.signal,
            color: downloading ? 'var(--ash)' : C.ink,
            border: 'none',
            cursor: downloading ? 'not-allowed' : 'pointer',
          }}
        >
          {downloading ? (
            <>
              <motion.span
                className="inline-block w-3.5 h-3.5 rounded-full border-2"
                style={{ borderColor: 'var(--ash)', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
              />
              Generating…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3M2 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download Proof Card
            </>
          )}
        </motion.button>

        <p className="font-mono text-ash/50 flex-shrink-0" style={{ fontSize: 9, letterSpacing: '0.08em' }}>
          Save · Screenshot · Post
        </p>
      </div>
    </motion.div>
  )
}
