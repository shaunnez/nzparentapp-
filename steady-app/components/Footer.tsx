'use client'

import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <Logo size="sm" />
            <p className="text-sm text-slate-500 max-w-md">
              Helping parents find calm, consistent approaches in challenging moments.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/app" className="text-slate-600 hover:text-slate-900 transition-colors">
              App
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-500">Important:</strong> Steady is not medical advice or a substitute for professional care.
            The guidance provided is for general parenting support only. If you&apos;re worried about your child&apos;s safety or wellbeing,
            or if you&apos;re experiencing thoughts of harming yourself or others, please contact local emergency services or
            a mental health professional immediately.
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Steady. Prototype version.
          </p>
        </div>
      </div>
    </footer>
  )
}
