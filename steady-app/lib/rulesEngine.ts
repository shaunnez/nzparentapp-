import {
  Situation,
  ContextFactor,
  ParentingApproach,
  Temperament,
  DecisionOutput,
  DEFAULT_RULES_CONFIG,
  RulesEngineConfig,
} from './types'

// The rules engine configuration - can be adjusted
let config: RulesEngineConfig = { ...DEFAULT_RULES_CONFIG }

export function setRulesConfig(newConfig: Partial<RulesEngineConfig>): void {
  config = { ...config, ...newConfig }
}

export function getRulesConfig(): RulesEngineConfig {
  return { ...config }
}

// Helper to check temperament levels
function isHighReactivity(t: Temperament): boolean {
  return t.reactivity >= config.highReactivityThreshold
}

function isHighPersistence(t: Temperament): boolean {
  return t.persistence >= config.highPersistenceThreshold
}

function isHighSensitivity(t: Temperament): boolean {
  return t.sensitivity >= config.highSensitivityThreshold
}

// Base guidance for each situation and approach
interface BaseGuidance {
  doThisNow: string[]
  avoidThis: string[]
  whyThisWorks: string
}

// Connect → Redirect approach guidance
const connectRedirectBase: Record<Situation, BaseGuidance> = {
  tantrum: {
    doThisNow: [
      'Get down to their level, stay calm and quiet.',
      'Offer gentle physical presence—open arms, soft voice: "I\'m here with you."',
      'Wait for the wave to pass, then name what you saw: "That was really big."',
    ],
    avoidThis: [
      'Don\'t try to reason or explain right now.',
      'Avoid saying "calm down" or "stop crying."',
    ],
    whyThisWorks: 'Connection activates the calming system before the thinking brain can engage.',
  },
  refusing: {
    doThisNow: [
      'Acknowledge what they want: "You really want to keep playing."',
      'Connect briefly—a touch, eye contact, understanding nod.',
      'Then redirect with limited choices: "Shoes first, then one more minute outside."',
    ],
    avoidThis: [
      'Don\'t repeat the instruction louder.',
      'Avoid power struggles—this isn\'t about winning.',
    ],
    whyThisWorks: 'Feeling understood makes cooperation easier than resistance.',
  },
  bedtime: {
    doThisNow: [
      'Slow everything down—your voice, your movements.',
      'Connect through the routine: "Let\'s do this together."',
      'Offer one small choice: "This book or that one?"',
    ],
    avoidThis: [
      'Don\'t rush or show frustration.',
      'Avoid screens or stimulating activities.',
    ],
    whyThisWorks: 'A calm, connected transition tells their nervous system it\'s safe to rest.',
  },
  sibling: {
    doThisNow: [
      'Separate briefly if needed, without blame: "Let\'s take a pause."',
      'Connect with each child: "Tell me what happened for you."',
      'Help them solve it together once both feel heard.',
    ],
    avoidThis: [
      'Don\'t ask "who started it."',
      'Avoid taking sides or assigning blame.',
    ],
    whyThisWorks: 'Both children need to feel heard before they can hear each other.',
  },
  transition: {
    doThisNow: [
      'Give a warm warning: "In two minutes we\'ll start getting ready."',
      'Connect to their current activity: "You\'re really enjoying that."',
      'Then transition together: "Let\'s go—you can tell me about it on the way."',
    ],
    avoidThis: [
      'Don\'t spring it on them suddenly.',
      'Avoid making it feel like punishment.',
    ],
    whyThisWorks: 'Transitions are easier when they don\'t feel like losses.',
  },
}

