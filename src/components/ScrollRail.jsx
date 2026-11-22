import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ScrollDots from '@/components/ScrollDots'

/*
 * A straight row of cards that is moved sideways by scrolling the page down, the way
 * the project rings are turned. The component is a tall wrapper holding a sticky frame
 * (heading, the row, the dots). While the frame is pinned, scrolling down slides the row
 * left until the last card is in view; scrolling up slides it back.
 *
 * The row is plain CSS layout, so the cards can be any height.
 */

const FADE = 'linear-gradient(to right, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)'
const FEEL = 0.5 // px of page scroll per px of sideways travel: the row moves faster than the page

const ScrollRail = ({ heading, count, children, className = '' }) => {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const viewRef = useRef(null)
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [size, setSize] = useState({ stage: 0, travel: 0 })

  // Measure the frame and how far the row has to travel. Images change both after loading.
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current?.offsetHeight ?? 0
      const travel = Math.max(0, (trackRef.current?.scrollWidth ?? 0) - (viewRef.current?.clientWidth ?? 0))
      setSize((prev) => (prev.stage === stage && prev.travel === travel ? prev : { stage, travel }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ;[stageRef.current, trackRef.current, viewRef.current].forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [count])

  useEffect(() => {
    let queued = false
    const update = () => {
      queued = false
      const wrap = wrapRef.current
      const stage = stageRef.current
      if (!wrap || !stage) return
      const stuckAt = parseFloat(getComputedStyle(stage).top) || 0
      const scrollable = wrap.offsetHeight - stage.offsetHeight
      if (scrollable <= 0) return setProgress(0)
      setProgress(Math.max(0, Math.min(1, (stuckAt - wrap.getBoundingClientRect().top) / scrollable)))
    }
    const queue = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    update()
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [size])

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      style={{ height: size.stage ? size.stage + size.travel * FEEL : undefined }}
    >
      <div
        ref={stageRef}
        className="sticky"
        // Pinned in the middle of the screen, clear of the phone header.
        style={{ top: size.stage ? `max(4.5rem, calc((100dvh - ${size.stage}px) / 2))` : '4.5rem' }}
      >
        {heading}
        {/* The row fades out at both sides, so each card eases in and out of view. The row has
            matching padding, so the first and last cards still rest in the clear. */}
        <div
          ref={viewRef}
          className="overflow-hidden"
          style={{ WebkitMaskImage: FADE, maskImage: FADE }}
        >
          <div
            ref={trackRef}
            className="flex gap-4 px-12 will-change-transform"
            style={{ transform: `translate3d(${-progress * size.travel}px, 0, 0)` }}
          >
            {children}
          </div>
        </div>
        <ScrollDots count={count} position={progress * (count - 1)} className="mt-6" />
      </div>
    </div>
  )
}

export default ScrollRail
