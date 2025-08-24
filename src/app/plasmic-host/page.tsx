'use client'

import * as React from 'react'
import { PlasmicCanvasHost } from '@plasmicapp/host'

// Import all Plasmic components to register them
import '@/components/plasmic-components'

export default function PlasmicHost() {
  return (
    <PlasmicCanvasHost />
  )
}

// This page serves as the Plasmic canvas host for design-time editing