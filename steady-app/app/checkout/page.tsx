'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Logo from '@/components/Logo'
import { setSubscribed } from '@/lib/storage'

const planDetails = {
  monthly: {
    name: 'Monthly',
    price: 15,
    period: 'month',
  },
  annual: {
    name: 'Annual',
    price: 120,
    period: 'year',
  },
}

function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const planId = searchParams.get('plan') as 'monthly' | 'annual' | null
  const plan = planId ? planDetails[planId] : null

  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Redirect if no valid plan
  useEffect(() => {
    if (!plan) {
      router.push('/pricing')
    }
  }, [plan, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsProcessing(true)

    // Simulate checkout processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Set subscribed in localStorage
    setSubscribed(planId as 'monthly' | 'annual', email)

    // Redirect to app
    router.push('/app')
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Plan summary card */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-900">{plan.name} Plan</h2>
            <p className="text-sm text-slate-500">Billed {plan.period}ly</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">${plan.price}</p>
            <p className="text-sm text-slate-500">NZD/{plan.period}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Today&apos;s charge</span>
            <span className="font-semibold text-slate-900">$0.00 NZD</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            7-day free trial. Cancel anytime before it ends.
          </p>
        </div>
      </div>

      {/* Checkout form */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Start your free trial</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              disabled={isProcessing}
            />
            {error && <p className="text-sm text-caution-600 mt-1">{error}</p>}
          </div>

          <Button
            type="submit"
            variant="accent"
            fullWidth
            size="lg"
            loading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Start free trial'}
          </Button>
        </form>

        {/* Trust indicators */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure checkout (demo)</span>
          </div>
          <p className="text-xs text-slate-400">
            This is a prototype. No real payment will be processed.
          </p>
        </div>
      </div>

      {/* Back link */}
      <div className="text-center mt-6">
        <a
          href="/pricing"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Back to pricing
        </a>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Header variant="landing" />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Complete your subscription
            </h1>
          </div>

          {/* Checkout form wrapped in Suspense for useSearchParams */}
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-slate-500">Loading checkout...</p>
            </div>
          }>
            <CheckoutForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
