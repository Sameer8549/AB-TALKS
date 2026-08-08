// Server component — static closing section.
import Link from 'next/link'

export default function LandingCTA() {
  return (
    <section className="border-t border-rim py-24 sm:py-40 relative overflow-hidden">
      {/* Ambient warm glow — the page ends warm, not cold */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 10% 60%, rgba(244,185,66,0.045) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Closing statement — matches hero energy */}
        <h2
          className="font-display font-bold text-chalk tracking-[-0.04em]"
          style={{ lineHeight: 0.92 }}
        >
          <span
            className="block"
            style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
          >
            Day 1
          </span>
          <span
            className="block text-signal"
            style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
          >
            starts now.
          </span>
        </h2>

        <p className="font-body text-ash text-base sm:text-lg mt-8 mb-10 max-w-[22rem] leading-relaxed">
          You don&apos;t need a perfect plan. You need a first commit.
          Sixty days from today, you&apos;ll have proof.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2.5 bg-signal text-ink font-display font-bold text-base sm:text-lg px-8 py-4 sm:px-10 sm:py-4.5 rounded-pill hover:opacity-92 transition-all duration-200 active:scale-[0.97]"
          style={{ fontSize: 'clamp(0.9rem, 2vw, 1.125rem)' }}
        >
          Join the Challenge
          <span aria-hidden="true" className="text-lg">→</span>
        </Link>

        <p
          className="font-mono text-ash/35 uppercase mt-8"
          style={{ fontSize: 10, letterSpacing: '0.2em' }}
        >
          60 days · GitHub commit · LinkedIn post · Every day
        </p>
      </div>
    </section>
  )
}
