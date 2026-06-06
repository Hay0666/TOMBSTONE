/**
 * TOMBSTONE — PipelineEdge
 * Custom edge with PAM-weighted stroke and animated directional flow.
 */

import { memo } from 'react'
import { BaseEdge, getStraightPath, type EdgeProps } from '@xyflow/react'
import type { PipelineEdgeData } from '@/types'
import { COLORS } from '@/config/design-tokens'

type PipelineEdgeProps = EdgeProps & { data?: PipelineEdgeData }

/** Interpolate color between nominal (green) and degraded (orange) based on PAM */
function interpolateColor(pam: number): string {
  // Clamp PAM to [0, 1]
  const t = Math.max(0, Math.min(1, pam))
  // Nominal: #33FF88 (51, 255, 136) → Degraded: #FF8800 (255, 136, 0)
  const r = Math.round(51 + t * (255 - 51))
  const g = Math.round(255 + t * (136 - 255))
  const b = Math.round(136 + t * (0 - 136))
  return `rgb(${r}, ${g}, ${b})`
}

export const PipelineEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: PipelineEdgeProps) => {
  const pam = data?.pam ?? 0.3
  const severed = data?.severed ?? false
  const strokeWidth = severed ? 1 : 2 + pam * 6
  const color = severed ? COLORS.fog : interpolateColor(pam)
  const opacity = severed ? 0.3 : 0.7

  const [path] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: color,
          strokeWidth,
          opacity,
          strokeDasharray: severed ? '4 4' : undefined,
        }}
      />
      {/* Animated flow overlay (non-severed only) */}
      {!severed && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          strokeDasharray="6 8"
          opacity={0.4}
          style={{
            animation: 'edge-flow 4s linear infinite',
          }}
        />
      )}
      <style>{`
        @keyframes edge-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -28; }
        }
      `}</style>
    </>
  )
})

PipelineEdge.displayName = 'PipelineEdge'
