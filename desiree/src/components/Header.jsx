import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useEffect, useRef, useState } from 'react';

// Register GSAP plugin (safe to call multiple times)
gsap.registerPlugin(ScrollToPlugin);

function Head() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    // Toggle Mobile Menu
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // Handle Scroll — hide on scroll down, show on hover near top
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            if (currentY > lastScrollY.current && currentY > 80) {
                // Scrolling down — hide navbar
                setIsHidden(true);
            } else {
                // Scrolling up — show navbar
                setIsHidden(false);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show navbar when mouse enters the top 60px of the viewport
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY <= 60) {
                setIsHidden(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Navigation Links Data
    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Connect', href: '#connect' },
    ];

    // Smooth scroll handler using GSAP ScrollToPlugin
    const handleNavClick = (e, href) => {
        // allow middle-click / ctrl-click to open new tab
        if (e && (e.metaKey || e.ctrlKey || (e.button && e.button === 1))) return;
        if (e) e.preventDefault();

        try {
            // Use ScrollToPlugin by passing the hash directly and offset for header
            gsap.to(window, {
                duration: 0.8,
                ease: 'power2.out',
                scrollTo: { y: href, offsetY: 72 },
            });
        } catch (err) {
            // Fallback to native behavior
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }

        // Close mobile menu if open
        setIsMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out font-['Poppins'] ${
                isScrolled
                    ? 'bg-black/70 backdrop-blur-lg py-3 shadow-lg shadow-[#db0a0a]/5'
                    : 'bg-transparent py-3'
            } ${
                isHidden ? '-translate-y-full' : 'translate-y-0'
            }`}
        >
            {/* ALIGNMENT FIX: 
               - 'w-full' takes full width.
               - 'justify-between' pushes Logo to far left and Nav to far right.
               - 'px-6 lg:px-16' ensures it sits close to the edge but not touching it.
            */}
            <div className="w-full flex justify-between items-center px-1 lg:px-10">
                
                {/* --- LOGO --- */}
                <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-3xl md:text-4xl font-black text-white tracking-tighter group flex items-center gap-1 select-none">
                    D
                    <span className="text-[#db0a0a] drop-shadow-[0_0_15px_rgba(219,10,10,0.8)] group-hover:text-white transition-colors duration-300">
                        R.S
                    </span>
                    {/* Small accent dot */}
                    <div className="w-1.5 h-1.5 bg-[#db0a0a] rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>

                {/* --- DESKTOP NAVBAR --- */}
                <nav className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="relative text-base font-semibold text-gray-300 transition-all duration-300 hover:text-white group/link"
                        >
                            {link.name}
                            {/* Fancy Animated Underline (expands from center) */}
                            <span className="absolute left-1/2 bottom-[-4px] w-0 h-[2px] bg-[#db0a0a] transition-all duration-300 ease-out group-hover/link:w-full group-hover/link:left-0"></span>
                            
                            {/* Glow effect on hover */}
                            <span className="absolute inset-0 blur-lg bg-[#db0a0a]/0 group-hover/link:bg-[#db0a0a]/20 transition-all duration-300 -z-10"></span>
                        </a>
                    ))}
                </nav>

                {/* --- MOBILE MENU ICON --- */}
                <div className="md:hidden">
                    <button 
                        onClick={toggleMenu} 
                        className="text-white p-2 focus:outline-none transition-transform duration-300 active:scale-90"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            // Close Icon (X)
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#db0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            // Hamburger Icon
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* --- MOBILE DROPDOWN MENU --- */}
            <div 
                className={`md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-[#db0a0a]/20 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isMenuOpen ? 'max-h-[400px] opacity-100 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'max-h-0 opacity-0'
                }`}
            >
                <nav className="flex flex-col items-center py-8 gap-8">
                    {navLinks.map((link, index) => (
                        <a 
                            key={link.name} 
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            // Staggered delay for links appearing
                            style={{ transitionDelay: `${index * 50}ms` }}
                            className={`text-xl font-bold text-gray-300 hover:text-[#db0a0a] transition-all duration-300 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
            </div>

        </header> 
    );
}
  
export default Head;