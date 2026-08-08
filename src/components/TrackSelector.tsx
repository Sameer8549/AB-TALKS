'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const TRACKS = [
  {
    id: 'fullstack',
    label: 'Full Stack Dev',
    summary:
      'React, Node.js, databases, authentication, and deployment. Build real apps from scratch — front to back.',
    sampleDay: 'Day 9 — JWT authentication from scratch',
    tag: 'Most picked',
  },
  {
    id: 'dsa',
    label: 'DSA & Algorithms',
    summary:
      'Arrays, trees, graphs, and dynamic programming. Master the interview fundamentals through daily practice.',
    sampleDay: 'Day 14 — Graph traversal: BFS and DFS',
    tag: null,
  },
  {
    id: 'aiml',
    label: 'AI / ML',
    summary:
      'Python, NumPy, neural networks, model training and deployment. Build systems that actually learn.',
    sampleDay: 'Day 11 — Train your first neural network',
    tag: null,
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud',
    summary:
      'Docker, CI/CD, cloud infrastructure, and monitoring. Ship it, scale it, keep it running.',
    sampleDay: 'Day 7 — Docker container + GitHub Actions CI',
    tag: null,
  },
]

export default function TrackSelector() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="tracks" className="border-t border-rim">
      {/* Section header — contained */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <h2
          className="font-display font-bold text-chalk tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.05 }}
        >
          Four tracks.
          <br />
          <span className="text-ash">One focus.</span>
        </h2>
        <p className="font-body text-ash mt-3 text-base leading-relaxed max-w-[20rem]">
          Pick one. Commit for all 60 days. Depth beats breadth.
        </p>
      </div>

      {/* Full-bleed list — borders edge to edge */}
      <div className="border-t border-rim">
        {TRACKS.map((track, i) => {
          const isOpen = active === track.id
          return (
            <div key={track.id} className="border-b border-rim">
              <button
                id={`track-${track.id}`}
                onClick={() => setActive(isOpen ? null : track.id)}
                className="group w-full text-left focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-signal"
              >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: index + name */}
                    <div className="flex items-baseline gap-5 sm:gap-8 min-w-0">
                      <span
                        className="font-mono text-rim group-hover:text-ash transition-colors duration-200 flex-shrink-0"
                        style={{ fontSize: 11, letterSpacing: '0.08em' }}
                      >
                        0{i + 1}
                      </span>
                      <h3
                        className={`font-display font-bold tracking-tight transition-colors duration-200 ${
                          isOpen
                            ? 'text-chalk'
                            : 'text-ash group-hover:text-chalk'
                        }`}
                        style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)' }}
                      >
                        {track.label}
                      </h3>
                      {track.tag && (
                        <span
                          className="hidden sm:inline font-mono text-signal uppercase flex-shrink-0"
                          style={{ fontSize: 9, letterSpacing: '0.18em' }}
                        >
                          {track.tag}
                        </span>
                      )}
                    </div>

                    {/* Right: plus/minus */}
                    <motion.span
                      className={`font-mono text-xl flex-shrink-0 transition-colors duration-200 ${
                        isOpen ? 'text-signal' : 'text-ash group-hover:text-chalk'
                      }`}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                      style={{ display: 'inline-block' }}
                    >
                      +
                    </motion.span>
                  </div>
                </div>
              </button>

              {/* Expanded panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
                      {/* Offset to align with track name */}
                      <div className="sm:pl-[calc(2.5rem+2rem)]">
                        <p className="font-body text-ash text-sm sm:text-base leading-relaxed mb-5 max-w-lg">
                          {track.summary}
                        </p>
                        {/* Sample day chip */}
                        <div
                          className="inline-flex items-center gap-2.5 rounded-chip px-3.5 py-2"
                          style={{
                            background: 'rgba(244,185,66,0.07)',
                            border: '1px solid rgba(244,185,66,0.2)',
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-signal flex-shrink-0" />
                          <p
                            className="font-mono text-signal/80"
                            style={{ fontSize: 11, letterSpacing: '0.04em' }}
                          >
                            e.g. {track.sampleDay}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
