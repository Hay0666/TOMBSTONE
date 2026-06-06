/**
 * TOMBSTONE — TombstoneNode
 * Post-deprecation collapsed state. Opacity 0.2, scale 0.6, [DEPRECATED] overlay.
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { FeatureNodeData } from '@/types'
import { COLORS } from '@/config/design-tokens'

type TombstoneNodeProps = NodeProps & { data: FeatureNodeData }

export const TombstoneNode = memo(({ data }: TombstoneNodeProps) => {
  const { label, metrics } = data
  const diameter = Math.max(32, Math.min(120, 40 + metrics.iei * 240))

  return (
    <div
      style={{
        width: diameter * 0.6,
        height: diameter * 0.6,
        borderRadius: '50%',
        background: COLORS.slab,
        border: `1px dashed ${COLORS.razorDim}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity: 0.3,
        cursor: 'pointer',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.opacity = '0.6'
        el.style.transform = 'scale(1.3)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.opacity = '0.3'
        el.style.transform = 'scale(1)'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />

      <div style={{
        fontSize: '7px',
        fontWeight: 700,
        color: COLORS.razor,
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
        textAlign: 'center',
      }}>
        ✝
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: -18,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '8px',
        color: COLORS.razorDim,
        whiteSpace: 'nowrap',
        textDecoration: 'line-through',
        opacity: 0.6,
      }}>
        {label}
      </div>
    </div>
  )
})

TombstoneNode.displayName = 'TombstoneNode'
