'use client'

import * as React from 'react'
import { createContext, useContext } from 'react'

// Screen size context for responsive design in Plasmic
interface ScreenContextType {
  screenVariant?: 'mobile' | 'tablet' | 'desktop'
}

const ScreenContext = createContext<ScreenContextType>({})

export function useScreenVariants() {
  return useContext(ScreenContext)
}

export function ScreenVariantProvider({ 
  children,
  screenVariant
}: {
  children: React.ReactNode
  screenVariant?: 'mobile' | 'tablet' | 'desktop'
}) {
  return (
    <ScreenContext.Provider value={{ screenVariant }}>
      {children}
    </ScreenContext.Provider>
  )
}