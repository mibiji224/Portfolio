import { Database, FileText, Layout, Palette, Server, Wrench } from 'lucide-react'

// Fallbacks for when Supabase has no rows yet. Once the tables are populated
// these can be deleted; the pages prefer the fetched data.

export const WORK_EXPERIENCE = [
    {
        title: "Executive Assistant / Operations and Project Manager",
        company: "Inventiv (Tech Start Up)",
        date: "June 2025 - October 2026",
        note: "Independent Contractor · Full Time",
        points: [
            "Right-hand assistant to the Technical Director; handled correspondence and led operations and project management across teams",
            "Carried out quality assurance and software testing on applications in development and production, and provided technical support for the company's software and app",
            "Managed social media and directed content creation, including multimedia editing (Canva graphics, TikTok/Reels video)",
            "Handled hiring end to end (screening, interviews, onboarding) and maintained SOPs and HR/attendance documentation",
            "Verified attendance and hours and calculated payroll before processing; tracked team records and tickets",
            "Prepared business proposals and reports; managed stakeholder and client communications; maintained Google Sheets trackers for tasks and follow-ups",
        ],
    },
    {
        title: "Administrative Assistant",
        company: "Department of Education Region XI",
        date: "Jun 2025 - Dec 2025",
        note: "Contract · Morning Shift",
        points: [
            "Provided close administrative support to the Assistant Regional Director",
            "Managed calendar coordination, correspondence, and confidential documentation",
            "Proofread and routed documents across departments before director approval and signing",
            "Handled incoming calls and tracked document status through to completion",
        ],
    },
    {
        title: "Customer Service Representative",
        company: "Awesome CX",
        date: "July 2025 - October 2025",
        note: "Seasonal / Contract",
        points: [
            "Answered inbound voice calls for a retail fashion brand, greeting customers professionally and finding out the reason for each call",
            "Resolved customer concerns and answered sales-related inquiries, explaining information and next steps clearly",
            "Documented each interaction accurately so the case details were complete and easy to follow up on",
        ],
    },
    {
        title: "Marketing and Social Media Manager",
        company: "Odara Management LLC",
        date: "Feb 2024 - June 2025",
        note: "Independent Contractor · Full Time",
        points: [
            "Planned social media content strategy across multiple platforms, including bilingual and multi-market content",
            "Kept a daily Instagram posting schedule across multiple creator accounts",
            "Researched markets and prepared executive proposals to support business development",
            "Contributed to go-to-market planning and brand positioning as part of the agency's founding operations team",
        ],
    },
    {
        title: "Freelance Digital Artist & Illustrator",
        company: "Self-Employed",
        date: "2020 - 2023",
        note: "Freelance · Full Time",
        points: [
            "Created custom digital illustrations on commission for clients sourced through Fiverr, Twitter, Discord, and Instagram",
            "Communicated directly with clients to understand requests, apply revisions, and deliver finished artwork",
        ],
    },
]

export const LEADERSHIP_ROLES = [
    {
        title: "President",
        company: "Computing College Department Student Government",
        date: "2024",
        points: ["Led student initiatives and addressed student concerns"],
    },
    {
        title: "Vice President",
        company: "University of Mindanao Council of College",
        date: "2024",
        points: ["Led student initiatives and addressed student concerns"],
    },
    {
        title: "Assistant Recreation Head",
        company: "Philippine Society of IT Students (PSITS) Region XI",
        date: "2024",
        points: [
            "Organized recreational activities to foster engagement and camaraderie",
            "Strengthened event planning, creativity, and management skills",
        ],
    },
    {
        title: "Design Team Volunteer",
        company: "Google Developers Group Davao",
        date: "2024",
        points: ["Assisted with media and publication materials"],
    },
    {
        title: "Event Logistics Volunteer",
        company: "Davao StartUp Week",
        date: "2024",
        points: ["Assisted with event logistics and coordination to ensure smooth execution"],
    },
    {
        title: "Photographer & Documentation Staff",
        company: "Blockchain Campus Conference",
        date: "2024",
        points: ["Contributed as a photographer and documentation staff, capturing key moments"],
    },
    {
        title: "Operation Block Committee",
        company: "Junior Blockchain Consortium of the Philippines",
        date: "2024",
        points: [
            "Hosted events, engaging participants and ensuring a seamless experience",
            "Managed event documentation and photography",
        ],
    },
    {
        title: "Secretary",
        company: "Computing College Department Student Government",
        date: "2023",
        points: ["Handled documentation, correspondence, and administrative tasks using MS Office, Google Suite, and Canva"],
    },
    {
        title: "Assistant Secretary",
        company: "Philippine Society of IT Students (PSITS) Region XI",
        date: "2023",
        points: [
            "Maintained accurate data records and supported organizational documentation",
            "Improved communication and technical writing skills",
        ],
    },
    {
        title: "Publication and Documentations Head",
        company: "Girl Up Davao",
        date: "2023",
        points: ["Led the creation of publication materials and digital media content to amplify organizational initiatives"],
    },
]

