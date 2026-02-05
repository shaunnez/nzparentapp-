import {
  InteractionOutcome,
  ParentingApproach,
  Situation,
  OutcomeContext,
  ApproachInsights,
  InsightPattern,
  DashboardInsightsSummary,
  OUTCOME_CONTEXTS,
} from './types'
import { getFilteredOutcomes, OutcomeFilters } from './storage'

// Configuration for insight thresholds
const INSIGHT_CONFIG = {
  MIN_SAMPLE_SIZE_FOR_PATTERN: 5, // Minimum samples to show context pattern
  MIN_DIFFERENCE_FOR_PATTERN: 0.20, // 20 percentage points difference
  MIN_RATED_FOR_STATEMENT: 10, // Minimum rated outcomes to show general statement
  MIN_RATED_FOR_DASHBOARD: 3, // Minimum to show on dashboard
}

/**
 * Compute insights for a specific approach and optionally a situation
 * Pure function - no side effects
 */
export function computeApproachInsights(
  approachId: ParentingApproach,
  situationId?: Situation,
  childId?: string | null
): ApproachInsights {
  // Get filtered outcomes
  const filters: OutcomeFilters = {
    approachId,
    childId,
  }
  if (situationId) {
    filters.situationId = situationId
  }

  const outcomes = getFilteredOutcomes(filters)

  // Basic counts
  const totalUses = outcomes.length
  const successOutcomes = outcomes.filter(o => o.outcome === 'SUCCESS')
  const failureOutcomes = outcomes.filter(o => o.outcome === 'NOT_SUCCESS')
  const ratedOutcomes = [...successOutcomes, ...failureOutcomes]

  const totalSuccesses = successOutcomes.length
  const totalFailures = failureOutcomes.length
  const ratedCount = ratedOutcomes.length

  // Success rate (0-1, excludes UNKNOWN)
  const successRate = ratedCount > 0 ? totalSuccesses / ratedCount : 0

  // Last used timestamp
  const lastUsed = outcomes.length > 0 ? outcomes[0].timestamp : null

  // Compute patterns by context
  const patterns = computeContextPatterns(outcomes, successRate)

  // Generate primary statement
  const statement = generatePrimaryStatement(
    totalSuccesses,
    totalFailures,
    ratedCount,
    patterns
  )

  return {
    approachId,
    situationId,
    totalUses,
    totalSuccesses,
    totalFailures,
    successRate,
    ratedCount,
    lastUsed,
    patterns,
    statement,
  }
}

/**
 * Compute patterns for each context tag
 * Pure function
 */
function computeContextPatterns(
  outcomes: InteractionOutcome[],
  baselineSuccessRate: number
): InsightPattern[] {
  const patterns: InsightPattern[] = []

  // Analyze each context type
  for (const contextInfo of OUTCOME_CONTEXTS) {
    const context = contextInfo.id

    // Get outcomes that have this context tag
    const outcomesWithContext = outcomes.filter(o => o.contexts.includes(context))
    const successesWithContext = outcomesWithContext.filter(o => o.outcome === 'SUCCESS')
    const failuresWithContext = outcomesWithContext.filter(o => o.outcome === 'NOT_SUCCESS')
    const ratedWithContext = successesWithContext.length + failuresWithContext.length

    // Skip if not enough data
    if (ratedWithContext < INSIGHT_CONFIG.MIN_SAMPLE_SIZE_FOR_PATTERN) {
      continue
    }

    // Calculate success rate for this context
    const contextSuccessRate = ratedWithContext > 0
      ? successesWithContext.length / ratedWithContext
      : 0

    // Check if difference is significant
    const difference = Math.abs(contextSuccessRate - baselineSuccessRate)
    const isSignificant = difference >= INSIGHT_CONFIG.MIN_DIFFERENCE_FOR_PATTERN

    // Generate statement
    let statement = ''
    if (contextSuccessRate > baselineSuccessRate) {
      statement = `Works better when ${contextInfo.label.toLowerCase()}`
    } else if (contextSuccessRate < baselineSuccessRate) {
      statement = `Less effective when ${contextInfo.label.toLowerCase()}`
    }

    patterns.push({
      context,
      successRate: contextSuccessRate,
      sampleSize: ratedWithContext,
      statement,
      isSignificant,
    })
  }

  // Sort by significance and difference from baseline
  patterns.sort((a, b) => {
    if (a.isSignificant && !b.isSignificant) return -1
    if (!a.isSignificant && b.isSignificant) return 1
    const diffA = Math.abs(a.successRate - baselineSuccessRate)
    const diffB = Math.abs(b.successRate - baselineSuccessRate)
    return diffB - diffA
  })

  return patterns
}

