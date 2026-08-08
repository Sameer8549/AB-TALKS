'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'

interface ProofSubmitFormProps {
  dayNumber: number
  /** 'today' = normal amber submit. 'recovery' = red-accented repair submit. */
  mode?: 'today' | 'recovery'
}

export default function ProofSubmitForm({ dayNumber, mode = 'today' }: ProofSubmitFormProps) {
  const [github, setGithub]     = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  const valid    = github.startsWith('https://') && linkedin.startsWith('https://')
  const isRepair = mode === 'recovery'

  // ── Success state ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-card p-6 flex flex-col items-center gap-3 text-center"
        style={{
          background: isRepair ? 'rgba(244,185,66,0.07)' : 'rgba(34,197,94,0.07)',
          border:     isRepair ? '1px solid rgba(244,185,66,0.25)' : '1px solid rgba(34,197,94,0.22)',
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: isRepair ? 'rgba(244,185,66,0.15)' : 'rgba(34,197,94,0.14)',
            border:     isRepair ? '2px solid rgba(244,185,66,0.4)' : '2px solid rgba(34,197,94,0.4)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5L9.5 17L19 7"
              stroke={isRepair ? 'var(--signal)' : '#22C55E'}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <div>
          <p className="font-display font-bold text-chalk" style={{ fontSize: 18 }}>
            {isRepair ? 'Chain repaired.' : `Day ${dayNumber} locked in.`}
          </p>
          <p className="font-body text-ash mt-1.5" style={{ fontSize: 13 }}>
            {isRepair
              ? `Day ${dayNumber} is marked as recovered — the crack now shows a gold seam, not a break.`
              : 'The chain holds. Come back tomorrow.'}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="font-mono text-signal hover:text-chalk transition-colors mt-1"
          style={{ fontSize: 11 }}
        >
          Back to dashboard
        </Link>
      </motion.div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  const accentColor  = isRepair ? '#EF4444' : 'var(--signal)'
  const submitBg     = isRepair ? 'rgba(239,68,68,0.85)' : 'var(--signal)'
  const submitColor  = isRepair ? '#fff' : 'var(--ink)'
  const borderAccent = isRepair ? 'rgba(239,68,68,0.3)' : 'rgba(244,185,66,0.25)'
  const barBg        = isRepair
    ? 'linear-gradient(90deg, #7F1D1D, #EF4444, #7F1D1D)'
    : 'linear-gradient(90deg, #C07820, #F4B942 50%, #C07820)'

  return (
    <div
      className="rounded-card overflow-hidden"
      style={{ background: 'var(--coal)', border: `1px solid ${borderAccent}` }}
    >
      {/* Top accent bar */}
      <div className="h-[3px] relative overflow-hidden" style={{ background: 'var(--graphite)' }}>
        {!isRepair && (
          <motion.div
            className="absolute inset-y-0"
            style={{ width: '60%', background: 'linear-gradient(90deg, transparent, #F4B942 40%, #FFE080 50%, #F4B942 60%, transparent)' }}
            animate={{ left: ['-60%', '160%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
          />
        )}
        <div className="absolute inset-0" style={{ background: barBg }} />
      </div>

      <div className="p-5">
        <p className="font-mono text-ash uppercase mb-4" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>
          {isRepair ? `Submit Repair Proof — Day ${dayNumber}` : 'Submit Your Proof'}
        </p>

        <form
          onSubmit={async e => {
            e.preventDefault()
            if (!valid) return
            setLoading(true)
            await new Promise(r => setTimeout(r, 1200))
            setLoading(false)
            setDone(true)
          }}
          className="flex flex-col gap-3"
        >
          {(['github', 'linkedin'] as const).map(field => (
            <div key={field} className="flex flex-col gap-1">
              <label className="font-mono text-ash" style={{ fontSize: 9.5, letterSpacing: '0.08em' }}>
                {field === 'github' ? 'GitHub commit / repo URL' : 'LinkedIn post URL'}
              </label>
              <input
                id={`proof-${field}-day${dayNumber}`}
                type="url"
                value={field === 'github' ? github : linkedin}
                onChange={e => field === 'github' ? setGithub(e.target.value) : setLinkedin(e.target.value)}
                placeholder={field === 'github' ? 'https://github.com/...' : 'https://linkedin.com/posts/...'}
                className="w-full rounded-[8px] px-3 py-2.5 font-mono text-chalk placeholder-ash/40 focus:outline-none transition-all"
                style={{ fontSize: 12, border: '1px solid var(--rim)', background: 'var(--graphite)' }}
                onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.background = 'var(--coal)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--rim)'; e.currentTarget.style.background = 'var(--graphite)' }}
              />
            </div>
          ))}

          <motion.button
            id={`proof-submit-day${dayNumber}`}
            type="submit"
            disabled={!valid || loading}
            whileTap={valid ? { scale: 0.97 } : {}}
            className="mt-1 rounded-pill py-3 font-display font-bold transition-all"
            style={{
              fontSize: 13,
              background: valid ? submitBg : 'var(--graphite)',
              color:      valid ? submitColor : 'var(--ash)',
              border: 'none',
              cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="inline-block w-3.5 h-3.5 rounded-full border-2"
                  style={{ borderColor: submitColor, borderTopColor: 'transparent' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
                />
                {isRepair ? 'Repairing…' : 'Locking in…'}
              </span>
            ) : (
              isRepair
                ? `Repair Day ${dayNumber} — Seal the crack`
                : `Lock in Day ${dayNumber}`
            )}
          </motion.button>
        </form>
      </div>
    </div>
  )
}
