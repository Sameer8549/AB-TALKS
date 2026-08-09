'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PromptsPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch('/Redesigning ABTalks Platform.md')
      .then((res) => res.text())
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch(() => {
        setContent('Error loading prompt transcript.')
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F0EDE6] p-6 sm:p-12 font-sans">
      {/* Navigation */}
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 mb-8">
        <Link
          href="/"
          className="font-mono text-xs text-[#6B7191] hover:text-[#F0EDE6] transition-colors"
        >
          ← Back to ABTalks
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="/Redesigning ABTalks Platform.md"
            download
            className="bg-[#1E2133] hover:bg-[#2A2D42] text-[#DDE1EA] font-mono text-xs px-4 py-2 rounded-lg border border-[#2A2D42] transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Raw .md
          </a>
        </div>
      </div>

      {/* Main Document Frame */}
      <div className="max-w-5xl mx-auto bg-[#111111] border border-[#222222] rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div className="border-b border-[#222222] pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#F4B942] uppercase tracking-wider bg-[#F4B942]/10 border border-[#F4B942]/30 px-3 py-1 rounded-full">
              AUTHENTICITY PROOF
            </span>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#F0EDE6] mt-3 tracking-tight">
              Raw Prompt & Chat Conversation History
            </h1>
            <p className="text-sm text-[#6B7191] mt-1 font-mono">
              Original session export file: Redesigning ABTalks Platform.md
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#6B7191] font-mono animate-pulse">
            Loading full prompt transcript...
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-[#DDE1EA] bg-[#0C0E14] p-6 rounded-xl border border-[#1E2133] leading-relaxed overflow-x-auto selection:bg-[#F4B942] selection:text-black">
            {content}
          </pre>
        )}
      </div>
    </main>
  )
}