export const FALLBACK_EDUCATION = [
    {
        school: "University of Mindanao",
        degree: "Bachelor of Science in Computer Science",
        year: "2022 - 2024",
        status: "Stopped Out (On Hold)",
    },
    {
        school: "Davao City National High School",
        degree: "STEM Strand",
        year: "2018 - 2022",
        status: "With High Honors"
    }
]

export const CORE_SKILLS = [
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
]

export const TECHNICAL_SKILLS = [
    { category: "Frontend", icon: <Layout size={14} />, items: ["HTML", "CSS", "Tailwind CSS", "Bootstrap", "React"] },
    { category: "Backend", icon: <Server size={14} />, items: ["JavaScript", "Python", "PHP", "Java", "Node.js", "REST API"] },
    { category: "Database", icon: <Database size={14} />, items: ["MySQL", "MongoDB", "Firebase", "PostgreSQL"] },
    { category: "Tech Tools", icon: <Wrench size={14} />, items: ["Git", "GitHub", "VSCode", "Eclipse", "NetBeans", "Xampp"] },

    { category: "Creative Tools", icon: <Palette size={14} />, items: ["Figma", "Adobe Photoshop", "Canva", "Blender", "Procreate", "IbisPaint", "CapCut", "Photopea"] },
    { category: "Office Tools", icon: <FileText size={14} />, items: ["Google Suite", "Excel", "Word", "Google Sheets", "Google Docs", "Notion", "Slack", "Trello", "Zoom", "GMeet", "Outlook", "Loom"] }
]

// Newest first. Mirrors the LinkedIn licenses & certifications list.
// `url` is optional: only the entries with a public verification page link out.
export const CERTIFICATIONS = [
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
]

export const HOBBIES = ['Digital Painting', 'Fitness', 'Reading', 'Cybersecurity']

export const TRAITS = ['INTJ-T', 'Detail-Oriented', 'Creative Strategist', 'Resilient']

export const FALLBACK_BLOG = [
    {
        id: "live-for-yourself-too",
        slug: "live-for-yourself-too",
        title: "Live for Yourself, Too",
        excerpt: "Give generously to the work you believe in, but don’t forget to save a piece for yourself.",
        cover_image: null,
        published_at: "2026-10-23",
        body: `When you start working on something new, it’s easy to give it everything. A new role, a new team, a new mission: there’s a kind of energy that comes with being part of something that’s just beginning. You want to prove yourself. You want it to succeed. And because you believe in it, you keep giving more.

That’s what I did. And somewhere along the way, I realized something I wish I had understood sooner.

The dedication and effort you put into your work should still be proportional to who you are and what you need as a person. Not just what the work asks of you, but what your life asks of you too.

When we pour ourselves into a cause, we often forget to save a piece for ourselves. We skip the rest, push past the signs of exhaustion, and tell ourselves it’s temporary. We think that giving more is the same as doing better. But it isn’t.

Forgetting to give a piece to yourself slowly breaks your foundation. And when your foundation cracks, everything you’re building on top of it starts to shake. Instead of successfully bringing a new idea to life, you end up exhausting yourself. Sometimes the damage goes further than you ever intended: to your health, your relationships, and the very passion that made you say yes in the first place.

I learned that you can’t sustain someone else’s vision if you’re running on empty. Burnout doesn’t make you more committed. It just makes you less of yourself.

So here’s what I want to remind you, and myself:

It’s important to keep yourself alive, especially when you’re working hard to keep someone else’s dream alive. Your effort matters. Your commitment matters. But so do you.

Rest without guilt. Set boundaries without apologizing. Speak up when something doesn’t feel right. Make room for the things that remind you who you are outside of your work.

Because the people and causes worth giving to will be better served by someone who is whole, not someone who is slowly disappearing.

Give generously, but live for yourself as well.`,
    },
]
