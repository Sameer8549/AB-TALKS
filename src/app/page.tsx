import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import TrackSelector from '@/components/TrackSelector'
import LandingCTA from '@/components/LandingCTA'

export const metadata: Metadata = {
  title: 'ABTalks — 60-Day Coding Challenge',
  description:
    'Pick a track, commit daily, post your proof. ABTalks is the 60-day coding challenge where Indian college students build habits that stick.',
}

export default function LandingPage() {
  return (
    <main className="min-h-[100dvh]">
      <NavBar />
      <HeroSection />
      <HowItWorks />
      <TrackSelector />
      <LandingCTA />
    </main>
  )
}
