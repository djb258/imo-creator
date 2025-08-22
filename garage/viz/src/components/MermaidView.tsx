import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidViewProps {
  diagram: string
  className?: string
}

export default function MermaidView({ diagram, className = '' }: MermaidViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !diagram) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        // Configure mermaid for dark theme
        mermaid.initialize({
          theme: 'dark',
          themeVariables: {
            primaryColor: '#10b981',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#10b981',
            lineColor: '#64748b',
            secondaryColor: '#1e293b',
            tertiaryColor: '#334155',
            background: '#0f172a',
            mainBkg: '#1e293b',
            secondBkg: '#334155',
            nodeBkg: '#1e293b',
            clusterBkg: '#334155'
          },
          flowchart: {
            nodeSpacing: 50,
            rankSpacing: 80,
            curve: 'basis'
          }
        })

        const element = containerRef.current
        element.innerHTML = ''
        
        const { svg } = await mermaid.render('mermaid-diagram', diagram)
        element.innerHTML = svg
        
        // Add click handlers if needed
        const nodes = element.querySelectorAll('.node')
        nodes.forEach(node => {
          node.addEventListener('click', (e) => {
            const nodeId = node.getAttribute('id')?.replace('flowchart-', '').replace('-', '')
            console.log('Mermaid node clicked:', nodeId)
          })
        })
        
        setIsLoading(false)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [diagram])

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-red-400 text-center">
          <div className="text-lg mb-2">Diagram Error</div>
          <div className="text-sm text-gray-400">{error}</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-gray-400">Rendering diagram...</div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full overflow-auto ${className}`}
      style={{ 
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  )
}