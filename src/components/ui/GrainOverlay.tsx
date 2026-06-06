import { type FC, useRef, useEffect } from 'react'

/**
 * GrainOverlay — Canvas-based noise grain texture.
 * Position: fixed, pointer-events: none, z-index: 9999.
 * Opacity: 2.5%. Driven by requestAnimationFrame outside React render cycle.
 */
export const GrainOverlay: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let frame = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const render = () => {
      frame++
      // Update grain every 3 frames for performance
      if (frame % 3 === 0) {
        const w = canvas.width
        const h = canvas.height
        const imageData = ctx.createImageData(w, h)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255
          data[i] = v
          data[i + 1] = v
          data[i + 2] = v
          data[i + 3] = 15 // ~6% alpha, combined with canvas opacity 0.025
        }

        ctx.putImageData(imageData, 0, 0)
      }

      animId = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.025,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
