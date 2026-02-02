'use client'

import Link from 'next/link'
import Logo from './Logo'

interface HeaderProps {
  variant?: 'landing' | 'app'
}

export default function Header({ variant = 'landing' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            {variant === 'landing' ? (
              <>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                >
                  Pricing
                </Link>
                <Link
                  href="/app"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Try Prototype
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                >
                  Pricing
                </Link>
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                >
                  Home
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
