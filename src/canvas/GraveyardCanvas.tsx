/**
 * TOMBSTONE — Graveyard Canvas
 * Core infinite graph workspace. Heart of the application.
 */

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  type NodeTypes,
  type EdgeTypes,
  type NodeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from '@/store'
import { FeatureNode } from './nodes/FeatureNode'
import { ClusterNode } from './nodes/ClusterNode'
import { TombstoneNode } from './nodes/TombstoneNode'
import { PipelineEdge } from './edges/PipelineEdge'
import { RazorOverlay } from './RazorOverlay'
import { COLORS } from '@/config/design-tokens'

const nodeTypes: NodeTypes = {
  feature: FeatureNode as unknown as NodeTypes['feature'],
  cluster: ClusterNode as unknown as NodeTypes['cluster'],
  tombstone: TombstoneNode as unknown as NodeTypes['tombstone'],
}

const edgeTypes: EdgeTypes = {
  pipeline: PipelineEdge as unknown as EdgeTypes['pipeline'],
}

function getMiniMapNodeColor(node: { data?: { tier?: string; sentenced?: boolean } }): string {
  if (node.data?.sentenced) return COLORS.razorDim
  switch (node.data?.tier) {
    case 'critical': return COLORS.critical
    case 'degraded': return COLORS.degraded
    case 'nominal': return COLORS.nominal
    default: return COLORS.fog
  }
}

function GraveyardCanvasInner() {
  const nodes = useStore(s => s.nodes)
  const edges = useStore(s => s.edges)
  const razorMode = useStore(s => s.razorMode)
  const openAutopsyPanel = useStore(s => s.openAutopsyPanel)
  const setHoveredNode = useStore(s => s.setHoveredNode)
  const autopsyPanelOpen = useStore(s => s.autopsyPanelOpen)

  const reactFlow = useReactFlow()

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    if (razorMode === 'NOMINAL') {
      openAutopsyPanel(node.id)
    }
  }, [razorMode, openAutopsyPanel])

  const onNodeMouseEnter: NodeMouseHandler = useCallback((_event, node) => {
    const nodePos = node.position
    setHoveredNode(node.id, { x: nodePos.x, y: nodePos.y })
  }, [setHoveredNode])

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNode(null, null)
  }, [setHoveredNode])

  const canvasWidth = autopsyPanelOpen ? 'calc(100vw - 420px)' : '100vw'

  const defaultViewport = useMemo(() => ({ x: 0, y: 100, zoom: 0.75 }), [])

  return (
    <div
      role="application"
      aria-label="Feature Entropy Graveyard"
      className={razorMode !== 'NOMINAL' ? 'cursor-razor' : ''}
      style={{
        width: canvasWidth,
        height: '100vh',
        transition: 'width 0.3s ease',
        position: 'relative',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        minZoom={0.1}
        maxZoom={4}
        panOnScroll
        panOnDrag={razorMode === 'NOMINAL'}
        selectionOnDrag={false}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={razorMode === 'NOMINAL'}
        nodesConnectable={false}
        elementsSelectable={razorMode === 'NOMINAL'}
      >
        <Background
          variant={"dots" as any}
          color="rgba(255,85,0,0.08)"
          size={1}
          gap={32}
        />
        <MiniMap
          nodeColor={getMiniMapNodeColor as any}
          nodeBorderRadius={100}
          maskColor="rgba(10,10,12,0.85)"
          style={{
            position: 'absolute',
            bottom: 40,
            right: 16,
            width: 180,
            height: 120,
            background: COLORS.bunker,
            border: `1px solid ${COLORS.bulkhead}`,
            borderRadius: 4,
          }}
        />
      </ReactFlow>
      <RazorOverlay />
    </div>
  )
}

export function GraveyardCanvas() {
  return (
    <ReactFlowProvider>
      <GraveyardCanvasInner />
    </ReactFlowProvider>
  )
}
