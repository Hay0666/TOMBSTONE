/**
 * TOMBSTONE — ClusterNode
 * Rounded rectangle grouping related features.
 */

import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import type { ClusterNodeData } from '@/types'
import { COLORS } from '@/config/design-tokens'

type ClusterNodeProps = NodeProps & { data: ClusterNodeData }

export const ClusterNode = memo(({ data }: ClusterNodeProps) => {
  const { label, aggregateIEI } = data

  return (
    <div
      style={{
        minWidth: 200,
        minHeight: 120,
        background: 'rgba(255,85,0,0.04)',
        border: `1px dashed ${COLORS.fog}`,
        borderRadius: '8px',
        padding: '12px',
        position: 'relative',
      }}
    >
      {/* Cluster label */}
      <div style={{
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: COLORS.concrete,
      }}>
        {label}
      </div>

      {/* Aggregate IEI badge */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        fontSize: '9px',
        fontWeight: 500,
        color: COLORS.razor,
        background: COLORS.slab,
        border: `1px solid ${COLORS.fog}`,
        borderRadius: '2px',
        padding: '2px 6px',
      }}>
        IEI {aggregateIEI.toFixed(3)}
      </div>
    </div>
  )
})

ClusterNode.displayName = 'ClusterNode'
