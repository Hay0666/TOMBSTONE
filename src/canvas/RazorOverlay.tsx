/**
 * TOMBSTONE — Razor Overlay
 * SVG overlay rendering the blade path during RAZOR_ARMED/DRAWING/EXECUTING modes.
 */

import { type FC, useCallback, useEffect, useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useStore } from '@/store'
import { getIntersectedNodesPolyline } from '@/engine/razorGeometry'
import { computeDeltaPhiBatch } from '@/engine/metrics'
import { COLORS } from '@/config/design-tokens'
import { track } from '@/telemetry'
import type { FeatureNodeData } from '@/types'

export const RazorOverlay: FC = () => {
  const razorMode = useStore(s => s.razorMode)
  const razorPath = useStore(s => s.razorPath)
  const razorCursor = useStore(s => s.razorCursor)
  const startRazorPath = useStore(s => s.startRazorPath)
  const addPointToRazorPath = useStore(s => s.addPointToRazorPath)
  const updateRazorCursor = useStore(s => s.updateRazorCursor)
  const setTargetedNodes = useStore(s => s.setTargetedNodes)
  const executeRazor = useStore(s => s.executeRazor)
  const resetRazor = useStore(s => s.resetRazor)
  const setLastSentenced = useStore(s => s.setLastSentenced)
  const sentenceNodes = useStore(s => s.sentenceNodes)
  const nodes = useStore(s => s.nodes)
  const openAutopsyPanel = useStore(s => s.openAutopsyPanel)
  const addToast = useStore(s => s.addToast)

  const { screenToFlowPosition } = useReactFlow()

  const [bladeFlash, setBladeFlash] = useState(false)
  const [bladeVisible, setBladeVisible] = useState(true)

  // Mouse move handler for tracking cursor position and path
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (razorMode === 'RAZOR_ARMED' || razorMode === 'DRAWING') {
      updateRazorCursor({ x: e.clientX, y: e.clientY })

      if (razorMode === 'DRAWING' && razorPath.length > 0) {
        const currentPath = [...razorPath, { x: e.clientX, y: e.clientY }]
        const flowPath = currentPath.map(p => screenToFlowPosition(p))

        const nodeBounds = nodes
          .filter(n => !n.data.sentenced)
          .map(n => {
            const radius = n.width ? n.width / 2 : Math.max(16, Math.min(60, 20 + n.data.metrics.iei * 120))
            return {
              id: n.id,
              x: n.position.x + radius, // Exact center in flow space
              y: n.position.y + radius,
              radius: radius,
            }
          })

        const intersected = getIntersectedNodesPolyline(
          flowPath,
          nodeBounds,
        )
        setTargetedNodes(intersected)
      }
    }
  }, [razorMode, razorPath, nodes, updateRazorCursor, setTargetedNodes])

  // Execute cut
  const executeCut = useCallback(() => {
    if (razorMode === 'DRAWING') {
      const finalPath = razorPath

      // We need at least 2 points to form a cut vector
      if (finalPath.length < 2) {
        resetRazor()
        track({
          event: 'razor_disarmed',
          properties: { reason: 'user_cancel' },
        })
        addToast({ content: 'RAZOR DISARMED — INVALID CUT VECTOR', status: 'razor', duration: 2000 })
        return
      }

      const flowPath = finalPath.map(p => screenToFlowPosition(p))

      const nodeBounds = nodes
        .filter(n => !n.data.sentenced)
        .map(n => {
          const radius = n.width ? n.width / 2 : Math.max(16, Math.min(60, 20 + n.data.metrics.iei * 120))
          return {
            id: n.id,
            x: n.position.x + radius,
            y: n.position.y + radius,
            radius: radius,
          }
        })

      const intersected = getIntersectedNodesPolyline(
        flowPath,
        nodeBounds,
      )

      if (intersected.length === 0) {
        resetRazor()
        track({
          event: 'razor_disarmed',
          properties: { reason: 'no_targets' },
        })
        addToast({ content: 'RAZOR DISARMED — NO TARGETS ACQUIRED', status: 'razor', duration: 2000 })
        return
      }

      // Execute cascade sequence
      executeRazor()

      // t=0ms: Blade flash white
      setBladeFlash(true)
      setTimeout(() => setBladeFlash(false), 100)

      // Pre-calculate ΔΦ using the live nodes at the moment of the cut
      const { totalDeltaPhi, nodeDeltaPhis } = computeDeltaPhiBatch(nodes, intersected)

      const totalIEICut = intersected.reduce((sum, id) => {
        const node = nodes.find(n => n.id === id)
        return sum + ((node?.data as FeatureNodeData)?.metrics?.iei ?? 0)
      }, 0)

      track({
        event: 'razor_executed',
        properties: {
          nodesSentenced: intersected.length,
          totalIEICut: Math.round(totalIEICut * 1000) / 1000,
          deltaPhiBits: Math.round(totalDeltaPhi * 100) / 100,
          sentencedNodeIds: intersected.join(','),
        },
      })

      // t=100ms: Sentence nodes
      setTimeout(() => {
        sentenceNodes(intersected, nodeDeltaPhis)
        setLastSentenced(intersected)
      }, 100)

      // t=400ms: Toast notification
      setTimeout(() => {
        const pathways = intersected.length * 4 // approximate interaction pathways

        addToast({
          content: `✦ DEPRECATION EXECUTED\n${pathways} INTERACTION PATHWAYS SEVERED\nCOGNITIVE LOAD RELEASE: ΔΦ = +${totalDeltaPhi.toFixed(2)} BITS\nPROCEED TO COMMIT OBSEQUIES? [ENTER] / [ESC]`,
          status: 'critical',
          duration: 10000,
        })
      }, 400)

      // t=600ms: Auto-open panel for first sentenced node
      setTimeout(() => {
        if (intersected.length > 0) {
          openAutopsyPanel(intersected[0])
          const autoNode = nodes.find(n => n.id === intersected[0])
          track({
            event: 'autopsy_panel_viewed',
            properties: {
              nodeId: intersected[0],
              nodeIEI: (autoNode?.data as FeatureNodeData)?.metrics?.iei ?? 0,
              nodeStatus: (autoNode?.data as FeatureNodeData)?.status ?? 'unknown',
              activationMethod: 'auto',
            },
          })
        }
      }, 600)

      // t=800ms: Reset razor mode, dissolve blade
      setTimeout(() => {
        setBladeVisible(false)
        setTimeout(() => {
          resetRazor()
          setBladeVisible(true)
        }, 300)
      }, 800)
    }
  }, [razorMode, razorPath, nodes, executeRazor, resetRazor, sentenceNodes, setLastSentenced, addToast, openAutopsyPanel])

  // Left click: Add point to path
  const handleClick = useCallback((e: MouseEvent) => {
    // Only respond to left clicks
    if (e.button !== 0) return;

    if (razorMode === 'RAZOR_ARMED') {
      startRazorPath({ x: e.clientX, y: e.clientY })
    } else if (razorMode === 'DRAWING') {
      addPointToRazorPath({ x: e.clientX, y: e.clientY })
    }
  }, [razorMode, startRazorPath, addPointToRazorPath])

  // Right click: Execute the cut
  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (razorMode === 'DRAWING' || razorMode === 'RAZOR_ARMED') {
      e.preventDefault() // prevent context menu
      if (razorMode === 'DRAWING') {
        executeCut()
      } else {
        resetRazor()
      }
    }
  }, [razorMode, executeCut, resetRazor])

  useEffect(() => {
    if (razorMode !== 'NOMINAL') {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('click', handleClick)
      window.addEventListener('contextmenu', handleContextMenu)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('click', handleClick)
        window.removeEventListener('contextmenu', handleContextMenu)
      }
    }
  }, [razorMode, handleMouseMove, handleClick, handleContextMenu])

  if (razorMode === 'NOMINAL' && bladeVisible) return null

  let pathD = ''
  if (razorPath.length > 0) {
    pathD = `M ${razorPath[0].x} ${razorPath[0].y} `
    for (let i = 1; i < razorPath.length; i++) {
      pathD += `L ${razorPath[i].x} ${razorPath[i].y} `
    }
    if (razorMode === 'DRAWING') {
      pathD += `L ${razorCursor.x} ${razorCursor.y} `
    }
  }

  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 8000,
        opacity: bladeVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Crosshair at cursor position (RAZOR_ARMED mode) */}
      {razorMode === 'RAZOR_ARMED' && (
        <g>
          <line
            x1={razorCursor.x - 12} y1={razorCursor.y}
            x2={razorCursor.x + 12} y2={razorCursor.y}
            stroke={COLORS.razor} strokeWidth={1} opacity={0.8}
          />
          <line
            x1={razorCursor.x} y1={razorCursor.y - 12}
            x2={razorCursor.x} y2={razorCursor.y + 12}
            stroke={COLORS.razor} strokeWidth={1} opacity={0.8}
          />
          <circle
            cx={razorCursor.x} cy={razorCursor.y} r={6}
            fill="none" stroke={COLORS.razor} strokeWidth={1} opacity={0.5}
          />
        </g>
      )}

      {/* Blade polyline (DRAWING or EXECUTING mode) */}
      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke={bladeFlash ? '#FFFFFF' : COLORS.razor}
          strokeWidth={bladeFlash ? 3 : 2}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={razorMode === 'DRAWING' ? '8 4' : 'none'}
          opacity={bladeFlash ? 1 : 0.9}
          style={{
            filter: `drop-shadow(0 0 8px ${bladeFlash ? '#FFFFFF' : COLORS.razorGlow})`,
            animation: razorMode === 'DRAWING' ? 'blade-pulse 0.5s ease-in-out infinite' : undefined,
          }}
        />
      )}

      {/* Origin point marker */}
      {razorPath.length > 0 && razorMode !== 'RAZOR_ARMED' && (
        <circle
          cx={razorPath[0].x} cy={razorPath[0].y} r={4}
          fill={COLORS.razor}
          style={{ filter: `drop-shadow(0 0 6px ${COLORS.razorGlow})` }}
        />
      )}
    </svg>
  )
}
