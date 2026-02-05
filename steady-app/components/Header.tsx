'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useDarkMode } from './DarkModeProvider'

interface HeaderProps {
  variant?: 'landing' | 'app'
}

export default function Header({ variant = 'landing' }: HeaderProps) {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
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
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-3 py-2"
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
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-3 py-2"
                >
                  Pricing
                </Link>
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-3 py-2"
                >
                  Home
                </Link>
              </>
            )}

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 focus:ring-primary-500"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.829a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 100 6 3 3 0 000-6zm-4.22-1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L5.78 5.22a1 1 0 010-1.414zm2.828 9.657a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.829a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM2.458 12.784a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM2 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm1.22-4.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L3.22 5.78a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
