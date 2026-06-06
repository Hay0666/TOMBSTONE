import { type FC, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { ToastMessage } from '@/types'

interface ToastNotificationProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

const STATUS_BORDER_COLORS: Record<ToastMessage['status'], string> = {
  nominal: 'var(--color-nominal)',
  degraded: 'var(--color-degraded)',
  critical: 'var(--color-critical)',
  razor: 'var(--color-razor)',
}

export const ToastNotification: FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration ?? 5000
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        onDismiss(toast.id)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [toast.id, duration, onDismiss])

  const borderColor = STATUS_BORDER_COLORS[toast.status]

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        background: 'var(--color-slab)',
        borderLeft: `2px solid ${borderColor}`,
        padding: '12px 16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        lineHeight: '1.6',
        color: 'var(--color-chalk)',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ whiteSpace: 'pre-line' }}>{toast.content}</div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '1px',
        width: `${progress}%`,
        background: borderColor,
        transition: 'width 50ms linear',
      }} />
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export const ToastContainer: FC<ToastContainerProps> = ({ toasts, onDismiss }) => (
  <div className="toast-container">
    <AnimatePresence>
      {toasts.map(toast => (
        <ToastNotification key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
)
