import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { scrollToSection } from '../lib/scroll';

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#connect' },
];

function Head({ onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [active, setActive] = useState('#home');
    const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0, ready: false });

    const lastScrollY = useRef(0);
    const navRef = useRef(null);
    const labelRefs = useRef({});

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    // Hide on scroll down, reveal on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY > lastScrollY.current && currentY > 80) {
                setIsHidden(true);
                setIsMenuOpen(false);
            } else {
                setIsHidden(false);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reveal when the pointer approaches the top of the viewport
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY <= 80) setIsHidden(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Track which section is in view. Sections mount lazily via Suspense, so
    // keep scanning until every target exists.
    useEffect(() => {
        const observed = new Set();
        const targets = ['#home', ...navLinks.map((l) => l.href)];

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(`#${entry.target.id}`);
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );

        const scan = () => {
            targets.forEach((href) => {
                const el = document.querySelector(href);
                if (el && !observed.has(el)) {
                    observed.add(el);
                    io.observe(el);
                }
            });
            return observed.size === targets.length;
        };

        if (scan()) return () => io.disconnect();

        const mo = new MutationObserver(() => {
            if (scan()) mo.disconnect();
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            mo.disconnect();
            io.disconnect();
        };
    }, []);

    // Park the sliding underline beneath the active link's text (not its
    // padding box), so the rule hugs the word the way it does in the design.
    const measureIndicator = useCallback(() => {
        const el = labelRefs.current[active];
        const nav = navRef.current;
        if (!el || !nav) {
            setIndicator((prev) => ({ ...prev, ready: false }));
            return;
        }

        const navBox = nav.getBoundingClientRect();
        const labelBox = el.getBoundingClientRect();
        setIndicator({
            left: labelBox.left - navBox.left,
            width: labelBox.width,
            top: labelBox.bottom - navBox.top + 3,
            ready: true,
        });
    }, [active]);

    useLayoutEffect(() => {
        measureIndicator();
    }, [measureIndicator]);

    useEffect(() => {
        window.addEventListener('resize', measureIndicator);
        // Re-measure once webfonts settle, since Poppins shifts link widths
        if (document.fonts?.ready) document.fonts.ready.then(measureIndicator);
        return () => window.removeEventListener('resize', measureIndicator);
    }, [measureIndicator]);

    const handleNavClick = (e, href) => {
        // Let middle-click / cmd-click open a new tab
        if (e && (e.metaKey || e.ctrlKey || (e.button && e.button === 1))) return;
        if (e) e.preventDefault();

        setActive(href);
        setIsMenuOpen(false);

        // The page owns scrolling when it has to reveal a hidden section first.
        if (onNavigate) onNavigate(href);
        else scrollToSection(href);
    };

    // Clear-glass pill: mostly the page showing through. The white gradient is
    // now a faint sheen rather than a pane, so the bar reads as transparent over
    // the #080707 page; the thin smoked tint underneath is what keeps the links
    // legible when bright artwork scrolls behind it. A deeper blur and the
    // saturation carry the glass, with the hairline edge and top inset as the
    // only hard highlights.
    const surface = `bg-black/25
        bg-[linear-gradient(100deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.08)_22%,rgba(255,255,255,0.09)_45%,rgba(255,255,255,0.06)_72%,rgba(255,255,255,0.04)_100%)]
        backdrop-blur-xl backdrop-saturate-150
        border border-white/[0.08]
        shadow-[0_18px_40px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)]`;

    return (
        <header
            data-floating-nav
            className={`fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-5 font-['Poppins']
                pointer-events-none transition-[transform,opacity] duration-500 ease-out ${
                    isHidden ? '-translate-y-[130%] opacity-0' : 'translate-y-0 opacity-100'
                }`}
        >
            <div className="pointer-events-auto w-full max-w-7xl">

                {/* --- FLOATING PILL --- */}
                <div
                    data-nav-pill
                    className={`relative flex items-center justify-between gap-3 sm:gap-4 rounded-full
                        py-2 pl-4 pr-2 sm:py-3 sm:pl-8 sm:pr-4 md:pr-8 ${surface}`}
                >
                    {/* --- LOGO --- */}
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, '#home')}
                        className="relative select-none text-xl sm:text-2xl font-black tracking-tight text-white
                            rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                        DR.
                        <span className="text-[#db0a0a]">S</span>
                    </a>

                    {/* --- DESKTOP LINKS --- */}
                    <nav ref={navRef} className="relative hidden items-center md:flex">
                        {/* Sliding underline */}
                        <span
                            aria-hidden="true"
                            style={{
                                transform: `translateX(${indicator.left}px)`,
                                width: `${indicator.width}px`,
                                top: `${indicator.top}px`,
                                opacity: indicator.ready ? 1 : 0,
                            }}
                            className="absolute left-0 h-[2px] rounded-full bg-white
                                transition-[transform,width,opacity,top] duration-500 ease-out"
                        />

                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                aria-current={active === link.href ? 'page' : undefined}
                                className={`relative rounded-full px-4 py-1.5 text-[15px]
                                    transition-colors duration-300 focus-visible:outline-none
                                    focus-visible:ring-2 focus-visible:ring-white/40 ${
                                        active === link.href
                                            ? 'font-semibold text-white'
                                            : 'font-normal text-white/75 hover:text-white'
                                    }`}
                            >
                                <span ref={(el) => (labelRefs.current[link.href] = el)}>
                                    {link.name}
                                </span>
                            </a>
                        ))}
                    </nav>

                    {/* --- MOBILE TOGGLE --- */}
                    <button
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        className="relative rounded-full p-1.5 sm:p-2 text-white transition-transform duration-300
                            active:scale-90 focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-white/40 md:hidden"
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#db0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        )}
                    </button>
                </div>

                {/* --- MOBILE PANEL: a second floating pane, not an attached drawer --- */}
                <div
                    className={`mt-1.5 sm:mt-2 overflow-hidden rounded-2xl sm:rounded-3xl transition-all
                        duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${surface} ${
                            isMenuOpen
                                ? 'max-h-80 opacity-100'
                                : 'pointer-events-none max-h-0 opacity-0'
                        }`}
                >
                    <nav className="flex flex-col p-1.5 sm:p-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                aria-current={active === link.href ? 'page' : undefined}
                                className={`rounded-xl sm:rounded-2xl px-4 py-2.5 text-sm sm:text-base transition-colors
                                    duration-300 focus-visible:outline-none focus-visible:ring-2
                                    focus-visible:ring-white/40 ${
                                        active === link.href
                                            ? 'bg-white/[0.08] font-semibold text-white underline underline-offset-4'
                                            : 'font-normal text-white/75 hover:bg-white/[0.05] hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Head;
