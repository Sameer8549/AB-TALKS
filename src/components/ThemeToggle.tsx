'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsLight(document.documentElement.classList.contains('light'))
  }, [])

  const toggle = () => {
    const next = !isLight
    setIsLight(next)
    if (next) {
      document.documentElement.classList.add('light')
      localStorage.setItem('ab-theme', 'light')
    } else {
      document.documentElement.classList.remove('light')
      localStorage.setItem('ab-theme', 'dark')
    }
  }

  // Render nothing until mounted — avoids server/client mismatch
  if (!mounted) {
    return (
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-chip border border-rim bg-coal" />
    )
  }

  return (
    <motion.button
      id="theme-toggle"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-chip border border-rim bg-coal hover:border-ash hover:bg-graphite transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          /* Moon — shown in light mode (click to go dark) */
          <motion.svg
            key="moon"
            width="13" height="13" viewBox="0 0 16 16" fill="none"
            aria-hidden="true"
            initial={{ opacity: 0, rotate: 60, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -40, scale: 0.7 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            <path
              d="M13.5 10A5.5 5.5 0 1 1 6 2.5a4 4 0 0 0 7.5 7.5z"
              stroke="var(--ash)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ) : (
          /* Sun — shown in dark mode (click to go light) */
          <motion.svg
            key="sun"
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            aria-hidden="true"
            initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.7 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Core */}
            <circle cx="8" cy="8" r="2.8" stroke="var(--signal)" strokeWidth="1.4" />
            {/* Rays */}
            <path
              d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.07 1.07M11.53 11.53l1.07 1.07M3.4 12.6l1.07-1.07M11.53 4.47l1.07-1.07"
              stroke="var(--signal)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
