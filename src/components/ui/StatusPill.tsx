import { type FC } from 'react'
import type { NodeStatus } from '@/types'

const STATUS_COLORS: Record<NodeStatus, string> = {
  NOMINAL: 'var(--color-nominal)',
  DEGRADED: 'var(--color-degraded)',
  CRITICAL: 'var(--color-critical)',
  SENTENCED: 'var(--color-razor)',
}

interface StatusPillProps {
  status: NodeStatus
  size?: 'sm' | 'md'
}

export const StatusPill: FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const color = STATUS_COLORS[status]
  const fontSize = size === 'sm' ? '8px' : '9px'
  const padding = size === 'sm' ? '2px 6px' : '3px 8px'

  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color,
      border: `1px solid ${color}`,
      borderRadius: '2px',
      padding,
      background: 'transparent',
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}
