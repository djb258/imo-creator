import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'IMO Creator - World-Class Web Design System',
    template: '%s | IMO Creator'
  },
  description: 'A unified repository compliance and orchestration system with Factory/Mechanic architecture featuring world-class UI components and visualizations.',
  keywords: [
    'web design',
    'react',
    'nextjs',
    'tailwindcss',
    'typescript',
    'ui components',
    'visualization',
    'dashboard',
    'factory',
    'garage',
    'heir',
    'orbt'
  ],
  authors: [{ name: 'IMO Creator Team' }],
  creator: 'IMO Creator',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://imo-creator.vercel.app',
    title: 'IMO Creator - World-Class Web Design System',
    description: 'Factory + Garage visualization system with Christmas tree flow diagrams',
    siteName: 'IMO Creator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMO Creator - World-Class Web Design System',
    description: 'Factory + Garage visualization system with Christmas tree flow diagrams',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}