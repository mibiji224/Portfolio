import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

// Horizontal rail: a row you move through sideways, with edge-aware arrows.
const Rail = ({ children }) => {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const sync = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // Axis lock for trackpad and wheel gestures. A sideways swipe always carries a
  // little vertical movement, which would otherwise scroll the page while the
  // row moves. So a gesture that starts sideways is locked to the row: the page
  // stays still and the row follows the fingers. A gesture that starts vertical,
  // or a clearly vertical push partway through, hands control back to the page.
  // A gesture ends when the wheel events go quiet.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const IDLE_MS = 160
    const lock = { axis: null, last: 0, timer: 0 }

    const onWheel = (e) => {
      const now = performance.now()
      if (now - lock.last > IDLE_MS) lock.axis = null
      lock.last = now

      const ax = Math.abs(e.deltaX)
      const ay = Math.abs(e.deltaY)
      if (!lock.axis) lock.axis = ax > ay ? 'x' : 'y'
      // Locked sideways, but the person has clearly turned to scroll up or down.
      else if (lock.axis === 'x' && ay > 20 && ay > ax * 3) lock.axis = 'y'

      if (lock.axis !== 'x') return
      e.preventDefault()
      // Keep the event from reaching the page-level smooth scroller too.
      e.stopPropagation()

      // Snapping would pull each small step straight back to the nearest card,
      // so it is switched off while the swipe lasts and back on when it ends.
      el.style.scrollSnapType = 'none'
      clearTimeout(lock.timer)
      lock.timer = setTimeout(() => { el.style.scrollSnapType = '' }, IDLE_MS)
      el.scrollLeft += e.deltaX
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      clearTimeout(lock.timer)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  const move = (dir) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });

  const arrow = 'absolute top-1/2 z-20 -translate-y-1/2 h-10 w-10 rounded-full border border-primary bg-background text-primary-strong shadow-lift hover:bg-primary-soft disabled:opacity-0 disabled:pointer-events-none';

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" aria-label="Scroll left" disabled={edge.start} onClick={() => move(-1)} className={`${arrow} left-2`}>
        <ChevronLeft />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Scroll right" disabled={edge.end} onClick={() => move(1)} className={`${arrow} right-2`}>
        <ChevronRight />
      </Button>

      <div
        ref={ref}
        onScroll={sync}
        className="flex gap-4 overflow-x-auto overscroll-x-contain snap-x snap-proximity scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

export default Rail
