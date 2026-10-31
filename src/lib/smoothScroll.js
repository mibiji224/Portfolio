import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion, registerSmoothScroller } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

// Wheel/trackpad softening. `wheelMultiplier` is the sensitivity (1 = native;
// lower moves the page less per notch) and `lerp` the glide (lower = softer).
const WHEEL_MULTIPLIER = 0.8
const LERP = 0.1

let lenis = null

// A sideways swipe on a trackpad always carries a little vertical movement.
// Lenis would take that for a real scroll and glide the page up and down while
// a carousel moves sideways. So a gesture that is mostly horizontal is left to
// the browser (which locks it to one axis), and for a moment after one the
// stray vertical bits that trail off are left alone too.
const AXIS_LOCK_MS = 200
let lastSideways = 0

const verticalOnly = ({ deltaX, deltaY }) => {
  const now = performance.now()
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    lastSideways = now
    return false
  }
  return now - lastSideways > AXIS_LOCK_MS
}

// Starts the smooth scroller and ties it to GSAP's ticker and ScrollTrigger.
// Returns a cleanup. Skipped entirely for visitors who ask for less motion.
export function startSmoothScroll() {
  // Phones and tablets keep native scrolling: it has the platform's own
  // momentum, and a JS scroller fighting it is what strands the page.
  if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return () => {}

  lenis = new Lenis({ wheelMultiplier: WHEEL_MULTIPLIER, lerp: LERP, virtualScroll: verticalOnly })
  registerSmoothScroller(lenis)
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    registerSmoothScroller(null)
    lenis.destroy()
    lenis = null
  }
}
