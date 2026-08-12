'use client'

import Link from 'next/link'

export default function ScriptPage() {
  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F0EDE6] p-6 sm:p-12 font-sans">
      <style jsx global>{`
        @media print {
          nav, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .print-header {
            color: black !important;
          }
          .print-text {
            color: #333 !important;
          }
          .print-badge {
            background: #eee !important;
            color: black !important;
            border: 1px solid #ccc !important;
          }
        }
      `}</style>

      {/* Top action bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 mb-8 no-print">
        <Link
          href="/"
          className="font-mono text-xs text-[#6B7191] hover:text-[#F0EDE6] transition-colors"
        >
          ← Back to ABTalks
        </Link>
        <button
          onClick={handlePrintPDF}
          className="bg-[#F4B942] text-[#0A0A0A] font-bold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download PDF Script
        </button>
      </div>

      {/* Printable Script Document */}
      <div className="max-w-4xl mx-auto bg-[#111111] border border-[#222222] rounded-xl p-8 sm:p-10 print-card shadow-2xl">
        <div className="border-b border-[#222222] pb-6 mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#F0EDE6] print-header">
              ABTalks Redesign — Hackathon Demo Video Script
            </h1>
            <span className="font-mono text-xs text-[#F4B942] bg-[#F4B942]/10 border border-[#F4B942]/30 px-3 py-1 rounded-full print-badge flex-shrink-0">
              OFFICIAL SCRIPT
            </span>
          </div>
          <div className="font-mono text-xs text-[#6B7191] flex flex-wrap gap-4 print-text">
            <p><strong>Presenter:</strong> Pavithra (Team 404 Found Us)</p>
            <p><strong>Target Duration:</strong> 2:30 – 3:00 minutes</p>
            <p><strong>Resolution:</strong> 1080p (390px Mobile Viewport)</p>
          </div>
        </div>

        {/* Script Content */}
        <div className="space-y-8">
          {/* Scene 1 */}
          <div className="border-l-2 border-[#F4B942] pl-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg text-[#F4B942]">Scene 1: The Hook & The Problem</h2>
              <span className="font-mono text-xs text-[#6B7191] print-text">0:00 – 0:30</span>
            </div>
            <p className="font-mono text-xs text-[#6B7191] mb-2 print-text">
              <strong>Screen:</strong> Open https://abtalksredesign.vercel.app (Landing Page). Scroll slowly down HowItWorks and TrackSelector. Toggle Theme once.
            </p>
            <blockquote className="bg-[#1E2133]/50 p-4 rounded-lg border border-[#2A2D42] text-sm text-[#DDE1EA] leading-relaxed print-card print-text">
              "Hey judges! I’m Pavithra, member of Team 404 Found Us. Today, we’re presenting our redesign of ABTalks — the platform where Indian college developers build a 60-day coding habit. Most students use ABTalks late at night on their phones — exhausted after college, trying to keep a habit alive. The original product mechanics worked, but the UI was raw and unforgiving. We reimagined ABTalks from the ground up — building an interface that adapts to the student instead of demanding discipline from them."
            </blockquote>
          </div>

          {/* Scene 2 */}
          <div className="border-l-2 border-[#F4B942] pl-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg text-[#F4B942]">Scene 2: The Core Thesis & The StreakChain</h2>
              <span className="font-mono text-xs text-[#6B7191] print-text">0:30 – 1:05</span>
            </div>
            <p className="font-mono text-xs text-[#6B7191] mb-2 print-text">
              <strong>Screen:</strong> Dashboard (/dashboard) in Normal State (Arjun Mehta). Hover over StreakChain links. Highlight midnight countdown and personal-best nudge.
            </p>
            <blockquote className="bg-[#1E2133]/50 p-4 rounded-lg border border-[#2A2D42] text-sm text-[#DDE1EA] leading-relaxed print-card print-text">
              "Welcome to the Student Command Center. Our signature feature is the StreakChain — not a generic contribution grid, but a physicalized chain of 60 links that glow, lock, crack, and repair. Our design thesis is simple: the chain knows what time it is, and it knows you’re tired. At 11 PM, the UI copy softens. As midnight approaches, a live countdown creates urgency. And when you’re near your personal best, a quiet nudge keeps you moving."
            </blockquote>
          </div>

          {/* Scene 3 */}
          <div className="border-l-2 border-[#F4B942] pl-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg text-[#F4B942]">Scene 3: Edge Cases & Recovery Grace</h2>
              <span className="font-mono text-xs text-[#6B7191] print-text">1:05 – 1:45</span>
            </div>
            <p className="font-mono text-xs text-[#6B7191] mb-2 print-text">
              <strong>Screen:</strong> Click 'Missed' in switcher (Rahul Nair). Click 'Repair Now', paste GitHub & LinkedIn URLs, submit. Show Gold Seam repaired link! Switch to 'New' (Priya Sharma).
            </p>
            <blockquote className="bg-[#1E2133]/50 p-4 rounded-lg border border-[#2A2D42] text-sm text-[#DDE1EA] leading-relaxed print-card print-text">
              "Most streak apps punish failure instantly. Miss one day, and your 30-day streak resets to zero — which is when 80% of students quit forever. On ABTalks, a missed day triggers Recovery Grace. You get a 24-hour grace window to repair the fracture. When you submit late, we don't hide the mistake — we seal the link with a Gold Seam. The scar becomes proof of your resilience. We also designed every edge case with care — including brand-new students on Day 1 with zero streak."
            </blockquote>
          </div>

          {/* Scene 4 */}
          <div className="border-l-2 border-[#F4B942] pl-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg text-[#F4B942]">Scene 4: Day Detail & Dual Export Engine</h2>
              <span className="font-mono text-xs text-[#6B7191] print-text">1:45 – 2:30</span>
            </div>
            <p className="font-mono text-xs text-[#6B7191] mb-2 print-text">
              <strong>Screen:</strong> Go to /day/12. Expand requirements checklist, submit URLs. Trigger ProofCard. Click 'Download PDF Certificate' (show print dialog) and 'Download PNG Image'.
            </p>
            <blockquote className="bg-[#1E2133]/50 p-4 rounded-lg border border-[#2A2D42] text-sm text-[#DDE1EA] leading-relaxed print-card print-text">
              "On Day 12, students get a clear task breakdown, expandable requirements, and a clean proof submission engine. When you submit proof, ABTalks dynamically generates a shareable ProofCard. Students can export a 1200×628 PNG image formatted specifically for LinkedIn posts, OR download an official A4 Landscape PDF Build Certificate with a unique verification ID."
            </blockquote>
          </div>

          {/* Scene 5 */}
          <div className="border-l-2 border-[#F4B942] pl-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg text-[#F4B942]">Scene 5: Conclusion & Technical Stack</h2>
              <span className="font-mono text-xs text-[#6B7191] print-text">2:30 – 3:00</span>
            </div>
            <p className="font-mono text-xs text-[#6B7191] mb-2 print-text">
              <strong>Screen:</strong> Return to /dashboard or README on GitHub.
            </p>
            <blockquote className="bg-[#1E2133]/50 p-4 rounded-lg border border-[#2A2D42] text-sm text-[#DDE1EA] leading-relaxed print-card print-text">
              "The application is built with Next.js 15, React 19, and Tailwind CSS. It features full mobile responsiveness at 390px, dual light/dark themes, and client-side export engines. Thank you judges! We are Team 404 Found Us — Pavithra, Abdul Sameer, and Mahendra Selvan. Try the live demo at abtalksredesign.vercel.app!"
            </blockquote>
          </div>
        </div>
      </div>
    </main>
  )
}
