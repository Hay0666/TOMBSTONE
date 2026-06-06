/**
 * TOMBSTONE — App Assembly
 * Final composition of all components.
 */

import { type FC } from 'react'
import { GraveyardCanvas } from '@/canvas/GraveyardCanvas'
import { AutopsyPanel } from '@/components/panels/AutopsyPanel'
import { CommitObsequies } from '@/components/terminal/CommitObsequies'
import { CommandPalette } from '@/components/overlays/CommandPalette'
import { HelpOverlay } from '@/components/overlays/HelpOverlay'
import { ToastContainer, GrainOverlay, ScanlineOverlay } from '@/components/ui'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { StatusBar } from '@/components/ui/StatusBar'
import { useHotkeyEngine } from '@/hooks/useHotkeyEngine'
import { useStore } from '@/store'

const App: FC = () => {
  // Activate hotkey engine
  useHotkeyEngine()

  const toasts = useStore(s => s.toasts)
  const removeToast = useStore(s => s.removeToast)
  const loadingComplete = useStore(s => s.loadingComplete)

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Loading Screen (shows first, then fades out) */}
      <LoadingScreen />

      {/* Main Canvas */}
      {loadingComplete && (
        <>
          <GraveyardCanvas />
          <AutopsyPanel />
          <CommitObsequies />
          <StatusBar />
        </>
      )}

      {/* Overlays (always mounted for animation) */}
      <CommandPalette />
      <HelpOverlay />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Atmospheric effects */}
      <ScanlineOverlay />
      <GrainOverlay />
    </div>
  )
}

export default App
