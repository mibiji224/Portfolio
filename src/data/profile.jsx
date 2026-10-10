import { Database, FileText, Layout, Palette, Server, Wrench } from 'lucide-react'

// Fallbacks for when Supabase has no rows yet. Once the tables are populated
// these can be deleted; the pages prefer the fetched data.

export const FALLBACK_EXPERIENCE = [
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

export const FALLBACK_EDUCATION = [
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
