import { useCallback, useMemo, useState, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  ReactFlowProvider,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'

import { FlowSpec, HealthStatus, FlowNode, FlowEdge } from '../types'
import PageNode from './PageNode'
import GatekeeperNode from './GatekeeperNode'

interface FlowVizProps {
  flowSpec: FlowSpec
  health: HealthStatus
  selectedNodeId?: string
  onNodeSelect: (nodeId: string | null) => void
  telemetryHeatMap?: Record<string, number>
}

const nodeTypes = {
  pageNode: PageNode,
  gatekeeperNode: GatekeeperNode,
}

export default function FlowViz({ 
  flowSpec, 
  health, 
  selectedNodeId, 
  onNodeSelect,
  telemetryHeatMap 
}: FlowVizProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Generate Christmas tree layout (root at top, hierarchical)
  const generateLayout = useCallback(() => {
    const pageEntries = Object.entries(flowSpec.flow.pages)
    const gatekeeperEntries = Object.entries(flowSpec.flow.gatekeepers)
    
    const newNodes: FlowNode[] = []
    const newEdges: FlowEdge[] = []

    // Layout parameters for Christmas tree shape
    const LEVEL_HEIGHT = 120
    const BASE_WIDTH = 600
    const ROOT_X = 400
    const ROOT_Y = 50

    // Entrypoint at the top (star of the tree)
    const entryPage = pageEntries.find(([id]) => id === flowSpec.flow.entrypoint)
    if (entryPage) {
      const [pageId, pageSpec] = entryPage
      const pageHealth = health.pages[pageId]
      
      newNodes.push({
        id: pageId,
        type: 'pageNode',
        position: { x: ROOT_X, y: ROOT_Y },
        data: {
          label: pageSpec.title,
          status: pageHealth?.status || 'fail',
          spec: pageSpec,
          health: pageHealth
        }
      })
    }

    // Level 1: Pages connected to entrypoint (main branches)
    let level1Pages = pageEntries.filter(([id, spec]) => {
      if (id === flowSpec.flow.entrypoint) return false
      const entrySpec = flowSpec.flow.pages[flowSpec.flow.entrypoint]
      return entrySpec?.next?.includes(id)
    })

    level1Pages.forEach(([pageId, pageSpec], index) => {
      const pageHealth = health.pages[pageId]
      const totalLevel1 = level1Pages.length
      const spacing = BASE_WIDTH / Math.max(totalLevel1 - 1, 1)
      const startX = ROOT_X - (BASE_WIDTH / 2)
      
      newNodes.push({
        id: pageId,
        type: 'pageNode',
        position: { 
          x: totalLevel1 === 1 ? ROOT_X : startX + (spacing * index), 
          y: ROOT_Y + LEVEL_HEIGHT 
        },
        data: {
          label: pageSpec.title,
          status: pageHealth?.status || 'fail',
          spec: pageSpec,
          health: pageHealth
        }
      })

      // Connect to entrypoint
      newEdges.push({
        id: `${flowSpec.flow.entrypoint}-${pageId}`,
        source: flowSpec.flow.entrypoint,
        target: pageId,
        markerEnd: { type: MarkerType.Arrow },
        style: { strokeWidth: 2 }
      })
    })

    // Level 2: Gatekeepers (ornaments on the tree)
    let gatekeeperY = ROOT_Y + (LEVEL_HEIGHT * 2)
    gatekeeperEntries.forEach(([gatekeeperId, gatekeeperSpec], index) => {
      const checkResult = health.checks[`gatekeeper_${gatekeeperId}`]
      const spacing = BASE_WIDTH / Math.max(gatekeeperEntries.length - 1, 1)
      const startX = ROOT_X - (BASE_WIDTH / 2)
      
      newNodes.push({
        id: gatekeeperId,
        type: 'gatekeeperNode',
        position: { 
          x: gatekeeperEntries.length === 1 ? ROOT_X : startX + (spacing * index),
          y: gatekeeperY 
        },
        data: {
          label: `🚪 ${gatekeeperId}`,
          status: checkResult?.status || 'fail',
          spec: gatekeeperSpec,
          health: checkResult
        }
      })

      // Connect gatekeepers to relevant pages
      level1Pages.forEach(([pageId]) => {
        newEdges.push({
          id: `${pageId}-${gatekeeperId}`,
          source: pageId,
          target: gatekeeperId,
          label: gatekeeperSpec.rules.join(', '),
          markerEnd: { type: MarkerType.Arrow },
          style: { 
            strokeWidth: 2,
            opacity: telemetryHeatMap?.[`${pageId}-${gatekeeperId}`] ? 
              Math.min(telemetryHeatMap[`${pageId}-${gatekeeperId}`] / 10, 1) : 0.7
          }
        })
      })
    })

    setNodes(newNodes as Node[])
    setEdges(newEdges as Edge[])
  }, [flowSpec, health, telemetryHeatMap])

  useEffect(() => {
    generateLayout()
  }, [generateLayout])

  // Highlight selected node's connections
  const processedEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      animated: selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId),
      style: {
        ...edge.style,
        stroke: selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId) 
          ? '#3b82f6' : edge.style?.stroke || '#64748b',
        strokeWidth: selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId)
          ? 3 : edge.style?.strokeWidth || 2
      }
    }))
  }, [edges, selectedNodeId])

  const onNodeClick = useCallback((event: any, node: Node) => {
    onNodeSelect(node.id === selectedNodeId ? null : node.id)
  }, [onNodeSelect, selectedNodeId])

  return (
    <div className="h-full w-full bg-viz-bg">
      <ReactFlow
        nodes={nodes}
        edges={processedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-viz-bg"
      >
        <Controls className="bg-viz-panel border-viz-border" />
        <MiniMap 
          className="bg-viz-panel border-viz-border"
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            const status = (node.data as any)?.status || 'fail'
            return status === 'pass' ? '#10b981' : status === 'warn' ? '#f59e0b' : '#ef4444'
          }}
        />
        <Background color="#334155" />
      </ReactFlow>
    </div>
  )
}

export function FlowVizProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactFlowProvider>
      {children}
    </ReactFlowProvider>
  )
}