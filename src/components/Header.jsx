import { useEffect, useState } from 'react';

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#connect' },
];

// Plain text links, centred at the top of the hero. It sits in normal flow of
// the page (absolute, not fixed), so it scrolls away with the hero.
function Head({ onNavigate }) {
    const [active, setActive] = useState('#home');

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

    const handleNavClick = (e, href) => {
        // Let middle-click / cmd-click open a new tab
        if (e && (e.metaKey || e.ctrlKey || (e.button && e.button === 1))) return;
        if (e) e.preventDefault();

        setActive(href);
        onNavigate?.(href);
    };

    return (
        <header className="absolute inset-x-0 top-0 z-50 flex justify-center pt-5 sm:pt-7 font-['Poppins']">
            <nav className="flex items-center gap-1 sm:gap-3">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        aria-current={active === link.href ? 'page' : undefined}
                        className={`rounded-full px-3 py-1.5 text-sm sm:px-4 sm:text-[15px]
                            transition-colors duration-300 focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-ring ${
                                active === link.href
                                    ? 'font-semibold text-foreground'
                                    : 'font-normal text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>
        </header>
    );
}

export default Head;
