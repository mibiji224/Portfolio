import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
// Added Award, CheckCircle2, Coffee, Sparkles to the imports
import { X, User, Code, Palette, Heart, Award, CheckCircle2, Coffee, Sparkles } from 'lucide-react';
// Ensure these paths match your project structure
import RippleBackground from './RippleBackground';
import profileImage from '/mbj.jpg';

// --- SUB-COMPONENT: ABOUT MODAL (GSAP Animated) ---
const AboutModal = ({ isOpen, onClose }) => {
    // 1. Create Refs for GSAP targeting
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const modalRef = useRef(null);

    // 2. Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // 3. GSAP Entrance Animation
    useLayoutEffect(() => {
        if (!isOpen) return;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Animate Backdrop
            tl.from(overlayRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.out"
            })
            // Animate Modal "Pop"
            .from(modalRef.current, {
                scale: 0.5,      // Start smaller
                opacity: 0,
                y: 50,           // Start slightly lower
                duration: 0.5,
                ease: "back.out(1.7)" // <--- This creates the "POP" effect
            }, "-=0.3")          // Overlap with backdrop animation
            // Animate Content Stagger
            .from(".modal-child", {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,    // Delay between each section
                ease: "power2.out"
            }, "-=0.3");

        }, containerRef);

        return () => ctx.revert();
    }, [isOpen]);

    // 4. Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        // Added ref={containerRef} for GSAP scope
        <div ref={containerRef} className="fixed inset-0 z-[100] h-screen w-screen flex items-center justify-center p-4">
            {/* Backdrop - Added ref={overlayRef} and removed tailwind animate classes */}
            <div 
                ref={overlayRef}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content - Added ref={modalRef} and removed tailwind animate classes */}
            <div 
                ref={modalRef}
                className="relative w-full max-w-2xl max-h-[85vh] m-auto bg-[#0d0c0c] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
            >
                
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-b border-white/5 bg-[#1a1a1a] rounded-t-2xl z-20">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-8 bg-[#db0a0a] rounded-full"></span>
                        Read More
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
                    
                    {/* Section 1: Introduction */}
                    <div className="modal-child space-y-4">
                        <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase">
                            <User className="w-4 h-4" /> Who I Am
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            I am a multidisciplinary creative and developer based in the Philippines, operating in the sweet spot where logic meets imagination. I don’t just build websites; I craft digital experiences that tell a story.
                            <br/>
                            <br/>
                            My journey wasn't linear. I began as a dreamer with a paintbrush, envisioning a future in the fine arts. However, I became captivated by the tech industry’s constant evolution—realizing that code, like paint, is a medium for creation. Transitioning from the intuitive freedom of art to the rigid structures of computer science was a humbling challenge. I started behind the curve, facing a steep learning curve that tested my resolve. Yet, that feeling of being an underdog didn't stop me; it fueled me.
                            <br/>
                            <br/>
                            Today, I am a multifaceted professional who blends these two worlds. My expertise spans software development, digital illustration, marketing, and project management. I channel this diverse background into leadership, having risen from a student council secretary to the President of the computing department. I am no longer just a lady who paints; I am a leader and developer dedicated to blending art with logic for everyone's efficiency and betterment. 
                        </p>
                    </div>

                    {/* Section 2: The Journey */}
                    <div className="modal-child space-y-4">
                        <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase">
                            <Code className="w-4 h-4" /> The Developer Side
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            My journey into tech wasn't a straight line. I started exploring code to bring my designs to life, and I fell in love with the problem-solving aspect of development. Today, I specialize in building responsive SPAs using <strong>React</strong>, managing data with <strong>SQL</strong>, and styling with <strong>Tailwind CSS</strong>. I believe that clean code is just as important as a clean design.
                        </p>
                    </div>

                    {/* Section 3: The Creative Side */}
                    <div className="modal-child space-y-4">
                        <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase">
                            <Palette className="w-4 h-4" /> The Artistic Side
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Before I wrote my first line of code, I was holding a stylus. Digital art, branding, and UI design are my roots. Whether it's creating publication materials for organizations or sketching character concepts, I bring an artistic eye to every technical project I touch. This duality allows me to bridge the gap between design teams and engineering teams effectively.
                        </p>
                    </div>

                    {/* Section 4: Personal Philosophy */}
                    <div className="modal-child p-6 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase mb-3">
                            <Heart className="w-4 h-4" /> My Philosophy
                        </div>
                        <p className="text-gray-300 italic font-serif text-lg">
                            "Technology without design is functional but boring. Design without technology is beautiful but static. I strive to combine both."
                        </p>
                    </div>
                    
                    {/* Section 5: Credentials & Interests (NEW ADDITION) */}
                    <div className="modal-child space-y-6 pt-4 border-t border-white/5">
                        
                        {/* Certifications Area */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase">
                                <Award className="w-4 h-4" /> Certifications & Awards
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {/* Certification Item 1 */}
                                <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:border-[#db0a0a]/30 transition-colors group">
                                    <CheckCircle2 className="w-4 h-4 text-[#db0a0a] mt-1" />
                                    <div>
                                        <h4 className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">Responsive Web Design</h4>
                                        <p className="text-xs text-gray-500">freeCodeCamp • 2024</p>
                                    </div>
                                </div>
                                {/* Certification Item 2 */}
                                <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:border-[#db0a0a]/30 transition-colors group">
                                    <CheckCircle2 className="w-4 h-4 text-[#db0a0a] mt-1" />
                                    <div>
                                        <h4 className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">Student Council Leadership Award</h4>
                                        <p className="text-xs text-gray-500">University of Mindanao • 2023</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Split Row for Hobbies & Personality */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Hobbies */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase">
                                    <Coffee className="w-4 h-4" /> Hobbies
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Digital Painting', 'Fitness', 'Reading', 'Cybersecurity'].map((hobby) => (
                                        <span key={hobby} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white hover:border-[#db0a0a]/50 transition-all cursor-default">
                                            {hobby}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Personality */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase">
                                    <Sparkles className="w-4 h-4" /> Personality
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['INTJ-T', 'Detail-Oriented', 'Creative Strategist', 'Resilient'].map((trait) => (
                                        <span key={trait} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white hover:border-[#db0a0a]/50 transition-all cursor-default">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                
            </div>

            {/* Inline Styles for Custom Scrollbar within this component */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #111;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #db0a0a;
                }
            `}</style>
        </div>
    );
};

// --- MAIN HOME COMPONENT ---
function Home() {
    const comp = useRef(null);
    const roles = ["a Web Developer", "a Student Leader", "a Tech Support", "an Assistant"];
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setCurrentRoleIndex((prev) => (prev + 1) % roles.length), 4000);
        return () => clearInterval(interval);
    }, [roles.length]);

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
                @keyframes textCycle { 0% { opacity:0; transform:translateY(100%) scale(0.95); filter:blur(4px); } 10% { opacity:1; transform:translateY(0) scale(1.05); filter:blur(0); } 85% { opacity:1; transform:translateY(0) scale(1.05); filter:blur(0); } 100% { opacity:0; transform:translateY(-100%) scale(0.95); filter:blur(4px); } }
                @keyframes float { 0% { transform:translateY(0px); } 50% { transform:translateY(-20px); } 100% { transform:translateY(0px); } }
                .bg-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); }
            `}</style>
            <div className="absolute inset-0 bg-grid z-0 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 lg:w-96 lg:h-96 bg-[#db0a0a] opacity-20 blur-[100px] lg:blur-[150px] rounded-full z-0"></div>

            <section className="relative z-10 min-h-[100dvh] flex flex-col-reverse lg:flex-row items-center justify-center px-4 sm:px-8 lg:px-20 gap-8 lg:gap-20 py-12 lg:py-0" id="home">
                {/* LEFT CONTENT */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl lg:max-w-none">
                    <span className="gsap-reveal text-[#db0a0a] font-bold tracking-widest uppercase text-xs sm:text-sm lg:text-base mb-3 lg:mb-4 block">Welcome to my Portfolio</span>
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight tracking-tight">
                        <span className="gsap-reveal block">Hello, I'm</span>
                        <span className="gsap-reveal block text-transparent bg-clip-text bg-gradient-to-r from-[#db0a0a] via-red-500 to-white drop-shadow-[0_0_20px_rgba(219,10,10,0.5)]">Desiree.</span>
                    </h1>
                    <div className="gsap-reveal flex flex-col sm:flex-row items-center sm:items-baseline justify-center lg:justify-start gap-2 mt-2 sm:mt-4 text-xl sm:text-3xl lg:text-4xl font-semibold w-full">
                        <span className="text-gray-300">I am</span>
                        <div className="relative flex justify-center sm:justify-start sm:pl-2 sm:ml-4">
                            <span className="invisible opacity-0" aria-hidden="true">a Web Developer</span>
                            <span key={currentRoleIndex} className="absolute left-0 sm:left-auto top-0 text-[#db0a0a] drop-shadow-[0_0_10px_rgba(219,10,10,0.8)] animate-[textCycle_4s_ease-in-out_forwards] whitespace-nowrap">{roles[currentRoleIndex]}</span>
                        </div>
                    </div>
                    <p className="gsap-reveal text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg lg:max-w-2xl mt-6 mb-8 lg:mt-8 lg:mb-10 px-2 lg:px-0">
                        A driven leader with a curious mind for the ever-evolving world of technology and innovation. I blend logical problem-solving with creative expression.
                    </p>
                    <div className="gsap-reveal flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center lg:justify-start">
                        <button onClick={() => setIsAboutOpen(true)} className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 sm:py-4 w-full sm:w-auto bg-[#db0a0a] text-black font-bold text-base sm:text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(219,10,10,0.6)]">
                            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Read More</span>
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
                    {/* MODAL IS RENDERED HERE */}
                    <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
                </div>
                {/* RIGHT IMAGE */}
                <div className="gsap-image-reveal flex-1 flex justify-center lg:justify-end relative group lg:-translate-x-10 mt-10 lg:mt-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[350px] sm:h-[350px] bg-[#db0a0a] blur-[60px] lg:blur-[80px] rounded-full opacity-0 group-hover:opacity-50 transition-all duration-700 ease-in-out"></div>
                    <div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[350px] lg:h-[350px] rounded-full p-2 border-2 border-[#db0a0a]/30 bg-[#080707] transition-all duration-500 group-hover:border-[#db0a0a] group-hover:scale-105">
                            <img src={profileImage} alt="Desiree" className="w-full h-full object-cover rounded-full shadow-[0_0_15px_rgba(219,10,10,0.2)] group-hover:shadow-[0_0_50px_#db0a0a] transition-all duration-500" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;