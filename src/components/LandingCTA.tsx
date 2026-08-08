// Server component — static closing CTA.
import Link from 'next/link'

export default function LandingCTA() {
  return (
    <section className="py-24 sm:py-40 border-t border-rim">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-chalk tracking-tight mb-5">
          Day 1 starts
          <br />
          <span className="text-signal">when you do.</span>
        </h2>
        <p className="font-body text-ash text-base sm:text-lg mb-10 max-w-[18rem] mx-auto leading-relaxed">
          You don&apos;t need a perfect plan. You need a first commit.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-signal text-ink font-display font-bold text-base sm:text-lg px-8 py-4 rounded-pill hover:opacity-90 transition-all duration-200 active:scale-[0.97]"
        >
          Join the Challenge
          <span aria-hidden="true">→</span>
        </Link>
        <p className="font-mono text-[11px] text-ash/50 tracking-wider mt-6 uppercase">
          60 days · GitHub commit · LinkedIn post · Every day
        </p>
      </div>
    </section>
  )
}
