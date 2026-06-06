/**
 * TOMBSTONE — Telemetry Wrapper
 * Pendo SDK initialization and typed track() function.
 * Components never fire track calls directly — they pass structured
 * event objects through this utility.
 */

import { env } from '@/config/env'
import type { TelemetryEvent } from './events'

// Pendo type declarations
declare global {
  interface Window {
    pendo?: {
      initialize: (config: {
        visitor: { id: string }
        account: { id: string }
      }) => void
      track: (eventName: string, properties?: Record<string, unknown>) => void
    }
  }
}

let initialized = false

/**
 * Initialize Pendo SDK.
 * Must be called before app root mounts.
 * Silently skips if PENDO_APP_ID is not set (hackathon demo mode).
 */
export function initTelemetry(): void {
  const appId = env.PENDO_APP_ID
  if (!appId || appId === 'your_pendo_app_id_here') {
    console.info('[TOMBSTONE:TELEMETRY] Pendo App ID not configured. Telemetry disabled.')
    return
  }

  try {
    // Dynamically inject Pendo agent script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://cdn.pendo.io/agent/static/${appId}/pendo.js`
    script.onload = () => {
      if (window.pendo) {
        window.pendo.initialize({
          visitor: { id: 'vis_hlyoubi_892' },
          account: { id: 'tombstone_hackathon_2026' },
        })
        initialized = true
        console.info('[TOMBSTONE:TELEMETRY] Pendo initialized successfully.')
      }
    }
    script.onerror = () => {
      console.warn('[TOMBSTONE:TELEMETRY] Failed to load Pendo script. Telemetry disabled.')
    }
    document.head.appendChild(script)
  } catch (err) {
    console.warn('[TOMBSTONE:TELEMETRY] Pendo initialization error:', err)
  }
}

/**
 * Track a telemetry event.
 * No-ops silently if Pendo is not initialized.
 */
export function track(event: TelemetryEvent): void {
  if (!initialized || !window.pendo) {
    // In development, log events to console for debugging
    if (import.meta.env.DEV) {
      console.debug(`[TOMBSTONE:TRACK] ${event.event}`, event.properties)
    }
    return
  }

  try {
    window.pendo.track(event.event, event.properties as Record<string, unknown>)
  } catch (err) {
    console.warn(`[TOMBSTONE:TELEMETRY] Track error for ${event.event}:`, err)
  }
}
