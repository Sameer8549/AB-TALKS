'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import StreakCard from './StreakCard'

export default function HeroSection() {
  return (
    <section className="min-h-[100dvh] pt-16 flex items-center relative overflow-hidden">

      {/* Ambient background glow — adapts to theme via CSS var */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 80% at 82% 55%, var(--signal-faint) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row items-start gap-10 sm:gap-12 lg:gap-16">

          {/* ── LEFT: Headline + body + CTA ─────────────────────────────── */}
          <div className="flex-1 min-w-0">

            <motion.h1
              className="font-display font-bold text-chalk"
              style={{ lineHeight: 0.9, letterSpacing: '-0.04em' }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            >
              <span
                className="block"
                style={{ fontSize: 'clamp(3.4rem, 10.5vw, 7.5rem)' }}
              >
                BUILD
              </span>
              <span
                className="block"
                style={{ fontSize: 'clamp(3.4rem, 10.5vw, 7.5rem)' }}
              >
                PROOF.
              </span>
            </motion.h1>

            <motion.p
              className="font-display font-bold text-signal"
              style={{
                fontSize: 'clamp(1.25rem, 3.6vw, 2.5rem)',
                letterSpacing: '-0.02em',
                marginTop: '0.75rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              One link a day. Don't break the chain.
            </motion.p>

            <motion.p
              className="font-body text-ash leading-relaxed max-w-[22rem] text-base sm:text-lg"
              style={{ marginTop: '2.5rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              Pick a track. Build something real every day. Post the proof.
              The chain adapts to where you are — the goal is to keep it unbroken.
            </motion.p>

            <motion.div
              className="flex items-center gap-5 mt-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
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

          {/* ── RIGHT: Streak Card ───────────────────────────────────────── */}
          <motion.div
            className="w-full sm:w-auto sm:flex-shrink-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <StreakCard />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
