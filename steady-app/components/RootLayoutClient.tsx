'use client'

import { DarkModeProvider } from './DarkModeProvider'

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return <DarkModeProvider>{children}</DarkModeProvider>
}
