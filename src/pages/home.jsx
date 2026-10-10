import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// Ensure these paths match your project structure
import FluidBackground from '../components/FluidBackground';
import { Button } from '@/components/ui/button'
import { useMagnetic } from '@/hooks/useMagnetic'

// --- MAIN HOME COMPONENT ---
const ROLES = ["a Software Developer", "a Leader", "a Project Manager", "a Designer", "an Innovator", "an Engineer", "a Creative Thinker", "a Project Manager"];
const TYPING_SPEED = 80;
const DELETING_SPEED = 45;
const HOLD_AFTER_TYPED = 1800;
const PAUSE_BEFORE_TYPING = 400;

function Home({ onReadMore }) {
    const comp = useRef(null);
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
            `}</style>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 lg:w-96 lg:h-96 bg-primary opacity-30 blur-[100px] lg:blur-[150px] rounded-full z-0"></div>

            <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-20 py-12 lg:py-0" id="home">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl lg:max-w-4xl">
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
                            aria-label={ROLES[roleIndex]}
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
                            <a ref={linkedinRef} href="https://www.linkedin.com/in/desireesoronio/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-matcha/40 flex items-center justify-center text-matcha-strong hover:bg-matcha hover:text-matcha-foreground hover:border-matcha transition-colors duration-300">
                                <svg data-magnetic-label className="relative z-10" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a ref={githubRef} href="https://github.com/mibiji224" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-matcha/40 flex items-center justify-center text-matcha-strong hover:bg-matcha hover:text-matcha-foreground hover:border-matcha transition-colors duration-300">
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