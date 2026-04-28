-- ============================================================
-- SEED DATA — existing portfolio content
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ============================================================
-- EXPERIENCE (15 entries)
-- ============================================================

insert into public.experience (title, company, date, type, is_current, description, display_order) values
(
  'Front End Developer / UIUX Designer',
  'Inventiv Softwares',
  'January 2025',
  'Present',
  true,
  'Building responsive and visually engaging user interfaces using React and modern design tools. Collaborating with cross-functional teams to translate design concepts into functional web applications while ensuring optimal user experience and performance.',
  0
),
(
  'Executive Assistant',
  'Inventiv Softwares',
  'January 2025',
  'Present',
  true,
  'Supporting executive leadership with strategic initiatives, stakeholder management, and operational excellence. Coordinating key business functions to drive organizational growth and efficiency.',
  1
),
(
  'Web Developer',
  'Freelance',
  'November 2025',
  'Part Time',
  false,
  'Designing and deploying custom web applications with focus on performance and scalability. Managing hosting infrastructure and implementing best practices for site optimization.',
  2
),
(
  'Administrative Secretary',
  'Department of Education Region XI - Office of the Assistant Regional Director',
  'July 2025',
  null,
  false,
  'Supporting administrative operations through document management, scheduling coordination, and office support services.',
  3
),
(
  'Customer Service Representative',
  'Awesome CX & Alorica Davao',
  'April 2025 - October 2025',
  null,
  false,
  'Delivered exceptional customer support through inbound voice channels while maintaining high performance standards and customer satisfaction metrics.',
  4
),
(
  'President',
  'College of Computing Education Student Government - University of Mindanao',
  'July 2024 - July 2025',
  'LEADERSHIP',
  false,
  'Directed student governance initiatives, organized campus events, and advocated for student interests with faculty leadership.',
  5
),
(
  'External Vice President',
  'Council of College Student Governments - University of Mindanao',
  'July 2024 - July 2025',
  'LEADERSHIP',
  false,
  'Managed external relations and student advocacy initiatives, building partnerships to enhance institutional engagement and student welfare programs.',
  6
),
(
  'Marketing and Multimedia Unit Supervisor',
  'College of Computing Education Student Government - University of Mindanao',
  'July 2024 - July 2025',
  'LEADERSHIP',
  false,
  'Oversaw creative content strategy and multimedia production to amplify student engagement and event reach across digital platforms.',
  7
),
(
  'Assistant Recreational Head',
  'Philippine Society of Information Technology Students Region XI',
  'August 2024 - May 2025',
  null,
  false,
  'Coordinated regional recreational events and activities for IT students, managing logistics and participant engagement.',
  8
),
(
  'Documentation Photographer',
  'Blockchain Campus Conference',
  'October 2024',
  'EVENT VOLUNTEER',
  false,
  'Captured conference highlights through professional photography, documenting key moments and attendee experiences.',
  9
),
(
  'Secretary',
  'College of Computing Education Student Government - University of Mindanao',
  'July 2023 - July 2024',
  null,
  false,
  'Managed official records, coordinated communications, and maintained documentation for student government operations.',
  10
),
(
  'Assistant Secretary',
  'Philippine Society of Information Technology Students Region XI',
  'October 2023 - March 2024',
  null,
  false,
  'Supported regional organization operations through documentation and communication coordination across member institutions.',
  11
),
(
  'Publication and Documentation Head',
  'United Nation''s Girl Up Organization - Davao Chapter',
  'July 2023 - December 2023',
  null,
  false,
  'Directed content creation and digital communications to promote organizational initiatives and community engagement.',
  12
),
(
  'Digital Artist',
  'Freelance',
  'March 2020',
  null,
  false,
  'Created custom digital artwork across multiple styles and genres, delivering compelling visual solutions tailored to client specifications using industry-standard software.',
  13
),
(
  'Personal Assistant',
  'Secondary Education English Teacher - Davao City National High School',
  'August 2018 - April 2021',
  null,
  false,
  'Provided administrative support including student records management, grade tracking, and instructional materials preparation.',
  14
);

-- ============================================================
-- EDUCATION (2 entries)
-- ============================================================

insert into public.education (degree, institution, period, description, display_order) values
(
  'Bachelor of Science in Computer Science',
  'University of Mindanao',
  '2023 - Present',
  'Currently Enrolled',
  0
),
(
  'STEM Strand',
  'Davao City National High School',
  '2018 - 2022',
  'With High Honors',
  1
);

