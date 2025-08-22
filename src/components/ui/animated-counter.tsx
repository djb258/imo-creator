'use client'

import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  end: number
  start?: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({ 
  end, 
  start = 0, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = ''
}: AnimatedCounterProps) {
  const [mounted, setMounted] = useState(false)
  const spring = useSpring(start, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (current) => 
    `${prefix}${Math.round(current)}${suffix}`
  )

  useEffect(() => {
    setMounted(true)
    spring.set(end)
  }, [spring, end])

  if (!mounted) {
    return (
      <span className={className}>
        {prefix}{start}{suffix}
      </span>
    )
  }

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  )
}