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
    name: 'Connect → Redirect',
    shortName: 'Connect first',
    description: 'Start by connecting with your child emotionally (right brain), then redirect behavior once they feel heard (left brain). Focus on co-regulation before problem-solving.',
  },
  {
    id: 'emotion-coaching',
    name: 'Emotion Coaching + Boundaries',
    shortName: 'Coach emotions',
    description: 'Name and validate emotions while maintaining clear, consistent boundaries. Help your child understand their feelings without giving in to inappropriate behavior.',
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

// Decision Output Types
export interface DecisionOutput {
  doThisNow: string[] // 1-3 numbered steps
  avoidThis: string[] // 1-2 bullets
  whyThisWorks: string // 1 short sentence
}

// Outcome Types
export type OutcomeRating = 'worked' | 'somewhat' | 'didnt'

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
  subscription: SubscriptionState
  usageCount: number // Free usage counter
}

export const DEFAULT_APP_STATE: SteadyAppState = {
  childProfile: null,
  approach: 'connect-redirect',
  history: [],
  subscription: {
    isSubscribed: false,
  },
  usageCount: 0,
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
