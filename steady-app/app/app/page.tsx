'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChildProfileCard from '@/components/ChildProfileCard'
import ApproachSelector from '@/components/ApproachSelector'
import HelpMeNow from '@/components/HelpMeNow'
import HistoryList from '@/components/HistoryList'
import PaywallModal from '@/components/PaywallModal'
import DashboardWhatWorkingCard from '@/components/DashboardWhatWorkingCard'
import {
  ChildProfile,
  ParentingApproach,
  HistoryEvent,
  DEFAULT_TEMPERAMENT,
} from '@/lib/types'
import {
  getChildProfile,
  getApproach,
  getHistory,
  getUsageCount,
  incrementUsageCount,
  isSubscribed,
  canUseForFree,
} from '@/lib/storage'

export default function AppPage() {
  // State for all the data
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null)
  const [approach, setApproach] = useState<ParentingApproach>('connect-redirect')
  const [history, setHistory] = useState<HistoryEvent[]>([])
  const [usageCount, setUsageCount] = useState(0)
  const [subscribed, setSubscribed] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load all data from localStorage on mount
  useEffect(() => {
    const profile = getChildProfile()
    const storedApproach = getApproach()
    const storedHistory = getHistory()
    const storedUsage = getUsageCount()
    const isUserSubscribed = isSubscribed()

    setChildProfile(profile)
    setApproach(storedApproach)
    setHistory(storedHistory)
    setUsageCount(storedUsage)
    setSubscribed(isUserSubscribed)
    setIsLoaded(true)
  }, [])

  // Handle profile changes
  const handleProfileChange = (profile: ChildProfile) => {
    setChildProfile(profile)
  }

  // Handle approach changes
  const handleApproachChange = (newApproach: ParentingApproach) => {
    setApproach(newApproach)
  }

  // Handle request to use Help Me Now (paywall check)
  const handleRequestHelp = useCallback((): boolean => {
    // If subscribed, always allow
    if (subscribed) return true

    // Check if can use for free
    if (canUseForFree()) {
      const newCount = incrementUsageCount()
      setUsageCount(newCount)
      return true
    }

    // Show paywall
    setShowPaywall(true)
    return false
  }, [subscribed])

  // Handle outcome logged (refresh history)
  const handleOutcomeLogged = () => {
    setHistory(getHistory())
  }

  // Handle history reset
  const handleHistoryReset = () => {
    setHistory([])
  }

  // Show loading state while hydrating
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="app" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Header variant="app" />

      <main className="flex-1 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Usage indicator for free users */}
          {!subscribed && (
            <div className="mb-6 bg-primary-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-primary-700">
                  Free trial: <span className="font-semibold">{Math.max(0, 3 - usageCount)}</span> sessions remaining
                </p>
              </div>
              <a
                href="/pricing"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Upgrade
              </a>
            </div>
          )}

          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left sidebar - Profile and Approach */}
            <div className="lg:col-span-4 space-y-6">
              <ChildProfileCard onProfileChange={handleProfileChange} />
              <ApproachSelector onApproachChange={handleApproachChange} />
            </div>

            {/* Main content - What's Working, Help Me Now and History */}
            <div className="lg:col-span-8 space-y-6">
              {/* What's Working Dashboard Card */}
              <DashboardWhatWorkingCard childId={childProfile?.name || null} />

              <HelpMeNow
                approach={approach}
                temperament={childProfile?.temperament || DEFAULT_TEMPERAMENT}
                childAge={childProfile?.age || 4}
                onRequestHelp={handleRequestHelp}
                onOutcomeLogged={handleOutcomeLogged}
              />

              <HistoryList events={history} onReset={handleHistoryReset} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        usageCount={usageCount}
      />
    </div>
  )
}
