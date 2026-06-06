import { type FC } from 'react'
import type { EntropyTier } from '@/types'
import { getTierColor } from '@/config/design-tokens'

interface MetricBadgeProps {
  abbreviation: string
  fullName: string
  value: number
  maxValue?: number
  tier: EntropyTier
}

export const MetricBadge: FC<MetricBadgeProps> = ({
  abbreviation,
  fullName,
  value,
  maxValue = 1,
  tier,
}) => {
  const color = getTierColor(tier)
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '12px 0',
      borderBottom: '1px solid var(--color-bulkhead)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '11px',
          letterSpacing: '0.04em',
          color: 'var(--color-razor)',
          fontWeight: 500,
        }}>
          {abbreviation}
        </span>
        <span style={{
          fontSize: '10px',
          color: 'var(--color-concrete)',
          flex: 1,
        }}>
          {fullName}
        </span>
        <span style={{
          fontSize: '28px',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'var(--color-chalk)',
          lineHeight: 1,
        }}>
          {value.toFixed(3)}
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '1px',
        background: 'var(--color-bulkhead)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${percentage}%`,
          background: color,
          transition: 'width 0.6s ease-out',
        }} />
      </div>
    </div>
  )
}
