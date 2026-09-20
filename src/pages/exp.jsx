import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
    Briefcase,
    Code,
    Database,
    Layout,
    Server,
    Wrench,
    Palette,
    FileText,
    ChevronDown
} from 'lucide-react';
import AboutNarrative from './readmore.jsx';

const SKILL_PILL = 'px-2 py-1 bg-matcha text-matcha-strong border border-matcha-strong/25 text-[11px] font-medium rounded-lg hover:bg-matcha/70 transition-colors cursor-default';
// Outlined, not filled: a solid pill sitting among solid pills reads as one
// more skill rather than as the control that reveals the rest.
const TOGGLE_PILL = 'inline-flex items-center gap-1 px-2 py-1 border border-primary-strong/40 text-primary-strong text-[11px] font-semibold rounded-lg hover:bg-primary-soft transition-colors';
// gap-1.5
const PILL_GAP = 6;

/** A wrapped pill row capped at `rows` lines, with the overflow behind a pill.
 *
 *  How many pills fit per line depends on the container width and on each
 *  label, so it has to be measured. The measuring is done on a hidden twin
 *  holding every pill: laying the real row out short would tell us nothing
 *  about where the cut belongs. One measurement is enough because dropping
 *  trailing items from a wrapped row never moves the ones before them, so
 *  the geometry we read stays true for the clamped row. */
