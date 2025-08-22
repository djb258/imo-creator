'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glowColor?: string
  intensity?: 'low' | 'medium' | 'high'
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, children, glowColor = 'brand-500', intensity = 'medium', ...props }, ref) => {
    const intensityMap = {
      low: 'shadow-lg',
      medium: 'shadow-xl',
      high: 'shadow-2xl'
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-lg border bg-card/50 backdrop-blur-sm text-card-foreground transition-all duration-300',
          'hover:border-white/40 hover:bg-card/70',
          intensityMap[intensity],
          `hover:shadow-${glowColor}/20`,
          className
        )}
        whileHover={{ 
          scale: 1.02,
          boxShadow: `0 25px 50px -12px rgba(var(--${glowColor}), 0.25)` 
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        {/* Glow effect overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-lg border border-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    )
  }
)

GlowCard.displayName = 'GlowCard'

export { GlowCard }