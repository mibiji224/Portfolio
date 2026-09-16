import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

// Fallback clearance for the floating pill at desktop size: 20px top gap +
// ~64px pill + breathing room. Used only when the pill can't be measured.
export const NAV_OFFSET = 104

// The pill hides itself on downward scroll, so a scroll that travels down
// lands under empty space if it reserves the full clearance. Just a little
// breathing room above the heading is enough.
export const SCROLL_DOWN_OFFSET = 12

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The pill is shorter on phones, so measure it rather than assuming a height.
// offsetTop/offsetHeight ignore the transform that hides it on scroll-down,
// which a getBoundingClientRect() would otherwise report as a negative offset.
function navClearance() {
  const pill = document.querySelector('[data-nav-pill]')
  if (!pill) return NAV_OFFSET
  return pill.offsetTop + pill.offsetHeight + 16
}

// Smooth-scrolls a section under the floating nav. Accepts a selector or an
// element; a target that isn't in the document is a no-op rather than a throw.
// Pass offsetY to override the clearance the nav state would otherwise pick.
export function scrollToSection(target, offsetY) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return

  if (offsetY == null) {
    // A target below the viewport top means we're scrolling down, which is
    // exactly when Header hides the pill, so don't hold a slot open for it.
    const scrollingDown = el.getBoundingClientRect().top > 0
    offsetY = scrollingDown ? SCROLL_DOWN_OFFSET : navClearance()
  }

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
