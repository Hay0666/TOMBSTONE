/**
 * TOMBSTONE — Help Overlay
 * Accessible hotkey reference triggered by [?].
 */

import { type FC } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '@/store'
import { CommandKey, Divider } from '@/components/ui'
import { COLORS } from '@/config/design-tokens'

const HOTKEYS = [
  { key: 'C', action: 'Arm Deprecation Razor' },
  { key: 'ESC', action: 'Disarm / Cancel all active states' },
  { key: 'ENTER', action: 'Confirm sentenced set → Commit Obsequies' },
  { key: 'D', action: 'Open/close Autopsy Panel for hovered node' },
  { key: 'G', action: 'Fit graph to viewport' },
  { key: 'Z', action: 'Undo last sentence (session only)' },
  { key: '/', action: 'Open command palette (fuzzy search)' },
  { key: '?', action: 'Toggle this help overlay' },
]

export const HelpOverlay: FC = () => {
  const isOpen = useStore(s => s.helpOverlayOpen)
  const close = useStore(s => s.closeHelpOverlay)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,10,12,0.8)',
              zIndex: 9500,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            role="dialog"
            aria-label="Keyboard shortcuts"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              background: COLORS.slab,
              border: `1px solid ${COLORS.bulkhead}`,
              zIndex: 9600,
              padding: '24px',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div>
                <div style={{
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: COLORS.concrete,
                  marginBottom: '4px',
                }}>
                  TOMBSTONE
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: COLORS.chalk,
                }}>
                  HOTKEY REFERENCE
                </div>
              </div>
              <button
                onClick={close}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.concrete,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                [×]
              </button>
            </div>

            <Divider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {HOTKEYS.map(({ key, action }) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '60px' }}>
                    <CommandKey keyLabel={key} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: COLORS.chalk,
                    letterSpacing: '0.02em',
                  }}>
                    {action}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '20px',
              fontSize: '9px',
              color: COLORS.ash,
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}>
              PRESS [?] OR [ESC] TO CLOSE
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
