'use client'

import { motion } from 'framer-motion'

const FloatingElement = ({ 
  delay, 
  duration, 
  children, 
  className = '' 
}: {
  delay: number
  duration: number
  children: React.ReactNode
  className?: string
}) => (
  <motion.div
    className={`absolute opacity-20 ${className}`}
    initial={{ y: 0, rotate: 0 }}
    animate={{ 
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
  >
    {children}
  </motion.div>
)

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Geometric shapes */}
      <FloatingElement delay={0} duration={8} className="top-1/4 left-1/4">
        <div className="w-4 h-4 bg-brand-400 rounded-full blur-sm" />
      </FloatingElement>
      
      <FloatingElement delay={1} duration={12} className="top-1/3 right-1/4">
        <div className="w-6 h-6 bg-purple-400 rotate-45 blur-sm" />
      </FloatingElement>
      
      <FloatingElement delay={2} duration={10} className="bottom-1/4 left-1/3">
        <div className="w-5 h-5 bg-pink-400 rounded-full blur-sm" />
      </FloatingElement>
      
      <FloatingElement delay={3} duration={14} className="top-2/3 right-1/3">
        <div className="w-3 h-8 bg-blue-400 rounded-full blur-sm" />
      </FloatingElement>
      
      <FloatingElement delay={4} duration={9} className="bottom-1/3 right-1/4">
        <div className="w-7 h-3 bg-green-400 rounded-full blur-sm" />
      </FloatingElement>

      {/* Additional decorative elements */}
      <FloatingElement delay={1.5} duration={16} className="top-1/2 left-1/6">
        <div className="w-2 h-2 bg-yellow-400 rounded-full blur-sm" />
      </FloatingElement>
      
      <FloatingElement delay={3.5} duration={11} className="top-3/4 right-1/6">
        <div className="w-4 h-4 bg-indigo-400 rotate-12 blur-sm" />
      </FloatingElement>
      
      <FloatingElement delay={5} duration={13} className="bottom-1/2 left-1/2">
        <div className="w-3 h-6 bg-teal-400 rounded-full blur-sm" />
      </FloatingElement>

      {/* Large background gradients */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-pink-500/10 to-violet-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}