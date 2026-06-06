/**
 * TOMBSTONE — Commit Obsequies Terminal
 * Terminal-mode interface for generating code diffs and JSON-LD tombstone schemas.
 */

import { type FC, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '@/store'
import { useTypewriter } from '@/hooks/useTypewriter'
import { generateDiff, generateCommitMessage } from '@/engine/diffGenerator'
import { COLORS } from '@/config/design-tokens'
import { toSlug } from '@/engine/tombstoneSchema'
import { exportBundle } from '@/utils/exportBundle'
import type { FeatureNodeData } from '@/types'

function buildTerminalLines(sentencedNodes: Array<{ id: string; data: FeatureNodeData }>): string[] {
  const timestamp = new Date().toISOString()
  const lines: string[] = [
    `> INITIALIZING DEPRECATION MANIFEST...`,
    `> SCANNING SENTENCED NODES: ${sentencedNodes.map(n => n.id).join(', ')}`,
    `> COMPUTING DEPENDENCY GRAPH DELTA...`,
    '',
  ]

  // Add diff for each sentenced node
  for (const node of sentencedNodes) {
    const diff = generateDiff({
      id: node.id,
      name: node.data.label,
      metrics: node.data.metrics,
      deprecatedAt: timestamp,
    })
    lines.push(...diff.split('\n'))
  }

  // Add tombstone schema generation
  for (const node of sentencedNodes) {
    lines.push(`> WRITING: /public/tombstone-schema/${toSlug(node.data.label)}.jsonld`)
    lines.push(`> STATUS: COMPLETE`)
    lines.push('')
  }

  // Add commit message
  const commitMsg = generateCommitMessage(
    sentencedNodes.map(n => ({
      id: n.id,
      name: n.data.label,
      metrics: n.data.metrics,
      deprecatedAt: timestamp,
    }))
  )
  lines.push('── COMMIT MESSAGE GENERATED ────────────────────────────────────')
  lines.push(...commitMsg.split('\n'))
  lines.push('')
  lines.push('> MANIFEST SEALED.')
  lines.push('> PRESS [↓] TO EXPORT BUNDLE.')

  return lines
}

export const CommitObsequies: FC = () => {
  const terminalOpen = useStore(s => s.terminalOpen)
  const closeTerminal = useStore(s => s.closeTerminal)
  const setTerminalComplete = useStore(s => s.setTerminalComplete)
  const terminalComplete = useStore(s => s.terminalComplete)
  const sentencedNodeIds = useStore(s => s.sentencedNodeIds)
  const nodes = useStore(s => s.nodes)

  const sentencedNodes = useMemo(
    () => nodes.filter(n => sentencedNodeIds.includes(n.id)),
    [nodes, sentencedNodeIds]
  )

  const terminalLines = useMemo(
    () => buildTerminalLines(sentencedNodes as Array<{ id: string; data: FeatureNodeData }>),
    [sentencedNodes]
  )

  const onComplete = useCallback(() => {
    setTerminalComplete(true)
  }, [setTerminalComplete])

  const { displayedLines, currentText, isTyping, start } = useTypewriter(terminalLines, {
    speed: 20,
    lineDelay: 60,
    onComplete,
  })

  useEffect(() => {
    if (terminalOpen && sentencedNodes.length > 0) {
      start()
    }
  }, [terminalOpen, sentencedNodes.length, start])

  const handleExport = useCallback(async () => {
    const timestamp = new Date().toISOString()
    await exportBundle(
      sentencedNodes.map(n => ({
        id: n.id,
        name: (n.data as FeatureNodeData).label,
        metrics: (n.data as FeatureNodeData).metrics,
        deprecatedAt: timestamp,
      })),
      terminalLines.join('\n'),
    )
  }, [sentencedNodes, terminalLines])

  const sessionId = useMemo(() => new Date().toISOString().replace(/[:.]/g, '-'), [])

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45vh',
            background: COLORS.void,
            borderTop: `2px solid ${COLORS.razor}`,
            zIndex: 7500,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
            borderBottom: `1px solid ${COLORS.bulkhead}`,
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: COLORS.razor,
            }}>
              TOMBSTONE COMMIT OBSEQUIES — SESSION {sessionId}
            </span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {terminalComplete && (
                <button
                  onClick={handleExport}
                  style={{
                    background: COLORS.razor,
                    border: 'none',
                    color: COLORS.void,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  [↓] EXPORT
                </button>
              )}
              <button
                onClick={closeTerminal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.concrete,
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                [ESC] CLOSE
              </button>
            </div>
          </div>

          {/* Terminal output */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '12px 16px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            lineHeight: '1.8',
            color: COLORS.nominal,
          }}>
            {displayedLines.map((line, i) => (
              <div key={i} style={{
                whiteSpace: 'pre',
                minHeight: '1.8em',
                color: line.startsWith('──') ? COLORS.concrete
                  : line.startsWith('-') || line.includes('[REMOVE]') ? COLORS.critical
                  : line.startsWith('+') || line.startsWith('> WRITING') ? COLORS.nominal
                  : line.startsWith('> STATUS') ? COLORS.razor
                  : COLORS.nominal,
              }}>
                {line}
              </div>
            ))}
            {/* Current line being typed */}
            {isTyping && (
              <div style={{
                whiteSpace: 'pre',
                minHeight: '1.8em',
                color: COLORS.nominal,
              }}>
                {currentText}
                <span style={{
                  animation: 'blink 0.8s step-end infinite',
                  color: COLORS.nominal,
                }}>
                  |
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
