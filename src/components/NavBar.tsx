'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-coal/90 backdrop-blur-md border-b border-rim' : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-chalk text-lg tracking-tight select-none"
        >
          AB<span className="text-signal">TALKS</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="font-body text-sm text-ash hover:text-chalk transition-colors duration-200"
          >
            How it works
          </a>
          <a
            href="#tracks"
            className="font-body text-sm text-ash hover:text-chalk transition-colors duration-200"
          >
            Tracks
          </a>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="bg-signal text-ink font-display font-bold text-sm px-5 py-2.5 rounded-pill hover:opacity-90 transition-all duration-200 active:scale-[0.97]"
        >
          Join Challenge
        </Link>
      </div>
    </nav>
  )
}
