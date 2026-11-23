import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/scroll'
import ScrollDots from '@/components/ScrollDots'
import useTilt, { TILT } from '@/hooks/useTilt'

/*
 * A scroll-driven 3D ring of cards, after the "Selected Work" scene on
 * ilijakorodic.com (the motion is the same; the look is this site's).
 *
 *  - The component is a tall wrapper holding a sticky stage. Scrolling the
 *    wrapper turns the ring under a 1400px perspective (1000px on phones).
 *  - Cards sit on the far side of a cylinder and face inward, `spacing` degrees
 *    apart, zigzagging up and down so neighbours never overlap. They fade out
 *    past the edge of a ~66 degree arc, so about three are visible at a time.
 *  - The whole ring takes at most ~3 screens of scrolling, however many cards.
 *
 * The caller decides what a card looks like (`renderCard`) and what a click does
 * (`onOpen`).
 */

const SPACING_DESKTOP = 46 // degrees between neighbouring cards
const SPACING_PHONE = 40
const VISIBLE = 66 // degrees either side of the front that stay visible

const usePhone = () => {
    const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640)
    useEffect(() => {
        const on = () => setPhone(window.innerWidth < 640)
        window.addEventListener('resize', on)
        return () => window.removeEventListener('resize', on)
    }, [])
    return phone
}

export const ringSurface =
    'overflow-hidden rounded-2xl border border-primary bg-white shadow-[0_18px_40px_-22px_rgba(229,108,124,0.55)]'

