import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// ─── Font Loading ─────────────────────────────────────────────────────────────
// All fonts loaded via next/font for zero layout shift + self-hosting.

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'ABTalks — 60-Day Coding Challenge',
    template: '%s | ABTalks',
  },
  description:
    'Build in public for 60 days. Pick a track, commit daily, post your proof. ABTalks is where Indian college students forge a coding habit that sticks.',
  keywords: ['coding challenge', 'ABTalks', 'streak', '60-day challenge', 'Indian college students', 'coding habit'],
  authors: [{ name: '404 Foundation Us' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'ABTalks',
    title: 'ABTalks — 60-Day Coding Challenge',
    description: 'Build in public for 60 days. Pick a track, commit daily, post your proof.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABTalks — 60-Day Coding Challenge',
    description: 'Build in public for 60 days. Pick a track, commit daily, post your proof.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C0E14', // --ink: matches the background for status bar on mobile
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body bg-ink text-chalk antialiased">
        {children}
      </body>
    </html>
  )
}
