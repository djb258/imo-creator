'use client'

import * as React from 'react'
import { registerComponent } from '@plasmicapp/host'
import { Button, ButtonProps } from '@/components/ui/button'

interface PlasmicButtonProps extends ButtonProps {
  children?: React.ReactNode
  text?: string
  icon?: React.ReactNode
  className?: string
}

export function PlasmicButton({ 
  children, 
  text, 
  icon, 
  className,
  variant = 'default',
  size = 'default',
  ...props 
}: PlasmicButtonProps) {
  const content = children || text || 'Button'
  
  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {content}
    </Button>
  )
}

// Register with Plasmic
registerComponent(PlasmicButton, {
  name: 'Button',
  displayName: 'World-Class Button',
  description: 'A beautiful, accessible button with multiple variants and animations',
  props: {
    text: {
      type: 'string',
      displayName: 'Button Text',
      description: 'The text to display on the button',
      defaultValue: 'Click me'
    },
    variant: {
      type: 'choice',
      displayName: 'Variant',
      description: 'Button style variant',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Outline', value: 'outline' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Link', value: 'link' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Glass', value: 'glass' }
      ],
      defaultValue: 'default'
    },
    size: {
      type: 'choice',
      displayName: 'Size',
      description: 'Button size',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Small', value: 'sm' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
        { label: 'Icon', value: 'icon' }
      ],
      defaultValue: 'default'
    },
    disabled: {
      type: 'boolean',
      displayName: 'Disabled',
      description: 'Whether the button is disabled',
      defaultValue: false
    },
    className: {
      type: 'string',
      displayName: 'CSS Classes',
      description: 'Additional CSS classes'
    },
    children: {
      type: 'slot',
      displayName: 'Content',
      description: 'Button content (overrides text)'
    },
    icon: {
      type: 'slot',
      displayName: 'Icon',
      description: 'Icon to display before text'
    }
  },
  importPath: '@/components/plasmic-components/PlasmicButton'
})