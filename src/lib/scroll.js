import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

// The nav is plain text at the top of the hero and scrolls away with it, so
// a section only needs a little breathing room above its heading.
export const SCROLL_OFFSET = 12

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Smooth-scrolls a section to the top of the viewport. Accepts a selector or an
// element; a target that isn't in the document is a no-op rather than a throw.
// Pass offsetY to override the default clearance.
export function scrollToSection(target, offsetY) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return

  if (offsetY == null) offsetY = SCROLL_OFFSET

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
