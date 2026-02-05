'use client'

import { useState } from 'react'
import Card from './Card'
import Button from './Button'
import { HistoryEvent, SITUATIONS, APPROACHES, OutcomeRating } from '@/lib/types'
import { formatTimestamp, resetHistory } from '@/lib/storage'

interface HistoryListProps {
  events: HistoryEvent[]
  onReset: () => void
}

const outcomeColors: Record<OutcomeRating, { bg: string; text: string; label: string }> = {
  worked: { bg: 'bg-success-100', text: 'text-success-700', label: 'Worked' },
  somewhat: { bg: 'bg-warning-100', text: 'text-warning-700', label: 'Somewhat' },
  didnt: { bg: 'bg-slate-100', text: 'text-slate-600', label: "Didn't work" },
}

export default function HistoryList({ events, onReset }: HistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleReset = () => {
    resetHistory()
    onReset()
    setShowResetConfirm(false)
  }

  const getSituationLabel = (situationId: string) => {
    return SITUATIONS.find((s) => s.id === situationId)?.label || situationId
  }

  if (events.length === 0) {
    return (
      <Card hover={false}>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">History</h2>
        <p className="text-sm text-slate-500">
          Your past guidance sessions will appear here. Use &ldquo;Help Me Now&rdquo; to get started.
        </p>
      </Card>
    )
  }

  return (
    <Card hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent History</h2>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            Reset demo data
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-caution-600 hover:text-caution-700 font-medium"
            >
              Confirm reset
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {events.slice(0, 10).map((event) => {
          const isExpanded = expandedId === event.id
          const outcome = outcomeColors[event.outcome]

          return (
            <div
              key={event.id}
              className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200"
            >
              {/* Header - always visible */}
              <button
                onClick={() => toggleExpand(event.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-800">
                      {getSituationLabel(event.situation)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Outcome badge */}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${outcome.bg} ${outcome.text}`}>
                    {outcome.label}
                  </span>

                  {/* Expand indicator */}
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 animate-fade-in">
                  <div className="border-t border-slate-100 pt-3">
                    {/* Context factors */}
                    {event.contextFactors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 mb-1">Context:</p>
                        <div className="flex flex-wrap gap-1">
                          {event.contextFactors.map((ctx) => (
                            <span
                              key={ctx}
                              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                            >
                              {ctx}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Steps suggested */}
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-2">Steps suggested:</p>
                      <ol className="space-y-1">
                        {event.output.doThisNow.map((step, index) => (
                          <li key={index} className="text-sm text-slate-700 flex gap-2">
                            <span className="text-primary-500 font-medium">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Approach used */}
                    <p className="text-xs text-slate-400">
                      Approach: {APPROACHES.find(a => a.id === event.approach)?.name ?? event.approach}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {events.length > 10 && (
        <p className="text-xs text-slate-400 mt-4 text-center">
          Showing last 10 of {events.length} sessions
        </p>
      )}
    </Card>
  )
}
