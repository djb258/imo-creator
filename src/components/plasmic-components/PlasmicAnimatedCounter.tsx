'use client'

import * as React from 'react'
import { registerComponent } from '@plasmicapp/host'
import { AnimatedCounter } from '@/components/ui/animated-counter'

interface PlasmicAnimatedCounterProps {
  end: number
  start?: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function PlasmicAnimatedCounter({ 
  end,
  start = 0,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  ...props 
}: PlasmicAnimatedCounterProps) {
  return (
    <AnimatedCounter 
      end={end}
      start={start}
      duration={duration}
      suffix={suffix}
      prefix={prefix}
      className={className}
      {...props}
    />
  )
}

// Register with Plasmic
registerComponent(PlasmicAnimatedCounter, {
  name: 'AnimatedCounter',
  displayName: 'Animated Counter',
  description: 'A smooth, spring-animated number counter',
  props: {
    end: {
      type: 'number',
      displayName: 'End Value',
      description: 'The final number to count to',
      defaultValue: 100
    },
    start: {
      type: 'number',
      displayName: 'Start Value',
      description: 'The number to start counting from',
      defaultValue: 0
    },
    duration: {
      type: 'number',
      displayName: 'Duration (ms)',
      description: 'Animation duration in milliseconds',
      defaultValue: 2000
    },
    prefix: {
      type: 'string',
      displayName: 'Prefix',
      description: 'Text to show before the number (e.g., "$")',
      defaultValue: ''
    },
    suffix: {
      type: 'string',
      displayName: 'Suffix',
      description: 'Text to show after the number (e.g., "%", "+")',
      defaultValue: ''
    },
    className: {
      type: 'string',
      displayName: 'CSS Classes',
      description: 'Additional CSS classes'
    }
  },
  importPath: '@/components/plasmic-components/PlasmicAnimatedCounter'
})