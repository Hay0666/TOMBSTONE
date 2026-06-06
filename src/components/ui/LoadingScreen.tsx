/**
 * TOMBSTONE — Loading Screen
 * Full-screen void overlay with typewriter sequence.
 * Minimum 1.8s display duration — the ritual matters.
 */

import { type FC, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '@/store'
import { COLORS } from '@/config/design-tokens'

const LOADING_LINES = [
  'TOMBSTONE',
  '─────────────────────────────────────────',
  'INITIALIZING ENTROPY GRAVEYARD...',
  'LOADING FEATURE CORPUS: 28 NODES',
  'COMPUTING INTERACTION ENTROPY INDICES...',
  'GRAVEYARD READY.',
]

export const LoadingScreen: FC = () => {
  const loadingComplete = useStore(s => s.loadingComplete)
  const setLoadingComplete = useStore(s => s.setLoadingComplete)
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [typingIndex, setTypingIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [showScreen, setShowScreen] = useState(true)

  // Typewriter animation
  useEffect(() => {
    if (visibleLines >= LOADING_LINES.length) {
      // All lines displayed, wait minimum duration then fade out
      const timer = setTimeout(() => {
        setShowScreen(false)
        setTimeout(() => setLoadingComplete(true), 500)
      }, 600)
      return () => clearTimeout(timer)
    }

    const line = LOADING_LINES[visibleLines]

    // Separators and title appear immediately
    if (line.startsWith('──') || visibleLines === 0) {
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1)
        setTypingIndex(0)
        setCurrentText('')
      }, visibleLines === 0 ? 400 : 200)
      return () => clearTimeout(timer)
    }

    // Typewriter for content lines
    if (typingIndex < line.length) {
      const timer = setTimeout(() => {
        setCurrentText(line.slice(0, typingIndex + 1))
        setTypingIndex(i => i + 1)
      }, 30)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1)
        setTypingIndex(0)
        setCurrentText('')
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [visibleLines, typingIndex, setLoadingComplete])

  if (loadingComplete) return null

  return (
    <AnimatePresence>
      {showScreen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: COLORS.void,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            maxWidth: '600px',
            width: '100%',
            padding: '0 24px',
          }}>
            {LOADING_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: i === 0 ? 'clamp(2rem, 4vw, 5rem)' : '12px',
                  fontWeight: i === 0 ? 700 : 400,
                  letterSpacing: i === 0 ? '0.08em' : '0.03em',
                  textTransform: i === 0 ? 'uppercase' : 'none',
                  color: i === 0 ? COLORS.chalk
                    : line.startsWith('──') ? COLORS.fog
                    : line === 'GRAVEYARD READY.' ? COLORS.nominal
                    : COLORS.concrete,
                  lineHeight: i === 0 ? 1.2 : 1.8,
                  marginBottom: i === 0 ? '4px' : '0',
                }}
              >
                {line}
              </div>
            ))}
            {/* Current typing line */}
            {visibleLines < LOADING_LINES.length && visibleLines > 0 && !LOADING_LINES[visibleLines].startsWith('──') && (
              <div style={{
                fontSize: '12px',
                color: LOADING_LINES[visibleLines] === 'GRAVEYARD READY.' ? COLORS.nominal : COLORS.concrete,
                lineHeight: 1.8,
                letterSpacing: '0.03em',
              }}>
                {currentText}
                <span style={{
                  animation: 'blink 0.8s step-end infinite',
                  color: COLORS.nominal,
                }}>|</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
