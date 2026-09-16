import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// Ensure these paths match your project structure
import RippleBackground from './RippleBackground';
import profileImage from '/mbj.jpg';

// --- MAIN HOME COMPONENT ---
const ROLES = ["a Web Developer", "a Leader", "a Developer", "an Assistant"];
const TYPING_SPEED = 90;
const DELETING_SPEED = 45;
const HOLD_AFTER_TYPED = 1800;
const PAUSE_BEFORE_TYPING = 400;
const HINT_DURATION = 1200;

function Home({ onReadMore, isExpanded = false }) {
    const comp = useRef(null);
    const [roleIndex, setRoleIndex] = useState(0);
    const [typedRole, setTypedRole] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [scrollHint, setScrollHint] = useState(false);
    const hintCooldown = useRef(false);

    useEffect(() => {
        const fullRole = ROLES[roleIndex];

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
    }, [typedRole, isDeleting, roleIndex]);

    // Collapsed, the landing page is the hero and nothing else, so scrolling down
    // goes nowhere. Pulse the one control that opens the rest of the portfolio.
    useEffect(() => {
        if (isExpanded) return;

        let hintTimer;
        let cooldownTimer;
        let touchStartY = 0;

        // Only nudge when the scroll really had nowhere to go.
        const atPageBottom = () =>
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        const nudge = () => {
            if (hintCooldown.current || !atPageBottom()) return;
            hintCooldown.current = true;
            setScrollHint(true);
            hintTimer = setTimeout(() => {
                setScrollHint(false);
                // Let the animation unmount before it can be retriggered.
                cooldownTimer = setTimeout(() => { hintCooldown.current = false; }, 300);
            }, HINT_DURATION);
        };

        const onWheel = (e) => { if (e.deltaY > 0) nudge(); };
        const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
        const onTouchMove = (e) => { if (touchStartY - e.touches[0].clientY > 20) nudge(); };
        const onKeyDown = (e) => {
            if (["ArrowDown", "PageDown", "End", " "].includes(e.key)) nudge();
        };

        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("keydown", onKeyDown);

        return () => {
            clearTimeout(hintTimer);
            clearTimeout(cooldownTimer);
            hintCooldown.current = false;
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isExpanded]);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const t1 = gsap.timeline();
            t1.from(".gsap-reveal", { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 })
                .from(".gsap-image-reveal", { x: 100, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=1");
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={comp} className="relative min-h-[100dvh] w-full bg-transparent text-white font-['Poppins'] overflow-hidden selection:bg-[#db0a0a] selection:text-black">
            <RippleBackground />
            <style>{`
                @keyframes caretBlink { 0%, 49% { opacity:1; } 50%, 100% { opacity:0; } }
                @keyframes float { 0% { transform:translateY(0px); } 50% { transform:translateY(-20px); } 100% { transform:translateY(0px); } }
                @keyframes readMorePulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(219,10,10,0); }
                    25% { transform: scale(1.09); box-shadow: 0 0 50px 8px rgba(219,10,10,0.85); }
                    50% { transform: scale(1); box-shadow: 0 0 20px rgba(219,10,10,0.45); }
                    75% { transform: scale(1.06); box-shadow: 0 0 42px 6px rgba(219,10,10,0.7); }
                }
                .read-more-hint { animation: readMorePulse ${HINT_DURATION}ms ease-in-out; }
                @media (prefers-reduced-motion: reduce) {
                    .read-more-hint { animation: none; box-shadow: 0 0 40px rgba(219,10,10,0.7); }
                }
                .bg-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); }
            `}</style>
            <div className="absolute inset-0 bg-grid z-0 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 lg:w-96 lg:h-96 bg-[#db0a0a] opacity-20 blur-[100px] lg:blur-[150px] rounded-full z-0"></div>

            <section className="relative z-10 min-h-[100dvh] flex flex-col-reverse lg:flex-row items-center justify-center px-4 sm:px-8 lg:px-20 gap-0 sm:gap-8 lg:gap-20 py-12 lg:py-0" id="home">
                {/* LEFT CONTENT */}
                <div className="flex-none sm:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl lg:max-w-none">
                    <span className="gsap-reveal text-[#db0a0a] font-bold tracking-widest uppercase text-xs sm:text-sm lg:text-base mb-3 lg:mb-4 block">Welcome to my Portfolio</span>
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight tracking-tight">
                        <span className="gsap-reveal block">Hello, I'm</span>
                        <span className="gsap-reveal block text-transparent bg-clip-text bg-gradient-to-r from-[#db0a0a] via-red-500 to-white drop-shadow-[0_0_20px_rgba(219,10,10,0.5)]">Desiree.</span>
                    </h1>
                    <div className="gsap-reveal flex flex-row items-baseline justify-center lg:justify-start gap-1.5 mt-2 sm:mt-4 text-lg sm:text-3xl lg:text-4xl font-semibold w-full">
                        <span className="text-gray-300 whitespace-nowrap">I am</span>
                        <div className="relative flex justify-start">
                            {/* This invisible span acts as a placeholder for the layout */}
                            <span className="invisible opacity-0 whitespace-nowrap" aria-hidden="true">a Web Developer</span>

                            {/* Overlays the placeholder so the row keeps a stable
                                width as the typed role changes length. */}
                            <span
                                className="absolute inset-x-0 top-0 text-left text-[#db0a0a] drop-shadow-[0_0_10px_rgba(219,10,10,0.8)] whitespace-nowrap"
                                aria-label={ROLES[roleIndex]}
                            >
                                {typedRole}
                                <span
                                    aria-hidden="true"
                                    className="inline-block w-[2px] sm:w-[3px] h-[0.85em] translate-y-[0.08em] ml-0.5 sm:ml-1 bg-[#db0a0a] animate-[caretBlink_1s_step-end_infinite]"
                                ></span>
                            </span>
                        </div>
                    </div>
                    <p className="gsap-reveal text-gray-400 text-xs sm:text-base lg:text-lg leading-relaxed max-w-xs sm:max-w-lg lg:max-w-2xl mt-3 mb-6 sm:mt-6 sm:mb-8 lg:mt-8 lg:mb-10 px-2 lg:px-0">
                        A driven leader with a curious mind for the ever-evolving world of technology and innovation. I blend logical problem-solving with creative expression.
                    </p>
                    <div className="gsap-reveal flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center lg:justify-start">
                        <button onClick={onReadMore} aria-expanded={isExpanded} aria-controls="portfolio-sections" className={`group relative inline-flex items-center justify-center gap-2 px-10 sm:px-8 py-3 sm:py-4 w-auto bg-[#db0a0a] text-black font-bold text-base sm:text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(219,10,10,0.6)] ${scrollHint ? 'read-more-hint' : ''}`}>
                            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">{isExpanded ? 'Show Less' : 'Read More'}</span>
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0"></div>
                        </button>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/desireesoronio/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-700 flex items-center justify-center text-[#db0a0a] hover:bg-[#db0a0a] hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_#db0a0a]">
                                <svg className="relative z-10" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="https://github.com/mibiji224" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-700 flex items-center justify-center text-[#db0a0a] hover:bg-[#db0a0a] hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_#db0a0a]">
                                <svg className="relative z-10" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
                {/* RIGHT IMAGE */}
                <div className="gsap-image-reveal hidden sm:flex flex-1 justify-center lg:justify-end relative group lg:-translate-x-10 mt-10 lg:mt-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#db0a0a] blur-[60px] lg:blur-[80px] rounded-full opacity-0 group-hover:opacity-50 transition-all duration-700 ease-in-out"></div>
                    <div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
                        <div className="relative w-80 h-80 lg:w-[350px] lg:h-[350px] rounded-full p-2 border-2 border-[#db0a0a]/30 bg-[#080707] transition-all duration-500 group-hover:border-[#db0a0a] group-hover:scale-105">
                            <img src={profileImage} alt="Desiree" loading="eager" decoding="async" fetchPriority="high" className="w-full h-full object-cover rounded-full shadow-[0_0_15px_rgba(219,10,10,0.2)] group-hover:shadow-[0_0_50px_#db0a0a] transition-all duration-500" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;