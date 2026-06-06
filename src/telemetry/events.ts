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

export interface NodesRestoredEvent {
  event: 'nodes_restored'
  properties: {
    nodesRestored: number
    restoredNodeIds: string[]
  }
}

export interface CommandPaletteSearchEvent {
  event: 'command_palette_search'
  properties: {
    query: string
    resultsCount: number
    selectedNodeId: string
    totalNodes: number
  }
}

export interface DeprecationWorkflowCompletedEvent {
  event: 'deprecation_workflow_completed'
  properties: {
    sentencedNodeCount: number
    totalDeltaPhiBits: number
    artifactCount: number
  }
}

export interface HelpOverlayOpenedEvent {
  event: 'help_overlay_opened'
  properties: {
    activationMethod: 'hotkey'
    currentRazorMode: string
    sentencedNodeCount: number
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
  | NodesRestoredEvent
  | CommandPaletteSearchEvent
  | DeprecationWorkflowCompletedEvent
  | HelpOverlayOpenedEvent
