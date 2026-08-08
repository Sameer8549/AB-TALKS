import type { Metadata, Viewport } from 'next'
import './globals.css'

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
  themeColor: '#0C0E14',
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
      suppressHydrationWarning
    >
      <head>
        {/* Google Fonts — loaded at runtime, not at build time (avoids network dependency during CI/CD) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/*
         * Flash-prevention: runs synchronously before first paint.
         * Reads localStorage and applies 'light' class to <html>
         * BEFORE React hydrates — zero theme flash.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('ab-theme');
                  if (t === 'light') document.documentElement.classList.add('light');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
