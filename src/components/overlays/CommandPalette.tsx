/**
 * TOMBSTONE — Command Palette
 * Fuzzy search over all node names. Triggered by [/].
 */

import { type FC, useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '@/store'
import { StatusPill } from '@/components/ui'
import { COLORS } from '@/config/design-tokens'
import type { FeatureNodeData } from '@/types'
import { track } from '@/telemetry'

export const CommandPalette: FC = () => {
  const isOpen = useStore(s => s.commandPaletteOpen)
  const close = useStore(s => s.closeCommandPalette)
  const nodes = useStore(s => s.nodes)
  const openAutopsyPanel = useStore(s => s.openAutopsyPanel)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const filtered = useMemo(() => {
    if (!query) return nodes
    const q = query.toLowerCase()
    return nodes.filter(n =>
      (n.data as FeatureNodeData).label.toLowerCase().includes(q) ||
      n.id.toLowerCase().includes(q)
    )
  }, [nodes, query])

  const handleSelect = (nodeId: string) => {
    openAutopsyPanel(nodeId)
    track({
      event: 'command_palette_search',
      properties: {
        query,
        resultsCount: filtered.length,
        selectedNodeId: nodeId,
        totalNodes: nodes.length,
      },
    })
    close()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,10,12,0.7)',
              zIndex: 8500,
            }}
          />
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            style={{
              position: 'fixed',
              top: '20vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 520,
              maxHeight: '50vh',
              background: COLORS.slab,
              border: `1px solid ${COLORS.bulkhead}`,
              zIndex: 8600,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Search input */}
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${COLORS.bulkhead}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '11px', color: COLORS.razor }}>/</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') close()
                  if (e.key === 'Enter' && filtered.length > 0) {
                    handleSelect(filtered[0].id)
                  }
                }}
                placeholder="SEARCH NODES..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: COLORS.chalk,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  letterSpacing: '0.04em',
                }}
              />
            </div>
            {/* Results */}
            <div style={{ overflow: 'auto', maxHeight: '40vh' }}>
              {filtered.map(node => {
                const data = node.data as FeatureNodeData
                return (
                  <button
                    key={node.id}
                    onClick={() => handleSelect(node.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${COLORS.bulkhead}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: "'JetBrains Mono', monospace",
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = COLORS.bunker)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <StatusPill status={data.status} size="sm" />
                    <span style={{ flex: 1, fontSize: '11px', color: COLORS.chalk }}>
                      {data.label}
                    </span>
                    <span style={{ fontSize: '9px', color: COLORS.concrete }}>
                      IEI {data.metrics.iei.toFixed(3)}
                    </span>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <div style={{
                  padding: '20px 16px',
                  fontSize: '10px',
                  color: COLORS.ash,
                  textAlign: 'center',
                }}>
                  NO MATCHING NODES
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
