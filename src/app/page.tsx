'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  ChartBarIcon, 
  CubeIcon, 
  RocketLaunchIcon,
  EyeIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GlowCard } from '@/components/ui/glow-card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { GradientText } from '@/components/ui/gradient-text'
import { FloatingElements } from '@/components/ui/floating-elements'
import Link from 'next/link'

const features = [
  {
    name: 'Christmas Tree Visualization',
    description: 'Interactive flow diagrams with real-time health status and beautiful Christmas tree layouts.',
    icon: SparklesIcon,
    color: 'from-green-400 to-emerald-600',
    href: '/garage/viz'
  },
  {
    name: 'Factory + Garage System', 
    description: 'HEIR/ORBT compliant orchestration with automated validation and enforcement.',
    icon: CubeIcon,
    color: 'from-blue-400 to-indigo-600',
    href: '/factory'
  },
  {
    name: 'Real-time Analytics',
    description: 'Live telemetry heat maps showing failure patterns and system performance.',
    icon: ChartBarIcon,
    color: 'from-purple-400 to-violet-600', 
    href: '/analytics'
  },
  {
    name: 'Modern UI Components',
    description: 'World-class design system with Radix UI, Framer Motion, and Tailwind CSS.',
    icon: PaintBrushIcon,
    color: 'from-pink-400 to-rose-600',
    href: '/components'
  }
]

const stats = [
  { label: 'UI Components', value: 50 },
  { label: 'Animation Variants', value: 25 },
  { label: 'Design Tokens', value: 100 },
  { label: 'Performance Score', value: 98 }
]

const technologies = [
  'Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion',
  'Radix UI', 'React Query', 'Zustand', 'React Flow', 'Mermaid', 'Zod'
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-white/10 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-8 glass text-white border-white/20">
              <SparklesIcon className="w-4 h-4 mr-2" />
              World-Class Web Design System
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
              <GradientText className="block mb-2">
                IMO Creator
              </GradientText>
              <span className="text-white/90">
                Design System
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              A unified repository compliance and orchestration system featuring 
              cutting-edge UI components, interactive visualizations, and world-class design patterns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white glow-brand interactive">
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Launch Dashboard
              </Button>
              
              <Button size="lg" variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                <EyeIcon className="w-5 h-5 mr-2" />
                View Components
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.label === 'Performance Score' ? '%' : '+'} />
                </div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cutting-Edge Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built with the latest technologies to create stunning, performant, and accessible web experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <GlowCard className="h-full cursor-pointer group">
                    <div className="p-8">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {feature.name}
                      </h3>
                      
                      <p className="text-white/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by Modern Tech
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built with the most advanced tools and libraries in the React ecosystem.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Badge 
                  variant="secondary" 
                  className="glass text-white border-white/20 hover:bg-white/10 transition-colors cursor-default px-4 py-2"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlowCard className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Explore our components, visualizations, and design system to create world-class web experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white glow-brand interactive">
                  <CodeBracketIcon className="w-5 h-5 mr-2" />
                  Browse Components
                </Button>
                
                <Button size="lg" variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                  <BoltIcon className="w-5 h-5 mr-2" />
                  View Source Code
                </Button>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}