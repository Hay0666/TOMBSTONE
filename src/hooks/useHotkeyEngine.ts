/**
 * TOMBSTONE — Hotkey Engine
 * Full keyboard shortcut registry for all primary canvas interactions.
 */

import { useEffect, useCallback } from 'react'
import { useStore } from '@/store'

export function useHotkeyEngine() {
  const razorMode = useStore(s => s.razorMode)
  const armRazor = useStore(s => s.armRazor)
  const disarmRazor = useStore(s => s.disarmRazor)
  const resetRazor = useStore(s => s.resetRazor)
  const lastSentencedIds = useStore(s => s.lastSentencedIds)
  const restoreNodes = useStore(s => s.restoreNodes)
  const openTerminal = useStore(s => s.openTerminal)
  const closeTerminal = useStore(s => s.closeTerminal)
  const closeAutopsyPanel = useStore(s => s.closeAutopsyPanel)
  const terminalOpen = useStore(s => s.terminalOpen)
  const autopsyPanelOpen = useStore(s => s.autopsyPanelOpen)
  const hoveredNodeId = useStore(s => s.hoveredNodeId)
  const openAutopsyPanel = useStore(s => s.openAutopsyPanel)
  const toggleCommandPalette = useStore(s => s.toggleCommandPalette)
  const commandPaletteOpen = useStore(s => s.commandPaletteOpen)
  const closeCommandPalette = useStore(s => s.closeCommandPalette)
  const toggleHelpOverlay = useStore(s => s.toggleHelpOverlay)
  const helpOverlayOpen = useStore(s => s.helpOverlayOpen)
  const closeHelpOverlay = useStore(s => s.closeHelpOverlay)
  const sentencedNodeIds = useStore(s => s.sentencedNodeIds)
  const addToast = useStore(s => s.addToast)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't capture when typing in inputs
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    const key = e.key.toLowerCase()

    // [?] — Toggle help overlay
    if (key === '?' || (e.shiftKey && key === '/')) {
      e.preventDefault()
      toggleHelpOverlay()
      return
    }

    // [ESC] — Universal escape
    if (key === 'escape') {
      e.preventDefault()
      if (helpOverlayOpen) {
        closeHelpOverlay()
        return
      }
      if (commandPaletteOpen) {
        closeCommandPalette()
        return
      }
      if (terminalOpen) {
        closeTerminal()
        return
      }
      if (autopsyPanelOpen) {
        closeAutopsyPanel()
        return
      }
      if (razorMode !== 'NOMINAL') {
        disarmRazor()
        addToast({
          content: 'RAZOR DISARMED',
          status: 'razor',
          duration: 2000,
        })
        return
      }
      return
    }

    // [C] — Arm Deprecation Razor
    if (key === 'c' && razorMode === 'NOMINAL' && !terminalOpen && !commandPaletteOpen) {
      e.preventDefault()
      armRazor()
      addToast({
        content: 'RAZOR ARMED — DRAW CUT VECTOR',
        status: 'razor',
        duration: 4000,
      })
      return
    }

    // [ENTER] — Confirm sentenced set, open Commit Obsequies terminal
    if (key === 'enter' && sentencedNodeIds.length > 0 && !terminalOpen) {
      e.preventDefault()
      openTerminal()
      return
    }

    // [D] — Open/close Diagnostic Panel for hovered node
    if (key === 'd' && !terminalOpen && !commandPaletteOpen) {
      e.preventDefault()
      if (autopsyPanelOpen) {
        closeAutopsyPanel()
      } else if (hoveredNodeId) {
        openAutopsyPanel(hoveredNodeId)
      }
      return
    }

    // [G] — Fit graph to viewport (handled by canvas)
    if (key === 'g' && !terminalOpen && !commandPaletteOpen) {
      e.preventDefault()
      // Dispatch custom event for canvas to handle
      window.dispatchEvent(new CustomEvent('tombstone:fitview'))
      return
    }

    // [Z] — Undo last sentence
    if (key === 'z' && !e.ctrlKey && !e.metaKey && !terminalOpen) {
      e.preventDefault()
      if (lastSentencedIds.length > 0) {
        restoreNodes(lastSentencedIds)
        addToast({
          content: 'NODE RESTORED — SENTENCE REVOKED\nWARNING: TERMINAL ARTIFACTS REMAIN PERMANENT',
          status: 'degraded',
          duration: 4000,
        })
      }
      return
    }

    // [/] — Open command palette
    if (key === '/' && !commandPaletteOpen && !terminalOpen) {
      e.preventDefault()
      toggleCommandPalette()
      return
    }
  }, [
    razorMode, armRazor, disarmRazor, resetRazor, lastSentencedIds, restoreNodes,
    openTerminal, closeTerminal, closeAutopsyPanel, terminalOpen, autopsyPanelOpen,
    hoveredNodeId, openAutopsyPanel, toggleCommandPalette, commandPaletteOpen,
    closeCommandPalette, toggleHelpOverlay, helpOverlayOpen, closeHelpOverlay,
    sentencedNodeIds, addToast,
  ])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
