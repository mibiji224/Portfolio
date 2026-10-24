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

// Starts the smooth scroller and ties it to GSAP's ticker and ScrollTrigger.
// Returns a cleanup. Skipped entirely for visitors who ask for less motion.
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {}

  lenis = new Lenis({ wheelMultiplier: WHEEL_MULTIPLIER, lerp: LERP })
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
