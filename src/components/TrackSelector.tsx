'use client'

import { useState } from 'react'

const TRACKS = [
  {
    id: 'fullstack',
    label: 'Full Stack Dev',
    summary: 'Build real web apps end to end.',
    sampleDay: 'Day 9 — JWT auth from scratch',
    tag: 'Most picked',
  },
  {
    id: 'dsa',
    label: 'DSA & Algorithms',
    summary: 'Master the interview fundamentals.',
    sampleDay: 'Day 14 — Graph traversal: BFS and DFS',
    tag: null,
  },
  {
    id: 'aiml',
    label: 'AI / ML',
    summary: 'Build systems that learn.',
    sampleDay: 'Day 11 — Train your first neural network',
    tag: null,
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud',
    summary: 'Ship it. Scale it. Keep it running.',
    sampleDay: 'Day 7 — Docker + CI/CD pipeline',
    tag: null,
  },
]

export default function TrackSelector() {
  const [active, setActive] = useState('fullstack')

  return (
    <section id="tracks" className="py-24 sm:py-32 border-t border-rim">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-chalk tracking-tight">
            Four tracks. One focus.
          </h2>
          <p className="font-body text-ash mt-3 text-base max-w-xs">
            Pick one. Commit to it for all 60 days. Depth beats breadth.
          </p>
        </div>

        {/* Track grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRACKS.map((track) => {
            const isActive = active === track.id
            return (
              <button
                key={track.id}
                id={`track-${track.id}`}
                onClick={() => setActive(track.id)}
                className={`text-left p-5 sm:p-6 rounded-card border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  isActive
                    ? 'border-signal bg-signal/[0.07]'
                    : 'border-rim bg-coal hover:border-ash hover:bg-graphite/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3
                    className={`font-display font-bold text-base sm:text-lg transition-colors duration-200 ${
                      isActive ? 'text-chalk' : 'text-ash'
                    }`}
                  >
                    {track.label}
                  </h3>
                  {track.tag && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-signal bg-signal/10 px-2 py-1 rounded-chip flex-shrink-0">
                      {track.tag}
                    </span>
                  )}
                </div>

                <p
                  className={`font-body text-sm mb-4 transition-colors duration-200 ${
                    isActive ? 'text-ash' : 'text-rim'
                  }`}
                >
                  {track.summary}
                </p>

                {/* Sample day — reveals on active */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isActive ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-signal/20 pt-3">
                    <p className="font-mono text-[11px] text-signal/70">
                      e.g. {track.sampleDay}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
