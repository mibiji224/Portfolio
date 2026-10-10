import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Smooth-scrolls to an element, a selector, or a y offset (0 = top of page).
// A target that isn't in the document is a no-op rather than a throw.
export function scrollToTarget(target, { duration = 1.2, offsetY = 0 } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el == null) return

  try {
    gsap.to(window, {
      duration: prefersReducedMotion() ? 0 : duration,
      ease: 'power3.inOut',
      scrollTo: { y: el, offsetY, autoKill: true },
      overwrite: true,
    })
  } catch {
    if (typeof el === 'number') window.scrollTo({ top: el })
    else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}
