import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

// Feature card data
const features = [
  {
    title: 'Memory',
    description: 'Steady remembers your child\'s temperament and what works for them, so guidance is always personalized.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" className="stroke-primary-500" strokeWidth="2" />
        <circle cx="16" cy="12" r="4" className="fill-primary-500" />
        <path d="M8 24c0-4 4-6 8-6s8 2 8 6" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'In-the-moment steps',
    description: 'Get clear, numbered actions for the next 60 seconds when things get tough.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="3" className="stroke-primary-500" strokeWidth="2" />
        <path d="M10 12h12M10 16h8M10 20h10" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Consistency',
    description: 'Use the same approach every time, building predictability for your child.',
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
    title: 'Co-parent friendly',
    description: 'Share the same profile and approach, so everyone responds the same way.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <circle cx="11" cy="10" r="4" className="stroke-primary-500" strokeWidth="2" />
        <circle cx="21" cy="10" r="4" className="stroke-primary-500" strokeWidth="2" />
        <path d="M4 24c0-4 3-6 7-6s7 2 7 6" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 24c0-4 3-6 7-6s7 2 7 6" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
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
                A calm, consistent{' '}
                <span className="gradient-text">third adult</span>{' '}
                in your household.
              </h1>

              {/* Subtext */}
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                In-the-moment guidance that remembers your child and keeps your approach consistent—
                even when you&apos;re exhausted.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/app"
                  className="btn-accent text-base px-8 py-4 w-full sm:w-auto"
                >
                  Try the prototype
                </Link>
                <Link
                  href="/pricing"
                  className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
                >
                  View pricing
                </Link>
              </div>

              {/* Trust badge */}
              <p className="mt-8 text-sm text-slate-500">
                No sign-up required to try. Your data stays on your device.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Parenting support that actually helps
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                When you&apos;re in the thick of it, you don&apos;t need theory—you need the next step.
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
                  title: 'Set up your child\'s profile',
                  description: 'Tell us their age and temperament—this helps personalize the guidance.',
                },
                {
                  step: '2',
                  title: 'Choose your approach',
                  description: 'Pick a parenting style that aligns with your values and stick with it.',
                },
                {
                  step: '3',
                  title: 'Get help in the moment',
                  description: 'When things get tough, tap a situation and get immediate, practical steps.',
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
