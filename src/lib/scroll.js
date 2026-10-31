// Set by smoothScroll.js once Lenis is running; programmatic scrolls go through
// it so the two don't fight over the scroll position.
let smoothScroller = null
export const registerSmoothScroller = (instance) => { smoothScroller = instance }

// Lenis scrolls the page itself on wheel input, which slips past a modal's
// scroll lock, so dialogs pause it while they are open.
export const pauseSmoothScroll = () => smoothScroller?.stop()
export const resumeSmoothScroll = () => smoothScroller?.start()

// Hard lock for the hero: the page cannot scroll until the visitor presses
// Read More. CSS (`.scroll-locked`) blocks wheel, touch and keyboard scrolling
// on the document; Lenis is paused so it can't move the page behind it.
const LOCK_CLASS = 'scroll-locked'
export const lockScroll = () => {
  document.documentElement.classList.add(LOCK_CLASS)
  smoothScroller?.stop()
}
export const unlockScroll = () => {
  document.documentElement.classList.remove(LOCK_CLASS)
  smoothScroller?.start()
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Smooth-scrolls to an element, a selector, or a y offset (0 = top of page).
// A target that isn't in the document is a no-op rather than a throw.
export function scrollToTarget(target, { duration = 1.2, offsetY = 0 } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el == null) return

  if (smoothScroller) {
    smoothScroller.scrollTo(el, { offset: offsetY, duration })
    return
  }

  // Native scrolling (touch devices, or Lenis not running). Computed as a plain
  // page offset so it works the same for an element, a selector or a number.
  const top = typeof el === 'number'
    ? el + offsetY
    : el.getBoundingClientRect().top + window.scrollY + offsetY
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
