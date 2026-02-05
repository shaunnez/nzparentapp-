'use client'

import { useState } from 'react'
import {
  OutcomeType,
  OutcomeContext,
  OUTCOME_CONTEXTS,
  ParentingApproach,
  Situation,
} from '@/lib/types'
import {
  generateOutcomeId,
  addOutcome,
  getChildProfile,
} from '@/lib/storage'
import Button from './Button'

interface OutcomePromptProps {
  approachId: ParentingApproach
  situationId: Situation
  onComplete?: () => void
  onSkip?: () => void
}

export default function OutcomePrompt({
  approachId,
  situationId,
  onComplete,
  onSkip,
}: OutcomePromptProps) {
  const [step, setStep] = useState<'outcome' | 'context' | 'complete'>('outcome')
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null)
  const [selectedContexts, setSelectedContexts] = useState<OutcomeContext[]>([])

  const handleOutcomeSelect = (outcome: OutcomeType) => {
    setSelectedOutcome(outcome)
    if (outcome === 'UNKNOWN') {
      // Skip directly to save if they skip
      handleSave(outcome, [])
    } else {
      // Move to context selection
      setStep('context')
    }
  }

  const handleContextToggle = (context: OutcomeContext) => {
    setSelectedContexts(prev =>
      prev.includes(context)
        ? prev.filter(c => c !== context)
        : [...prev, context]
    )
  }

  const handleSave = (outcome: OutcomeType, contexts: OutcomeContext[]) => {
    const childProfile = getChildProfile()

    const newOutcome = {
      id: generateOutcomeId(),
      userId: 'default', // For future multi-user support
      childId: childProfile?.name || null,
      approachId,
      situationId,
      timestamp: new Date().toISOString(),
      outcome,
      contexts,
    }

    addOutcome(newOutcome)
    setStep('complete')

    // Call onComplete after a brief delay to show success state
    setTimeout(() => {
      onComplete?.()
    }, 800)
  }

  const handleSkip = () => {
    handleSave('UNKNOWN', [])
    onSkip?.()
  }

  if (step === 'complete') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
        <div className="text-green-600 dark:text-green-400 text-2xl mb-2">✓</div>
        <p className="text-green-800 dark:text-green-200 font-medium">
          Thanks for tracking what worked
        </p>
      </div>
    )
  }

  if (step === 'context') {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Anything that was true just now?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Optional — helps spot patterns (select up to 3)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {OUTCOME_CONTEXTS.map(context => {
            const isSelected = selectedContexts.includes(context.id)
            const isDisabled = !isSelected && selectedContexts.length >= 3

            return (
              <button
                key={context.id}
                onClick={() => handleContextToggle(context.id)}
                disabled={isDisabled}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isSelected
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                  }
                `}
              >
                {context.label}
              </button>
            )
          })}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleSave(selectedOutcome!, selectedContexts)}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleSave(selectedOutcome!, [])}
          >
            Skip
          </Button>
        </div>
      </div>
    )
  }

  // Step: outcome selection
  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-900 border border-primary-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">
        Did this help?
      </h3>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleOutcomeSelect('SUCCESS')}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-95"
        >
          <span className="text-3xl">👍</span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">Yes</span>
        </button>

        <button
          onClick={() => handleOutcomeSelect('NOT_SUCCESS')}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 active:scale-95"
        >
          <span className="text-3xl">👎</span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">Not really</span>
        </button>

        <button
          onClick={() => handleSkip()}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 active:scale-95"
        >
          <span className="text-3xl">⏭️</span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">Skip</span>
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
        Based on what you've tried
      </p>
    </div>
  )
}
