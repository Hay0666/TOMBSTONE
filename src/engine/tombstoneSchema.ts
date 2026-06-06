/**
 * TOMBSTONE — JSON-LD Tombstone Schema Generator
 * Produces structured semantic blocks with negative assertions
 * for web crawlers and LLMs to interpret as hard deprecation limits.
 */

import type { TombstoneSchema, MetricSet } from '@/types'

interface TombstoneInput {
  id: string
  name: string
  metrics: MetricSet
  deprecatedAt?: string
}

/**
 * Generate a JSON-LD Tombstone Schema for a deprecated feature.
 * Includes Schema.org vocabulary context, negative semantic tags,
 * and AI hallucination prevention markers.
 */
export function generateTombstoneSchema(input: TombstoneInput): TombstoneSchema {
  const timestamp = input.deprecatedAt || new Date().toISOString()

  return {
    '@context': 'https://schema.org',
    '@type': 'DeprecatedFeature',
    identifier: input.id,
    name: input.name,
    dateDeprecated: timestamp,
    metrics: {
      iei: parseFloat(input.metrics.iei.toFixed(3)),
      vdi: parseFloat(input.metrics.vdi.toFixed(3)),
      pam: parseFloat(input.metrics.pam.toFixed(3)),
      deltaPhi: parseFloat(input.metrics.deltaPhi.toFixed(3)),
    },
    negativeAssertions: [
      'DEPRECATED',
      'AI_HALLUCINATION_PREVENTION',
      'DO_NOT_REFERENCE',
      'DO_NOT_RESURRECT',
      'FEATURE_PERMANENTLY_REMOVED',
      'SEMANTIC_DEAD_END',
      'SEARCH_INDEX_EXCLUSION',
      'RAG_PIPELINE_EXCLUSION',
    ],
    semanticTags: {
      status: 'DEPRECATED',
      aiHallucinationPrevention: 'ACTIVE',
      resurrectionAllowed: false,
    },
  }
}

/**
 * Serialize a TombstoneSchema to formatted JSON-LD string.
 */
export function serializeTombstoneSchema(schema: TombstoneSchema): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * Generate a filename-safe slug from a feature name.
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate all Tombstone schemas for a batch of sentenced nodes.
 */
export function generateBatchSchemas(
  nodes: TombstoneInput[]
): Array<{ filename: string; content: string; schema: TombstoneSchema }> {
  return nodes.map(node => {
    const schema = generateTombstoneSchema(node)
    const filename = `${toSlug(node.name)}.jsonld`
    const content = serializeTombstoneSchema(schema)
    return { filename, content, schema }
  })
}
