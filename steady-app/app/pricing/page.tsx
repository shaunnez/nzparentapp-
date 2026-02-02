import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 15,
    period: 'month',
    description: 'Perfect for trying Steady out',
    features: [
      'Unlimited guidance sessions',
      'Full child profile customization',
      'Complete history tracking',
      'Both parenting approaches',
      'Cancel anytime',
    ],
    cta: 'Start free trial',
    popular: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 120,
    period: 'year',
    description: 'Best value — save $60',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Priority support',
      'Early access to new features',
      'Lock in current price',
    ],
    cta: 'Start free trial',
    popular: true,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="landing" />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start with a free trial. No credit card required. Cancel anytime.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative bg-white rounded-2xl shadow-soft p-6 sm:p-8
                  ${plan.popular ? 'ring-2 ring-primary-500' : 'border border-slate-200'}
                `}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Best value
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h2>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-500">NZD/{plan.period}</span>
                  </div>
                  {plan.id === 'annual' && (
                    <p className="text-sm text-primary-600 mt-1">That&apos;s just $10/month</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/checkout?plan=${plan.id}`}
                  className={`
                    block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200
                    ${plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }
                  `}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ / Additional info */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Questions?
            </h3>
            <div className="max-w-2xl mx-auto space-y-4 text-sm text-slate-600">
              <p>
                <strong className="text-slate-800">How does the free trial work?</strong>{' '}
                You get 3 free guidance sessions to try Steady. No payment info required.
              </p>
              <p>
                <strong className="text-slate-800">Can I cancel anytime?</strong>{' '}
                Yes! Cancel with one click. No questions asked.
              </p>
              <p>
                <strong className="text-slate-800">Is my data safe?</strong>{' '}
                Your child&apos;s profile stays on your device. We don&apos;t store personal information on our servers.
              </p>
            </div>
          </div>

          {/* Back to app link */}
          <div className="mt-12 text-center">
            <Link
              href="/app"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Back to the app
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
