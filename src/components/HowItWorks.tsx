// Server component.
// No section header. No 01/02/03. The verbs carry the structure.

const STEPS = [
  {
    verb: 'Pick.',
    description:
      'Choose one of four tracks — Full Stack, DSA, AI/ML, or DevOps. One path. 60 days. No switching.',
  },
  {
    verb: 'Build.',
    description:
      'One real task every day. Not a tutorial, not a replay. Something you wrote, tested, and pushed to GitHub.',
  },
  {
    verb: 'Prove.',
    description:
      'A GitHub commit and a LinkedIn post. Every day. Your streak is your public record — and the chain is what you’re protecting.',
  },
  {
    verb: 'Repair.',
    description:
      'Miss a day? You have a 24-hour window to submit late. A repaired link shows as a gold seam, not a break. The chain doesn’t punish — it recovers.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-rim">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Three-step list — verb left, description right ────────────────── */}
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] items-start gap-4 sm:gap-20 py-10 sm:py-14 border-b border-rim"
          >
            <h3
              className="font-display font-bold text-chalk tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1 }}
            >
              {step.verb}
            </h3>
            <p className="font-body text-ash text-base sm:text-lg leading-relaxed sm:pt-2">
              {step.description}
            </p>
          </div>
        ))}

        {/* ── Proof callout — concrete, not abstract ─────────────────────────── */}
        <div className="py-10 sm:py-14">
          <p className="font-mono text-ash/50 text-[11px] uppercase tracking-[0.18em] mb-4">
            What you submit every day
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-graphite border border-rim rounded-chip px-4 py-4">
              <p className="font-mono text-[10px] text-ash/60 uppercase tracking-wider mb-2">
                GitHub commit
              </p>
              <p className="font-body text-sm text-chalk truncate">
                github.com/yourname/day-12-error-handling
              </p>
            </div>
            <div className="flex-1 bg-graphite border border-rim rounded-chip px-4 py-4">
              <p className="font-mono text-[10px] text-ash/60 uppercase tracking-wider mb-2">
                LinkedIn post
              </p>
              <p className="font-body text-sm text-chalk truncate">
                linkedin.com/posts/yourname_day12
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
