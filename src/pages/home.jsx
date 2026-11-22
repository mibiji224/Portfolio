import FluidBackground from '../components/FluidBackground';
import gsap from 'gsap';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
// Ensure these paths match your project structure
import { Button } from '@/components/ui/button'
import { useMagnetic } from '@/hooks/useMagnetic'

// Comic "POW" burst behind the portrait, centred on her, traced from a reference:
// a sharp, uneven explosion with a few very long needle spikes (lower-left,
// lower-right and upper-right) and many short ones. It is built from nested
// copies of one outline in tonal pinks, with no outlines at all: the bands are
// just the gaps between copies. The pale outer band and the two mid-pink bands
// are real frosted glass (a clipped translucent div with a backdrop blur), so the
// page's soft background shows through them. Everything is placed in the
// portrait's own coordinate space (1000 x 1164) so it stays locked to her.
const VB = { x: -400, y: -250, w: 1800, h: 1700 } // the drawing area, wider than the photo
const pct = ([x, y]) => `${(((x - VB.x) / VB.w) * 100).toFixed(2)}% ${(((y - VB.y) / VB.h) * 100).toFixed(2)}%`
const clip = (pts) => `polygon(${pts.map(pct).join(',')})`
const poly = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

// A comic starburst with deliberately uneven cones: fourteen spikes at even spacing,
// each its own length and leaning a little off its slot, so the silhouette reads as
// abstract rather than as a gear. The lengths are fixed per spike and shared by
// every layer, with no twist between layers, so the nested bands stay tidy.
// [length 0..1, lean as a fraction of the slot]. The two that point at the text
// (left side) are kept shorter.
const SPIKES = [
    [1.0, 0], [0.7, 0.14], [0.9, -0.1], [0.58, 0.1], [0.96, -0.16], [0.66, 0.08], [0.84, -0.06],
    [0.5, 0.12], [0.62, -0.12], [1.0, 0.1], [0.62, -0.08], [0.88, 0.16], [0.7, -0.14], [0.94, 0.06],
]
const TILT = -9 // degrees, so it is not perfectly upright

// One outline, scaled: `size` is the length of the longest spike. It is stretched
// sideways by WIDE, so the burst is wider than it is tall, like the photo's frame.
const WIDE = 1.22
const burst = (cx, cy, size) => {
    const n = SPIKES.length
    const pts = []
    SPIKES.forEach(([length, lean], i) => {
        const tip = ((i + lean) / n * 360 + TILT) * (Math.PI / 180)
        const notch = (((i + 0.5) / n) * 360 + TILT) * (Math.PI / 180)
        pts.push([cx + size * WIDE * length * Math.cos(tip), cy + size * length * Math.sin(tip)])
        pts.push([cx + size * WIDE * 0.44 * Math.cos(notch), cy + size * 0.44 * Math.sin(notch)])
    })
    return pts
}

// Centred on her back: (575, 600) is the middle of her body in the photo's space.
const CX = 575
const CY = 600
const SIZE = 780
const L1 = burst(CX, CY, SIZE) // pale glass band
const L2 = burst(CX, CY, SIZE * 0.84) // coral band
const L3 = burst(CX, CY, SIZE * 0.68) // butter glass
const L4 = burst(CX, CY, SIZE * 0.52) // pink band
const SHADOW = burst(CX + 30, CY + 38, SIZE) // hard offset shadow: the depth
const CORE = (() => {
    // The small light star in the middle: eight even points.
    const pts = []
    for (let i = 0; i < 16; i++) {
        const r = i % 2 === 0 ? SIZE * 0.3 : SIZE * 0.14
        const a = ((i / 16) * 360 - 20) * (Math.PI / 180)
        pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a)])
    }
    return pts
})()

// The project cards' palette: the site's soft pinks only, nothing dark.
const SOFT = 'hsl(var(--primary-soft))'
const PINK = 'hsl(var(--primary))'
const CORAL = 'hsl(var(--primary-deep))'
// Soft accents beside the pinks, for variety: peach and butter.
const PEACH = 'hsl(18 100% 86%)'
const BUTTER = 'hsl(45 100% 85%)'

