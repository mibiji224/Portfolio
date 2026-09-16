import { Award, CheckCircle2, ChevronLeft, ChevronRight, Code, Coffee, ExternalLink, GraduationCap, Heart, Palette, Sparkles, User } from 'lucide-react';
import { useState } from 'react';

const HOBBIES = ['Digital Painting', 'Fitness', 'Reading', 'Cybersecurity'];
const TRAITS = ['INTJ-T', 'Detail-Oriented', 'Creative Strategist', 'Resilient'];

// Newest first. Mirrors the LinkedIn licenses & certifications list.
// `url` is optional: only the entries with a public verification page link out.
const CERTIFICATIONS = [
    {
        title: 'Introduction to AI',
        issuer: 'Google',
        date: 'Apr 2026',
        credentialId: '3VCH5AVY94X4',
        url: 'https://www.coursera.org/account/accomplishments/verify/3VCH5AVY94X4',
    },
    {
        title: 'Crash Course on Python',
        issuer: 'Google',
        date: 'Apr 2026',
        credentialId: 'AT3F9KBUJTEV',
        url: 'https://www.coursera.org/account/accomplishments/verify/AT3F9KBUJTEV',
    },
    {
        title: 'Foundations of User Experience (UX) Design',
        issuer: 'Google',
        date: 'Mar 2026',
        credentialId: 'PR06XKI3GPPG',
        url: 'https://www.coursera.org/account/accomplishments/verify/PR06XKI3GPPG',
    },
    {
        title: 'Leadership Award',
        issuer: 'Philippine Society of Information Technology Student Region XI',
        date: '2024',
    },
    {
        title: 'Responsive Web Design',
        issuer: 'freeCodeCamp',
        date: '2022',
    },
    {
        title: 'Coding Basics: Web Profile using HTML, CSS, and Bootstrap',
        issuer: 'Zuitt Coding Bootcamp',
        date: 'Aug 2022',
        credentialId: '01801',
    },
    {
        title: 'Women in Science of Southeast Asia 2022',
        issuer: 'Girl Up',
        date: 'Jul 2022',
    },
    {
        title: 'Programming for Beginners to Intermediate Level Using Python',
        issuer: 'DICT Philippines',
        date: 'Jun 2022',
        credentialId: 'df310ab2-f59a-4652-a4f3-2cac65002b72',
    },
];

// Rows per page. The list below is height-locked, so this is what decides how
// tall the card is: change one and check the other still fits.
const CERTS_PER_PAGE = 3;

const Card = ({ className = '', children }) => (
    <div className={`bg-[#0f0f0f]/50 border border-white/5 rounded-xl p-5 sm:p-6 ${className}`}>
        {children}
    </div>
);

const Label = ({ icon, children }) => (
    <div className="flex items-center gap-3 text-[#db0a0a] font-bold text-sm tracking-wider uppercase mb-3">
        {icon} {children}
    </div>
);

