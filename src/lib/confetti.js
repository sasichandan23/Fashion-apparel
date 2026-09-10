/**
 * Tiny dependency-free confetti burst.
 * Draws to a temporary full-screen canvas and cleans itself up.
 */
export function confetti({ count = 140, duration = 2600, colors = ['#7c5cff', '#ff5c8a', '#ffb56b', '#2fbf9b', '#c9a227'] } = {}) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
  })
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const pieces = Array.from({ length: count }, () => {
    const angle = (Math.random() * Math.PI) / 1.4 + Math.PI / 3.4
    const speed = 9 + Math.random() * 13
    return {
      x: w / 2 + (Math.random() - 0.5) * 160,
      y: h * 0.42,
      vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
      vy: -Math.abs(Math.sin(angle) * speed) - 4,
      size: 5 + Math.random() * 7,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.34,
      shape: Math.random() < 0.35 ? 'circle' : 'rect',
    }
  })

  const start = performance.now()
  let raf

  const frame = (now) => {
    const t = now - start
    ctx.clearRect(0, 0, w, h)

    pieces.forEach((p) => {
      p.vy += 0.32 // gravity
      p.vx *= 0.995
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.max(0, 1 - t / duration)
      ctx.fillStyle = p.color
      if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      }
      ctx.restore()
    })

    if (t < duration) {
      raf = requestAnimationFrame(frame)
    } else {
      cancelAnimationFrame(raf)
      canvas.remove()
    }
  }

  raf = requestAnimationFrame(frame)
}
