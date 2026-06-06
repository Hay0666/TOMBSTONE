import { type FC, useState, useEffect } from 'react'

interface TerminalLineProps {
  text: string
  typingSpeed?: number
  onComplete?: () => void
  immediate?: boolean
}

export const TerminalLine: FC<TerminalLineProps> = ({
  text,
  typingSpeed = 40,
  onComplete,
  immediate = false,
}) => {
  const [displayText, setDisplayText] = useState(immediate ? text : '')
  const [isComplete, setIsComplete] = useState(immediate)

  useEffect(() => {
    if (immediate) {
      setDisplayText(text)
      setIsComplete(true)
      onComplete?.()
      return
    }

    let index = 0
    setDisplayText('')
    setIsComplete(false)

    const timer = setInterval(() => {
      index++
      setDisplayText(text.slice(0, index))
      if (index >= text.length) {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, typingSpeed)

    return () => clearInterval(timer)
  }, [text, typingSpeed, immediate, onComplete])

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '11px',
      lineHeight: '1.8',
      color: 'var(--color-nominal)',
      whiteSpace: 'pre',
      minHeight: '1.8em',
    }}>
      {displayText}
      {!isComplete && (
        <span style={{
          animation: 'blink 0.8s step-end infinite',
          color: 'var(--color-nominal)',
        }}>
          |
        </span>
      )}
    </div>
  )
}
