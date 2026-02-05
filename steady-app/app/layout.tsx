import type { Metadata } from 'next'
import './globals.css'
import { RootLayoutClient } from '@/components/RootLayoutClient'

export const metadata: Metadata = {
  title: 'Steady - Parenting Decision Support',
  description: 'A calm, consistent third adult in your household. Get in-the-moment guidance tailored to your child.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