// Both layer kinds fill the same extended box around the photo.
const AREA = { left: '-40%', top: `${(VB.y / 1164) * 100}%`, width: '180%', height: `${(VB.h / 1164) * 100}%` }

const Layer = ({ children }) => (
    <svg aria-hidden="true" focusable="false" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute max-w-none" style={AREA}>
        {children}
    </svg>
)

const Glass = ({ points, background, blur }) => (
    <div
        aria-hidden="true"
        className="absolute"
        style={{
            ...AREA,
            clipPath: clip(points),
            WebkitClipPath: clip(points),
            background,
            backdropFilter: `blur(${blur}px) saturate(1.35)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(1.35)`,
        }}
    />
)

const HeroBackdrop = ({ className }) => (
    <div aria-hidden="true" className={`${className} aspect-[1000/1164]`}>
        {/* Halftone dot patches: a square grid, fading out at the edges. */}
        <Layer>
            <defs>
                <pattern id="hero-dots" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="14" cy="14" r="7" style={{ fill: PINK }} />
                </pattern>
                <radialGradient id="hero-dots-fade">
                    <stop offset="0" stopColor="#fff" />
                    <stop offset="0.6" stopColor="#fff" stopOpacity="0.7" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <mask id="hero-dots-mask" maskUnits="userSpaceOnUse" x={VB.x} y={VB.y} width={VB.w} height={VB.h}>
                    <ellipse cx="140" cy="170" rx="210" ry="170" fill="url(#hero-dots-fade)" />
                    <ellipse cx="50" cy="900" rx="190" ry="210" fill="url(#hero-dots-fade)" />
                    <ellipse cx="900" cy="130" rx="190" ry="130" fill="url(#hero-dots-fade)" />
                </mask>
            </defs>
            <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="url(#hero-dots)" mask="url(#hero-dots-mask)" opacity="0.6" />
        </Layer>

        {/* Depth: the same outline, pushed down and right, as a hard comic shadow. */}
        <Layer>
            <polygon points={poly(SHADOW)} style={{ fill: CORAL }} opacity="0.5" />
        </Layer>

        {/* Outer band: pale pink glass. */}
        <Glass
            points={L1}
            blur={7}
            background="linear-gradient(135deg, rgba(255,219,224,0.62), rgba(254,195,202,0.34))"
        />

        {/* Coral band, printed with a halftone texture like a comic page. */}
        <Layer>
            <defs>
                <pattern id="hero-print" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                    <circle cx="11" cy="11" r="4.5" fill="#fff" />
                </pattern>
            </defs>
            <polygon points={poly(L2)} style={{ fill: CORAL }} opacity="0.62" />
            <polygon points={poly(L2)} fill="url(#hero-print)" opacity="0.42" />
        </Layer>

        {/* Butter-yellow glass band with a peach glow toward the edge. */}
        <Glass
            points={L3}
            blur={10}
            background={`linear-gradient(150deg, ${BUTTER}, rgba(255,214,170,0.86))`}
        />

        {/* Pink band, then a peach ring and the pale star in the middle. */}
        <Layer>
            <polygon points={poly(L4)} style={{ fill: PINK }} />
            <polygon points={poly(CORE)} style={{ fill: PEACH }} />
            <polygon points={poly(burst(CX, CY, SIZE * 0.2))} style={{ fill: SOFT }} />
        </Layer>
    </div>
)

// --- MAIN HOME COMPONENT ---
const DEFAULT_ROLES = ["a Software Developer", "a Leader", "a Project Manager", "a Designer", "an Innovator", "an Engineer", "a Creative Thinker", "a Project Manager"];
const TYPING_SPEED = 80;
const DELETING_SPEED = 45;
const HOLD_AFTER_TYPED = 1800;
const PAUSE_BEFORE_TYPING = 400;

