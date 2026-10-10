import { useEffect } from 'react'
import gsap from 'gsap'

// Magnetic pull: the element drifts toward the pointer while it is near, and
// springs back on leave. A child marked `data-magnetic-label` travels a little
// further than the shell, which gives the pull some depth.
//
// Only runs for a fine, hovering pointer and when motion is welcome; touch and
// reduced-motion users get the plain button.
export function useMagnetic(ref, { strength = 0.35, reach = 48, scale = 1.05 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const mm = gsap.matchMedia()
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const label = el.querySelector('[data-magnetic-label]')
      const spring = { duration: 0.9, ease: 'elastic.out(1, 0.35)' }
      const toX = gsap.quickTo(el, 'x', spring)
      const toY = gsap.quickTo(el, 'y', spring)
      const toScale = gsap.quickTo(el, 'scale', { duration: 0.4, ease: 'power3.out' })
      const labelX = label && gsap.quickTo(label, 'x', spring)
      const labelY = label && gsap.quickTo(label, 'y', spring)

      let engaged = false
      const release = () => {
        if (!engaged) return
        engaged = false
        toX(0)
        toY(0)
        toScale(1)
        labelX?.(0)
        labelY?.(0)
      }

      const onMove = (e) => {
        // The rect includes our own translate, so take it back out to find the
        // button's resting centre; otherwise the target chases itself.
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2 - gsap.getProperty(el, 'x')
        const cy = rect.top + rect.height / 2 - gsap.getProperty(el, 'y')
        const dx = e.clientX - cx
        const dy = e.clientY - cy

        const near =
          Math.abs(dx) < rect.width / 2 + reach && Math.abs(dy) < rect.height / 2 + reach
        if (!near) {
          release()
          return
        }

        engaged = true
        toX(dx * strength)
        toY(dy * strength)
        toScale(scale)
        labelX?.(dx * strength * 0.5)
        labelY?.(dy * strength * 0.5)
      }

      window.addEventListener('pointermove', onMove)
      document.addEventListener('mouseleave', release)

      return () => {
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('mouseleave', release)
        gsap.set([el, label].filter(Boolean), { clearProps: 'transform' })
      }
    })

    return () => mm.revert()
  }, [ref, strength, reach, scale])
}
