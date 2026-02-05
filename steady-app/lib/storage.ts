import {
  SteadyAppState,
  DEFAULT_APP_STATE,
  ChildProfile,
  ParentingApproach,
  HistoryEvent,
  SubscriptionState,
  HistorySummary,
  Situation,
  OutcomeRating,
  InteractionOutcome,
  OutcomeType,
  OutcomeContext,
} from './types'

const STORAGE_KEY = 'steady-app-state'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Get the full app state
export function getAppState(): SteadyAppState {
  if (!isBrowser) return DEFAULT_APP_STATE

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_APP_STATE

    const parsed = JSON.parse(stored) as Partial<SteadyAppState>

    // Merge with defaults to handle missing fields from older versions
    return {
      ...DEFAULT_APP_STATE,
      ...parsed,
      subscription: {
        ...DEFAULT_APP_STATE.subscription,
        ...parsed.subscription,
      },
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return DEFAULT_APP_STATE
  }
}

// Save the full app state
export function saveAppState(state: SteadyAppState): void {
  if (!isBrowser) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Child Profile helpers
export function getChildProfile(): ChildProfile | null {
  return getAppState().childProfile
}

export function saveChildProfile(profile: ChildProfile): void {
  const state = getAppState()
  state.childProfile = {
    ...profile,
    lastUpdated: new Date().toISOString(),
  }
  saveAppState(state)
}

// Approach helpers
export function getApproach(): ParentingApproach {
  return getAppState().approach
}

export function saveApproach(approach: ParentingApproach): void {
  const state = getAppState()
  state.approach = approach
  saveAppState(state)
}

// History helpers
export function getHistory(): HistoryEvent[] {
  return getAppState().history
}

export function addHistoryEvent(event: HistoryEvent): void {
  const state = getAppState()
  // Add to beginning, keep only last 50 events
  state.history = [event, ...state.history].slice(0, 50)
  saveAppState(state)
}

export function getRecentHistory(limit: number = 10): HistoryEvent[] {
  return getHistory().slice(0, limit)
}

// Subscription helpers
export function getSubscription(): SubscriptionState {
  return getAppState().subscription
}

export function setSubscribed(plan: 'monthly' | 'annual', email: string): void {
  const state = getAppState()
  state.subscription = {
    isSubscribed: true,
    plan,
    email,
    subscribedAt: new Date().toISOString(),
  }
  saveAppState(state)
}

export function isSubscribed(): boolean {
  return getAppState().subscription.isSubscribed
}

// Usage counter helpers
export function getUsageCount(): number {
  return getAppState().usageCount
}

export function incrementUsageCount(): number {
  const state = getAppState()
  state.usageCount += 1
  saveAppState(state)
  return state.usageCount
}

export function canUseForFree(): boolean {
  const state = getAppState()
  return state.subscription.isSubscribed || state.usageCount < 3
}

// Reset helpers
export function resetHistory(): void {
  const state = getAppState()
  state.history = []
  saveAppState(state)
}

export function resetAllData(): void {
  if (!isBrowser) return
  localStorage.removeItem(STORAGE_KEY)
}

// Generate unique ID for events
export function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Format timestamp for display
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
  })
}

// History summary - derives facts from history for the rules engine
// Pure function: reads history, returns aggregated data, no side effects
const ALL_SITUATIONS: Situation[] = ['tantrum', 'refusing', 'bedtime', 'sibling', 'transition']

export function getHistorySummary(): HistorySummary {
  const history = getHistory()
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Initialize empty records for all situations
  const lastShownBySituation: Record<Situation, Date | null> = {
    tantrum: null, refusing: null, bedtime: null, sibling: null, transition: null,
  }
  const shownCountLast7DaysBySituation: Record<Situation, number> = {
    tantrum: 0, refusing: 0, bedtime: 0, sibling: 0, transition: 0,
  }
  const lastOutcomeRatingBySituation: Record<Situation, OutcomeRating | null> = {
    tantrum: null, refusing: null, bedtime: null, sibling: null, transition: null,
  }

  // Single pass through history to compute all aggregations
  for (const event of history) {
    const situation = event.situation
    const eventDate = new Date(event.timestamp)

    // Track most recent occurrence per situation
    if (!lastShownBySituation[situation] || eventDate > lastShownBySituation[situation]) {
      lastShownBySituation[situation] = eventDate
      // Also track the outcome of the most recent occurrence
      lastOutcomeRatingBySituation[situation] = event.outcome
    }

    // Count occurrences in last 7 days
    if (eventDate >= sevenDaysAgo) {
      shownCountLast7DaysBySituation[situation]++
    }
  }

  return {
    lastShownBySituation,
    shownCountLast7DaysBySituation,
    lastOutcomeRatingBySituation,
  }
}

// ============================================================================
// What Worked Tracking - Outcome helpers
// ============================================================================

// Get all outcomes
export function getOutcomes(): InteractionOutcome[] {
  return getAppState().outcomes
}

// Add a new outcome
export function addOutcome(outcome: InteractionOutcome): void {
  const state = getAppState()
  // Add to beginning, keep only last 200 outcomes
  state.outcomes = [outcome, ...state.outcomes].slice(0, 200)
  saveAppState(state)
}

// Generate unique ID for outcomes
export function generateOutcomeId(): string {
  return `outcome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get outcomes filtered by criteria
export interface OutcomeFilters {
  childId?: string | null
  approachId?: ParentingApproach
  situationId?: Situation
  rangeDays?: number // Get outcomes from last N days
}

export function getFilteredOutcomes(filters: OutcomeFilters = {}): InteractionOutcome[] {
  let outcomes = getOutcomes()

  // Filter by childId (for future multi-child support)
  if (filters.childId !== undefined) {
    outcomes = outcomes.filter(o => o.childId === filters.childId)
  }

  // Filter by approach
  if (filters.approachId) {
    outcomes = outcomes.filter(o => o.approachId === filters.approachId)
  }

  // Filter by situation
  if (filters.situationId) {
    outcomes = outcomes.filter(o => o.situationId === filters.situationId)
  }

  // Filter by date range
  if (filters.rangeDays) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - filters.rangeDays)
    outcomes = outcomes.filter(o => new Date(o.timestamp) >= cutoffDate)
  }

  return outcomes
}

// Update an existing outcome (e.g., to add notes)
export function updateOutcome(outcomeId: string, updates: Partial<InteractionOutcome>): boolean {
  const state = getAppState()
  const index = state.outcomes.findIndex(o => o.id === outcomeId)

  if (index === -1) return false

  state.outcomes[index] = {
    ...state.outcomes[index],
    ...updates,
    id: state.outcomes[index].id, // Preserve ID
    timestamp: state.outcomes[index].timestamp, // Preserve timestamp
  }
  saveAppState(state)
  return true
}

// Delete an outcome
export function deleteOutcome(outcomeId: string): boolean {
  const state = getAppState()
  const initialLength = state.outcomes.length
  state.outcomes = state.outcomes.filter(o => o.id !== outcomeId)

  if (state.outcomes.length < initialLength) {
    saveAppState(state)
    return true
  }
  return false
}
