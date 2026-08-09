'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChainLink {
  day: number
  status: 'completed' | 'recovered' | 'today' | 'upcoming' | 'missed'
}

export interface ProofCardProps {
  dayNumber: number
  dayTitle: string
  studentName: string
  trackLabel: string
  streakCount: number
  chainWindow: ChainLink[]
}

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  ink:       '#0A0A0A',
  coal:      '#111111',
  graphite:  '#1C1C1C',
  chalk:     '#F0EDE6',
  ash:       '#5A5A5A',
  signal:    '#F4B942',
  signalDim: '#C07820',
  green:     '#22C55E',
  red:       '#EF4444',
  rim:       '#222222',
}

// ─── Link status → colour ─────────────────────────────────────────────────────
function linkColor(status: ChainLink['status']): string {
  if (status === 'completed')  return C.green
  if (status === 'recovered')  return C.signal
  if (status === 'today')      return C.signal
  if (status === 'missed')     return C.red
  return C.rim
}
function isFilled(status: ChainLink['status']) {
  return status === 'completed' || status === 'recovered' || status === 'today'
}

// ─── Chain link SVG (large, glowing version for the card) ────────────────────
function ChainLinkNode({
  link,
  index,
  size,
}: {
  link: ChainLink
  index: number
  size: number
}) {
  const color   = linkColor(link.status)
  const filled  = isFilled(link.status)
  const isToday = link.status === 'today'
  const dotSize = size * 0.35

  return (
    <motion.div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.1 + index * 0.06,
        duration: 0.4,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {/* Outer glow ring — today only */}
      {isToday && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -6,
            border: `1.5px solid ${color}40`,
          }}
          animate={{ opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Filled halo */}
      {filled && (
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `${color}16` }}
        />
      )}

      {/* Border ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${color}`,
          boxShadow: filled ? `0 0 ${isToday ? 14 : 6}px ${color}50` : 'none',
        }}
      />

      {/* Inner dot */}
      {filled && (
        <motion.div
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
          animate={isToday ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Gold seam line for recovered */}
      {link.status === 'recovered' && (
        <div
          className="absolute"
          style={{
            width: 2,
            height: '75%',
            background: `linear-gradient(to bottom, transparent, ${C.signal}CC, transparent)`,
            borderRadius: 1,
          }}
        />
      )}
    </motion.div>
  )
}

// ─── Connector bar between chain links ───────────────────────────────────────
function Connector({ left, right }: { left: ChainLink; right: ChainLink }) {
  const leftFilled  = isFilled(left.status)
  const rightFilled = isFilled(right.status)
  const color = leftFilled ? linkColor(left.status) : C.rim

  return (
    <motion.div
      className="flex-shrink-0"
      style={{ width: 14, height: 2.5, borderRadius: 2 }}
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.25, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 2,
          background: leftFilled && rightFilled
            ? `linear-gradient(to right, ${linkColor(left.status)}, ${linkColor(right.status)})`
            : leftFilled
            ? `linear-gradient(to right, ${color}88, ${C.rim})`
            : C.rim,
        }}
      />
    </motion.div>
  )
}

