'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface DarkModeContextType {
  isDark: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem('dark-mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const shouldBeDark = saved !== null ? saved === 'true' : prefersDark
    setIsDark(shouldBeDark)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('dark-mode', isDark.toString())
  }, [isDark, mounted])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider')
  }
  return context
}
