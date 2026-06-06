/**
 * TOMBSTONE — Telemetry Events
 * Strictly typed tracking parameter definitions.
 */

export interface CanvasMountedEvent {
  event: 'canvas_mounted'
  properties: {
    totalNodes: number
    criticalNodes: number
    degradedNodes: number
    nominalNodes: number
  }
}

export interface RazorArmedEvent {
  event: 'razor_armed'
  properties: {
    visibleNodeCount: number
  }
}

export interface RazorDisarmedEvent {
  event: 'razor_disarmed'
  properties: {
    reason: 'user_cancel' | 'escape' | 'no_targets'
  }
}

export interface RazorExecutedEvent {
  event: 'razor_executed'
  properties: {
    nodesSentenced: number
    totalIEICut: number
    deltaPhiBits: number
  }
}

export interface AutopsyPanelOpenedEvent {
  event: 'autopsy_panel_opened'
  properties: {
    nodeId: string
    nodeIEI: number
    activationMethod: 'click' | 'hotkey' | 'auto'
  }
}

export interface CommitObsequiesOpenedEvent {
  event: 'commit_obsequies_opened'
  properties: {
    sentencedNodeCount: number
    origin: 'hotkey' | 'button'
  }
}

export interface TombstoneSchemaExportedEvent {
  event: 'tombstone_schema_exported'
  properties: {
    schemaCount: number
    sessionDurationMs: number
  }
}

export interface NodeSearchExecutedEvent {
  event: 'node_search_executed'
  properties: {
    query: string
    resultsCount: number
    selectedNodeId: string
    selectedNodeTier: string
  }
}

export interface SentenceUndoneEvent {
  event: 'sentence_undone'
  properties: {
    restoredNodeCount: number
    restoredNodeIds: string[]
  }
}

export interface ManifestGenerationCompletedEvent {
  event: 'manifest_generation_completed'
  properties: {
    sentencedNodeCount: number
    manifestLineCount: number
    generationDurationMs: number
  }
}

export interface OnboardingCompletedEvent {
  event: 'onboarding_completed'
  properties: {
    loadDurationMs: number
    sessionStartTime: string
  }
}

export interface DeprecationWorkflowCompletedEvent {
  event: 'deprecation_workflow_completed'
  properties: {
    totalNodesSentenced: number
    totalDeltaPhiBits: number
    workflowDurationMs: number
    exportedSchemaCount: number
  }
}

export type TelemetryEvent =
  | CanvasMountedEvent
  | RazorArmedEvent
  | RazorDisarmedEvent
  | RazorExecutedEvent
  | AutopsyPanelOpenedEvent
  | CommitObsequiesOpenedEvent
  | TombstoneSchemaExportedEvent
  | NodeSearchExecutedEvent
  | SentenceUndoneEvent
  | ManifestGenerationCompletedEvent
  | OnboardingCompletedEvent
  | DeprecationWorkflowCompletedEvent