// One card on the ring. Scroll places it on the cylinder; hovering adds the mouse tilt on top.
const RingCard = ({ dims, visible, away, spacing, calm, base, angle, zig, fade, ariaLabel, onOpen, children }) => {
    const { ref, tilt, active, bind } = useTilt()
    return (
        <div
            ref={ref}
            role="button"
            data-fluid-block
            tabIndex={visible && away < spacing / 2 + 1 ? 0 : -1}
            aria-label={ariaLabel}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onOpen()
                }
            }}
            {...bind}
            className={`group absolute cursor-pointer ${ringSurface} hover:border-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            style={{
                width: dims.width,
                height: dims.height,
                marginLeft: -dims.width / 2,
                marginTop: -dims.height / 2,
                transform: `rotateY(${angle}deg) translateZ(${-base.radius}px) translateY(${zig}px) ${tilt}`,
                opacity: fade,
                zIndex: Math.round(100 - away),
                backfaceVisibility: 'hidden',
                pointerEvents: visible ? 'auto' : 'none',
                willChange: active ? 'transform' : undefined,
                transition: calm
                    ? 'none'
                    : `transform ${active ? `${TILT.speed}ms ${TILT.easing}` : '0.15s ease-out'}, opacity 0.25s ease, border-color 0.3s`,
            }}
        >
            {children}
        </div>
    )
}

const Ring3D = ({
    items,
    getKey,
    renderCard,
    onOpen,
    label,
    title,
    heading,
    clearance,
    hint = 'Scroll to turn the ring. Click to open.',
    size,
    itemSize,
    children,
}) => {
    const phone = usePhone()
    const calm = prefersReducedMotion()
    const wrapRef = useRef(null)
    const stageRef = useRef(null)
    const [position, setPosition] = useState(0) // which card is at the front, as a fraction
    const count = items.length

    // Card sizes: `size` has a desktop and a phone set; each is {width, height, radius, lift}.
    const base = phone
        ? { width: 290, height: 190, lift: 100, ...size?.phone }
        : { width: 600, height: 230, lift: 135, ...size?.desktop }
    // The ring's radius follows the card width, so the gap between neighbours stays a
    // little over half a card however big the cards are: close, but never touching.
    base.radius = size?.[phone ? 'phone' : 'desktop']?.radius ?? Math.round(base.width * (phone ? 1.5 : 1.4))
    const SPACING = phone ? SPACING_PHONE : SPACING_DESKTOP
    const perspective = phone ? 1000 : 1400
    // As tall as the cards need (the tallest card, plus how far the zigzag takes it, plus
    // room for the dots and for a hovered card's tilt to grow), not the whole screen, and centred on screen while pinned.
    const STAGE = `min(${base.height + base.lift * 2 + 32}px, calc(100dvh - 13rem))`
    // The heading and hint ride along in the pinned frame, above the ring, so the section
    // title stays on screen for as long as the ring is turning.
    const HEAD = 60
    const clearanceTop = phone ? clearance?.phone : clearance?.desktop
    // However many cards there are, the ring never takes more than ~3 screens to turn.
    const perCard = count > 1 ? Math.min(34, 280 / (count - 1)) : 0

    useLayoutEffect(() => {
        const wrap = wrapRef.current
        const stage = stageRef.current
        if (!wrap || !stage) return
        let queued = false
        const update = () => {
            queued = false
            const stuckAt = parseFloat(getComputedStyle(stage).top) || 0
            const travel = wrap.offsetHeight - stage.offsetHeight
            if (travel <= 0) return setPosition(0)
            const progress = Math.max(0, Math.min(1, (stuckAt - wrap.getBoundingClientRect().top) / travel))
            setPosition(progress * (count - 1))
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
    }, [count, phone])

    if (!count) return null

    // Cards are spaced by their own widths, not by a fixed angle, so a wide card and a
    // narrow one both keep the same gap to their neighbours. `centers` is how far along the
    // ring (in px) each card's middle sits. With equal cards this is the old even spacing.
    const sizes = items.map((item) => (itemSize ? itemSize(item, base) : base))
    const ARC_GAP = base.width * 0.14
    const centers = sizes.reduce((acc, size, i) => {
        acc.push(i === 0 ? 0 : acc[i - 1] + (sizes[i - 1].width + size.width) / 2 + ARC_GAP)
        return acc
    }, [])
    const lo = Math.floor(position)
    const hi = Math.min(count - 1, lo + 1)
    const here = centers[lo] + (centers[hi] - centers[lo]) * (position - lo)

    return (
        <div
            ref={wrapRef}
            className="relative"
            style={{ height: `calc(${STAGE} + ${HEAD}px + ${(count - 1) * perCard}dvh)` }}
        >
            <div
                ref={stageRef}
                className="sticky"
                // With a `clearance` the frame pins right under whatever sticky header sits above
                // it; without one it pins in the middle of the screen.
                style={{ top: clearanceTop ?? `max(4.5rem, calc((100dvh - ${STAGE} - ${HEAD}px) / 2))` }}
            >
            <div style={{ height: HEAD }} className="flex flex-col justify-end pb-3">
                {heading}
                {title && <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</h2>}
                {hint && <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>}
            </div>
            <div
                className="relative overflow-hidden"
                style={{
                    height: STAGE,
                    perspective: `${perspective}px`,
                    perspectiveOrigin: '50% 50%',
                }}
            >
                {/* A soft pink glow behind the ring. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[calc(50%-40px)] h-[520px] w-[620px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(ellipse, hsl(var(--primary-soft)) 0%, transparent 70%)', filter: 'blur(40px)' }}
                />

                <div
                    className="absolute left-1/2 top-[calc(50%-40px)]"
                    style={{ transformStyle: 'preserve-3d', transform: `translateZ(${base.radius * 0.7}px)` }}
                >
                    {items.map((item, i) => {
                        const angle = ((here - centers[i]) / base.radius) * (180 / Math.PI)
                        const away = Math.abs(angle)
                        const visible = away < VISIBLE
                        // Every card on the front arc is fully solid; only the ones leaving it fade out.
                        const fade = visible ? Math.min(1, (VISIBLE - away) / (VISIBLE - SPACING)) : 0
                        // Neighbours zigzag; the card at the front settles toward the middle.
                        const zig = (i % 2 === 0 ? -1 : 1) * base.lift * (0.35 + 0.65 * Math.min(1, away / SPACING))
                        // Cards can have their own shape (`itemSize`), e.g. to match a photo's proportions.
                        const dims = sizes[i]
                        return (
                            <RingCard
                                key={getKey(item, i)}
                                dims={dims}
                                visible={visible}
                                away={away}
                                spacing={SPACING}
                                calm={calm}
                                base={base}
                                angle={angle}
                                zig={zig}
                                fade={fade}
                                ariaLabel={label(item)}
                                onOpen={() => onOpen(item, i)}
                            >
                                {renderCard(item, i, dims)}
                            </RingCard>
                        )
                    })}
                </div>

                {/* Where you are in the ring. */}
                <ScrollDots count={count} position={position} className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2" />
            </div>
            </div>
            {children}
        </div>
    )
}

export default Ring3D
