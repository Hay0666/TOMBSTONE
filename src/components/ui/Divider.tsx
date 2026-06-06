import { type FC } from 'react'

interface DividerProps {
  label?: string
}

export const Divider: FC<DividerProps> = ({ label }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '8px 0',
  }}>
    <div style={{
      flex: 1,
      height: '1px',
      background: 'var(--color-bulkhead)',
    }} />
    {label && (
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '9px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-concrete)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    )}
    {label && (
      <div style={{
        flex: 1,
        height: '1px',
        background: 'var(--color-bulkhead)',
      }} />
    )}
  </div>
)
