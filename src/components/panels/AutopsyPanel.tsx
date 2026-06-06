/**
 * TOMBSTONE — Autopsy Panel
 * Right-edge slide-out panel displaying mathematical metrics per node.
 */

import { type FC, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '@/store'
import { MetricBadge, StatusPill, Divider } from '@/components/ui'
import { getEntryTier, COLORS } from '@/config/design-tokens'
import type { FeatureNodeData, NodeStatus } from '@/types'

/** SVG Sparkline — 90-day interaction frequency */
const Sparkline: FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const width = 380
  const height = 60
  const max = Math.max(...data, 1)
  const peakIndex = data.indexOf(Math.max(...data))

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (v / max) * height
    return `${x},${y}`
  }).join(' ')

  const peakX = (peakIndex / (data.length - 1)) * width

  return (
    <svg width={width} height={height + 16} style={{ display: 'block' }}>
      {/* Area fill */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`${color}15`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.8}
      />
      {/* Peak marker */}
      <line
        x1={peakX} y1={0} x2={peakX} y2={height}
        stroke={COLORS.concrete}
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.5}
      />
      <text
        x={peakX + 4}
        y={10}
        fill={COLORS.concrete}
        fontSize="8"
        fontFamily="JetBrains Mono"
      >
        PEAK USAGE
      </text>
    </svg>
  )
}

export const AutopsyPanel: FC = () => {
  const autopsyPanelOpen = useStore(s => s.autopsyPanelOpen)
  const autopsyNodeId = useStore(s => s.autopsyNodeId)
  const nodes = useStore(s => s.nodes)
  const edges = useStore(s => s.edges)
  const closeAutopsyPanel = useStore(s => s.closeAutopsyPanel)
  const openAutopsyPanel = useStore(s => s.openAutopsyPanel)

  const node = useMemo(
    () => nodes.find(n => n.id === autopsyNodeId),
    [nodes, autopsyNodeId]
  )

  const connectedNodes = useMemo(() => {
    if (!autopsyNodeId) return []
    const connectedIds = new Set<string>()
    edges.forEach(e => {
      if (e.source === autopsyNodeId) connectedIds.add(e.target)
      if (e.target === autopsyNodeId) connectedIds.add(e.source)
    })
    return nodes.filter(n => connectedIds.has(n.id))
  }, [autopsyNodeId, edges, nodes])

  const data = node?.data as FeatureNodeData | undefined

  return (
    <AnimatePresence>
      {autopsyPanelOpen && data && (
        <motion.div
          initial={{ x: 420 }}
          animate={{ x: 0 }}
          exit={{ x: 420 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 420,
            height: '100vh',
            background: COLORS.slab,
            borderLeft: `2px solid ${COLORS.razor}`,
            zIndex: 7000,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 20px 12px',
            borderBottom: `1px solid ${COLORS.bulkhead}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <div>
              <div style={{
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: COLORS.concrete,
                marginBottom: '4px',
              }}>
                AUTOPSY REPORT
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: COLORS.chalk,
                lineHeight: 1.2,
              }}>
                {data.label}
              </div>
            </div>
            <button
              onClick={closeAutopsyPanel}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.concrete,
                fontSize: '14px',
                cursor: 'pointer',
                padding: '4px 8px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              [×]
            </button>
          </div>

          {/* Status */}
          <div style={{ padding: '12px 20px' }}>
            <StatusPill status={data.status} />
          </div>

          {/* Metrics */}
          <div style={{ padding: '0 20px' }}>
            <MetricBadge
              abbreviation="IEI"
              fullName="Interaction Entropy Index"
              value={data.metrics.iei}
              tier={data.tier}
            />
            <MetricBadge
              abbreviation="VDI"
              fullName="Value Drift Index"
              value={data.metrics.vdi}
              tier={getEntryTier(data.metrics.vdi)}
            />
            <MetricBadge
              abbreviation="PAM"
              fullName="Procedure Adherence Metric"
              value={data.metrics.pam}
              tier={getEntryTier(data.metrics.pam)}
            />
            <MetricBadge
              abbreviation="ΔΦ"
              fullName="Cognitive Load Release"
              value={data.metrics.deltaPhi}
              maxValue={5}
              tier="nominal"
            />
          </div>

          {/* Interaction Archaeology */}
          <div style={{ padding: '16px 20px' }}>
            <Divider label="INTERACTION ARCHAEOLOGY" />
            <div style={{
              fontSize: '9px',
              color: COLORS.concrete,
              marginBottom: '8px',
              letterSpacing: '0.04em',
            }}>
              90-DAY INTERACTION FREQUENCY
            </div>
            <Sparkline
              data={data.sparkline}
              color={data.tier === 'critical' ? COLORS.critical
                : data.tier === 'degraded' ? COLORS.degraded
                : COLORS.nominal}
            />
          </div>

          {/* Connected Features */}
          <div style={{ padding: '16px 20px', flex: 1 }}>
            <Divider label="CONNECTED FEATURES" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {connectedNodes.map(cn => {
                const cnData = cn.data as FeatureNodeData
                return (
                  <button
                    key={cn.id}
                    onClick={() => openAutopsyPanel(cn.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 0',
                      textAlign: 'left',
                      width: '100%',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <StatusPill status={cnData.status} size="sm" />
                    <span style={{
                      fontSize: '11px',
                      color: COLORS.chalk,
                      flex: 1,
                    }}>
                      {cnData.label}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      color: COLORS.concrete,
                    }}>
                      {cnData.metrics.iei.toFixed(3)}
                    </span>
                  </button>
                )
              })}
              {connectedNodes.length === 0 && (
                <div style={{ fontSize: '10px', color: COLORS.ash }}>
                  NO CONNECTED FEATURES
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
