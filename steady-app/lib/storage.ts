import {
  SteadyAppState,
  DEFAULT_APP_STATE,
  ChildProfile,
  ParentingApproach,
  HistoryEvent,
  SubscriptionState,
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
