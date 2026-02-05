import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

// Feature card data
const features = [
  {
    title: 'Instant',
    description: 'Guidance appears immediately — no waiting, no loading, works even with bad reception.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M16 4v24M8 12l8-8 8 8" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="3" className="fill-primary-500" />
      </svg>
    ),
  },
  {
    title: 'Expert-curated',
    description: 'Steps are written and reviewed by parenting professionals — not generated on the fly.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="3" className="stroke-primary-500" strokeWidth="2" />
        <path d="M10 12h12M10 16h8M10 20h10" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'What worked (for your child)',
    description: 'After each moment, tap what happened. Steady tracks your wins and misses and shows patterns — based on your usage, stored on your device.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M6 16h20" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="16" r="3" className="fill-primary-300 stroke-primary-500" strokeWidth="2" />
        <circle cx="16" cy="16" r="3" className="fill-primary-300 stroke-primary-500" strokeWidth="2" />
        <circle cx="24" cy="16" r="3" className="fill-primary-300 stroke-primary-500" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Private',
    description: 'Everything stays on your device. No accounts. No data sent anywhere.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect x="8" y="14" width="16" height="12" rx="2" className="stroke-primary-500" strokeWidth="2" />
        <path d="M12 14V10c0-2.2 1.8-4 4-4s4 1.8 4 4v4" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="20" r="2" className="fill-primary-500" />
      </svg>
    ),
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="landing" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-16 sm:py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Hero headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Expert parenting advice{' '}
                <span className="gradient-text">in 3 seconds.</span>
              </h1>

              {/* Subtext */}
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Instant, expert-curated steps for the next 60 seconds — even offline.
                Then Steady remembers what worked for your child, so the guidance gets more consistent over time.
              </p>

              {/* Qualifier */}
              <p className="mt-4 text-base text-slate-500">
                Private by default: your child profile and history stay on your device.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/app"
                  className="btn-accent text-base px-8 py-4 w-full sm:w-auto"
                >
                  Help me now
                </Link>
                <Link
                  href="/pricing"
                  className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
                >
                  See pricing
                </Link>
              </div>

              {/* Trust badge */}
              <p className="mt-8 text-sm text-slate-500">
                No sign-up. Works offline. Your data stays on your device.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                When you&apos;re stressed, decision-making is the problem.
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                When emotions are high, even good parents escalate.
                Steady removes the guesswork by telling you exactly what to do next — before things get worse.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="card hover:translate-y-[-4px] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-24 bg-surface-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                How Steady works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Pick what\'s happening',
                  description: 'Tell us their age and temperament, then choose the situation you\'re facing.',
                },
                {
                  step: '2',
                  title: 'Follow "Do this now" / "Avoid this"',
                  description: 'Get immediate, expert-curated steps for the next 60 seconds.',
                },
                {
                  step: '3',
                  title: 'Tap how it went',
                  description: 'Mark what worked, what didn\'t. Steady builds your "what worked" history — stored on your device.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/app"
                className="btn-primary text-base px-8 py-4"
              >
                Start now — it&apos;s free to try
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
