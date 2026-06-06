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
    sentencedNodeIds: string
  }
}

export interface AutopsyPanelViewedEvent {
  event: 'autopsy_panel_viewed'
  properties: {
    nodeId: string
    nodeIEI: number
    nodeStatus: string
    activationMethod: 'click' | 'hotkey' | 'auto' | 'search'
  }
}

export interface CommitObsequiesOpenedEvent {
  event: 'commit_obsequies_opened'
  properties: {
    sentencedNodeCount: number
    origin: 'hotkey' | 'button'
  }
}

export interface TombstoneExportCompletedEvent {
  event: 'tombstone_export_completed'
  properties: {
    schemaCount: number
    sessionDurationMs: number
    exportedNodeIds: string
  }
}

export interface NodeSearchExecutedEvent {
  event: 'node_search_executed'
  properties: {
    query: string
    resultsCount: number
    selectedNodeId: string
    selectedNodeLabel: string
  }
}

export interface SentenceUndoneEvent {
  event: 'sentence_undone'
  properties: {
    restoredNodeCount: number
    restoredNodeIds: string
  }
}

export interface CommitObsequiesCompletedEvent {
  event: 'commit_obsequies_completed'
  properties: {
    sentencedNodeCount: number
    terminalLineCount: number
    typewriterDurationMs: number
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
  | AutopsyPanelViewedEvent
  | CommitObsequiesOpenedEvent
  | TombstoneExportCompletedEvent
  | NodeSearchExecutedEvent
  | SentenceUndoneEvent
  | CommitObsequiesCompletedEvent
  | OnboardingCompletedEvent
  | DeprecationWorkflowCompletedEvent
