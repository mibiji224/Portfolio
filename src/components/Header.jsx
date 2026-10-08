import { useScrollSpy } from '@/hooks/useScrollSpy';

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#connect' },
];

// Plain text links, centred at the top of the hero. It sits in normal flow of
// the page (absolute, not fixed), so it scrolls away with the hero.
function Head({ onNavigate }) {
    const [active, setActive] = useScrollSpy(['#home', ...navLinks.map((l) => l.href)], '#home');

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
