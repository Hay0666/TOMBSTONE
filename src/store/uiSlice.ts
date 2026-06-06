/**
 * TOMBSTONE — UI Slice
 * Zustand state for panels, terminal, toasts, loading, and session tracking.
 */

import type { StateCreator } from 'zustand'
import type { ToastMessage } from '@/types'

export interface UISlice {
  // Autopsy Panel
  autopsyPanelOpen: boolean
  autopsyNodeId: string | null

  // Terminal
  terminalOpen: boolean
  terminalComplete: boolean

  // Loading
  loadingComplete: boolean

  // Toasts
  toasts: ToastMessage[]

  // Command Palette
  commandPaletteOpen: boolean

  // Help Overlay
  helpOverlayOpen: boolean

  // Session
  sessionStartTime: number

  // Actions
  openAutopsyPanel: (nodeId: string) => void
  closeAutopsyPanel: () => void
  openTerminal: () => void
  closeTerminal: () => void
  setTerminalComplete: (complete: boolean) => void
  setLoadingComplete: (complete: boolean) => void
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
  toggleCommandPalette: () => void
  closeCommandPalette: () => void
  toggleHelpOverlay: () => void
  closeHelpOverlay: () => void
}

let toastCounter = 0

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  autopsyPanelOpen: false,
  autopsyNodeId: null,
  terminalOpen: false,
  terminalComplete: false,
  loadingComplete: false,
  toasts: [],
  commandPaletteOpen: false,
  helpOverlayOpen: false,
  sessionStartTime: Date.now(),

  openAutopsyPanel: (nodeId) => set({
    autopsyPanelOpen: true,
    autopsyNodeId: nodeId,
  }),

  closeAutopsyPanel: () => set({
    autopsyPanelOpen: false,
    autopsyNodeId: null,
  }),

  openTerminal: () => set({
    terminalOpen: true,
    terminalComplete: false,
  }),

  closeTerminal: () => set({
    terminalOpen: false,
    terminalComplete: false,
  }),

  setTerminalComplete: (complete) => set({ terminalComplete: complete }),

  setLoadingComplete: (complete) => set({ loadingComplete: complete }),

  addToast: (toast) => {
    const id = `toast-${++toastCounter}`
    set(state => ({
      toasts: [...state.toasts, { ...toast, id, timestamp: Date.now() }],
    }))
  },

  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id),
  })),

  toggleCommandPalette: () => set(state => ({
    commandPaletteOpen: !state.commandPaletteOpen,
  })),

  closeCommandPalette: () => set({ commandPaletteOpen: false }),

  toggleHelpOverlay: () => set(state => ({
    helpOverlayOpen: !state.helpOverlayOpen,
  })),

  closeHelpOverlay: () => set({ helpOverlayOpen: false }),
})
