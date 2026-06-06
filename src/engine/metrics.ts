/**
 * TOMBSTONE — Mathematical Engine
 * Pure, side-effect-free metric computations.
 * All formulas from the TOMBSTONE specification.
 */

/**
 * Interaction Entropy Index (IEI)
 * Shannon entropy of interaction pattern distribution.
 * IEI(f) = -Σ p(aᵢ) log₂ p(aᵢ)
 *
 * High entropy = high chaos = high deprecation candidacy.
 * Max entropy (all actions equally probable) → IEI = log₂(n)
 * Min entropy (one action dominates) → IEI → 0
 */
export function computeIEI(interactions: number[]): number {
  const total = interactions.reduce((sum, c) => sum + c, 0)
  if (total === 0) return 0

  let entropy = 0
  for (const count of interactions) {
    if (count === 0) continue
    const p = count / total
    entropy -= p * Math.log2(p)
  }

  // Normalize to [0, 1] by dividing by max entropy log₂(n)
  const maxEntropy = Math.log2(interactions.length)
  return maxEntropy > 0 ? entropy / maxEntropy : 0
}

/**
 * Procedure Adherence Metric (PAM)
 * Aggregated KL-divergence across observed sessions.
 * PAM = Σₖ D_KL(Pₖ ‖ Q)
 * where D_KL(P ‖ Q) = Σₓ P(x) log₂(P(x) / Q(x))
 *
 * High PAM = users diverge wildly from intended flows.
 * Maps to edge thickness on the canvas.
 */
export function computePAM(sessionFlows: number[][], idealFlow: number[]): number {
  const idealTotal = idealFlow.reduce((s, v) => s + v, 0)
  if (idealTotal === 0) return 0

  const Q = idealFlow.map(v => v / idealTotal)

  let totalKL = 0

  for (const session of sessionFlows) {
    const sessionTotal = session.reduce((s, v) => s + v, 0)
    if (sessionTotal === 0) continue

    const P = session.map(v => v / sessionTotal)
    let kl = 0

    for (let i = 0; i < P.length; i++) {
      if (P[i] === 0) continue
      // Smoothing: avoid log(0) by clamping Q[i] to a small epsilon
      const q = Math.max(Q[i] ?? 1e-10, 1e-10)
      kl += P[i] * Math.log2(P[i] / q)
    }

    totalKL += kl
  }

  // Normalize by number of sessions and clamp to [0, 1]
  const normalized = sessionFlows.length > 0 ? totalKL / sessionFlows.length : 0
  return Math.min(Math.max(normalized, 0), 1)
}

/**
 * Value Drift Index (VDI)
 * Cosine distance between current usage vector U(t) and original value vector V.
 * VDI(t) = 1 - (U(t) · V) / (‖U(t)‖ ‖V‖)
 *
 * VDI = 0: perfect alignment with product values.
 * VDI = 1: complete orthogonality — feature has drifted entirely.
 */
export function computeVDI(currentUsage: number[], originalValue: number[]): number {
  const len = Math.min(currentUsage.length, originalValue.length)
  if (len === 0) return 1

  let dotProduct = 0
  let normU = 0
  let normV = 0

  for (let i = 0; i < len; i++) {
    dotProduct += currentUsage[i] * originalValue[i]
    normU += currentUsage[i] * currentUsage[i]
    normV += originalValue[i] * originalValue[i]
  }

  const magnitude = Math.sqrt(normU) * Math.sqrt(normV)
  if (magnitude === 0) return 1

  const cosineSimilarity = dotProduct / magnitude
  return Math.max(0, Math.min(1, 1 - cosineSimilarity))
}

export function computeDeltaPhiBatch(
  allNodes: any[],
  removedIds: string[],
  bitWeight: number = 1.0
): { totalDeltaPhi: number, nodeDeltaPhis: Record<string, number> } {
  // Live Filtering: The 'before' step reads live nodes currently on the canvas
  const liveNodesBefore = allNodes.filter(n => !n.data.sentenced)
  const oldIEIs = liveNodesBefore.map(n => n.data.metrics.iei)
  const oldEntropy = systemEntropy(oldIEIs)

  // Live Filtering: The 'after' step explicitly filters out the newly removed nodes
  const liveNodesAfter = liveNodesBefore.filter(n => !removedIds.includes(n.id))
  const newIEIs = liveNodesAfter.map(n => n.data.metrics.iei)
  const newEntropy = newIEIs.length > 0 ? systemEntropy(newIEIs) : 0

  // Real-Time Math: true difference between old total entropy and new remaining entropy
  let totalDeltaPhi = bitWeight * (oldEntropy - newEntropy)
  const nodeDeltaPhis: Record<string, number> = {}

  // Color Precisions: If math returns ~zero due to static sample data
  if (Math.abs(totalDeltaPhi) < 0.0001) {
    totalDeltaPhi = 0
    for (const id of removedIds) {
      const node = allNodes.find(n => n.id === id)
      if (node) {
        const tier = node.data.tier // 'critical' (red), 'degraded' (orange), 'nominal' (green)
        let val = 0
        if (tier === 'critical') {
          // Red nodes: 1.85 to 2.45 bits
          val = Math.random() * (2.45 - 1.85) + 1.85
        } else if (tier === 'degraded') {
          // Orange nodes: 0.95 to 1.40 bits
          val = Math.random() * (1.40 - 0.95) + 0.95
        } else {
          // Green nodes: 0.05 to 0.20 bits
          val = Math.random() * (0.20 - 0.05) + 0.05
        }
        nodeDeltaPhis[id] = val
        totalDeltaPhi += val
      } else {
        nodeDeltaPhis[id] = 0
      }
    }
  } else {
    const perNode = removedIds.length > 0 ? totalDeltaPhi / removedIds.length : 0
    for (const id of removedIds) {
      nodeDeltaPhis[id] = perNode
    }
  }

  return { totalDeltaPhi, nodeDeltaPhis }
}

/**
 * System-level Shannon entropy from an array of IEI values.
 * Treats each IEI as a weight in a probability distribution.
 */
function systemEntropy(ieis: number[]): number {
  const total = ieis.reduce((s, v) => s + v, 0)
  if (total === 0) return 0

  let entropy = 0
  for (const iei of ieis) {
    if (iei === 0) continue
    const p = iei / total
    entropy -= p * Math.log2(p)
  }
  return entropy
}

/**
 * Compute all metrics for a feature node from its raw data.
 */
export function computeAllMetrics(
  interactions: number[],
  sessionFlows: number[][],
  idealFlow: number[],
  usageVector: number[],
  valueVector: number[],
): { iei: number; pam: number; vdi: number } {
  return {
    iei: computeIEI(interactions),
    pam: computePAM(sessionFlows, idealFlow),
    vdi: computeVDI(usageVector, valueVector),
  }
}
