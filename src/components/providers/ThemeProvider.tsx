'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      themes={['dark', 'light', 'system']}
      storageKey="mc-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