-- ============================================================
-- PROJECTS (6 entries)
-- Images kept as local /public paths — they still work from the public folder.
-- You can replace src values with Supabase Storage CDN URLs later via the CMS.
-- ============================================================

insert into public.projects (title, description, tech_stack, images, category, demo_url, github_url, is_coming_soon, display_order) values
(
  'BiteTrack',
  'Bitetrack is a modern nutrition tracker developed with a clean UI. Users can record meals, monitor calories and macros, and view personalized progress analytics.',
  array['PHP', 'TailwindCSS', 'JavaScript', 'MySQL', 'HTML', 'CSS', 'InfinityFree'],
  '[{"src":"/img-bitetrack/01.jpg","caption":"BiteTrack"},{"src":"/img-bitetrack/02.jpg","caption":"BiteTrack"},{"src":"/img-bitetrack/03.jpg","caption":"BiteTrack"}]'::jsonb,
  'development',
  'https://bitetrack.page.gd/',
  'https://github.com/mibiji224/BiteTrack',
  false,
  0
),
(
  'Personal Portfolio',
  'A responsive Single Page Application (SPA) designed to showcase my multidisciplinary work. Features include interactive modals, optimized image loading, and a custom dark aesthetic.',
  array['React', 'TailwindCSS', 'Vite', 'Node.js', 'JavaScript', 'Vercel'],
  '[{"src":"/img-drs/01.jpg","caption":"Personal Portfolio"},{"src":"/img-drs/02.jpg","caption":"Personal Portfolio"}]'::jsonb,
  'development',
  'https://desireesoronio.vercel.app/',
  'https://github.com/mibiji224/Portfolio',
  false,
  1
),
(
  'AMHere',
  'A modern attendance tracking web application built with Next.js and PostgreSQL. Features real-time check-ins, user management, and analytics dashboard for monitoring attendance records.',
  array['Next.js', 'PostgreSQL', 'Prisma', 'NeonDB', 'TailwindCSS'],
  '[{"src":"/img-am-here/01.png","caption":"AMHere"},{"src":"/img-am-here/02.png","caption":"AMHere"},{"src":"/img-am-here/03.png","caption":"AMHere"},{"src":"/img-am-here/04.png","caption":"AMHere"},{"src":"/img-am-here/05.png","caption":"AMHere"},{"src":"/img-am-here/06.png","caption":"AMHere"},{"src":"/img-am-here/07.png","caption":"AMHere"},{"src":"/img-am-here/08.png","caption":"AMHere"},{"src":"/img-am-here/09.png","caption":"AMHere"},{"src":"/img-am-here/10.png","caption":"AMHere"},{"src":"/img-am-here/11.png","caption":"AMHere"},{"src":"/img-am-here/12.png","caption":"AMHere"},{"src":"/img-am-here/13.png","caption":"AMHere"}]'::jsonb,
  'development',
  null,
  null,
  false,
  2
),
(
  'XChange',
  'A marketplace platform connecting influencers and businesses. XChange streamlines brand collaborations by enabling businesses to discover and partner with content creators, manage campaigns, and process transactions seamlessly.',
  array['Next.js', 'Supabase', 'Genkit', 'GA4', 'Square'],
  '[{"src":"/img-xchange/01.png","caption":"XChange"},{"src":"/img-xchange/02.png","caption":"XChange"},{"src":"/img-xchange/03.png","caption":"XChange"},{"src":"/img-xchange/04.png","caption":"XChange"},{"src":"/img-xchange/05.png","caption":"XChange"},{"src":"/img-xchange/06.png","caption":"XChange"},{"src":"/img-xchange/07.png","caption":"XChange"},{"src":"/img-xchange/08.png","caption":"XChange"},{"src":"/img-xchange/09.png","caption":"XChange"}]'::jsonb,
  'development',
  'https://app-delta-lemon-26.vercel.app/',
  null,
  false,
  3
),
(
  'Coming Soon',
  'A top-secret project currently under wraps.',
  array['Confidential'],
  '[]'::jsonb,
  'development',
  null,
  null,
  true,
  4
),
(
  'Coming Soon',
  'A top-secret project currently under wraps.',
  array['Confidential'],
  '[]'::jsonb,
  'development',
  null,
  null,
  true,
  5
);
