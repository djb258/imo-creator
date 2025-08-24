'use client'

import * as React from 'react'
import { registerComponent } from '@plasmicapp/host'
import { GlowCard } from '@/components/ui/glow-card'

interface PlasmicGlowCardProps {
  children?: React.ReactNode
  glowColor?: string
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function PlasmicGlowCard({ 
  children, 
  glowColor = 'brand-500',
  intensity = 'medium',
  className,
  ...props 
}: PlasmicGlowCardProps) {
  return (
    <GlowCard 
      glowColor={glowColor}
      intensity={intensity}
      className={className}
      {...props}
    >
      {children}
    </GlowCard>
  )
}

// Register with Plasmic
registerComponent(PlasmicGlowCard, {
  name: 'GlowCard',
  displayName: 'Glow Card',
  description: 'An interactive card with beautiful glow effects and hover animations',
  props: {
    glowColor: {
      type: 'choice',
      displayName: 'Glow Color',
      description: 'Color of the glow effect',
      options: [
        { label: 'Brand Blue', value: 'brand-500' },
        { label: 'Green', value: 'green-500' },
        { label: 'Purple', value: 'purple-500' },
        { label: 'Pink', value: 'pink-500' },
        { label: 'Yellow', value: 'yellow-500' },
        { label: 'Red', value: 'red-500' }
      ],
      defaultValue: 'brand-500'
    },
    intensity: {
      type: 'choice',
      displayName: 'Glow Intensity',
      description: 'Intensity of the glow effect',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' }
      ],
      defaultValue: 'medium'
    },
    className: {
      type: 'string',
      displayName: 'CSS Classes',
      description: 'Additional CSS classes'
    },
    children: {
      type: 'slot',
      displayName: 'Content',
      description: 'Card content'
    }
  },
  importPath: '@/components/plasmic-components/PlasmicGlowCard'
})