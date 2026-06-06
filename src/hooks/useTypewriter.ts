/**
 * TOMBSTONE — Typewriter Hook
 * Queued character animation for terminal output.
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface TypewriterOptions {
  speed?: number // ms per character
  lineDelay?: number // ms between lines
  onLineComplete?: (lineIndex: number) => void
  onComplete?: () => void
}

export function useTypewriter(lines: string[], options: TypewriterOptions = {}) {
  const { speed = 40, lineDelay = 100, onLineComplete, onComplete } = options
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const completedRef = useRef(false)

  const start = useCallback(() => {
    setCurrentLine(0)
    setCurrentChar(0)
    setDisplayedLines([])
    setIsComplete(false)
    setIsTyping(true)
    completedRef.current = false
  }, [])

  useEffect(() => {
    if (!isTyping || isComplete || lines.length === 0) return

    if (currentLine >= lines.length) {
      setIsComplete(true)
      setIsTyping(false)
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
      return
    }

    const line = lines[currentLine]

    // If line is empty or a separator, show immediately
    if (line.length === 0 || line.startsWith('──')) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, line])
        onLineComplete?.(currentLine)
        setCurrentLine(prev => prev + 1)
        setCurrentChar(0)
      }, lineDelay)
      return () => clearTimeout(timer)
    }

    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setCurrentChar(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      // Line complete
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, line])
        onLineComplete?.(currentLine)
        setCurrentLine(prev => prev + 1)
        setCurrentChar(0)
      }, lineDelay)
      return () => clearTimeout(timer)
    }
  }, [isTyping, isComplete, currentLine, currentChar, lines, speed, lineDelay, onLineComplete, onComplete])

  const currentText = currentLine < lines.length
    ? lines[currentLine].slice(0, currentChar)
    : ''

  return {
    displayedLines,
    currentText,
    isTyping: isTyping && !isComplete,
    isComplete,
    start,
    currentLineIndex: currentLine,
  }
}