// ─── Canvas download (PNG image) ──────────────────────────────────────────────
async function downloadPNG(props: ProofCardProps) {
  const W = 1200, H = 628, S = 2
  const canvas = document.createElement('canvas')
  canvas.width = W * S; canvas.height = H * S
  const ctx = canvas.getContext('2d')!
  ctx.scale(S, S)

  // Background
  ctx.fillStyle = C.coal
  ctx.fillRect(0, 0, W, H)

  // Radial ambient glows
  const grd = ctx.createRadialGradient(W * 0.82, H * 0.28, 0, W * 0.82, H * 0.28, W * 0.55)
  grd.addColorStop(0,   'rgba(244,185,66,0.07)')
  grd.addColorStop(0.5, 'rgba(244,185,66,0.025)')
  grd.addColorStop(1,   'transparent')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)

  const grd2 = ctx.createRadialGradient(W * 0.05, H * 0.85, 0, W * 0.05, H * 0.85, W * 0.4)
  grd2.addColorStop(0,   'rgba(34,197,94,0.04)')
  grd2.addColorStop(1,   'transparent')
  ctx.fillStyle = grd2
  ctx.fillRect(0, 0, W, H)

  // Top gold bar
  const bar = ctx.createLinearGradient(0, 0, W, 0)
  bar.addColorStop(0,   C.signalDim)
  bar.addColorStop(0.5, C.signal)
  bar.addColorStop(1,   C.signalDim)
  ctx.fillStyle = bar
  ctx.fillRect(0, 0, W, 5)

  // Bottom border line
  ctx.fillStyle = C.rim
  ctx.fillRect(0, H - 1, W, 1)

  // Brand top-left
  ctx.font = 'bold 18px system-ui, sans-serif'
  ctx.fillStyle = C.chalk
  const abW = ctx.measureText('AB').width
  ctx.fillText('AB', 56, 56)
  ctx.fillStyle = C.signal
  ctx.fillText('TALKS', 56 + abW, 56)

  // "60-Day Challenge" top-right
  ctx.font = '500 11px monospace'
  ctx.fillStyle = C.ash
  ctx.textAlign = 'right'
  ctx.fillText('60-DAY CHALLENGE  ·  BUILD IN PUBLIC', W - 56, 56)
  ctx.textAlign = 'left'

  // Divider under header
  ctx.fillStyle = C.rim
  ctx.fillRect(56, 70, W - 112, 1)

  // Giant day number
  ctx.font = `bold 148px system-ui, sans-serif`
  const dayGrd = ctx.createLinearGradient(56, 0, 56 + 600, 0)
  dayGrd.addColorStop(0,   C.chalk)
  dayGrd.addColorStop(0.6, C.chalk)
  dayGrd.addColorStop(1,   'rgba(240,237,230,0.4)')
  ctx.fillStyle = dayGrd
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '-6px'
  ctx.fillText(`Day ${props.dayNumber}`, 56, 240)

  // Day title
  ctx.font = '300 22px system-ui, sans-serif'
  ctx.fillStyle = C.ash
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px'
  ctx.fillText(truncate(props.dayTitle, 72), 56, 278)

  // Chain links
  const chainY = 358
  const linkR  = 22
  const connW  = 18
  let   cx     = 56

  props.chainWindow.forEach((link, i) => {
    const color  = linkColor(link.status)
    const filled = isFilled(link.status)

    if (i > 0) {
      const prevColor = linkColor(props.chainWindow[i - 1].status)
      const prevFilled = isFilled(props.chainWindow[i - 1].status)
      const connColor = prevFilled && filled
        ? prevColor
        : prevFilled ? `${prevColor}66` : C.rim
      ctx.fillStyle = connColor
      ctx.fillRect(cx - connW, chainY - 1.5, connW, 3)
    }

    if (filled) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx + linkR, chainY, linkR + 10, 0, Math.PI * 2)
      ctx.fillStyle = `${color}20`
      ctx.fill()
      ctx.restore()
    }

    ctx.beginPath()
    ctx.arc(cx + linkR, chainY, linkR, 0, Math.PI * 2)
    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.stroke()

    if (filled) {
      ctx.beginPath()
      ctx.arc(cx + linkR, chainY, linkR, 0, Math.PI * 2)
      ctx.fillStyle = `${color}18`
      ctx.fill()
    }

    if (filled) {
      ctx.beginPath()
      ctx.arc(cx + linkR, chainY, linkR * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    ctx.font = '9px monospace'
    ctx.fillStyle = filled ? `${color}CC` : C.rim
    ctx.textAlign = 'center'
    ctx.fillText(`${link.day}`, cx + linkR, chainY + linkR + 14)
    ctx.textAlign = 'left'

    cx += linkR * 2 + connW
  })

  // "Your chain" label
  ctx.font = '10px monospace'
  ctx.fillStyle = `${C.ash}99`
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0.18em'
  ctx.fillText('YOUR CHAIN', 56, chainY - linkR - 14)
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px'

  // Divider above footer
  ctx.fillStyle = C.rim
  ctx.fillRect(56, H - 110, W - 112, 1)

  // Student name
  ctx.font = `bold 20px system-ui, sans-serif`
  ctx.fillStyle = C.chalk
  ctx.fillText(props.studentName, 56, H - 72)

  ctx.font = '11px monospace'
  ctx.fillStyle = C.ash
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0.1em'
  ctx.fillText(props.trackLabel.toUpperCase(), 56, H - 52)
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px'

  // Streak badge
  const bW = 130, bH = 56, bX = W - 56 - bW, bY = H - 56 - bH + 8
  ctx.fillStyle = `${C.signal}12`
  ctx.strokeStyle = `${C.signal}40`
  ctx.lineWidth = 1
  roundRect(ctx, bX, bY, bW, bH, 10)
  ctx.fill()
  roundRect(ctx, bX, bY, bW, bH, 10)
  ctx.stroke()

  ctx.font = `bold 32px system-ui, sans-serif`
  ctx.fillStyle = C.signal
  ctx.textAlign = 'center'
  ctx.fillText(`${props.streakCount}`, bX + bW / 2, bY + 34)

  ctx.font = '9px monospace'
  ctx.fillStyle = C.ash
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0.12em'
  ctx.fillText('DAY STREAK', bX + bW / 2, bY + 50)
  ctx.textAlign = 'left'
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px'

  // Site footer
  ctx.font = '10px monospace'
  ctx.fillStyle = `${C.ash}55`
  ctx.textAlign = 'right'
  ctx.fillText('abtalks.vercel.app', W - 56, H - 16)
  ctx.textAlign = 'left'

  // Download trigger
  const url = canvas.toDataURL('image/png')
  const a   = document.createElement('a')
  a.download = `abtalks-day-${props.dayNumber}-proof.png`
  a.href = url
  a.click()
}