function Home({ onReadMore, roles, deepLink = false }) {
    // The roles that type out under the name: from the dashboard, else the defaults.
    const ROLES = useMemo(() => (roles?.length ? roles : DEFAULT_ROLES), [roles]);
    const comp = useRef(null);
    // Reloading on another page must not bring the hero's photo and backdrop with it: they
    // are not drawn (or fetched) until the visitor scrolls back up to the hero.
    const [showArt, setShowArt] = useState(!deepLink);
    useEffect(() => {
        if (showArt) return;
        let leftHero = false;
        const check = () => {
            if (window.scrollY >= window.innerHeight * 0.9) leftHero = true;
            // Only after they have been down in the page, so the jump to their section
            // (which starts from the top) doesn't count as visiting the hero.
            if (leftHero && window.scrollY < window.innerHeight * 0.8) setShowArt(true);
        };
        window.addEventListener('scroll', check, { passive: true });
        check();
        return () => window.removeEventListener('scroll', check);
    }, [showArt]);
    // On the main page the photo and backdrop make their bounce entrance every time it loads.
    const animateArt = !deepLink;
    const [roleIndex, setRoleIndex] = useState(0);
    const [typedRole, setTypedRole] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const readMoreRef = useRef(null);
    const linkedinRef = useRef(null);
    const githubRef = useRef(null);
    useMagnetic(readMoreRef);
    useMagnetic(linkedinRef);
    useMagnetic(githubRef);

    useEffect(() => {
        const fullRole = ROLES[roleIndex % ROLES.length];

        // Finished typing: hold the complete word before erasing it
        if (!isDeleting && typedRole === fullRole) {
            const hold = setTimeout(() => setIsDeleting(true), HOLD_AFTER_TYPED);
            return () => clearTimeout(hold);
        }

        // Finished erasing: brief beat, then move on to the next role
        if (isDeleting && typedRole === "") {
            const next = setTimeout(() => {
                setIsDeleting(false);
                setRoleIndex((prev) => (prev + 1) % ROLES.length);
            }, PAUSE_BEFORE_TYPING);
            return () => clearTimeout(next);
        }

        const tick = setTimeout(
            () => setTypedRole((prev) => fullRole.slice(0, prev.length + (isDeleting ? -1 : 1))),
            isDeleting ? DELETING_SPEED : TYPING_SPEED
        );
        return () => clearTimeout(tick);
    }, [typedRole, isDeleting, roleIndex, ROLES]);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const t1 = gsap.timeline();
            t1.from(".gsap-reveal", { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={comp} className="relative min-h-[100dvh] w-full bg-transparent text-foreground font-['Poppins'] overflow-hidden">
            <FluidBackground />
            <style>{`
                @keyframes caretBlink { 0%, 49% { opacity:1; } 50%, 100% { opacity:0; } }

                /* Entrance: the burst pops open from its centre and overshoots, then she
                   bounces up into it. The individual translate / scale / rotate properties
                   are used so they stack on top of the centring transform on small screens. */
                @keyframes heroPop {
                    0%   { opacity: 0; scale: 0.15; rotate: -14deg; }
                    45%  { opacity: 1; scale: 1.14; rotate: 4deg; }
                    65%  { scale: 0.94; rotate: -2deg; }
                    82%  { scale: 1.04; rotate: 1deg; }
                    100% { opacity: 1; scale: 1; rotate: 0deg; }
                }
                @keyframes heroRise {
                    0%   { opacity: 0; translate: 0 75dvh; }
                    10%  { opacity: 1; }
                    52%  { translate: 0 -5dvh; }
                    70%  { translate: 0 2.2dvh; }
                    85%  { translate: 0 -1dvh; }
                    100% { opacity: 1; translate: 0 0; }
                }
                .hero-pop {
                    transform-origin: 57.5% 51.5%;
                    animation: heroPop 1000ms cubic-bezier(0.22, 0.9, 0.3, 1) both;
                }
                .hero-rise {
                    animation: heroRise 1100ms cubic-bezier(0.25, 0.8, 0.35, 1) 260ms both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .hero-pop, .hero-rise { animation: none; }
                }
            `}</style>
            <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 sm:px-8 lg:pl-[14vw] lg:pr-20 pt-12 lg:py-0 pb-[44dvh] lg:pb-0" id="home">
                {/* Portrait: anchored to the bottom edge and bleeding off it. Beside the
                    text on desktop; under it on small screens. */}
                {showArt && <HeroBackdrop className={`${animateArt ? 'hero-pop' : ''} pointer-events-none select-none absolute -bottom-[3dvh] left-1/2 -translate-x-1/2 h-[43dvh] w-auto max-w-none lg:left-auto lg:right-[9%] lg:translate-x-0 lg:h-[104dvh] lg:-bottom-[7dvh]`} />}
                {showArt && <img
                    src="/desiree-hero.webp"
                    alt="Desiree Soronio"
                    width="1000"
                    height="1164"
                    fetchPriority="high"
                    decoding="async"
                    draggable="false"
                    className={`${animateArt ? 'hero-rise' : ''} pointer-events-none select-none absolute -bottom-[3dvh] left-1/2 -translate-x-1/2 h-[43dvh] w-auto max-w-none lg:left-auto lg:right-[9%] lg:translate-x-0 lg:h-[104dvh] lg:-bottom-[7dvh] drop-shadow-[0_18px_30px_hsl(var(--primary-deep)/0.25)]`}
                />}
                <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl lg:max-w-none lg:w-1/2 lg:mr-auto">
                    <span className="gsap-reveal text-primary-strong font-bold tracking-widest uppercase text-xs sm:text-sm lg:text-base mb-3 lg:mb-4 block">Welcome to my Portfolio</span>
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight tracking-tight">
                        <span className="gsap-reveal block text-matcha-ink">Hello, I'm</span>
                        <span className="gsap-reveal block text-transparent bg-clip-text bg-gradient-to-r from-primary-deep via-primary-deep to-primary-strong drop-shadow-[0_2px_12px_hsl(var(--primary)/0.3)]">Desiree.</span>
                    </h1>
                    <div className="gsap-reveal flex flex-row items-baseline justify-center lg:justify-start gap-1.5 mt-2 sm:mt-4 text-lg sm:text-3xl lg:text-4xl font-semibold w-full">
                        <span className="text-primary-strong whitespace-nowrap">I am</span>

                        {/* The role sits in normal flow rather than in a slot sized to the
                            longest role: a fixed slot is what the row centres on, which
                            leaves shorter roles parked left of centre on mobile. */}
                        <span
                            className="text-matcha-ink whitespace-nowrap"
                            aria-label={ROLES[roleIndex % ROLES.length]}
                        >
                            {typedRole}
                            <span
                                aria-hidden="true"
                                className="inline-block w-[2px] sm:w-[3px] h-[0.85em] translate-y-[0.08em] ml-0.5 sm:ml-1 bg-matcha-strong animate-[caretBlink_1s_step-end_infinite]"
                            ></span>
                        </span>
                    </div>
                    <div className="gsap-reveal flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center lg:justify-start mt-6 sm:mt-8 lg:mt-10">
                        <Button
                            ref={readMoreRef}
                            onClick={onReadMore}
                            size="pill"
                            className="group relative overflow-hidden transition-[background-color,box-shadow] text-primary-strong"
                        >
                            <span data-magnetic-label className="relative z-10">Read More</span>
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0"></div>
                        </Button>
                        <div className="flex gap-4">
                            <a ref={linkedinRef} href="https://www.linkedin.com/in/desireesoronio/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-matcha/40 flex items-center justify-center text-matcha-strong hover:bg-matcha hover:text-matcha-foreground hover:border-matcha transition-colors duration-300">
                                <svg data-magnetic-label className="relative z-10" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a ref={githubRef} href="https://github.com/mibiji224" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-matcha/40 flex items-center justify-center text-matcha-strong hover:bg-matcha hover:text-matcha-foreground hover:border-matcha transition-colors duration-300">
                                <svg data-magnetic-label className="relative z-10" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;