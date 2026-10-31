import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useOutletContext } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageShell from '@/components/PageShell'
import { LEADERSHIP_ROLES, WORK_EXPERIENCE } from '@/data/profile'
import { prefersReducedMotion } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

const GAP = 16
const MARGIN = 12

// The card in the reading position is enlarged; hover adds a little on top.
const SPOTLIGHT = 1.04
const HOVER = 1.03

// The preview that carries an item's bullet points while hovering; it follows
// the cursor. Clicking a card opens the full details in a modal instead.
// Rendered in a portal because the cards scale, and a transformed ancestor
// would stop `position: fixed` from meaning the viewport.
const DetailCard = ({ item, pointRef, id }) => {
    const ref = useRef(null)

    const place = useCallback(() => {
        const el = ref.current
        if (!el) return
        const { x, y } = pointRef.current
        const { offsetWidth: w, offsetHeight: h } = el
        let left = x + GAP
        if (left + w > window.innerWidth - MARGIN) left = x - GAP - w
        let top = y + GAP
        if (top + h > window.innerHeight - MARGIN) top = y - GAP - h
        left = Math.max(MARGIN, left)
        top = Math.max(MARGIN, top)
        el.style.transform = `translate3d(${left}px, ${top}px, 0)`
    }, [pointRef])

    useLayoutEffect(place, [item, place])

    useEffect(() => {
        window.addEventListener('mousemove', place)
        return () => window.removeEventListener('mousemove', place)
    }, [place])

    return createPortal(
        <div
            ref={ref}
            id={id}
            role="tooltip"
            className="pointer-events-none fixed left-0 top-0 z-50 w-80 max-w-[calc(100vw-1.5rem)] rounded-xl border border-primary bg-background p-4 shadow-lift animate-in fade-in duration-150"
        >
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="mb-2 text-xs text-muted-foreground">{item.company}</p>
            <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground marker:text-primary-strong">
                {item.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
        </div>,
        document.body
    )
}

// Growing is springy (GSAP's elastic ease; amplitude 1, period 0.55 keeps it
// to a small bounce). Scrolling hands the spotlight from card to card: the
// one crossing the reading line grows, the one it replaces settles back.
const Card = ({ item, open, spotlit, edge, onSpot, onHover, onMove, onLeave, onOpen }) => {
    const ref = useRef(null)
    const base = useRef(1)

    const grow = (scale, vars) => {
        if (prefersReducedMotion()) return
        // On phones the cards fill the column, so growing them would push them
        // past the screen edge; the highlight colour alone marks the spotlight.
        if (window.matchMedia('(max-width: 639px)').matches) scale = 1
        gsap.to(ref.current, { scale, overwrite: 'auto', ...vars })
    }

    useEffect(() => {
        base.current = spotlit ? SPOTLIGHT : 1
        grow(base.current, { duration: 0.9, ease: 'elastic.out(1, 0.55)' })
    }, [spotlit])

    // Active while the card straddles the reading line, 30% down the screen,
    // so nothing moves until the first card has reached the top part of the
    // screen. Scrolling out of the section at either end clears it.
    useLayoutEffect(() => {
        const trigger = ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 30%',
            end: 'bottom 30%',
            onEnter: () => onSpot(item),
            onEnterBack: () => onSpot(item),
            onLeaveBack: () => edge === 'first' && onSpot(null),
            onLeave: () => edge === 'last' && onSpot(null),
        })
        return () => trigger.kill()
    }, [item, edge, onSpot])

    const openFromKey = (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        onOpen(item)
    }

    return (
        <div
            ref={ref}
            data-exp-card
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-describedby={open ? 'exp-detail' : undefined}
            onMouseEnter={(e) => {
                grow(base.current * HOVER, { duration: 0.9, ease: 'elastic.out(1, 0.55)' })
                onHover(item, { x: e.clientX, y: e.clientY })
            }}
            onMouseMove={(e) => onMove({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => {
                grow(base.current, { duration: 0.6, ease: 'elastic.out(1, 0.7)' })
                onLeave()
            }}
            onClick={() => onOpen(item)}
            onKeyDown={openFromKey}
            className={`cursor-pointer rounded-xl border hover:bg-primary-soft ${spotlit ? 'bg-primary-soft' : 'bg-white'} ${spotlit ? 'border-primary-strong ring-2 ring-primary shadow-lift' : 'border-primary'} transition-[background-color,border-color,box-shadow] duration-300 p-4 sm:p-6 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0 sm:flex-1">
                    <h3 className={`text-base font-bold mb-0.5 transition-colors duration-300 ${spotlit ? 'text-primary-strong' : 'text-foreground'}`}>{item.title}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{item.company}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0 sm:flex-col sm:items-end">
                    <span className="whitespace-nowrap text-[10px] font-mono font-medium text-primary-strong border border-primary px-2.5 py-0.5 rounded-full bg-background">
                        {item.date}
                    </span>
                    {item.note && (
                        <span className="text-[10px] sm:text-[9px] font-bold px-2 sm:px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-secondary text-foreground sm:whitespace-nowrap">
                            {item.note}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

const Timeline = ({ items, tip, first, last }) => (
    <ol className="relative border-l border-border ml-2 sm:ml-3 space-y-4 sm:space-y-6">
        {items.map((item, i) => (
            <li key={`${item.title}-${item.company}`} className="relative ml-7 sm:ml-8">
                <span className="absolute -left-[41px] sm:-left-[45px] top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 bg-background rounded-full border border-primary">
                    <div className="w-2 h-2 bg-primary-strong rounded-full"></div>
                </span>
                <Card
                    item={item}
                    open={tip.item === item}
                    spotlit={tip.spot === item}
                    onSpot={tip.setSpot}
                    edge={(first && i === 0 && 'first') || (last && i === items.length - 1 && 'last') || undefined}
                    {...tip.handlers}
                />
            </li>
        ))}
    </ol>
)

const Group = ({ title, children }) => (
    <div className="mt-10 first:mt-0">
        <h2 className="mb-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</h2>
        {children}
    </div>
)

// Database rows -> what the cards show. Rows from before the migration have no
// `kind`, so they count as "nothing there" and the built-in lists are used.
const fromRows = (rows) => {
    const usable = (rows ?? []).filter((r) => r.kind)
    if (!usable.length) return null
    const shape = (r) => ({ title: r.title, company: r.company, date: r.date, note: r.type, points: r.points ?? [] })
    return {
        work: usable.filter((r) => r.kind === 'work').map(shape),
        leadership: usable.filter((r) => r.kind === 'leadership').map(shape),
    }
}

const Experience = () => {
    const { experience } = useOutletContext()
    // Memoised: the cards re-create their scroll triggers whenever an item's
    // identity changes, and a trigger that fires on creation sets state, so a
    // fresh array on every render would loop forever.
    const lists = useMemo(
        () => fromRows(experience) ?? { work: WORK_EXPERIENCE, leadership: LEADERSHIP_ROLES },
        [experience]
    )
    const [shown, setShown] = useState(null)
    // `detail` is kept after closing so the dialog can finish its exit
    // animation and unmount cleanly; `open` is what actually shows it.
    const [detail, setDetail] = useState(null)
    const [open, setOpen] = useState(false)
    const [spot, setSpot] = useState(null)
    const point = useRef({ x: 0, y: 0 })

    const handlers = {
        onHover: (item, p) => {
            point.current = p
            setShown(item)
        },
        onMove: (p) => {
            point.current = p
        },
        onLeave: () => setShown(null),
        // Click, tap or Enter: the details open in a modal over a blurred page.
        // Closing it (X, Esc, or a click outside) leaves the page exactly as it was.
        onOpen: (item) => {
            setShown(null)
            setDetail(item)
            setOpen(true)
        },
    }

    // Setting the same card again is a no-op, so a trigger firing twice can't loop.
    const spotOnce = useCallback((item) => setSpot((prev) => (prev === item ? prev : item)), [])
    const tip = { item: shown, handlers, spot, setSpot: spotOnce }

    return (
        <PageShell
            index="01"
            label="experience"
            title="Experience"
            description="Professional work, then leadership roles and affiliations, newest first. Hover for a preview, or click a role to open the details."
        >
            <Group title="Work Experience">
                <Timeline items={lists.work} tip={tip} first />
            </Group>
            <Group title="Leadership Roles & Affiliations">
                <Timeline items={lists.leadership} tip={tip} last />
            </Group>

            {shown && !open && <DetailCard id="exp-detail" item={shown} pointRef={point} />}

            <Dialog open={open} onOpenChange={setOpen}>
                {detail && (
                    <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-2 pr-8">
                            <span className="whitespace-nowrap text-[10px] font-mono font-medium text-primary-strong border border-primary px-2.5 py-0.5 rounded-full bg-background">
                                {detail.date}
                            </span>
                            {detail.note && (
                                <span className="whitespace-nowrap text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-secondary text-foreground">
                                    {detail.note}
                                </span>
                            )}
                        </div>
                        <DialogTitle className="mt-3 text-xl font-bold leading-snug text-foreground">
                            {detail.title}
                        </DialogTitle>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">{detail.company}</p>
                        <ul className="mt-5 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-primary-strong">
                            {detail.points.map((point) => <li key={point}>{point}</li>)}
                        </ul>
                    </DialogContent>
                )}
            </Dialog>
        </PageShell>
    )
}

export default Experience