// ─── PDF Proof Certificate Generator ─────────────────────────────────────────
// Opens a dedicated, beautifully styled landscape certificate print view
// configured for automatic native PDF export via window.print()
function downloadPDF(props: ProofCardProps) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>ABTalks Proof Certificate — Day ${props.dayNumber}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 100vw;
          height: 100vh;
          background: #0A0A0A;
          color: #F0EDE6;
          font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }
        .cert-border {
          width: 100%;
          height: 100%;
          border: 3px solid #F4B942;
          padding: 8px;
          border-radius: 16px;
          position: relative;
          background: #111111;
          box-shadow: 0 0 50px rgba(244, 185, 66, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .cert-inner {
          border: 1px solid #222222;
          height: 100%;
          border-radius: 12px;
          padding: 40px 50px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          background: radial-gradient(ellipse 70% 60% at 85% 20%, rgba(244,185,66,0.08) 0%, transparent 70%);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .brand {
          font-weight: 800;
          font-size: 24px;
          letter-spacing: -0.5px;
          color: #F0EDE6;
        }
        .brand span { color: #F4B942; }
        .cert-type {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 3px;
          color: #5A5A5A;
          text-transform: uppercase;
        }
        .hero {
          margin-top: 20px;
        }
        .badge-title {
          font-family: monospace;
          color: #F4B942;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .day-title {
          font-size: 56px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -2px;
          color: #F0EDE6;
        }
        .task-name {
          font-size: 20px;
          color: #5A5A5A;
          margin-top: 10px;
          font-weight: 300;
        }
        .student-section {
          margin-top: 30px;
          padding-top: 25px;
          border-top: 1px solid #222222;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .student-name {
          font-size: 28px;
          font-weight: 700;
          color: #F0EDE6;
        }
        .track-label {
          font-family: monospace;
          font-size: 12px;
          letter-spacing: 2px;
          color: #5A5A5A;
          margin-top: 4px;
          text-transform: uppercase;
        }
        .streak-pill {
          background: rgba(244, 185, 66, 0.1);
          border: 1px solid rgba(244, 185, 66, 0.3);
          padding: 12px 24px;
          border-radius: 12px;
          text-align: center;
        }
        .streak-val {
          font-size: 32px;
          font-weight: 800;
          color: #F4B942;
          line-height: 1;
        }
        .streak-lbl {
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 2px;
          color: #5A5A5A;
          margin-top: 4px;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: monospace;
          font-size: 10px;
          color: #5A5A5A;
          border-top: 1px solid #222222;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="cert-border">
        <div class="cert-inner">
          <div class="header">
            <div>
              <div class="brand">AB<span>TALKS</span></div>
              <div class="cert-type">Official Build Proof Certificate</div>
            </div>
            <div style="text-align: right;">
              <div class="cert-type">60-Day Challenge</div>
              <div style="font-family: monospace; font-size: 10px; color: #5A5A5A; margin-top: 4px;">Date: ${dateStr}</div>
            </div>
          </div>

          <div class="hero">
            <div class="badge-title">✓ Milestone Verified · Day ${props.dayNumber}</div>
            <div class="day-title">Day ${props.dayNumber} Completed</div>
            <div class="task-name">${props.dayTitle}</div>
          </div>

          <div class="student-section">
            <div>
              <div style="font-family: monospace; font-size: 10px; color: #5A5A5A; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px;">Issued To</div>
              <div class="student-name">${props.studentName}</div>
              <div class="track-label">${props.trackLabel} Track</div>
            </div>
            <div class="streak-pill">
              <div class="streak-val">${props.streakCount}</div>
              <div class="streak-lbl">DAY STREAK</div>
            </div>
          </div>

          <div class="footer">
            <div>Verified Record ID: ABT-PROOF-${props.dayNumber}-${Date.now().toString(36).toUpperCase()}</div>
            <div>abtalks.vercel.app · Built in public</div>
          </div>
        </div>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProofCard(props: ProofCardProps) {
  const { dayNumber, dayTitle, studentName, trackLabel, streakCount, chainWindow } = props
  const [downloadingPNG, setDownloadingPNG] = useState(false)

  const handleDownloadPNG = async () => {
    setDownloadingPNG(true)
    try { await downloadPNG(props) } finally { setDownloadingPNG(false) }
  }

  const handleDownloadPDF = () => {
    downloadPDF(props)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col gap-3"
    >

      {/* ════════════════════════════════════════════════════════════════
          THE CARD — Visual Artifact
      ════════════════════════════════════════════════════════════════ */}
      <div
        id="proof-card"
        className="rounded-card overflow-hidden relative"
        style={{
          background: C.coal,
          border: `1px solid ${C.signal}28`,
          boxShadow: `0 0 0 1px ${C.rim}, 0 24px 64px rgba(0,0,0,0.7), 0 0 80px ${C.signal}0A`,
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 88% 15%, ${C.signal}0D 0%, transparent 65%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 45% 45% at 4% 92%, rgba(34,197,94,0.05) 0%, transparent 65%)`,
          }}
        />

        {/* Gold top bar with shimmer */}
        <div className="h-[3px] relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(90deg, ${C.signalDim}, ${C.signal} 50%, ${C.signalDim})` }}
          />
          <motion.div
            className="absolute inset-y-0"
            style={{
              width: '45%',
              background: 'linear-gradient(90deg, transparent, rgba(255,220,100,0.7) 50%, transparent)',
            }}
            animate={{ left: ['-45%', '145%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
          />
        </div>

        <div className="relative px-5 sm:px-7 pt-5 pb-5">

          {/* Top row: brand left · badge right */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p
                className="font-display font-bold"
                style={{ fontSize: 14, letterSpacing: '-0.01em', color: C.chalk }}
              >
                AB<span style={{ color: C.signal }}>TALKS</span>
              </p>
              <p
                className="font-mono uppercase mt-0.5"
                style={{ fontSize: 7.5, letterSpacing: '0.2em', color: C.ash }}
              >
                60-Day Challenge
              </p>
            </div>

            {/* Streak badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center px-4 py-2.5 flex-shrink-0"
              style={{
                background: `${C.signal}10`,
                border: `1px solid ${C.signal}35`,
                borderRadius: 10,
                boxShadow: `0 0 18px ${C.signal}10`,
              }}
            >
              <motion.p
                className="font-display font-bold"
                style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.04em', color: C.signal }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              >
                {streakCount}
              </motion.p>
              <p
                className="font-mono uppercase mt-0.5"
                style={{ fontSize: 7, letterSpacing: '0.16em', color: C.ash }}
              >
                day streak
              </p>
            </motion.div>
          </div>

          {/* Day number */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            <p
              className="font-display font-bold"
              style={{
                fontSize: 'clamp(3.6rem, 13vw, 6rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.05em',
                color: C.chalk,
              }}
            >
              Day <span style={{ color: C.signal }}>{dayNumber}</span>
            </p>
            <p
              className="font-body mt-2.5 leading-snug"
              style={{ fontSize: 13, color: C.ash, maxWidth: '28rem' }}
            >
              {dayTitle}
            </p>
          </motion.div>

          {/* Chain strip */}
          <div className="mt-7 mb-6">
            <p
              className="font-mono uppercase mb-3"
              style={{ fontSize: 7.5, letterSpacing: '0.2em', color: `${C.ash}88` }}
            >
              Your chain
            </p>

            <div className="flex items-center">
              {chainWindow.map((link, i) => (
                <div key={link.day} className="flex items-center">
                  <ChainLinkNode link={link} index={i} size={32} />
                  {i < chainWindow.length - 1 && (
                    <Connector left={link} right={chainWindow[i + 1]} />
                  )}
                </div>
              ))}
            </div>

            {/* Day number labels */}
            <div className="flex items-center mt-2" style={{ gap: 0 }}>
              {chainWindow.map((link, i) => (
                <div key={link.day} className="flex items-center">
                  <div
                    style={{ width: 32, textAlign: 'center' }}
                    className="font-mono"
                  >
                    <span
                      style={{
                        fontSize: 8,
                        color: isFilled(link.status)
                          ? `${linkColor(link.status)}BB`
                          : `${C.ash}55`,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {link.day}
                    </span>
                  </div>
                  {i < chainWindow.length - 1 && (
                    <div style={{ width: 14, flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer info bar */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 -mx-1 rounded-[8px]"
            style={{
              background: `${C.graphite}CC`,
              border: `1px solid ${C.rim}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="min-w-0">
              <p
                className="font-display font-bold truncate"
                style={{ fontSize: 14, letterSpacing: '-0.02em', color: C.chalk }}
              >
                {studentName}
              </p>
              <p
                className="font-mono uppercase mt-0.5"
                style={{ fontSize: 8, letterSpacing: '0.14em', color: C.ash }}
              >
                {trackLabel}
              </p>
            </div>
            <p
              className="font-mono flex-shrink-0"
              style={{ fontSize: 8, letterSpacing: '0.1em', color: `${C.ash}66` }}
            >
              abtalks.vercel.app
            </p>
          </div>

        </div>
      </div>

      {/* ── Action buttons: PNG & PDF Download ── */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        {/* PDF Certificate Download Button */}
        <motion.button
          id="download-pdf-proof"
          onClick={handleDownloadPDF}
          whileHover={{ opacity: 0.94 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-pill py-3 px-4 font-display font-bold transition-all"
          style={{
            fontSize: 13,
            background: 'linear-gradient(135deg, #F4B942 0%, #C49030 100%)',
            color: '#0A0A0A',
            border: 'none',
            boxShadow: '0 4px 14px rgba(244, 185, 66, 0.25)',
            cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download PDF Certificate
        </motion.button>

        {/* PNG Image Download Button */}
        <motion.button
          id="download-png-proof"
          onClick={handleDownloadPNG}
          disabled={downloadingPNG}
          whileHover={downloadingPNG ? {} : { opacity: 0.9 }}
          whileTap={downloadingPNG ? {} : { scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-pill py-3 px-4 font-display font-bold transition-all"
          style={{
            fontSize: 12.5,
            background: 'var(--graphite)',
            color: 'var(--chalk)',
            border: '1px solid var(--rim)',
            cursor: downloadingPNG ? 'not-allowed' : 'pointer',
          }}
        >
          {downloadingPNG ? (
            <>
              <motion.span
                className="inline-block w-3.5 h-3.5 rounded-full border-2"
                style={{ borderColor: C.ash, borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
              />
              Generating PNG…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2v8M5 7l3 3 3-3M2 12h12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download PNG Image
            </>
          )}
        </motion.button>
      </div>

    </motion.div>
  )
}
