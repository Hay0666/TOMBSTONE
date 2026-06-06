import { type FC } from 'react'

/**
 * ScanlineOverlay — Subtle CRT horizontal scanline texture.
 * Position: fixed, pointer-events: none, z-index: 9997.
 * Opacity: 1.5% via repeating linear gradient.
 */
export const ScanlineOverlay: FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9997,
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    }}
  />
)
