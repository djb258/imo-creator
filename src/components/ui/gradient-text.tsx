'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  gradient?: string
  animate?: boolean
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, children, gradient = 'from-brand-400 via-brand-600 to-brand-800', animate = true, ...props }, ref) => {
    if (!animate) {
      return (
        <span
          ref={ref}
          className={cn(
            'bg-gradient-to-r bg-clip-text text-transparent',
            gradient,
            className
          )}
          {...props}
        >
          {children}
        </span>
      )
    }

    return (
      <motion.span
        ref={ref}
        className={cn(
          'bg-gradient-to-r bg-clip-text text-transparent',
          gradient,
          className
        )}
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 3,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
        {...props}
      >
        {children}
      </motion.span>
    )
  }
)

GradientText.displayName = 'GradientText'

export { GradientText }