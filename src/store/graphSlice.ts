/**
 * TOMBSTONE — Graph Slice
 * Zustand state for all canvas nodes, edges, selection, and sentence tracking.
 */

import type { StateCreator } from 'zustand'
import type { Node, Edge } from '@xyflow/react'
import type { FeatureNodeData, PipelineEdgeData, Point } from '@/types'
import { computeIEI, computePAM, computeVDI } from '@/engine/metrics'
import { getEntryTier } from '@/config/design-tokens'
import { SEED_NODES, SEED_EDGES } from './seedData'

export interface GraphSlice {
  nodes: Node<FeatureNodeData>[]
  edges: Edge<PipelineEdgeData>[]
  selectedNodeIds: string[]
  sentencedNodeIds: string[]
  hoveredNodeId: string | null
  hoverPosition: Point | null

  // Actions
  selectNode: (id: string) => void
  deselectAll: () => void
  sentenceNodes: (ids: string[], deltaPhis?: Record<string, number>) => void
  restoreNodes: (ids: string[]) => void
  setHoveredNode: (id: string | null, position?: Point | null) => void
  getNodeById: (id: string) => Node<FeatureNodeData> | undefined
}

function buildNodes(): Node<FeatureNodeData>[] {
  return SEED_NODES.map(seed => {
    const iei = computeIEI(seed.interactions)
    const pam = computePAM(seed.sessionFlows, seed.idealFlow)
    const vdi = computeVDI(seed.usageVector, seed.valueVector)
    const tier = getEntryTier(iei)

    const diameter = Math.max(32, Math.min(120, 40 + iei * 240))

    return {
      id: seed.id,
      type: 'feature',
      position: seed.position,
      width: diameter,
      height: diameter,
      data: {
        label: seed.label,
        metrics: { iei, vdi, pam, deltaPhi: 0 },
        interactions: seed.interactions,
        sparkline: seed.sparkline,
        usageVector: seed.usageVector,
        valueVector: seed.valueVector,
        sessionFlows: seed.sessionFlows,
        idealFlow: seed.idealFlow,
        status: tier === 'critical' ? 'CRITICAL' : tier === 'degraded' ? 'DEGRADED' : 'NOMINAL',
        tier,
        sentenced: false,
      },
    }
  })
}

function buildEdges(): Edge<PipelineEdgeData>[] {
  return SEED_EDGES.map(seed => ({
    id: seed.id,
    source: seed.source,
    target: seed.target,
    type: 'pipeline',
    data: {
      pam: Math.random() * 0.8 + 0.1, // Random PAM for edge weight
      severed: false,
    },
  }))
}

export const createGraphSlice: StateCreator<GraphSlice, [], [], GraphSlice> = (set, get) => ({
  nodes: buildNodes(),
  edges: buildEdges(),
  selectedNodeIds: [],
  sentencedNodeIds: [],
  hoveredNodeId: null,
  hoverPosition: null,

  selectNode: (id) => set(state => ({
    selectedNodeIds: state.selectedNodeIds.includes(id)
      ? state.selectedNodeIds.filter(nid => nid !== id)
      : [...state.selectedNodeIds, id],
  })),

  deselectAll: () => set({ selectedNodeIds: [] }),

  sentenceNodes: (ids, deltaPhis) => set(state => {
    const newSentenced = [...new Set([...state.sentencedNodeIds, ...ids])]
    const newNodes = state.nodes.map(node => {
      if (ids.includes(node.id)) {
        return {
          ...node,
          type: 'tombstone' as const,
          data: {
            ...node.data,
            sentenced: true,
            status: 'SENTENCED' as const,
            metrics: {
              ...node.data.metrics,
              deltaPhi: deltaPhis?.[node.id] ?? node.data.metrics.deltaPhi,
            }
          },
        }
      }
      return node
    })
    const newEdges = state.edges.map(edge => {
      if (ids.includes(edge.source) || ids.includes(edge.target)) {
        return {
          ...edge,
          data: { ...edge.data!, severed: true },
        }
      }
      return edge
    })
    return { sentencedNodeIds: newSentenced, nodes: newNodes, edges: newEdges }
  }),

  restoreNodes: (ids) => set(state => {
    const newSentenced = state.sentencedNodeIds.filter(id => !ids.includes(id))
    const newNodes = state.nodes.map(node => {
      if (ids.includes(node.id)) {
        const tier = getEntryTier(node.data.metrics.iei)
        return {
          ...node,
          type: 'feature' as const,
          data: {
            ...node.data,
            sentenced: false,
            status: (tier === 'critical' ? 'CRITICAL' : tier === 'degraded' ? 'DEGRADED' : 'NOMINAL') as FeatureNodeData['status'],
          },
        }
      }
      return node
    })
    const newEdges = state.edges.map(edge => {
      if (ids.includes(edge.source) || ids.includes(edge.target)) {
        const otherNode = ids.includes(edge.source) ? edge.target : edge.source
        const otherSentenced = newSentenced.includes(otherNode)
        return {
          ...edge,
          data: { ...edge.data!, severed: otherSentenced },
        }
      }
      return edge
    })
    return { sentencedNodeIds: newSentenced, nodes: newNodes, edges: newEdges }
  }),

  setHoveredNode: (id, position = null) => set({
    hoveredNodeId: id,
    hoverPosition: position,
  }),

  getNodeById: (id) => get().nodes.find(n => n.id === id),
})
