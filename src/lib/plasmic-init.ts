import { initPlasmicLoader } from '@plasmicapp/loader-nextjs'

// Import all our world-class components
import { Button } from '@/components/ui/button'
import { GlowCard } from '@/components/ui/glow-card'
import { GradientText } from '@/components/ui/gradient-text'
import { AnimatedCounter } from '@/components/ui/animated-counter'

// Initialize Plasmic loader with enhanced configuration
export const PLASMIC = initPlasmicLoader({
  projects: [
    // Add your Plasmic project IDs here when you create them
    // Example:
    // {
    //   id: "your-project-id",
    //   token: "your-project-token"
    // }
  ],
  
  // Enhanced preview mode for better design experience
  preview: true,
  
  // Global variants for responsive/theme support
  globalVariants: [
    {
      name: 'Screen',
      contextName: 'ScreenVariantContext',
      values: [
        { name: 'mobile', displayName: 'Mobile', mediaQuery: '(max-width: 768px)' },
        { name: 'tablet', displayName: 'Tablet', mediaQuery: '(max-width: 1024px)' },
        { name: 'desktop', displayName: 'Desktop', mediaQuery: '(min-width: 1025px)' },
      ]
    },
    {
      name: 'Theme',
      contextName: 'ThemeVariantContext',
      values: [
        { name: 'light', displayName: 'Light Theme' },
        { name: 'dark', displayName: 'Dark Theme' }
      ]
    }
  ]
})

// Register all world-class components with comprehensive props
PLASMIC.registerComponent(Button, {
  name: 'Button',
  displayName: 'World-Class Button',
  description: 'Ultra-modern button with 8 variants, 5 sizes, and full accessibility',
  props: {
    variant: {
      type: 'choice',
      displayName: 'Button Style',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'destructive', label: 'Destructive (Red)' },
        { value: 'outline', label: 'Outline' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'ghost', label: 'Ghost' },
        { value: 'link', label: 'Link Style' },
        { value: 'gradient', label: '🎨 Gradient' },
        { value: 'glass', label: '✨ Glass Morphism' }
      ],
      defaultValue: 'default'
    },
    size: {
      type: 'choice',
      displayName: 'Button Size',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'sm', label: 'Small' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
        { value: 'icon', label: 'Icon Only' }
      ],
      defaultValue: 'default'
    },
    disabled: {
      type: 'boolean',
      displayName: 'Disabled',
      defaultValue: false
    },
    children: {
      type: 'slot',
      displayName: 'Button Content',
      defaultValue: [
        {
          type: 'text',
          value: 'Click Me'
        }
      ]
    }
  }
})

PLASMIC.registerComponent(GlowCard, {
  name: 'GlowCard',
  displayName: 'Glow Card',
  description: 'Interactive cards with mesmerizing hover glow effects',
  props: {
    glowColor: {
      type: 'choice',
      displayName: 'Glow Color',
      options: [
        { value: 'blue', label: '💙 Brand Blue' },
        { value: 'green', label: '💚 Green' },
        { value: 'purple', label: '💜 Purple' },
        { value: 'pink', label: '🩷 Pink' },
        { value: 'yellow', label: '💛 Yellow' },
        { value: 'red', label: '❤️ Red' }
      ],
      defaultValue: 'blue'
    },
    intensity: {
      type: 'choice',
      displayName: 'Glow Intensity',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ],
      defaultValue: 'medium'
    },
    className: {
      type: 'string',
      displayName: 'Custom CSS Classes',
      defaultValue: ''
    },
    children: {
      type: 'slot',
      displayName: 'Card Content',
      defaultValue: [
        {
          type: 'text',
          value: 'Your amazing content here'
        }
      ]
    }
  }
})

PLASMIC.registerComponent(GradientText, {
  name: 'GradientText', 
  displayName: 'Gradient Text',
  description: 'Animated gradient text with 6 stunning color schemes',
  props: {
    gradient: {
      type: 'choice',
      displayName: 'Gradient Style',
      options: [
        { value: 'brand', label: '🔵 Brand Blue' },
        { value: 'purple', label: '🟣 Purple to Pink' },
        { value: 'blue-green', label: '🔷 Blue to Green' },
        { value: 'orange-red', label: '🔶 Orange to Red' },
        { value: 'green-blue', label: '🟢 Green to Blue' },
        { value: 'gold', label: '🟡 Gold' }
      ],
      defaultValue: 'brand'
    },
    animated: {
      type: 'boolean',
      displayName: 'Enable Animation',
      defaultValue: true
    },
    text: {
      type: 'string',
      displayName: 'Text Content',
      defaultValue: 'Gradient Text'
    },
    children: {
      type: 'slot',
      displayName: 'Rich Content',
      defaultValue: []
    }
  }
})

PLASMIC.registerComponent(AnimatedCounter, {
  name: 'AnimatedCounter',
  displayName: 'Animated Counter',
  description: 'Spring-based number animations with customizable formatting',
  props: {
    start: {
      type: 'number',
      displayName: 'Start Value',
      defaultValue: 0
    },
    end: {
      type: 'number', 
      displayName: 'End Value',
      defaultValue: 100
    },
    duration: {
      type: 'number',
      displayName: 'Duration (seconds)',
      defaultValue: 2
    },
    prefix: {
      type: 'string',
      displayName: 'Prefix (e.g. "$")',
      defaultValue: ''
    },
    suffix: {
      type: 'string',
      displayName: 'Suffix (e.g. "%", "+")',
      defaultValue: ''
    }
  }
})

// Register host page component
PLASMIC.registerComponent({
  name: 'HostPage',
  component: () => null, // This will be replaced by Plasmic
})