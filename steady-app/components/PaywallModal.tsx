'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Button from './Button'
import Logo from './Logo'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  usageCount: number
}

export default function PaywallModal({ isOpen, onClose, usageCount }: PaywallModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-soft-lg max-w-md w-full p-6 sm:p-8 animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-4" />

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            You&apos;ve used your free tries
          </h2>

          <p className="text-slate-600 mb-6">
            You&apos;ve used {usageCount} of 3 free guidance sessions. Subscribe to get unlimited access and support Steady&apos;s development.
          </p>

          {/* Benefits */}
          <div className="bg-primary-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-primary-700 mb-2">With Steady Premium:</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                'Unlimited guidance sessions',
                'Full history tracking',
                'Support ongoing development',
                'Cancel anytime',
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Link href="/pricing" className="block">
              <Button variant="accent" fullWidth size="lg">
                View pricing
              </Button>
            </Link>

            <button
              onClick={onClose}
              className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors py-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
