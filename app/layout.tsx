import type { Metadata } from 'next'
import './globals.css'
import { Manrope, Space_Grotesk } from 'next/font/google'
import { siteSettings } from '@/lib/site-data'

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(siteSettings.canonicalUrl),
  title: {
    default: `${siteSettings.title} | Live Gaming Issues & Community Fixes`,
    template: `%s | ${siteSettings.title}`,
  },
  description: siteSettings.description,
  keywords: siteSettings.keywords,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteSettings.title,
    description: siteSettings.description,
    url: siteSettings.canonicalUrl,
    siteName: siteSettings.title,
    images: [siteSettings.ogImage],
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
