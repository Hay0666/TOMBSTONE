/**
 * TOMBSTONE — Status Bar
 * 32px footer with live Zustand subscriptions.
 */

import { type FC, useState, useEffect } from 'react'
import { useStore } from '@/store'
import { COLORS } from '@/config/design-tokens'

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const StatusBar: FC = () => {
  const nodes = useStore(s => s.nodes)
  const sentencedNodeIds = useStore(s => s.sentencedNodeIds)
  const razorMode = useStore(s => s.razorMode)
  const sessionStartTime = useStore(s => s.sessionStartTime)
  const [elapsed, setElapsed] = useState(0)

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - sessionStartTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStartTime])

  // Compute average IEI
  const activeNodes = nodes.filter(n => !sentencedNodeIds.includes(n.id))
  const avgIEI = activeNodes.length > 0
    ? activeNodes.reduce((sum, n) => sum + n.data.metrics.iei, 0) / activeNodes.length
    : 0

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '32px',
      background: COLORS.slab,
      borderTop: `1px solid ${COLORS.bulkhead}`,
      zIndex: 6000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '9px',
      letterSpacing: '0.04em',
      color: COLORS.concrete,
    }}>
      {/* Left: Version */}
      <div>
        TOMBSTONE v1.0 — GRAVEYARD ACTIVE
      </div>

      {/* Center: Live metrics */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>NODES: {activeNodes.length}</span>
        <span style={{ color: sentencedNodeIds.length > 0 ? COLORS.razor : undefined }}>
          SENTENCED: {sentencedNodeIds.length}
        </span>
        <span>IEI AVG: {avgIEI.toFixed(3)}</span>
      </div>

      {/* Right: Razor mode + timer */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{
          color: razorMode !== 'NOMINAL' ? COLORS.razor : undefined,
          fontWeight: razorMode !== 'NOMINAL' ? 700 : 400,
        }}>
          RAZOR: {razorMode}
        </span>
        <span>{formatTime(elapsed)}</span>
      </div>
    </div>
  )
}
