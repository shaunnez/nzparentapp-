// Child Profile Types
export interface ChildProfile {
  name: string
  age: number // 2-10
  temperament: Temperament
  lastUpdated: string // ISO timestamp
}

export interface Temperament {
  reactivity: number // 0-10: How quickly/intensely they react to stimuli
  persistence: number // 0-10: How long they persist with demands/tantrums
  sensitivity: number // 0-10: How sensitive to environmental factors
}

// Default temperament values (middle of the road)
export const DEFAULT_TEMPERAMENT: Temperament = {
  reactivity: 5,
  persistence: 5,
  sensitivity: 5,
}

export const DEFAULT_CHILD_PROFILE: ChildProfile = {
  name: '',
  age: 4,
  temperament: DEFAULT_TEMPERAMENT,
  lastUpdated: '',
}

// Parenting Approach Types
export type ParentingApproach = 'connect-redirect' | 'emotion-coaching'

export interface ApproachInfo {
  id: ParentingApproach
  name: string
  shortName: string
  description: string
}

export const APPROACHES: ApproachInfo[] = [
  {
    id: 'connect-redirect',
    name: 'Connection Before Direction',
    shortName: 'Connection first',
    description: 'When kids are upset or resisting, their ability to listen and cooperate drops. Start by helping them feel calm and understood, then guide behaviour once they\u2019re more regulated. Prioritise co-regulation and clear follow-through over quick compliance.',
  },
  {
    id: 'emotion-coaching',
    name: 'Calm Feelings + Clear Limits',
    shortName: 'Feelings + limits',
    description: 'Name and validate the feeling, while keeping the limit steady. Help your child put words to what\u2019s going on without giving in to inappropriate behaviour. Warmth and empathy stay high; boundaries stay clear and consistent.',
  },
]

// Situation Types
export type Situation =
  | 'tantrum'
  | 'refusing'
  | 'bedtime'
  | 'sibling'
  | 'transition'

export interface SituationInfo {
  id: Situation
  label: string
  description: string
}

export const SITUATIONS: SituationInfo[] = [
  { id: 'tantrum', label: 'Tantrum / Meltdown', description: 'Full emotional overwhelm' },
  { id: 'refusing', label: 'Refusing instructions', description: 'Won\'t do what\'s asked' },
  { id: 'bedtime', label: 'Bedtime battle', description: 'Resisting sleep' },
  { id: 'sibling', label: 'Sibling conflict', description: 'Fighting with brother/sister' },
  { id: 'transition', label: 'Transition trouble', description: 'Leaving house, changing activity' },
]

// Context Toggles
export type ContextFactor = 'tired' | 'hungry' | 'overstimulated' | 'public'

export interface ContextInfo {
  id: ContextFactor
  label: string
}

export const CONTEXT_FACTORS: ContextInfo[] = [
  { id: 'tired', label: 'Tired' },
  { id: 'hungry', label: 'Hungry' },
  { id: 'overstimulated', label: 'Overstimulated' },
  { id: 'public', label: 'Public place' },
]

// What Worked Tracking - Context tags for outcome capture
export type OutcomeContext = 'tired' | 'hungry' | 'rushed' | 'public' | 'bedtime' | 'transition'

export interface OutcomeContextInfo {
  id: OutcomeContext
  label: string
}

export const OUTCOME_CONTEXTS: OutcomeContextInfo[] = [
  { id: 'tired', label: 'Tired' },
  { id: 'hungry', label: 'Hungry' },
  { id: 'rushed', label: 'Rushed' },
  { id: 'public', label: 'Public' },
  { id: 'bedtime', label: 'Bedtime' },
  { id: 'transition', label: 'Transition' },
]

// Decision Output Types
export interface DecisionOutput {
  doThisNow: string[] // 1-3 numbered steps
  avoidThis: string[] // 1-2 bullets
  whyThisWorks: string // 1 short sentence
}

// Outcome Types
export type OutcomeRating = 'worked' | 'somewhat' | 'didnt'

// What Worked Tracking - Outcome tracking
export type OutcomeType = 'SUCCESS' | 'NOT_SUCCESS' | 'UNKNOWN'

export interface InteractionOutcome {
  id: string
  userId: string // For future multi-user support; currently uses 'default'
  childId: string | null // For future multi-child support; currently nullable
  approachId: ParentingApproach
  situationId: Situation
  timestamp: string // ISO timestamp
  outcome: OutcomeType
  contexts: OutcomeContext[]
  notes?: string // Optional, max 240 chars
}

// Event History Types
export interface HistoryEvent {
  id: string
  timestamp: string // ISO timestamp
  situation: Situation
  contextFactors: ContextFactor[]
  approach: ParentingApproach
  output: DecisionOutput
  outcome: OutcomeRating
  childAge: number
  temperament: Temperament
  outcomeRecorded?: boolean // Track if outcome was captured via new system
}

// Subscription Types
export interface SubscriptionState {
  isSubscribed: boolean
  plan?: 'monthly' | 'annual'
  email?: string
  subscribedAt?: string
}

// App State for localStorage
export interface SteadyAppState {
  childProfile: ChildProfile | null
  approach: ParentingApproach
  history: HistoryEvent[]
  outcomes: InteractionOutcome[] // What Worked tracking
  subscription: SubscriptionState
  usageCount: number // Free usage counter
}

export const DEFAULT_APP_STATE: SteadyAppState = {
  childProfile: null,
  approach: 'connect-redirect',
  history: [],
  outcomes: [],
  subscription: {
    isSubscribed: false,
  },
  usageCount: 0,
}

// History Summary - derived facts from user history for rules engine
// Used for light personalization without making the engine stateful
export interface HistorySummary {
  lastShownBySituation: Record<Situation, Date | null>
  shownCountLast7DaysBySituation: Record<Situation, number>
  lastOutcomeRatingBySituation: Record<Situation, OutcomeRating | null>
}

// Rules Engine Config - for easy adjustment later
export interface RulesEngineConfig {
  // Temperament thresholds that trigger modified responses
  highReactivityThreshold: number
  highPersistenceThreshold: number
  highSensitivityThreshold: number
  // How much temperament affects the output (0-1, 1 = full effect)
  temperamentWeight: number
}

export const DEFAULT_RULES_CONFIG: RulesEngineConfig = {
  highReactivityThreshold: 7,
  highPersistenceThreshold: 7,
  highSensitivityThreshold: 7,
  temperamentWeight: 0.5, // 50% influence - can be adjusted
}

// What Worked Tracking - Insights Types
export interface ApproachInsights {
  approachId: ParentingApproach
  situationId?: Situation // If undefined, insights are across all situations
  totalUses: number
  totalSuccesses: number
  totalFailures: number
  successRate: number // 0-1, excludes UNKNOWN outcomes
  ratedCount: number // Count of SUCCESS + NOT_SUCCESS (excludes UNKNOWN)
  lastUsed: string | null // ISO timestamp
  patterns: InsightPattern[]
  statement: string | null // Primary statement to display
}

export interface InsightPattern {
  context: OutcomeContext
  successRate: number
  sampleSize: number
  statement: string // e.g., "Works better when tired"
  isSignificant: boolean // Meets thresholds for display
}

export interface DashboardInsightsSummary {
  topApproach: ApproachInsights | null
  totalTracked: number
  hasMinimumData: boolean // At least 3 rated outcomes
}
