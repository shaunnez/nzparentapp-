'use client'

import { useState } from 'react'
import Card from './Card'
import Button from './Button'
import {
  Situation,
  ContextFactor,
  ParentingApproach,
  Temperament,
  DecisionOutput,
  OutcomeRating,
  HistoryEvent,
  SITUATIONS,
  CONTEXT_FACTORS,
  DEFAULT_TEMPERAMENT,
} from '@/lib/types'
import { generateDecision } from '@/lib/rulesEngine'
import { addHistoryEvent, generateEventId } from '@/lib/storage'

interface HelpMeNowProps {
  approach: ParentingApproach
  temperament: Temperament
  childAge: number
  onRequestHelp: () => boolean // Returns false if paywall should show
  onOutcomeLogged?: () => void
}

export default function HelpMeNow({
  approach,
  temperament,
  childAge,
  onRequestHelp,
  onOutcomeLogged,
}: HelpMeNowProps) {
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null)
  const [activeContexts, setActiveContexts] = useState<ContextFactor[]>([])
  const [output, setOutput] = useState<DecisionOutput | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [outcomeLogged, setOutcomeLogged] = useState(false)

  const toggleContext = (context: ContextFactor) => {
    setActiveContexts((prev) =>
      prev.includes(context)
        ? prev.filter((c) => c !== context)
        : [...prev, context]
    )
  }

  const handleGenerate = () => {
    if (!selectedSituation) return

    // Check if user can use (paywall check)
    const canUse = onRequestHelp()
    if (!canUse) return

    setIsGenerating(true)
    setOutcomeLogged(false)

    // Small delay for visual feedback
    setTimeout(() => {
      const result = generateDecision(
        selectedSituation,
        approach,
        temperament || DEFAULT_TEMPERAMENT,
        activeContexts
      )
      setOutput(result)
      setIsGenerating(false)
    }, 300)
  }

  const handleOutcome = (outcome: OutcomeRating) => {
    if (!output || !selectedSituation || outcomeLogged) return

    const event: HistoryEvent = {
      id: generateEventId(),
      timestamp: new Date().toISOString(),
      situation: selectedSituation,
      contextFactors: activeContexts,
      approach,
      output,
      outcome,
      childAge,
      temperament: temperament || DEFAULT_TEMPERAMENT,
    }

    addHistoryEvent(event)
    setOutcomeLogged(true)
    onOutcomeLogged?.()
  }

  const handleReset = () => {
    setSelectedSituation(null)
    setActiveContexts([])
    setOutput(null)
    setOutcomeLogged(false)
  }

  return (
    <Card className="border-2 border-primary-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Help Me Now</h2>
          <p className="text-sm text-slate-500">Get guidance for the next 60 seconds</p>
        </div>
      </div>

      {/* Situation picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          What&apos;s happening?
        </label>
        <div className="flex flex-wrap gap-2">
          {SITUATIONS.map((situation) => {
            const isSelected = selectedSituation === situation.id

            return (
              <button
                key={situation.id}
                onClick={() => setSelectedSituation(situation.id)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-surface-100 text-slate-700 hover:bg-surface-200'
                  }
                `}
              >
                {situation.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Context toggles */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          What else is going on? <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTEXT_FACTORS.map((context) => {
            const isActive = activeContexts.includes(context.id)

            return (
              <button
                key={context.id}
                onClick={() => toggleContext(context.id)}
                className={`
                  ${isActive ? 'chip-active' : 'chip-inactive'}
                `}
              >
                {isActive && (
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {context.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        variant="accent"
        fullWidth
        disabled={!selectedSituation}
        loading={isGenerating}
        className="mb-6"
      >
        {output ? 'Get fresh guidance' : 'Give me the next 60 seconds'}
      </Button>

      {/* Output panel */}
      {output && (
        <div className="animate-fade-in">
          {/* Do this now */}
          <div className="bg-success-50 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-success-600 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Do this now
            </h3>
            <ol className="space-y-2">
              {output.doThisNow.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success-500 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Avoid this */}
          <div className="bg-caution-50 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-caution-600 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Avoid this
            </h3>
            <ul className="space-y-2">
              {output.avoidThis.map((item, index) => (
                <li key={index} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-caution-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why this works */}
          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-primary-600 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Why this works
            </h3>
            <p className="text-sm text-slate-700">{output.whyThisWorks}</p>
          </div>

          {/* Outcome logging */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-600 mb-3">
              {outcomeLogged ? 'Thanks for the feedback!' : 'How did it go?'}
            </p>
            <div className="flex gap-2">
              {[
                { value: 'worked' as OutcomeRating, label: 'Worked', color: 'bg-success-100 text-success-700 hover:bg-success-200' },
                { value: 'somewhat' as OutcomeRating, label: 'Somewhat', color: 'bg-warning-100 text-warning-700 hover:bg-warning-200' },
                { value: 'didnt' as OutcomeRating, label: "Didn't", color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOutcome(option.value)}
                  disabled={outcomeLogged}
                  className={`
                    flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${outcomeLogged ? 'opacity-50 cursor-not-allowed' : ''}
                    ${option.color}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Start over with a new situation
          </button>
        </div>
      )}
    </Card>
  )
}