/**
 * Generate primary statement to display
 * Returns null if not enough data
 */
function generatePrimaryStatement(
  totalSuccesses: number,
  totalFailures: number,
  ratedCount: number,
  patterns: InsightPattern[]
): string | null {
  // If we have a significant pattern, use it
  const significantPattern = patterns.find(p => p.isSignificant)
  if (significantPattern) {
    return significantPattern.statement
  }

  // Otherwise, show general success count if we have enough data
  if (ratedCount >= INSIGHT_CONFIG.MIN_RATED_FOR_STATEMENT) {
    return `Helped ${totalSuccesses} of ${ratedCount} times`
  }

  return null
}

/**
 * Get insights for dashboard summary
 * Shows the top-performing approach based on last 30 days
 */
export function getDashboardInsightsSummary(
  childId?: string | null
): DashboardInsightsSummary {
  // Get all outcomes from last 30 days
  const outcomes = getFilteredOutcomes({ rangeDays: 30, childId })

  // Count total tracked (rated outcomes only)
  const totalTracked = outcomes.filter(
    o => o.outcome === 'SUCCESS' || o.outcome === 'NOT_SUCCESS'
  ).length

  const hasMinimumData = totalTracked >= INSIGHT_CONFIG.MIN_RATED_FOR_DASHBOARD

  if (!hasMinimumData) {
    return {
      topApproach: null,
      totalTracked,
      hasMinimumData: false,
    }
  }

  // Compute insights for each approach
  const connectRedirectInsights = computeApproachInsights('connect-redirect', undefined, childId)
  const emotionCoachingInsights = computeApproachInsights('emotion-coaching', undefined, childId)

  // Filter to last 30 days for ranking
  const connectRedirect30Days = computeApproachInsightsForRange('connect-redirect', 30, childId)
  const emotionCoaching30Days = computeApproachInsightsForRange('emotion-coaching', 30, childId)

  // Determine top approach based on successes in last 30 days
  let topApproach: ApproachInsights

  if (connectRedirect30Days.totalSuccesses > emotionCoaching30Days.totalSuccesses) {
    topApproach = connectRedirect30Days
  } else if (emotionCoaching30Days.totalSuccesses > connectRedirect30Days.totalSuccesses) {
    topApproach = emotionCoaching30Days
  } else if (connectRedirect30Days.ratedCount > emotionCoaching30Days.ratedCount) {
    // Tie-breaker: most used
    topApproach = connectRedirect30Days
  } else {
    topApproach = emotionCoaching30Days
  }

  return {
    topApproach,
    totalTracked,
    hasMinimumData: true,
  }
}

/**
 * Helper: Compute insights for a specific time range
 */
function computeApproachInsightsForRange(
  approachId: ParentingApproach,
  rangeDays: number,
  childId?: string | null
): ApproachInsights {
  const outcomes = getFilteredOutcomes({ approachId, rangeDays, childId })

  const successOutcomes = outcomes.filter(o => o.outcome === 'SUCCESS')
  const failureOutcomes = outcomes.filter(o => o.outcome === 'NOT_SUCCESS')
  const ratedCount = successOutcomes.length + failureOutcomes.length

  const totalSuccesses = successOutcomes.length
  const totalFailures = failureOutcomes.length
  const successRate = ratedCount > 0 ? totalSuccesses / ratedCount : 0

  const lastUsed = outcomes.length > 0 ? outcomes[0].timestamp : null

  const patterns = computeContextPatterns(outcomes, successRate)
  const statement = generatePrimaryStatement(totalSuccesses, totalFailures, ratedCount, patterns)

  return {
    approachId,
    totalUses: outcomes.length,
    totalSuccesses,
    totalFailures,
    successRate,
    ratedCount,
    lastUsed,
    patterns,
    statement,
  }
}

/**
 * Get insights for a specific situation across all approaches
 */
export function getSituationInsights(
  situationId: Situation,
  childId?: string | null
): {
  connectRedirect: ApproachInsights
  emotionCoaching: ApproachInsights
} {
  return {
    connectRedirect: computeApproachInsights('connect-redirect', situationId, childId),
    emotionCoaching: computeApproachInsights('emotion-coaching', situationId, childId),
  }
}

/**
 * Format time since last use for display
 */
export function formatTimeSinceUse(isoTimestamp: string | null): string {
  if (!isoTimestamp) return 'Never used'

  const date = new Date(isoTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  const months = Math.floor(diffDays / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}
