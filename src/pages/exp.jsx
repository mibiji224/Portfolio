import React from 'react';
import {
    Briefcase,
    Code,
    Database,
    Layout,
    Server,
    Wrench,
    Palette,
    FileText
} from 'lucide-react';
import AboutNarrative from './readmore.jsx';

const About = ({ experienceData: expProp, educationData: eduProp, skillsData }) => {
    // DATA: Falls back to hardcoded values when Supabase has no data yet.
    // Once you populate the DB, pass props from App.jsx and these inline arrays can be removed.
    const experienceData = expProp?.length ? expProp : [
        {
            title: "Operations Manager",
            company: "Inventiv Softwares",
            date: "September 2025",
            type: "Present",
            description: "Driving operational efficiency by managing executive software development project workflows, talent acquisition, business and activity proposals, and social media strategy for a growing software firm."
        },
        {
            title: "Front End Developer / UI UX Designer",
            company: "Inventiv Softwares",
            date: "June 2025 - September 2025",
            type: "Part Time",
            description: "Building responsive and visually engaging user interfaces using React and modern design tools. Collaborating with cross-functional teams to translate design concepts into functional web applications while ensuring optimal user experience and performance."
        },
        {
            title: "Account Manager",
            company: "ELM Marketing Agency",
            date: "Present",
            type: "Part Time",
            description: "Managing client accounts and campaign delivery, acting as the bridge between clients and the creative team to keep marketing work on brief and on schedule."
        },
        {
            title: "Web Developer",
            company: "Acme Construction",
            date: "October 2024 - January 2026",
            type: "Contract",
            description: "Designing and deploying custom web applications with focus on performance and scalability. Managing hosting infrastructure and implementing best practices for site optimization."
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
            title: "Marketing and Multimedia Unit Supervisor",
            company: "College of Computing Education Student Government - University of Mindanao",
            date: "July 2024 - July 2025",
            type: "LEADERSHIP",
            description: "Oversaw creative content strategy and multimedia production to amplify student engagement and event reach across digital platforms."
        },
        {
            title: "Assistant Recreational Head",
            company: "Philippine Society of Information Technology Students Region XI",
            date: "August 2024 - May 2025",
            type: null,
            description: "Coordinated regional recreational events and activities for IT students, managing logistics and participant engagement."
        },
        {
            title: "Documentation Photographer",
            company: "Blockchain Campus Conference",
            date: "October 2024",
            type: "EVENT VOLUNTEER",
            description: "Captured conference highlights through professional photography, documenting key moments and attendee experiences."
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
        // Standard width cards (Span 1)
        { category: "Frontend", icon: <Layout size={14} />, items: ["HTML", "CSS", "Tailwind CSS", "Bootstrap", "React"] },
        { category: "Backend", icon: <Server size={14} />, items: ["JavaScript", "Python", "PHP", "Java", "Node.js", "REST API"] },
        { category: "Database", icon: <Database size={14} />, items: ["MySQL", "MongoDB", "Firebase", "PostgreSQL"] },
        { category: "Tech Tools", icon: <Wrench size={14} />, items: ["Git", "GitHub", "VSCode", "Eclipse", "NetBeans", "Xampp"] },

        // Full width cards (Span 2) - Moved here for visual balance
        { category: "Creative Tools", icon: <Palette size={14} />, items: ["Figma", "Adobe Photoshop", "Canva", "Blender", "Procreate", "IbisPaint", "CapCut", "Photopea"], fullWidth: true },
        { category: "Office Tools", icon: <FileText size={14} />, items: ["Google Suite", "Excel", "Word", "Google Sheets", "Google Docs", "Notion", "Slack", "Trello", "Zoom", "GMeet", "Outlook", "Loom"], fullWidth: true }
    ];

    return (
        <section className="bg-[#080707] text-white min-h-screen w-full flex flex-col pt-6 pb-16 lg:pt-10 lg:pb-24 px-4 sm:px-6 lg:px-12 font-sans relative" id="about">

            <style>{`
        .modern-scrollbar::-webkit-scrollbar { width: 4px; }
        .modern-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
        .modern-scrollbar::-webkit-scrollbar-thumb { background: #db0a0a; border-radius: 4px; }
        .modern-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff1f1f; }
      `}</style>

            <div className="max-w-7xl mx-auto w-full flex flex-col">

                {/* Section Title */}
                <div className="shrink-0 mb-6 lg:mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">About Me</h2>
                    <div className="w-20 h-1 bg-[#db0a0a]"></div>
                </div>

                {/* The narrative leads the section, ahead of the timeline */}
                <AboutNarrative educationData={educationData} />

                {/* Experience / Skills: both columns share one height on desktop so the
                    two panels start and end on the same line */}
                <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                    {/* LEFT COLUMN: EXPERIENCE */}
                    <div className="lg:col-span-7 flex flex-col lg:h-[70vh] lg:min-h-[520px]">
                        <div className="flex items-center gap-3 mb-4 shrink-0">
                            <div className="p-1.5 bg-[#db0a0a]/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-[#db0a0a]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-100">Experience</h3>
                        </div>

                        <div className="max-h-[65vh] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto pr-2 sm:pr-4 modern-scrollbar bg-[#0f0f0f]/50 rounded-xl p-3 sm:p-4 border border-white/5 pb-6" style={{ overscrollBehavior: 'contain' }}>
                            <ol className="relative border-l border-neutral-800 ml-2 sm:ml-3 space-y-8">
                                {experienceData.map((item, index) => (
                                    <li key={index} className="relative ml-6 sm:ml-8 group">
                                        <span className="absolute -left-[31px] sm:-left-[43px] top-1 flex items-center justify-center w-6 h-6 bg-[#080707] rounded-full border border-neutral-700 group-hover:border-[#db0a0a] group-hover:shadow-[0_0_10px_#db0a0a] transition-all duration-300">
                                            <div className="w-2 h-2 bg-neutral-600 rounded-full group-hover:bg-[#db0a0a] transition-colors"></div>
                                        </span>

                                        <div className="relative">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono font-medium text-[#db0a0a] border border-[#db0a0a]/30 px-1.5 py-0.5 rounded bg-[#db0a0a]/5">
                                                    {item.date}
                                                </span>
                                                {item.type && (
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.type === 'Present' ? 'bg-[#db0a0a] text-white' : 'bg-white text-black'}`}>
                                                        {item.type}
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="text-base font-bold text-white mb-0.5 group-hover:text-[#db0a0a] transition-colors">
                                                {item.title}
                                            </h4>

                                            <h5 className="text-xs font-medium text-gray-300 mb-2">
                                                {item.company}
                                            </h5>

                                            <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
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
                            <div className="p-1.5 bg-[#db0a0a]/10 rounded-lg">
                                <Code className="w-5 h-5 text-[#db0a0a]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-100">Skills</h3>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="max-h-[65vh] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto pr-2 sm:pr-4 modern-scrollbar bg-[#0f0f0f]/50 rounded-xl p-3 sm:p-4 border border-white/5 pb-6" style={{ overscrollBehavior: 'contain' }}>

                            {/* Core Skills Group */}
                            <div className="mb-4">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-[#db0a0a] rounded-full"></div>
                                    Core Competencies
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {coreSkills.map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-[#1a1a1a] text-gray-400 text-[10px] font-medium rounded border border-white/5 hover:text-white hover:border-[#db0a0a]/50 transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Proficiency - IMPROVED LAYOUT */}
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-[#db0a0a] rounded-full"></div>
                                    Technical Proficiency
                                </h4>

                                {/* Bento Grid Layout */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {technicalSkills.map((group, index) => (
                                        <div
                                            key={index}
                                            // If fullWidth is true (for Creative/Office), span 2 columns
                                            className={`bg-[#0f0f0f] p-3 rounded-lg border border-white/5 hover:border-[#db0a0a]/30 transition-colors group ${group.fullWidth ? 'sm:col-span-2' : 'col-span-1'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[#db0a0a] opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {group.icon}
                                                </span>
                                                <h5 className="text-white text-[11px] font-bold uppercase tracking-wider">
                                                    {group.category}
                                                </h5>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                {group.items.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[10px] text-gray-400 bg-black/40 px-2 py-1 rounded border border-white/5 transition-all duration-200 group-hover:border-[#db0a0a]/20 group-hover:text-gray-200"
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
            </div>
        </section>
    );
};

export default About;