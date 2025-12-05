import React from 'react';
import { 
    Briefcase, 
    GraduationCap, 
    Code, 
    Award, 
    Database, 
    Layout, 
    Server, 
    Wrench, 
    Palette, 
    FileText 
} from 'lucide-react';

const About = () => {
    // DATA: Your specific details
    const experienceData = [
        {
            title: "Administrative Secretary",
            company: "Department of Education Region XI - Office of the Assistant Regional Director",
            date: "July 2025",
            type: "Present",
            description: "Handling administrative tasks, document processing, and scheduling for the Assistant Regional Director office."
        },
        {
            title: "Customer Service Representative",
            company: "Awesome CX & Alorica Davao",
            date: "April 2025 - October 2025",
            type: null,
            description: "Handled Inbound Voice Accounts. Resolved customer inquiries efficiently while maintaining high quality assurance scores."
        },
        {
            title: "President",
            company: "College of Computing Education Student Government - University of Mindanao",
            date: "July 2024 - July 2025",
            type: "LEADERSHIP",
            description: "Led the student body of the College of Computing Education. Organized events, facilitated student welfare programs, and bridged communication between students and faculty."
        },
        {
            title: "External Vice President",
            company: "Council of College Student Governments - University of Mindanao",
            date: "July 2024 - July 2025",
            type: "LEADERSHIP",
            description: "Led external affairs for the University of Mindanao’s central student government, representing the entire student body. I negotiated strategic partnerships and executed university-wide welfare programs to bridge student advocacy with administrative policy."
        },
        {
            title: "Marketing and Multimedia Unit Supervisor",
            company: "College of Computing Education Student Government - University of Mindanao",
            date: "July 2024 - July 2025",
            type: "LEADERSHIP",
            description: "Led a team to manage marketing campaigns and multimedia content creation for student government events. Oversaw social media strategies, graphic design, and video production to enhance student engagement and event visibility."
        },
        {
            title: "Assistant Recreational Head",
            company: "Philippine Society of Information Technology Students Region XI",
            date: "August 2024 - May 2025",
            type: null,
            description: "Assisted in organizing recreational activities and events for IT students across Region XI. Coordinated logistics, managed event schedules, and ensured participant engagement during regional IT student gatherings."
        },
        {
            title: "Documentation Photographer",
            company: "Blockchain Campus Conference",
            date: "October 2024",
            type: "EVENT VOLUNTEER",
            description: "Documented the conference proceedings through photography, capturing candid moments and staged shots of attendees and speakers."
        },
        {
            title: "Secretary",
            company: "College of Computing Education Student Government - University of Mindanao",
            date: "July 2023 - July 2024",
            type: null,
            description: "Managed official documentation, meeting minutes, and correspondence for the student government. Ensured effective communication between student representatives and faculty members."
        },
        {
            title: "Assistant Secretary",
            company: "Philippine Society of Information Technology Students Region XI",
            date: "October 2023 - March 2024",
            type: null,
            description: "Assisted in managing documentation and correspondence for the regional IT student organization. Supported event planning and communication efforts among member schools."
        },
        {
            title: "Publication and Documentation Head",
            company: "United Nation's Girl Up Organization - Davao Chapter",
            date: "July 2023 - December 2023",
            type: null,
            description: "Led the publication and documentation efforts for the Girl Up Davao Chapter. Managed content creation, social media updates, and event documentation to promote the organization's mission and activities."
        },
        {
            title: "Digital Artist",
            company: "Freelance",
            date: "March 2020",
            type: null,
            description: "Conceptualizing and executing custom digital artwork for global clients using industry-standard tools (e.g., Adobe Photoshop, Procreate, IbisPaint). Specializing in Character Design, Semi-Realism, Anime /2D Style, etc., I translate client ideas into compelling visual narratives with a focus on composition, color theory, and detail."
        },
        {
            title: "Personal Assistant",
            company: "Secondary Education English Teacher - Davao City National High School",
            date: "August 2018 - April 2021",
            type: null,
            description: "Provided administrative support by managing student data entry and automated grade computations using spreadsheets. Oversaw document preparation and revisions, and designed visual aids, including PowerPoint presentations."
        }
    ];

    const educationData = [
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
    ];

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
        <section className="bg-[#080707] text-white h-screen w-full flex flex-col py-4 px-4 lg:px-12 font-sans relative overflow-hidden" id="about">

            <style>{`
        .modern-scrollbar::-webkit-scrollbar { width: 4px; }
        .modern-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
        .modern-scrollbar::-webkit-scrollbar-thumb { background: #db0a0a; border-radius: 4px; }
        .modern-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff1f1f; }
      `}</style>

            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">

                {/* Section Title */}
                <div className="shrink-0 mb-4 mt-2">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">About Me</h2>
                    <div className="w-20 h-1 bg-[#db0a0a]"></div>
                </div>

                {/* Main Grid */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

                    {/* LEFT COLUMN: EXPERIENCE */}
                    <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center gap-3 mb-4 shrink-0">
                            <div className="p-1.5 bg-[#db0a0a]/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-[#db0a0a]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-100">Experience</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 modern-scrollbar bg-[#0f0f0f]/50 rounded-xl p-4 border border-white/5 pb-6">
                            <ol className="relative border-l border-neutral-800 ml-3 space-y-8">
                                {experienceData.map((item, index) => (
                                    <li key={index} className="relative ml-8 group">
                                        <span className="absolute -left-[43px] top-1 flex items-center justify-center w-6 h-6 bg-[#080707] rounded-full border border-neutral-700 group-hover:border-[#db0a0a] group-hover:shadow-[0_0_10px_#db0a0a] transition-all duration-300">
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

                    {/* RIGHT COLUMN: EDUCATION & SKILLS */}
                    <div className="lg:col-span-5 flex flex-col h-full overflow-hidden gap-3">

                        {/* Education Section */}
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 mb-2 shrink-0">
                                <div className="p-1.5 bg-[#db0a0a]/10 rounded-lg">
                                    <GraduationCap className="w-4 h-4 text-[#db0a0a]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-100">Education</h3>
                            </div>

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
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-400 text-[10px] truncate max-w-[200px]">{edu.degree}</p>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <Award className="w-3 h-3 text-[#db0a0a]" />
                                                <span className="text-[9px] text-gray-300 font-medium">{edu.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-2 mt-4 shrink-0">
                                <div className="p-1.5 bg-[#db0a0a]/10 rounded-lg">
                                    <Code className="w-4 h-4 text-[#db0a0a]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-100">Skills</h3>
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto pr-2 modern-scrollbar pb-6">

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
                                    <div className="grid grid-cols-2 gap-2">
                                        {technicalSkills.map((group, index) => (
                                            <div 
                                                key={index} 
                                                // If fullWidth is true (for Creative/Office), span 2 columns
                                                className={`bg-[#0f0f0f] p-3 rounded-lg border border-white/5 hover:border-[#db0a0a]/30 transition-colors group ${group.fullWidth ? 'col-span-2' : 'col-span-1'}`}
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
            </div>
        </section>
    );
};

export default About;