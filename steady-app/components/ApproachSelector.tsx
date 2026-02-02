'use client'

import { useState, useEffect } from 'react'
import Card from './Card'
import { ParentingApproach, APPROACHES } from '@/lib/types'
import { getApproach, saveApproach } from '@/lib/storage'

interface ApproachSelectorProps {
  onApproachChange?: (approach: ParentingApproach) => void
}

export default function ApproachSelector({ onApproachChange }: ApproachSelectorProps) {
  const [selected, setSelected] = useState<ParentingApproach>('connect-redirect')

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getApproach()
    if (stored) {
      setSelected(stored)
    }
  }, [])

  const handleSelect = (approach: ParentingApproach) => {
    setSelected(approach)
    saveApproach(approach)
    onApproachChange?.(approach)
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Parenting Approach
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Choose an approach to use consistently. You can change this anytime.
      </p>

      <div className="space-y-3">
        {APPROACHES.map((approach) => {
          const isSelected = selected === approach.id

          return (
            <button
              key={approach.id}
              onClick={() => handleSelect(approach.id)}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                ${isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-surface-50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Radio indicator */}
                <div className={`
                  mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                  ${isSelected ? 'border-primary-500' : 'border-slate-300'}
                `}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`font-semibold ${isSelected ? 'text-primary-700' : 'text-slate-800'}`}>
                    {approach.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {approach.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Current selection indicator */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Currently using:{' '}
          <span className="font-medium text-primary-600">
            {APPROACHES.find(a => a.id === selected)?.shortName}
          </span>
        </p>
      </div>
    </Card>
  )
}
