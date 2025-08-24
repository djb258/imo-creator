'use client'

import * as React from 'react'
import { registerComponent } from '@plasmicapp/host'
import { GradientText } from '@/components/ui/gradient-text'

interface PlasmicGradientTextProps {
  children?: React.ReactNode
  text?: string
  gradient?: string
  animate?: boolean
  className?: string
}

export function PlasmicGradientText({ 
  children,
  text,
  gradient = 'from-brand-400 via-brand-600 to-brand-800',
  animate = true,
  className,
  ...props 
}: PlasmicGradientTextProps) {
  const content = children || text || 'Gradient Text'
  
  return (
    <GradientText 
      gradient={gradient}
      animate={animate}
      className={className}
      {...props}
    >
      {content}
    </GradientText>
  )
}

// Register with Plasmic
registerComponent(PlasmicGradientText, {
  name: 'GradientText',
  displayName: 'Gradient Text',
  description: 'Animated gradient text with multiple color schemes',
  props: {
    text: {
      type: 'string',
      displayName: 'Text Content',
      description: 'The text to display with gradient',
      defaultValue: 'Beautiful Gradient'
    },
    gradient: {
      type: 'choice',
      displayName: 'Gradient Style',
      description: 'Gradient color scheme',
      options: [
        { label: 'Brand Blue', value: 'from-brand-400 via-brand-600 to-brand-800' },
        { label: 'Purple to Pink', value: 'from-purple-400 via-pink-500 to-red-500' },
        { label: 'Blue to Green', value: 'from-blue-400 via-teal-500 to-green-500' },
        { label: 'Orange to Red', value: 'from-orange-400 via-red-500 to-pink-500' },
        { label: 'Green to Blue', value: 'from-green-400 via-blue-500 to-purple-500' },
        { label: 'Gold', value: 'from-yellow-400 via-orange-500 to-red-500' }
      ],
      defaultValue: 'from-brand-400 via-brand-600 to-brand-800'
    },
    animate: {
      type: 'boolean',
      displayName: 'Animate Gradient',
      description: 'Whether to animate the gradient',
      defaultValue: true
    },
    className: {
      type: 'string',
      displayName: 'CSS Classes',
      description: 'Additional CSS classes'
    },
    children: {
      type: 'slot',
      displayName: 'Content',
      description: 'Text content (overrides text prop)'
    }
  },
  importPath: '@/components/plasmic-components/PlasmicGradientText'
})