'use client'

import { useEffect, useState } from 'react'
import { ParentingApproach, Situation, ApproachInsights } from '@/lib/types'
import { computeApproachInsights, formatTimeSinceUse } from '@/lib/insights'

interface ApproachResultsPanelProps {
  approachId: ParentingApproach
  situationId?: Situation
  childId?: string | null
}

export default function ApproachResultsPanel({
  approachId,
  situationId,
  childId,
}: ApproachResultsPanelProps) {
  const [insights, setInsights] = useState<ApproachInsights | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const data = computeApproachInsights(approachId, situationId, childId)
    setInsights(data)
    setIsLoaded(true)
  }, [approachId, situationId, childId])

  if (!isLoaded) {
    return null // Or loading skeleton
  }

  if (!insights || insights.ratedCount === 0) {
    // Empty state
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <div className="text-center space-y-2">
          <div className="text-slate-400 dark:text-slate-500 text-2xl">📊</div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Track what works
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            After trying this approach, record whether it helped. You'll see patterns based on your usage.
          </p>
        </div>
      </div>
    )
  }

  // Calculate percentage for display
  const successPercentage = insights.ratedCount > 0
    ? Math.round((insights.successRate * 100))
    : 0

  // Get the most significant pattern
  const significantPattern = insights.patterns.find(p => p.isSignificant)

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
            Your Results
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Based on what you've tried
          </p>
        </div>
        {insights.lastUsed && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Last used: {formatTimeSinceUse(insights.lastUsed)}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {insights.totalUses}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {insights.totalUses === 1 ? 'use' : 'uses'}
          </span>
        </div>

        {insights.ratedCount > 0 && (
          <>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {successPercentage}%
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                helped
              </span>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              ({insights.totalSuccesses} of {insights.ratedCount})
            </div>
          </>
        )}
      </div>

      {/* Pattern statement */}
      {insights.statement && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {insights.statement}
          </p>
        </div>
      )}

      {/* Significant pattern callout */}
      {significantPattern && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                {significantPattern.statement}
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                {Math.round(significantPattern.successRate * 100)}% success rate
                ({significantPattern.sampleSize} {significantPattern.sampleSize === 1 ? 'time' : 'times'})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
