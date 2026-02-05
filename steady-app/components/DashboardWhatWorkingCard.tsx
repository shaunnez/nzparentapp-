'use client'

import { useEffect, useState } from 'react'
import { DashboardInsightsSummary } from '@/lib/types'
import { getDashboardInsightsSummary } from '@/lib/insights'
import { APPROACHES } from '@/lib/types'

interface DashboardWhatWorkingCardProps {
  childId?: string | null
}

export default function DashboardWhatWorkingCard({ childId }: DashboardWhatWorkingCardProps) {
  const [summary, setSummary] = useState<DashboardInsightsSummary | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const data = getDashboardInsightsSummary(childId)
    setSummary(data)
    setIsLoaded(true)
  }, [childId])

  if (!isLoaded) {
    return null // Or loading skeleton
  }

  if (!summary || !summary.hasMinimumData) {
    // Empty state - encourage tracking
    return (
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-900 border border-primary-200 dark:border-slate-700 rounded-2xl p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              What's working
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Start tracking outcomes to discover patterns in what works for your child.
          </p>

          <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              How it works
            </p>
            <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
              <li>Use an approach for a situation</li>
              <li>Record if it helped (1 tap)</li>
              <li>See data-driven insights based on your usage</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  // Has data - show top approach
  const topApproach = summary.topApproach
  if (!topApproach) return null

  const approachInfo = APPROACHES.find(a => a.id === topApproach.approachId)
  if (!approachInfo) return null

  const successRate = Math.round(topApproach.successRate * 100)
  const significantPattern = topApproach.patterns.find(p => p.isSignificant)

  return (
    <div className="bg-gradient-to-br from-green-50 to-primary-50 dark:from-green-900/20 dark:to-primary-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            What's working
          </h2>
        </div>

        {/* Top approach */}
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 space-y-3">
          <div>
            <div className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">
              Top approach (last 30 days)
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {approachInfo.name}
            </h3>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 dark:text-slate-400">Used</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {topApproach.totalUses}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 dark:text-slate-400">Helped</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {topApproach.totalSuccesses}
              </span>
            </div>
            {topApproach.ratedCount > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="font-bold text-green-600 dark:text-green-400">
                  {successRate}%
                </span>
              </>
            )}
          </div>

          {/* Pattern or statement */}
          {(significantPattern || topApproach.statement) && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {significantPattern ? significantPattern.statement : topApproach.statement}
              </p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Based on what you've tried · {summary.totalTracked} {summary.totalTracked === 1 ? 'outcome' : 'outcomes'} tracked
        </p>
      </div>
    </div>
  )
}
