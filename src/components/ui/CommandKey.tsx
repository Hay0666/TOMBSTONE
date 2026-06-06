import { type FC } from 'react'

interface CommandKeyProps {
  keyLabel: string
}

export const CommandKey: FC<CommandKeyProps> = ({ keyLabel }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    color: 'var(--color-chalk)',
    border: '1px solid var(--color-fog)',
    borderRadius: '3px',
    padding: '2px 6px',
    background: 'var(--color-slab)',
    lineHeight: 1,
    minWidth: '24px',
    textAlign: 'center',
  }}>
    {keyLabel}
  </span>
)
