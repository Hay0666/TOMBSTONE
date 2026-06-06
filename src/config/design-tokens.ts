/**
 * TOMBSTONE — Design Tokens
 * All visual constants defined once. No agent invents a color or spacing value.
 * Import from this module. Never hardcode visual values in components.
 */

export const COLORS = {
  // ── VOID LAYER ──
  void: '#0A0A0C',
  bunker: '#0F0F11',
  slab: '#1A1A1E',
  bulkhead: '#242428',
  fog: '#3A3A40',

  // ── TYPE LAYER ──
  chalk: '#E8E8EC',
  concrete: '#8A8A92',
  ash: '#4A4A52',

  // ── SIGNAL LAYER ──
  razor: '#FF5500',
  razorDim: '#CC4400',
  razorGlow: 'rgba(255,85,0,0.25)',

  // ── STATUS LAYER ──
  critical: '#FF3333',
  degraded: '#FF8800',
  nominal: '#33FF88',
  ghostNode: 'rgba(255,85,0,0.08)',
} as const

export const SPACING = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  24: '96px',
} as const

export const TYPOGRAPHY = {
  family: "'JetBrains Mono', monospace",

  display: {
    fontSize: 'clamp(2rem, 4vw, 5rem)',
    letterSpacing: '0.08em',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  metricValue: {
    fontSize: 'clamp(3rem, 6vw, 8rem)',
    fontWeight: 300,
    letterSpacing: '-0.02em',
  },
  body: {
    fontSize: '12px',
    lineHeight: '1.6',
    letterSpacing: '0.03em',
  },
  terminal: {
    fontSize: '11px',
    lineHeight: '1.8',
    letterSpacing: '0.03em',
  },
  label: {
    fontSize: '9px',
    letterSpacing: '0.08em',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
} as const

export const COMPONENTS = {
  node: {
    radiusBase: 40,
    borderWidth: 1.5,
    glowSpread: 12,
  },
  edge: {
    widthBase: 2,
    widthMax: 8,
  },
  panel: {
    width: 420,
    border: `1px solid ${COLORS.bulkhead}`,
    backdropBlur: 'blur(8px)',
  },
  blade: {
    stroke: 2,
    color: COLORS.razor,
    glow: `0 0 16px ${COLORS.razorGlow}`,
  },
  statusBar: {
    height: 32,
  },
} as const

export const ANIMATION = {
  nodeEntryStagger: 30,
  nodeEntrySpring: { stiffness: 300, damping: 20 },
  sentenceSpring: { stiffness: 400, damping: 15 },
  typewriterSpeed: 40,
  loadingMinDuration: 1800,
  hoverTooltipDelay: 400,
  criticalPulseDuration: 1.5,
  bladePulseDuration: 0.5,
  edgeFlowDuration: 4,
} as const

/** Entropy tier classification */
export function getEntryTier(iei: number): 'nominal' | 'invisible' | 'degraded' | 'critical' {
  if (iei < 0.25) return 'nominal'
  if (iei < 0.55) return 'invisible'
  if (iei < 0.85) return 'degraded'
  return 'critical'
}

/** Get color for a given entropy tier */
export function getTierColor(tier: 'nominal' | 'invisible' | 'degraded' | 'critical'): string {
  switch (tier) {
    case 'nominal': return COLORS.nominal
    case 'invisible': return COLORS.fog
    case 'degraded': return COLORS.degraded
    case 'critical': return COLORS.critical
  }
}

/** Get glow spread for a given entropy tier */
export function getTierGlow(tier: 'nominal' | 'invisible' | 'degraded' | 'critical'): number {
  switch (tier) {
    case 'nominal': return 4
    case 'invisible': return 0
    case 'degraded': return 8
    case 'critical': return 16
  }
}
