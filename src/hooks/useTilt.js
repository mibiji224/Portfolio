import { useEffect, useRef, useState } from 'react'

// Mouse-tilt (ported from the reference site's card): the card leans toward the
// cursor in 3D (max 15deg) and grows to 1.05x, easing back on leave.
// Fine pointers only; touch and reduced-motion get a plain card.
export const TILT = { max: 15, perspective: 1000, scale: 1.05, speed: 400, easing: 'cubic-bezier(.03,.98,.52,.99)' }

const REST = `perspective(${TILT.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`

const enabled = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Returns `ref`, the current `tilt` transform string, whether the card is `active`, and mouse `bind` handlers. */
export default function useTilt() {
  const ref = useRef(null)
  const frame = useRef(null)
  const [tilt, setTilt] = useState(REST)
  const [active, setActive] = useState(false)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const onMouseEnter = () => {
    if (enabled()) setActive(true)
  }

  const onMouseMove = (e) => {
    if (!enabled() || !ref.current) return
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      if (!ref.current) return
      const r = ref.current.getBoundingClientRect()
      const x = Math.min(Math.max((clientX - r.left) / r.width, 0), 1)
      const y = Math.min(Math.max((clientY - r.top) / r.height, 0), 1)
      const rotY = (TILT.max / 2 - x * TILT.max).toFixed(2)
      const rotX = (y * TILT.max - TILT.max / 2).toFixed(2)
      setTilt(`perspective(${TILT.perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${TILT.scale}, ${TILT.scale}, ${TILT.scale})`)
    })
  }

  const onMouseLeave = () => {
    cancelAnimationFrame(frame.current)
    setActive(false)
    setTilt(REST)
  }

  return { ref, tilt, active, bind: { onMouseEnter, onMouseMove, onMouseLeave } }
}
