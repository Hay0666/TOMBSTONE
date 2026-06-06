/**
 * TOMBSTONE — Global TypeScript Types
 */

// ── Entropy Tiers ──
export type EntropyTier = 'nominal' | 'invisible' | 'degraded' | 'critical'
export type NodeStatus = 'NOMINAL' | 'DEGRADED' | 'CRITICAL' | 'SENTENCED'
export type RazorMode = 'NOMINAL' | 'RAZOR_ARMED' | 'DRAWING' | 'EXECUTING'

// ── Coordinate ──
export interface Point {
  x: number
  y: number
}

// ── Metrics ──
export interface MetricSet {
  iei: number
  vdi: number
  pam: number
  deltaPhi: number
}

// ── Feature Node Data ──
export interface FeatureNodeData {
  [key: string]: unknown
  label: string
  metrics: MetricSet
  interactions: number[]       // raw interaction action counts
  sparkline: number[]          // 90-day interaction frequency
  usageVector: number[]        // current usage vector for VDI
  valueVector: number[]        // original value vector for VDI
  sessionFlows: number[][]     // observed session step distributions for PAM
  idealFlow: number[]          // ideal procedure distribution for PAM
  status: NodeStatus
  tier: EntropyTier
  sentenced: boolean
  clusterId?: string
}

// ── Cluster Node Data ──
export interface ClusterNodeData {
  [key: string]: unknown
  label: string
  aggregateIEI: number
  childNodeIds: string[]
}

// ── Tombstone Node Data (post-deprecation) ──
export interface TombstoneNodeData extends FeatureNodeData {
  deprecatedAt: string         // ISO 8601
  originalStatus: NodeStatus
}

// ── Edge Data ──
export interface PipelineEdgeData {
  [key: string]: unknown
  pam: number
  severed: boolean
}

// ── Toast ──
export interface ToastMessage {
  id: string
  content: string
  status: 'nominal' | 'degraded' | 'critical' | 'razor'
  duration?: number            // auto-dismiss in ms, default 5000
  timestamp: number
}

// ── Terminal Line ──
export interface TerminalLineData {
  type: 'command' | 'output' | 'header' | 'diff-add' | 'diff-remove' | 'status' | 'blank'
  content: string
}

// ── JSON-LD Tombstone Schema ──
export interface TombstoneSchema {
  '@context': string
  '@type': string
  identifier: string
  name: string
  dateDeprecated: string
  metrics: {
    iei: number
    vdi: number
    pam: number
    deltaPhi: number
  }
  negativeAssertions: string[]
  semanticTags: {
    status: 'DEPRECATED'
    aiHallucinationPrevention: 'ACTIVE'
    resurrectionAllowed: false
  }
}

// ── Seed Node (pre-processed) ──
export interface SeedNode {
  id: string
  label: string
  position: Point
  interactions: number[]
  sparkline: number[]
  usageVector: number[]
  valueVector: number[]
  sessionFlows: number[][]
  idealFlow: number[]
  clusterId?: string
  type: 'feature' | 'cluster'
}

// ── Seed Edge ──
export interface SeedEdge {
  id: string
  source: string
  target: string
}
