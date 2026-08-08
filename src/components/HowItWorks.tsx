// Server component — no interactivity needed here.

const STEPS = [
  {
    number: '01',
    action: 'Pick.',
    description:
      'Choose one of four tracks — Full Stack, DSA, AI/ML, or DevOps. You commit to one path for all 60 days.',
  },
  {
    number: '02',
    action: 'Build.',
    description:
      'One real task every day. Not a tutorial. Not a replay. Something you built, understood, and pushed.',
  },
  {
    number: '03',
    action: 'Prove.',
    description:
      'Submit a GitHub commit link and a LinkedIn post. Your proof is public. Your streak is your record.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 border-t border-rim"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-chalk tracking-tight">
            Three things.
            <br className="sm:hidden" /> Every day.
          </h2>
          <p className="font-body text-ash mt-3 text-base max-w-xs">
            The whole challenge, reduced to its essentials.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`py-8 sm:py-0 ${
                i < STEPS.length - 1
                  ? 'border-b border-rim sm:border-b-0 sm:border-r sm:pr-10'
                  : ''
              } ${i > 0 ? 'sm:pl-10' : ''}`}
            >
              {/* Step number ruler */}
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-2xs text-signal tracking-[0.2em]">
                  {step.number}
                </span>
                <div className="h-px flex-1 bg-rim" />
              </div>

              {/* Action word */}
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-chalk tracking-tight mb-3">
                {step.action}
              </h3>

              {/* Description */}
              <p className="font-body text-ash text-sm sm:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Proof callout — what "proof" actually means */}
        <div className="mt-16 sm:mt-20 p-5 sm:p-6 bg-coal border border-rim rounded-card">
          <p className="font-mono text-2xs uppercase tracking-[0.18em] text-ash mb-3">
            What you submit every day
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-graphite border border-rim rounded-chip px-4 py-3">
              <p className="font-mono text-xs text-ash mb-1">GitHub commit</p>
              <p className="font-body text-sm text-chalk truncate">
                github.com/yourname/day-12-error-handling
              </p>
            </div>
            <div className="flex-1 bg-graphite border border-rim rounded-chip px-4 py-3">
              <p className="font-mono text-xs text-ash mb-1">LinkedIn post</p>
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