// Emotion Coaching approach guidance
const emotionCoachingBase: Record<Situation, BaseGuidance> = {
  tantrum: {
    doThisNow: [
      'Stay nearby and calm—your calm is contagious.',
      'Name the emotion: "You\'re really frustrated right now."',
      'Set the boundary gently: "It\'s okay to feel angry. It\'s not okay to hit."',
    ],
    avoidThis: [
      'Don\'t dismiss the feeling ("It\'s not a big deal").',
      'Avoid giving in to stop the tantrum.',
    ],
    whyThisWorks: 'Naming emotions helps children understand and eventually regulate them.',
  },
  refusing: {
    doThisNow: [
      'Acknowledge the feeling: "You don\'t want to do this right now."',
      'State the boundary clearly: "And it\'s time to [task]."',
      'Offer support: "I\'ll help you get started."',
    ],
    avoidThis: [
      'Don\'t negotiate the non-negotiable.',
      'Avoid lecturing or explaining too much.',
    ],
    whyThisWorks: 'Clear boundaries with emotional support teach self-regulation.',
  },
  bedtime: {
    doThisNow: [
      'Validate the feeling: "It\'s hard to stop playing, isn\'t it?"',
      'Keep the boundary: "And it\'s bedtime now."',
      'Stay warm but firm through the routine.',
    ],
    avoidThis: [
      'Don\'t add extra steps to delay.',
      'Avoid engaging in negotiations.',
    ],
    whyThisWorks: 'Consistent boundaries create security, even when met with protest.',
  },
  sibling: {
    doThisNow: [
      'Coach each child: "How do you think your brother felt when that happened?"',
      'Help them name their own feelings.',
      'Guide them toward a solution: "What could we do differently?"',
    ],
    avoidThis: [
      'Don\'t solve it for them.',
      'Avoid punishing without teaching.',
    ],
    whyThisWorks: 'Conflict is a chance to practice emotional intelligence.',
  },
  transition: {
    doThisNow: [
      'Acknowledge the hard part: "Leaving is hard when you\'re having fun."',
      'State what\'s happening: "It\'s time to go now."',
      'Stay patient and present while they adjust.',
    ],
    avoidThis: [
      'Don\'t bribe or make promises.',
      'Avoid letting frustration show.',
    ],
    whyThisWorks: 'Learning to handle transitions builds emotional resilience.',
  },
}

// Modifiers based on temperament
function getTemperamentModifiers(temperament: Temperament): string[] {
  const modifiers: string[] = []

  if (isHighReactivity(temperament)) {
    modifiers.push('Allow extra time—reactions may be intense.')
  }

  if (isHighPersistence(temperament)) {
    modifiers.push('Stay consistent—they\'ll test the boundary longer.')
  }

  if (isHighSensitivity(temperament)) {
    modifiers.push('Lower your voice and reduce stimulation.')
  }

  return modifiers
}

// Modifiers based on context
function getContextModifiers(context: ContextFactor[]): string[] {
  const modifiers: string[] = []

  if (context.includes('tired')) {
    modifiers.push('Keep it simple—they have less capacity right now.')
  }

  if (context.includes('hungry')) {
    modifiers.push('Address hunger first if possible.')
  }

  if (context.includes('overstimulated')) {
    modifiers.push('Move to a quieter space if you can.')
  }

  if (context.includes('public')) {
    modifiers.push('Focus on getting through, not teaching—debrief later at home.')
  }

  return modifiers
}

// Main rules engine function
export function generateDecision(
  situation: Situation,
  approach: ParentingApproach,
  temperament: Temperament,
  context: ContextFactor[]
): DecisionOutput {
  // Get base guidance for the approach
  const baseGuidance = approach === 'connect-redirect'
    ? connectRedirectBase[situation]
    : emotionCoachingBase[situation]

  // Get modifiers
  const tempModifiers = getTemperamentModifiers(temperament)
  const contextModifiers = getContextModifiers(context)

  // Combine steps - add most relevant modifier to the steps
  const doThisNow = [...baseGuidance.doThisNow]

  // Add the most relevant modifier as an additional step if there are any
  const allModifiers = [...contextModifiers, ...tempModifiers]
  if (allModifiers.length > 0) {
    // Add top modifier to the list (prioritize context over temperament)
    doThisNow.push(allModifiers[0])
  }

  // Limit to 3-4 steps
  const finalSteps = doThisNow.slice(0, 4)

  // Combine avoid items - add context-specific avoidance if in public
  const avoidThis = [...baseGuidance.avoidThis]
  if (context.includes('public') && !avoidThis.some(a => a.includes('public'))) {
    avoidThis.push('Don\'t worry about what others think right now.')
  }

  // Limit to 2-3 items
  const finalAvoid = avoidThis.slice(0, 3)

  return {
    doThisNow: finalSteps,
    avoidThis: finalAvoid,
    whyThisWorks: baseGuidance.whyThisWorks,
  }
}

// For debugging / testing
export function getBaseGuidance(
  situation: Situation,
  approach: ParentingApproach
): BaseGuidance {
  return approach === 'connect-redirect'
    ? connectRedirectBase[situation]
    : emotionCoachingBase[situation]
}
