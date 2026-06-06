/**
 * TOMBSTONE — Code Diff Generator
 * Generates programmatic code diffs and commit messages from sentenced node metadata.
 * No actual file system access — all output is synthetic but structurally realistic.
 */

import type { MetricSet } from '@/types'
import { toSlug } from './tombstoneSchema'

interface DiffInput {
  id: string
  name: string
  metrics: MetricSet
  deprecatedAt: string
}

/**
 * Generate a code diff block for a single deprecated feature.
 */
export function generateDiff(node: DiffInput): string {
  const slug = toSlug(node.name)
  const pascalName = node.name
    .split(/[\s-_]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
  const timestamp = node.deprecatedAt

  const lines = [
    `── CODE DIFF: ${node.name.toUpperCase()} ──────────────────────────────────────────`,
    '',
    `- import { ${pascalName} } from '@/features/${slug}';`,
    '',
    `+ // [TOMBSTONE] Feature deprecated: ${slug}`,
    `+ // IEI: ${node.metrics.iei.toFixed(3)} | VDI: ${node.metrics.vdi.toFixed(3)} | Deprecated: ${timestamp}`,
    `+ // Tombstone schema: /tombstone-schema/${slug}.jsonld`,
    '',
    `── DEPENDENCY REMOVALS ─────────────────────────────────────────`,
    '',
    `  feat/${slug}/index.tsx              [REMOVE]`,
    `  feat/${slug}/${pascalName}.tsx      [REMOVE]`,
    `  feat/${slug}/use${pascalName}State.ts  [REMOVE]`,
    `  hooks/use${pascalName}.ts            [REMOVE]`,
    '',
    `── TOMBSTONE SCHEMA GENERATED ──────────────────────────────────`,
    '',
    `> WRITING: /public/tombstone-schema/${slug}.jsonld`,
    `> STATUS: COMPLETE`,
    '',
  ]

  return lines.join('\n')
}

/**
 * Generate a unified git-patch.diff for all sentenced nodes.
 */
export function generatePatchFile(nodes: DiffInput[]): string {
  const header = [
    '# TOMBSTONE DEPRECATION PATCH',
    `# Generated: ${new Date().toISOString()}`,
    `# Nodes sentenced: ${nodes.length}`,
    '#',
    '',
  ].join('\n')

  const diffs = nodes.map(n => generateDiff(n)).join('\n')
  return header + diffs
}

/**
 * Generate a commit message for a batch deprecation.
 */
export function generateCommitMessage(nodes: DiffInput[]): string {
  const totalDeltaPhi = nodes.reduce((s, n) => s + n.metrics.deltaPhi, 0)
  const nodeList = nodes.map(n => `  - ${n.name} [IEI:${n.metrics.iei.toFixed(3)}]`).join('\n')

  return [
    `feat(deprecation): tombstone ${nodes.length} feature${nodes.length > 1 ? 's' : ''} per entropy analysis`,
    '',
    `Deprecated features:`,
    nodeList,
    '',
    `Total cognitive load release: ΔΦ = +${totalDeltaPhi.toFixed(2)} bits`,
    `Tombstone schemas published to /tombstone-schema/`,
    `Negative semantic tags applied. External AI hallucination prevention: ACTIVE.`,
    '',
  ].join('\n')
}

/**
 * Generate the full DEPRECATION_MANIFEST.md content.
 */
export function generateManifest(nodes: DiffInput[], terminalOutput: string): string {
  return [
    '# TOMBSTONE — DEPRECATION MANIFEST',
    '',
    `**Generated:** ${new Date().toISOString()}`,
    `**Nodes Sentenced:** ${nodes.length}`,
    `**Total ΔΦ:** +${nodes.reduce((s, n) => s + n.metrics.deltaPhi, 0).toFixed(2)} bits`,
    '',
    '---',
    '',
    '## Terminal Output',
    '',
    '```',
    terminalOutput,
    '```',
    '',
    '---',
    '',
    '## Sentenced Nodes',
    '',
    '| Feature | IEI | VDI | PAM | ΔΦ |',
    '|---------|-----|-----|-----|-----|',
    ...nodes.map(n =>
      `| ${n.name} | ${n.metrics.iei.toFixed(3)} | ${n.metrics.vdi.toFixed(3)} | ${n.metrics.pam.toFixed(3)} | ${n.metrics.deltaPhi.toFixed(3)} |`
    ),
    '',
    '---',
    '',
    '*The dead stay dead.*',
    '',
  ].join('\n')
}
