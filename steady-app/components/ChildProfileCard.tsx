'use client'

import { useState, useEffect } from 'react'
import Card from './Card'
import Button from './Button'
import Slider from './Slider'
import {
  ChildProfile,
  DEFAULT_CHILD_PROFILE,
  DEFAULT_TEMPERAMENT,
} from '@/lib/types'
import { getChildProfile, saveChildProfile, formatTimestamp } from '@/lib/storage'

interface ChildProfileCardProps {
  onProfileChange?: (profile: ChildProfile) => void
}

export default function ChildProfileCard({ onProfileChange }: ChildProfileCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [profile, setProfile] = useState<ChildProfile>(DEFAULT_CHILD_PROFILE)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = getChildProfile()
    if (stored) {
      setProfile(stored)
    }
  }, [])

  // Auto-collapse on mobile after profile is set
  useEffect(() => {
    if (profile.name && profile.lastUpdated && window.innerWidth < 768) {
      setIsCollapsed(true)
    }
  }, [profile.name, profile.lastUpdated])

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    }
    saveChildProfile(updatedProfile)
    setProfile(updatedProfile)
    setHasChanges(false)
    setIsSaved(true)
    onProfileChange?.(updatedProfile)

    // Reset saved indicator after 2 seconds
    setTimeout(() => setIsSaved(false), 2000)
  }

  const updateProfile = (updates: Partial<ChildProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
    setHasChanges(true)
    setIsSaved(false)
  }

  const updateTemperament = (key: keyof typeof DEFAULT_TEMPERAMENT, value: number) => {
    setProfile((prev) => ({
      ...prev,
      temperament: { ...prev.temperament, [key]: value },
    }))
    setHasChanges(true)
    setIsSaved(false)
  }

  const ages = Array.from({ length: 9 }, (_, i) => i + 2) // 2-10

  return (
    <Card className="relative">
      {/* Header - always visible */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-left md:cursor-default"
      >
        <div className="flex items-center gap-3">
          {/* Child avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-600" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {profile.name || 'Child Profile'}
            </h2>
            {profile.lastUpdated && (
              <p className="text-xs text-slate-500">
                Updated {formatTimestamp(profile.lastUpdated)}
              </p>
            )}
          </div>
        </div>

        {/* Collapse indicator - mobile only */}
        <div className="md:hidden">
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible content */}
      <div className={`${isCollapsed ? 'hidden md:block' : 'block'} mt-6 space-y-6`}>
        {/* Name input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Child&apos;s name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="Enter name"
            className="input"
          />
        </div>

        {/* Age dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Age
          </label>
          <select
            value={profile.age}
            onChange={(e) => updateProfile({ age: Number(e.target.value) })}
            className="input"
          >
            {ages.map((age) => (
              <option key={age} value={age}>
                {age} years old
              </option>
            ))}
          </select>
        </div>

        {/* Temperament sliders */}
        <div className="space-y-5">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            Temperament
            <span className="text-xs font-normal text-slate-500">(helps personalize guidance)</span>
          </h3>

          <Slider
            label="Reactivity"
            value={profile.temperament.reactivity}
            onChange={(v) => updateTemperament('reactivity', v)}
            description="How quickly and intensely they respond to things"
          />

          <Slider
            label="Persistence"
            value={profile.temperament.persistence}
            onChange={(v) => updateTemperament('persistence', v)}
            description="How long they keep going with demands or big emotions"
          />

          <Slider
            label="Sensitivity"
            value={profile.temperament.sensitivity}
            onChange={(v) => updateTemperament('sensitivity', v)}
            description="How affected they are by environment (noise, light, texture)"
          />
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges && !isSaved}
            variant={isSaved ? 'secondary' : 'primary'}
            className="flex-1"
          >
            {isSaved ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
