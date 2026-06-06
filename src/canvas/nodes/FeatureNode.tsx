/**
 * TOMBSTONE — FeatureNode
 * Circle node with IEI-scaled radius and tiered glow effects.
 */

import { memo, useMemo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'motion/react'
import type { FeatureNodeData } from '@/types'
import { COLORS, getTierColor, getTierGlow } from '@/config/design-tokens'

type FeatureNodeProps = NodeProps & { data: FeatureNodeData }

export const FeatureNode = memo(({ data, selected }: FeatureNodeProps) => {
  const { label, metrics, tier, sentenced } = data
  const { iei } = metrics

  // Size: node-radius-base scaled by IEI * 3, clamped 32–120px
  const diameter = Math.max(32, Math.min(120, 40 + iei * 240))
  const color = getTierColor(tier)
  const glowSpread = getTierGlow(tier)
  const isCritical = tier === 'critical'

  // Stable random animation parameters so nodes float asynchronously
  const anim = useMemo(() => ({
    yDuration: 3 + Math.random() * 3,
    yDelay: Math.random() * -3,
    glowDuration: isCritical ? 1.5 : 2 + Math.random() * 3,
    glowDelay: Math.random() * -3,
    yOffset: -6 - Math.random() * 8,
  }), [isCritical])

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{
        scale: sentenced ? 0.6 : 1,
        opacity: sentenced ? 0.2 : 1,
        y: sentenced ? 0 : [0, anim.yOffset, 0],
        boxShadow: sentenced ? 'none' : isCritical ? [
          `0 0 ${glowSpread}px ${color}, 0 0 ${glowSpread * 1.5}px ${color}`,
          `0 0 ${glowSpread * 1.5}px ${color}, 0 0 ${glowSpread * 2.5}px ${color}`,
          `0 0 ${glowSpread}px ${color}, 0 0 ${glowSpread * 1.5}px ${color}`
        ] : [
          `0 0 ${glowSpread * 0.6}px ${color}`,
          `0 0 ${glowSpread * 1.3}px ${color}`,
          `0 0 ${glowSpread * 0.6}px ${color}`
        ],
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { type: 'spring', stiffness: 300, damping: 20 },
        y: sentenced ? { duration: 0.3 } : {
          duration: anim.yDuration,
          delay: anim.yDelay,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        boxShadow: sentenced ? { duration: 0.3 } : {
          duration: anim.glowDuration,
          delay: anim.glowDelay,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      style={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        background: `radial-gradient(circle at 40% 35%, ${COLORS.bulkhead}, ${COLORS.slab})`,
        border: `1.5px solid ${sentenced ? COLORS.razorDim : color}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        outline: selected ? `2px solid ${COLORS.razor}` : 'none',
        outlineOffset: '3px',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />

      {sentenced && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '8px',
          fontWeight: 700,
          color: COLORS.razor,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>
          [DEPRECATED]
        </div>
      )}

      {/* Node label below */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        fontWeight: 400,
        color: COLORS.chalk,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        maxWidth: 150,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {label}
      </div>

      {/* IEI sub-label */}
      <div style={{
        position: 'absolute',
        bottom: -34,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '9px',
        color: COLORS.concrete,
        whiteSpace: 'nowrap',
      }}>
        IEI {iei.toFixed(3)}
      </div>
    </motion.div>
  )
})

FeatureNode.displayName = 'FeatureNode'