const Pill = ({ children }) => (
    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white hover:border-[#db0a0a]/50 transition-all cursor-default">
        {children}
    </span>
);

const PagerButton = ({ onClick, disabled, label, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-gray-300 transition-all hover:border-[#db0a0a]/60 hover:text-[#db0a0a] hover:bg-[#db0a0a]/10 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-gray-300 disabled:hover:bg-transparent"
    >
        {children}
    </button>
);

// One page of certifications at a time. The list keeps a fixed height so the
// card stays aligned with the developer/artistic cards opposite it no matter
// how many entries the list grows to.
const CertificationList = () => {
    const [page, setPage] = useState(0);

    const pageCount = Math.ceil(CERTIFICATIONS.length / CERTS_PER_PAGE);
    const start = page * CERTS_PER_PAGE;
    const visible = CERTIFICATIONS.slice(start, start + CERTS_PER_PAGE);
    // A short last page still has to fill the same height as a full one.
    const fillers = CERTS_PER_PAGE - visible.length;

    return (
        <>
            <div key={page} className="h-[13.75rem] flex flex-col gap-2 animate-certPage">
                {visible.map((cert) => (
                    <div key={cert.title} className="flex-1 min-h-0 overflow-hidden flex items-start gap-2.5 p-2.5 bg-[#0f0f0f] border border-white/5 rounded-lg hover:border-[#db0a0a]/50 transition-all hover:-translate-y-0.5 duration-300 group">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#db0a0a] mt-[3px] shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h4 className="text-white text-xs font-bold leading-tight line-clamp-2 group-hover:text-[#db0a0a] transition-colors">{cert.title}</h4>
                            {/* Issuer, date, credential ID and the verify link share one
                                line: two lines per row is what keeps these as compact as
                                the education entries below. */}
                            <div className="flex items-baseline gap-1.5 mt-0.5 text-[10px] text-gray-400">
                                <span className="truncate" title={cert.issuer}>{cert.issuer}</span>
                                <span className="shrink-0 text-gray-500">• {cert.date}</span>
                                {cert.credentialId && (
                                    <span className="font-mono text-[9px] text-gray-600 truncate" title={`Credential ID ${cert.credentialId}`}>
                                        ID {cert.credentialId}
                                    </span>
                                )}
                                {cert.url && (
                                    <a
                                        href={cert.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-semibold text-[#db0a0a] hover:text-white transition-colors shrink-0 ml-auto"
                                    >
                                        Show credential <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {Array.from({ length: fillers }).map((_, i) => (
                    <div key={`filler-${i}`} className="flex-1" aria-hidden="true" />
                ))}
            </div>

            {pageCount > 1 && (
                <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-white/5">
                    <span className="text-[11px] text-gray-500 tabular-nums">
                        {start + 1}–{start + visible.length} of {CERTIFICATIONS.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <PagerButton
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            label="Previous certifications"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </PagerButton>
                        <span className="text-[11px] text-gray-400 tabular-nums w-8 text-center">{page + 1}/{pageCount}</span>
                        <PagerButton
                            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                            disabled={page === pageCount - 1}
                            label="Next certifications"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </PagerButton>
                    </div>
                </div>
            )}
        </>
    );
};

// The personal narrative that opens the About section, above experience.
// Rendered by exp.jsx; it carries no section wrapper or heading of its own.
// Education rides along here so it sits with the other credentials.
function AboutNarrative({ educationData = [] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN: THE NARRATIVE */}
            <div className="lg:col-span-7 space-y-6">

                <Card>
                    <Label icon={<User className="w-4 h-4" />}>Who I Am</Label>
                    <p className="text-gray-400 leading-relaxed">
                        I am a Philippines-based creative and developer operating where logic meets imagination. My journey began with a paintbrush, envisioning a career in Fine Arts before discovering that code, like paint, is a powerful medium for creation. Transitioning from the freedom of art to the structure of Computer Science was a challenge that fueled my growth from an underdog to a leader.
                    </p>
                </Card>

                <Card>
                    <Label icon={<Code className="w-4 h-4" />}>The Developer Side</Label>
                    <p className="text-gray-400 leading-relaxed">
                        I specialize in building responsive SPAs using <strong>React</strong>, <strong>SQL</strong>, and <strong>Tailwind CSS</strong>. I fell in love with code while trying to bring my designs to life, and I now believe that clean code is just as essential as clean design.
                    </p>
                </Card>

                <Card>
                    <Label icon={<Palette className="w-4 h-4" />}>The Artistic Side</Label>
                    <p className="text-gray-400 leading-relaxed">
                        Digital art and UI design are my roots. Whether I'm branding an organization or sketching character concepts, I bring a designer's eye to every technical project. This duality allows me to effectively bridge the gap between design and engineering teams.
                    </p>
                </Card>

            </div>

            {/* RIGHT COLUMN: PHILOSOPHY & CREDENTIALS */}
            <div className="lg:col-span-5 space-y-6">

                <Card className="bg-white/5">
                    <Label icon={<Heart className="w-4 h-4" />}>My Philosophy</Label>
                    <p className="text-gray-300 italic font-serif text-base sm:text-lg">
                        "Technology without design is functional but boring. Design without technology is beautiful but static. I strive to combine both."
                    </p>
                </Card>

                <Card>
                    <Label icon={<Award className="w-4 h-4" />}>Certifications & Awards</Label>
                    <CertificationList />
                </Card>

                <Card>
                    <Label icon={<GraduationCap className="w-4 h-4" />}>Education</Label>
                    <div className="space-y-2">
                        {educationData.map((edu, index) => (
                            <div key={index} className="group bg-[#0f0f0f] p-2.5 rounded-lg border border-white/5 hover:border-[#db0a0a]/50 transition-all hover:-translate-y-0.5 duration-300">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-xs font-bold text-white group-hover:text-[#db0a0a] transition-colors truncate pr-2">
                                        {edu.school}
                                    </h4>
                                    <span className="text-[9px] font-mono text-[#db0a0a] bg-[#db0a0a]/10 px-1.5 py-0.5 rounded border border-[#db0a0a]/20 whitespace-nowrap">
                                        {edu.year}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <p className="text-gray-400 text-[10px] truncate min-w-0 flex-1">{edu.degree}</p>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Award className="w-3 h-3 text-[#db0a0a]" />
                                        <span className="text-[9px] text-gray-300 font-medium">{edu.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>

            {/* FULL WIDTH: INTERESTS: pills need the room to sit on one line */}
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                    <Label icon={<Coffee className="w-4 h-4" />}>Hobbies</Label>
                    <div className="flex flex-wrap gap-2">
                        {HOBBIES.map((hobby) => <Pill key={hobby}>{hobby}</Pill>)}
                    </div>
                </Card>
                <Card>
                    <Label icon={<Sparkles className="w-4 h-4" />}>Personality</Label>
                    <div className="flex flex-wrap gap-2">
                        {TRAITS.map((trait) => <Pill key={trait}>{trait}</Pill>)}
                    </div>
                </Card>
            </div>

        </div>
    );
}

export default AboutNarrative;
