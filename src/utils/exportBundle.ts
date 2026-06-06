/**
 * TOMBSTONE — Export Bundle
 * JSZip compilation of JSON-LD schemas, diffs, manifest, and commit message.
 */

import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { generateBatchSchemas } from '@/engine/tombstoneSchema'
import { generatePatchFile, generateCommitMessage, generateManifest } from '@/engine/diffGenerator'
import type { MetricSet } from '@/types'

interface ExportNode {
  id: string
  name: string
  metrics: MetricSet
  deprecatedAt: string
}

export async function exportBundle(
  nodes: ExportNode[],
  terminalOutput: string,
): Promise<void> {
  const zip = new JSZip()

  // 1. JSON-LD Tombstone Schemas
  const schemas = generateBatchSchemas(nodes)
  const schemaFolder = zip.folder('tombstone-schema')!
  for (const schema of schemas) {
    schemaFolder.file(schema.filename, schema.content)
  }

  // 2. Git patch diff
  const patchContent = generatePatchFile(nodes)
  zip.file('git-patch.diff', patchContent)

  // 3. Commit message
  const commitMessage = generateCommitMessage(nodes)
  zip.file('commit-message.txt', commitMessage)

  // 4. Deprecation manifest
  const manifest = generateManifest(nodes, terminalOutput)
  zip.file('DEPRECATION_MANIFEST.md', manifest)

  // Generate and download
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  saveAs(content, `tombstone-export-${timestamp}.zip`)
}