const ClampedPills = ({ items, rows = 2, pillClassName = SKILL_PILL }) => {
    const [expanded, setExpanded] = useState(false);
    const [limit, setLimit] = useState(items.length);
    const twinRef = useRef(null);

    const measure = useCallback(() => {
        const el = twinRef.current;
        if (!el) return;
        const nodes = Array.from(el.children);
        const toggle = nodes[nodes.length - 1];
        const pills = nodes.slice(0, -1);
        if (!pills.length || !toggle) return;

        const tops = [...new Set(pills.map((p) => p.offsetTop))].sort((a, b) => a - b);
        if (tops.length <= rows) {
            setLimit(items.length);
            return;
        }

        const lastRowTop = tops[rows - 1];
        let count = pills.filter((p) => p.offsetTop <= lastRowTop).length;
        const width = el.clientWidth;
        const toggleWidth = toggle.offsetWidth;

        // Give back trailing pills until the toggle fits on the last kept row.
        while (count > 1) {
            const last = pills[count - 1];
            if (last.offsetTop < lastRowTop) break;
            if (last.offsetLeft + last.offsetWidth + PILL_GAP + toggleWidth <= width) break;
            count -= 1;
        }
        setLimit(count);
    }, [items.length, rows]);

    useLayoutEffect(() => {
        measure();
        const el = twinRef.current;
        const observer = new ResizeObserver(measure);
        if (el) observer.observe(el);
        // Pill widths shift once the webfont swaps in, so measure again after.
        let cancelled = false;
        if (document.fonts?.ready) {
            document.fonts.ready.then(() => { if (!cancelled) measure(); });
        }
        return () => {
            cancelled = true;
            observer.disconnect();
        };
    }, [measure]);

    const clamped = limit < items.length;
    const shown = expanded || !clamped ? items : items.slice(0, limit);

    return (
        <div className="relative">
            <div
                ref={twinRef}
                aria-hidden="true"
                className="absolute inset-x-0 top-0 invisible pointer-events-none flex flex-wrap gap-1.5"
            >
                {items.map((skill, index) => (
                    <span key={index} className={pillClassName}>{skill}</span>
                ))}
                <span className={TOGGLE_PILL}>
                    +{items.length} more <ChevronDown className="h-3 w-3" />
                </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {shown.map((skill, index) => (
                    <span key={index} className={pillClassName}>{skill}</span>
                ))}
                {clamped && (
                    <button
                        type="button"
                        onClick={() => setExpanded((open) => !open)}
                        aria-expanded={expanded}
                        className={TOGGLE_PILL}
                    >
                        {expanded ? 'Show less' : `+${items.length - limit} more`}
                        <ChevronDown
                            className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

const About = ({ experienceData: expProp, educationData: eduProp, skillsData }) => {
    // DATA: Falls back to hardcoded values when Supabase has no data yet.
    // Once you populate the DB, pass props from App.jsx and these inline arrays can be removed.
    const experienceData = expProp?.length ? expProp : [
        {
            title: "Executive Assistant & Operations Manager",
            company: "Inventiv Softwares",
            date: "December 2025 - Present",
            type: null,
            description: "Driving operational efficiency by managing executive software development project workflows, talent acquisition, business and activity proposals, and social media strategy for a growing software firm."
        },
        {
            title: "Administrative Secretary - Office of the Regional Director",
            company: "Department of Education Region XI",
            date: "June 2025 - December 2025",
            type: null,
            description: "Supporting administrative operations through document management, scheduling coordination, and office support services."
        },
        {
            title: "Customer Service Representative",
            company: "Awesome CX & Alorica Davao",
            date: "April 2025 - October 2025",
            type: null,
            description: "Delivered exceptional customer support through inbound voice channels while maintaining high performance standards and customer satisfaction metrics."
        },
        {
            title: "President",
            company: "College of Computing Education Student Government - University of Mindanao",
            date: "July 2024 - July 2025",
            type: "LEADERSHIP",
            description: "Directed student governance initiatives, organized campus events, and advocated for student interests with faculty leadership."
        },
        {
            title: "External Vice President",
            company: "Council of College Student Governments - University of Mindanao",
            date: "July 2024 - July 2025",
            type: "LEADERSHIP",
            description: "Managed external relations and student advocacy initiatives, building partnerships to enhance institutional engagement and student welfare programs."
        },
        {
            title: "Assistant Recreational Head",
            company: "Philippine Society of Information Technology Students Region XI",
            date: "August 2024 - May 2025",
            type: null,
            description: "Coordinated regional recreational events and activities for IT students, managing logistics and participant engagement."
        },
        {
            title: "Secretary",
            company: "College of Computing Education Student Government - University of Mindanao",
            date: "July 2023 - July 2024",
            type: null,
            description: "Managed official records, coordinated communications, and maintained documentation for student government operations."
        },
        {
            title: "Assistant Secretary",
            company: "Philippine Society of Information Technology Students Region XI",
            date: "October 2023 - March 2024",
            type: null,
            description: "Supported regional organization operations through documentation and communication coordination across member institutions."
        },
        {
            title: "Publication and Documentation Head",
            company: "United Nation's Girl Up Organization - Davao Chapter",
            date: "July 2023 - December 2023",
            type: null,
            description: "Directed content creation and digital communications to promote organizational initiatives and community engagement."
        },
        {
            title: "Digital Artist",
            company: "Freelance",
            date: "March 2020",
            type: null,
            description: "Created custom digital artwork across multiple styles and genres, delivering compelling visual solutions tailored to client specifications using industry-standard software."
        },
        {
            title: "Personal Assistant",
            company: "Secondary Education English Teacher - Davao City National High School",
            date: "August 2018 - April 2021",
            type: null,
            description: "Provided administrative support including student records management, grade tracking, and instructional materials preparation."
        }
    ]

    const educationData = eduProp?.length ? eduProp : [
        {
            school: "University of Mindanao",
            degree: "Bachelor of Science in Computer Science",
            year: "2023 - Present",
            status: "Currently Enrolled"
        },
        {
            school: "Davao City National High School",
            degree: "STEM Strand",
            year: "2018 - 2022",
            status: "With High Honors"
        }
    ]

    // UPDATED SKILLS DATA WITH ICONS AND SPAN LOGIC
    const coreSkills = [
        "Leadership", "Team Management",
        "Project Management",
        "Organizational Skills", "Time Management",
        "Communication", "Technical Writing",
        "Creative Design", "Visual Communication",
        "Web Development", "Programming", "Technical Support",
        "Customer Service", "Client Relations",
        "Marketing", "Branding Strategies",
        "Data Analysis", "Problem Solving",
        "Documentation", "Event Photography",
        "Administrative Assistance", "Office Support"
    ];

    const technicalSkills = [
        { category: "Frontend", icon: <Layout size={14} />, items: ["HTML", "CSS", "Tailwind CSS", "Bootstrap", "React"] },
        { category: "Backend", icon: <Server size={14} />, items: ["JavaScript", "Python", "PHP", "Java", "Node.js", "REST API"] },
        { category: "Database", icon: <Database size={14} />, items: ["MySQL", "MongoDB", "Firebase", "PostgreSQL"] },
        { category: "Tech Tools", icon: <Wrench size={14} />, items: ["Git", "GitHub", "VSCode", "Eclipse", "NetBeans", "Xampp"] },

        { category: "Creative Tools", icon: <Palette size={14} />, items: ["Figma", "Adobe Photoshop", "Canva", "Blender", "Procreate", "IbisPaint", "CapCut", "Photopea"] },
        { category: "Office Tools", icon: <FileText size={14} />, items: ["Google Suite", "Excel", "Word", "Google Sheets", "Google Docs", "Notion", "Slack", "Trello", "Zoom", "GMeet", "Outlook", "Loom"] }
    ];

    return (
        <section className="bg-background text-foreground min-h-screen w-full flex flex-col pt-6 pb-16 lg:pt-10 lg:pb-24 px-4 sm:px-6 lg:px-12 font-sans relative" id="about">

            <div className="max-w-7xl mx-auto w-full flex flex-col">

                {/* Section Title */}
                <div className="shrink-0 mb-6 lg:mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">About Me</h2>
                    <div className="w-20 h-1 bg-primary"></div>
                </div>

                {/* Experience / Skills lead the section. Both columns share one height
                    on desktop so the two panels start and end on the same line */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                    {/* LEFT COLUMN: EXPERIENCE */}
                    <div className="lg:col-span-7 flex flex-col lg:h-[70vh] lg:min-h-[520px]">
                        <div className="flex items-center gap-3 mb-4 shrink-0">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-primary-strong" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Experience</h3>
                        </div>

                        <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain pr-2 sm:pr-4 modern-scrollbar bg-card rounded-2xl p-3 sm:p-4 shadow-lift pb-6">
                            <ol className="relative border-l border-border ml-2 sm:ml-3 space-y-8">
                                {experienceData.map((item, index) => (
                                    <li key={index} className="relative ml-6 sm:ml-8 group">
                                        <span className="absolute -left-[31px] sm:-left-[43px] top-1 flex items-center justify-center w-6 h-6 bg-background rounded-full border border-border group-hover:border-primary group-hover:shadow-accent transition-all duration-300">
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full group-hover:bg-primary transition-colors"></div>
                                        </span>

                                        <div className="relative">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono font-medium text-primary-strong border border-primary/30 px-1.5 py-0.5 rounded bg-primary/5">
                                                    {item.date}
                                                </span>
                                                {item.type && (
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.type === 'Present' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                                                        {item.type}
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary-strong transition-colors">
                                                {item.title}
                                            </h4>

                                            <h5 className="text-xs font-medium text-muted-foreground mb-2">
                                                {item.company}
                                            </h5>

                                            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                                                {item.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SKILLS */}
                    <div className="lg:col-span-5 flex flex-col lg:h-[70vh] lg:min-h-[520px]">
                        <div className="flex items-center gap-3 mb-4 shrink-0">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Code className="w-5 h-5 text-primary-strong" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Skills</h3>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain pr-2 sm:pr-4 modern-scrollbar bg-card rounded-2xl p-3 sm:p-4 shadow-lift pb-6">

                            {/* Core Skills Group */}
                            <div className="mb-7">
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                                    <span className="h-4 w-1 rounded-full bg-primary-strong" aria-hidden="true"></span>
                                    Core Competencies
                                </h4>
                                {/* Pink here, matcha below: the two groups are different kinds of
                                    thing, and colour says so faster than a heading alone. */}
                                <ClampedPills
                                    items={coreSkills}
                                    rows={2}
                                    pillClassName="px-2 py-1 bg-primary text-foreground border border-primary-strong/25 text-[11px] font-medium rounded-lg hover:bg-primary-deep/60 transition-colors cursor-default"
                                />
                            </div>

                            {/* Technical Proficiency - IMPROVED LAYOUT */}
                            <div>
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                                    <span className="h-4 w-1 rounded-full bg-matcha-strong" aria-hidden="true"></span>
                                    Technical Proficiency
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {technicalSkills.map((group, index) => (
                                        <div
                                            key={index}
                                            className="bg-card p-3.5 rounded-xl shadow-lift transition-transform hover:-translate-y-0.5 group"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-primary-strong opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {group.icon}
                                                </span>
                                                <h5 className="text-foreground text-[11px] font-bold uppercase tracking-wider">
                                                    {group.category}
                                                </h5>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                {group.items.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[11px] font-medium text-matcha-strong bg-matcha border border-matcha-strong/25 px-2 py-1 rounded-lg transition-all duration-200 group-hover:bg-matcha/70"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Credentials and the personal panels close the section */}
                <div className="mt-12 lg:mt-16">
                    <AboutNarrative educationData={educationData} />
                </div>
            </div>
        </section>
    );
};

export default About;