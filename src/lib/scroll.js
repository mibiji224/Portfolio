import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

// Breathing room above a section's heading. Below `lg` the dashboard's sticky
// top bar covers the first 56px of the viewport, so clear that as well.
export const SCROLL_OFFSET = 12
const MOBILE_BAR_HEIGHT = 56
const mobileBarOffset = () =>
  typeof window !== 'undefined' && window.innerWidth < 1024 ? MOBILE_BAR_HEIGHT : 0

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Smooth-scrolls a section to the top of the viewport. Accepts a selector or an
// element; a target that isn't in the document is a no-op rather than a throw.
// Pass offsetY to override the default clearance.
export function scrollToSection(target, offsetY) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return

  if (offsetY == null) offsetY = SCROLL_OFFSET + mobileBarOffset()

  try {
    gsap.to(window, {
      duration: prefersReducedMotion() ? 0 : 0.8,
      ease: 'power2.out',
      scrollTo: { y: el, offsetY, autoKill: false },
    })
  } catch {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}
