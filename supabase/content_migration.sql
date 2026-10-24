-- Moves the site's written-in-code content into the database so it can be
-- edited from the dashboard. Run once in the Supabase SQL editor, BEFORE
-- deploying the matching site update. Safe to run again: each block only
-- inserts when its table has nothing to show yet.
--
-- What it does:
--   * experience: adds "kind" (work / leadership) and "points" (bullets), and
--     deletes the 14 old sample rows from April (all created by the original
--     seed, none of them shown on the site any more).
--   * creates certifications and personal_tags (readable by everyone, writable
--     only by the admin address, like the other tables).
--   * fills experience, skills, certifications, personal_tags and the art and
--     graphics projects with what the site currently shows.
-- Development projects and education are already in the database and are left
-- exactly as they are.

-- ── Experience ────────────────────────────────────────────────────────────────
alter table public.experience add column if not exists kind   text;
alter table public.experience add column if not exists points text[] default '{}';

delete from public.experience where kind is null;

insert into public.experience (kind, title, company, date, type, points, display_order)
select * from (values
    ('work', 'Executive Assistant / Operations and Project Manager', 'Inventiv (Tech Start Up)', 'June 2025 - October 2026', 'Independent Contractor · Full Time', array['Right-hand assistant to the Technical Director; handled correspondence and led operations and project management across teams', 'Carried out quality assurance and software testing on applications in development and production, and provided technical support for the company''s software and app', 'Managed social media and directed content creation, including multimedia editing (Canva graphics, TikTok/Reels video)', 'Handled hiring end to end (screening, interviews, onboarding) and maintained SOPs and HR/attendance documentation', 'Verified attendance and hours and calculated payroll before processing; tracked team records and tickets', 'Prepared business proposals and reports; managed stakeholder and client communications; maintained Google Sheets trackers for tasks and follow-ups']::text[], 0),
    ('work', 'Administrative Assistant', 'Department of Education Region XI', 'Jun 2025 - Dec 2025', 'Contract · Morning Shift', array['Provided close administrative support to the Assistant Regional Director', 'Managed calendar coordination, correspondence, and confidential documentation', 'Proofread and routed documents across departments before director approval and signing', 'Handled incoming calls and tracked document status through to completion']::text[], 1),
    ('work', 'Customer Service Representative', 'Awesome CX', 'July 2025 - October 2025', 'Seasonal / Contract', array['Answered inbound voice calls for a retail fashion brand, greeting customers professionally and finding out the reason for each call', 'Resolved customer concerns and answered sales-related inquiries, explaining information and next steps clearly', 'Documented each interaction accurately so the case details were complete and easy to follow up on']::text[], 2),
    ('work', 'Marketing and Social Media Manager', 'Odara Management LLC', 'Feb 2024 - June 2025', 'Independent Contractor · Full Time', array['Planned social media content strategy across multiple platforms, including bilingual and multi-market content', 'Kept a daily Instagram posting schedule across multiple creator accounts', 'Researched markets and prepared executive proposals to support business development', 'Contributed to go-to-market planning and brand positioning as part of the agency''s founding operations team']::text[], 3),
    ('work', 'Freelance Digital Artist & Illustrator', 'Self-Employed', '2020 - 2023', 'Freelance · Full Time', array['Created custom digital illustrations on commission for clients sourced through Fiverr, Twitter, Discord, and Instagram', 'Communicated directly with clients to understand requests, apply revisions, and deliver finished artwork']::text[], 4),
    ('leadership', 'President', 'Computing College Department Student Government', '2024', null, array['Led student initiatives and addressed student concerns']::text[], 5),
    ('leadership', 'Vice President', 'University of Mindanao Council of College', '2024', null, array['Led student initiatives and addressed student concerns']::text[], 6),
    ('leadership', 'Assistant Recreation Head', 'Philippine Society of IT Students (PSITS) Region XI', '2024', null, array['Organized recreational activities to foster engagement and camaraderie', 'Strengthened event planning, creativity, and management skills']::text[], 7),
    ('leadership', 'Design Team Volunteer', 'Google Developers Group Davao', '2024', null, array['Assisted with media and publication materials']::text[], 8),
    ('leadership', 'Event Logistics Volunteer', 'Davao StartUp Week', '2024', null, array['Assisted with event logistics and coordination to ensure smooth execution']::text[], 9),
    ('leadership', 'Photographer & Documentation Staff', 'Blockchain Campus Conference', '2024', null, array['Contributed as a photographer and documentation staff, capturing key moments']::text[], 10),
    ('leadership', 'Operation Block Committee', 'Junior Blockchain Consortium of the Philippines', '2024', null, array['Hosted events, engaging participants and ensuring a seamless experience', 'Managed event documentation and photography']::text[], 11),
    ('leadership', 'Secretary', 'Computing College Department Student Government', '2023', null, array['Handled documentation, correspondence, and administrative tasks using MS Office, Google Suite, and Canva']::text[], 12),
    ('leadership', 'Assistant Secretary', 'Philippine Society of IT Students (PSITS) Region XI', '2023', null, array['Maintained accurate data records and supported organizational documentation', 'Improved communication and technical writing skills']::text[], 13),
    ('leadership', 'Publication and Documentations Head', 'Girl Up Davao', '2023', null, array['Led the creation of publication materials and digital media content to amplify organizational initiatives']::text[], 14)
) v(kind, title, company, date, type, points, display_order)
where not exists (select 1 from public.experience);

-- ── Skills (core + technical groups) ──────────────────────────────────────────
insert into public.skills (category, name, display_order)
select * from (values
    ('core', 'Leadership', 0),
    ('core', 'Team Management', 1),
    ('core', 'Project Management', 2),
    ('core', 'Organizational Skills', 3),
    ('core', 'Time Management', 4),
    ('core', 'Communication', 5),
    ('core', 'Technical Writing', 6),
    ('core', 'Creative Design', 7),
    ('core', 'Visual Communication', 8),
    ('core', 'Web Development', 9),
    ('core', 'Programming', 10),
    ('core', 'Technical Support', 11),
    ('core', 'Customer Service', 12),
    ('core', 'Client Relations', 13),
    ('core', 'Marketing', 14),
    ('core', 'Branding Strategies', 15),
    ('core', 'Data Analysis', 16),
    ('core', 'Problem Solving', 17),
    ('core', 'Documentation', 18),
    ('core', 'Event Photography', 19),
    ('core', 'Administrative Assistance', 20),
    ('core', 'Office Support', 21),
    ('frontend', 'HTML', 22),
    ('frontend', 'CSS', 23),
    ('frontend', 'Tailwind CSS', 24),
    ('frontend', 'Bootstrap', 25),
    ('frontend', 'React', 26),
    ('backend', 'JavaScript', 27),
    ('backend', 'Python', 28),
    ('backend', 'PHP', 29),
    ('backend', 'Java', 30),
    ('backend', 'Node.js', 31),
    ('backend', 'REST API', 32),
    ('database', 'MySQL', 33),
    ('database', 'MongoDB', 34),
    ('database', 'Firebase', 35),
    ('database', 'PostgreSQL', 36),
    ('tools', 'Git', 37),
    ('tools', 'GitHub', 38),
    ('tools', 'VSCode', 39),
    ('tools', 'Eclipse', 40),
    ('tools', 'NetBeans', 41),
    ('tools', 'Xampp', 42),
    ('creative', 'Figma', 43),
    ('creative', 'Adobe Photoshop', 44),
    ('creative', 'Canva', 45),
    ('creative', 'Blender', 46),
    ('creative', 'Procreate', 47),
    ('creative', 'IbisPaint', 48),
    ('creative', 'CapCut', 49),
    ('creative', 'Photopea', 50),
    ('office', 'Google Suite', 51),
    ('office', 'Excel', 52),
    ('office', 'Word', 53),
    ('office', 'Google Sheets', 54),
    ('office', 'Google Docs', 55),
    ('office', 'Notion', 56),
    ('office', 'Slack', 57),
    ('office', 'Trello', 58),
    ('office', 'Zoom', 59),
    ('office', 'GMeet', 60),
    ('office', 'Outlook', 61),
    ('office', 'Loom', 62)
) v(category, name, display_order)
where not exists (select 1 from public.skills);

-- ── Certifications ────────────────────────────────────────────────────────────
create table if not exists public.certifications (
  id             uuid        primary key default uuid_generate_v4(),
  title          text        not null,
  issuer         text        not null,
  date           text,
  credential_id  text,
  url            text,
  display_order  integer     default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

insert into public.certifications (title, issuer, date, credential_id, url, display_order)
select * from (values
    ('Introduction to AI', 'Google', 'Apr 2026', '3VCH5AVY94X4', 'https://www.coursera.org/account/accomplishments/verify/3VCH5AVY94X4', 0),
    ('Crash Course on Python', 'Google', 'Apr 2026', 'AT3F9KBUJTEV', 'https://www.coursera.org/account/accomplishments/verify/AT3F9KBUJTEV', 1),
    ('Foundations of User Experience (UX) Design', 'Google', 'Mar 2026', 'PR06XKI3GPPG', 'https://www.coursera.org/account/accomplishments/verify/PR06XKI3GPPG', 2),
    ('Leadership Award', 'Philippine Society of Information Technology Student Region XI', '2024', null, null, 3),
    ('Responsive Web Design', 'freeCodeCamp', '2022', null, null, 4),
    ('Coding Basics: Web Profile using HTML, CSS, and Bootstrap', 'Zuitt Coding Bootcamp', 'Aug 2022', '01801', null, 5),
    ('Women in Science of Southeast Asia 2022', 'Girl Up', 'Jul 2022', null, null, 6),
    ('Programming for Beginners to Intermediate Level Using Python', 'DICT Philippines', 'Jun 2022', 'df310ab2-f59a-4652-a4f3-2cac65002b72', null, 7)
) v(title, issuer, date, credential_id, url, display_order)
where not exists (select 1 from public.certifications);

-- ── About me tags: homepage roles, hobbies, personality ───────────────────────
create table if not exists public.personal_tags (
  id             uuid        primary key default uuid_generate_v4(),
  kind           text        not null,   -- role | hobby | trait
  label          text        not null,
  display_order  integer     default 0,
  created_at     timestamptz default now()
);

insert into public.personal_tags (kind, label, display_order)
select * from (values
    ('role', 'a Software Developer', 0),
    ('role', 'a Leader', 1),
    ('role', 'a Project Manager', 2),
    ('role', 'a Designer', 3),
    ('role', 'an Innovator', 4),
    ('role', 'an Engineer', 5),
    ('role', 'a Creative Thinker', 6),
    ('role', 'a Project Manager', 7),
    ('hobby', 'Digital Painting', 8),
    ('hobby', 'Fitness', 9),
    ('hobby', 'Reading', 10),
    ('hobby', 'Cybersecurity', 11),
    ('trait', 'INTJ-T', 12),
    ('trait', 'Detail-Oriented', 13),
    ('trait', 'Creative Strategist', 14),
    ('trait', 'Resilient', 15)
) v(kind, label, display_order)
where not exists (select 1 from public.personal_tags);

-- ── Access rules for the two new tables ───────────────────────────────────────
drop trigger if exists certifications_updated_at on public.certifications;
create trigger certifications_updated_at
  before update on public.certifications
  for each row execute function handle_updated_at();

do $$
declare t text;
begin
  foreach t in array array['certifications', 'personal_tags'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public_read_%s" on public.%I', t, t);
    execute format('create policy "public_read_%s" on public.%I for select to anon, authenticated using (true)', t, t);
    execute format('drop policy if exists "admin_write_%s" on public.%I', t, t);
    execute format(
      'create policy "admin_write_%s" on public.%I for all to authenticated
         using ((auth.jwt() ->> ''email'') = ''desireesoronio@gmail.com'')
         with check ((auth.jwt() ->> ''email'') = ''desireesoronio@gmail.com'')', t, t);
  end loop;
end $$;

-- ── Art and graphics (the images stay in the site's /public folder) ───────────
-- "subtitle" holds the kind of piece (Illustration, UI Design...), "tech_stack"
-- the tool. New uploads from the dashboard go to Supabase Storage instead.
insert into public.projects (category, title, subtitle, description, tech_stack, images, display_order)
select * from (values
    ('art', 'Three Heroes Sketch', 'Character Design', 'Sketching the Monuments for The Greatest Heroes Art', array['IArtbook']::text[], '[{"src":"/arts/0000.jpg"}]'::jsonb, 100),
    ('art', 'The Greatest Heroes', 'Illustration', 'Inspired by the anime ''My Hero Academia'', this piece showcases three iconic heroes in a dynamic composition.', array['Sketchbook, iArtbook']::text[], '[{"src":"/arts/001.jpg"}]'::jsonb, 101),
    ('art', 'Dark Deku', 'Portrait', 'Inspired by the ''Dark Deku'' arc, this piece shows the light in his eyes finally extinguished by the burden of the upcoming war.', array['ibisPaint']::text[], '[{"src":"/arts/002.jpg"}]'::jsonb, 102),
    ('art', 'Katsuki', 'Portrait', null, array['ibisPaint']::text[], '[{"src":"/arts/003.jpg"}]'::jsonb, 103),
    ('art', 'Fallen Angel', 'Illustration', 'Inspired by Touya''s tragic backstory, this piece depicts his new identity, Dabi, in a literal fall. This symbolizes his metaphorical transformation from' || ' an innocent youth into' || ' a ''fallen angel.''', array['iArtbook']::text[], '[{"src":"/arts/004.jpg"}]'::jsonb, 104),
    ('art', 'Innocent Angel', 'Illustration', 'Inspired by Touya''s tragic backstory, this piece depicts his new identity, Dabi, in a literal fall. This symbolizes his metaphorical transformation from' || ' an innocent youth into' || ' a ''fallen angel.''', array['iArtbook']::text[], '[{"src":"/arts/005.jpg"}]'::jsonb, 105),
    ('art', 'Dabi in the Final War', 'Illustration', 'Inspired by the climactic battles in My Hero Academia, this piece captures Dabi amidst the chaos of the final war, showcasing his decaying skin from' || ' constant burns almost taking over his entire body.', array['ibisPaint']::text[], '[{"src":"/arts/006.jpg"}]'::jsonb, 106),
    ('art', 'Doctor Katsuki', 'Illustration', null, array['iArtbook']::text[], '[{"src":"/arts/007.jpg"}]'::jsonb, 107),
    ('art', 'Shoto', 'Illustration', 'Description for artwork 008...', array['iArtBook']::text[], '[{"src":"/arts/008.jpg"}]'::jsonb, 108),
    ('art', 'Open the door', 'Illustration', 'Description for artwork 009...', array['iArtBook']::text[], '[{"src":"/arts/009.jpg"}]'::jsonb, 109),
    ('art', 'Spill of Light', 'Illustration', 'Description for artwork 010...', array['iArtBook']::text[], '[{"src":"/arts/0010.jpg"}]'::jsonb, 110),
    ('art', 'The Wind', 'Illustration', 'Description for artwork 011...', array['iArtBook']::text[], '[{"src":"/arts/0011.jpg"}]'::jsonb, 111),
    ('art', 'Katsuki Bakuguo', 'Illustration', 'Description for artwork 012...', array['iArtBook']::text[], '[{"src":"/arts/0012.jpg"}]'::jsonb, 112),
    ('art', 'Deku', 'Illustration', 'Description for artwork 013...', array['iArtBook']::text[], '[{"src":"/arts/0013.jpg"}]'::jsonb, 113),
    ('art', 'The Art Master', 'Illustration', 'Description for artwork 014...', array['iArtBook']::text[], '[{"src":"/arts/0014.jpg"}]'::jsonb, 114),
    ('art', 'Spy', 'Illustration', 'Description for artwork 015...', array['iArtBook']::text[], '[{"src":"/arts/0015.jpg"}]'::jsonb, 115),
    ('art', 'Three Young Women Who Gave Life To Heroes', 'Illustration', 'Description for artwork 016...', array['iArtBook']::text[], '[{"src":"/arts/0016.jpg"}]'::jsonb, 116),
    ('art', 'Birthday Boy', 'Illustration', 'Description for artwork 017...', array['iArtBook']::text[], '[{"src":"/arts/0017.jpg"}]'::jsonb, 117),
    ('art', 'Shota', 'Illustration', 'Description for artwork 018...', array['iArtBook']::text[], '[{"src":"/arts/0018.jpg"}]'::jsonb, 118),
    ('art', 'Stranger Things (Deku)', 'Illustration', 'Description for artwork 019...', array['iArtBook']::text[], '[{"src":"/arts/0019.jpg"},{"src":"/arts/0020.jpg"}]'::jsonb, 119),
    ('art', 'Basketball Game', 'Illustration', 'Description for artwork 021...', array['iArtBook']::text[], '[{"src":"/arts/0021.jpg"}]'::jsonb, 120),
    ('art', 'Blood Sucker', 'Illustration', 'Description for artwork 022...', array['iArtBook']::text[], '[{"src":"/arts/0022.jpg"}]'::jsonb, 121),
    ('art', 'Umbrella', 'Illustration', 'Description for artwork 023...', array['iArtBook']::text[], '[{"src":"/arts/0023.jpg"}]'::jsonb, 122),
    ('art', 'The Trio', 'Illustration', 'Description for artwork 024...', array['iArtBook']::text[], '[{"src":"/arts/0024.jpg"}]'::jsonb, 123),
    ('art', 'Fair Skin', 'Illustration', 'Description for artwork 025...', array['iArtBook']::text[], '[{"src":"/arts/0025.jpg"}]'::jsonb, 124),
    ('art', 'Basketball Game', 'Illustration', 'Description for artwork 026...', array['iArtBook']::text[], '[{"src":"/arts/0026.jpg"}]'::jsonb, 125),
    ('art', 'Red Eyes', 'Commissioned', 'Description for artwork 027...', array['iArtBook']::text[], '[{"src":"/arts/0027.jpg"}]'::jsonb, 126),
    ('art', 'Anya''s Mischievous Smile', 'Illustration', 'Description for artwork 028...', array['iArtBook']::text[], '[{"src":"/arts/0028.jpg"}]'::jsonb, 127),
    ('art', 'Yor', 'Illustration', 'Description for artwork 029...', array['iArtBook']::text[], '[{"src":"/arts/0029.jpg"}]'::jsonb, 128),
    ('art', 'Blood', 'Commissioned', 'Description for artwork 030...', array['iArtBook']::text[], '[{"src":"/arts/0030.jpg"}]'::jsonb, 129),
    ('art', 'Golden Child', 'Commissioned', 'Description for artwork 031...', array['iArtBook']::text[], '[{"src":"/arts/0031.jpg"}]'::jsonb, 130),
    ('art', 'Female Version', 'Commissioned', 'Description for artwork 032...', array['iArtBook']::text[], '[{"src":"/arts/0032.jpg"}]'::jsonb, 131),
    ('art', 'Bike Boy', 'Illustration', 'Description for artwork 033...', array['iArtBook']::text[], '[{"src":"/arts/0033.jpg"}]'::jsonb, 132),
    ('art', 'Guitarist', 'Illustration', 'Description for artwork 034...', array['iArtBook']::text[], '[{"src":"/arts/0034.jpg"}]'::jsonb, 133),
    ('art', 'Mr. Doctor', 'Illustration', 'Description for artwork 035...', array['iArtBook']::text[], '[{"src":"/arts/0035.jpg"}]'::jsonb, 134),
    ('art', 'Crawling Out', 'Commissioned', 'Description for artwork 036...', array['iArtBook']::text[], '[{"src":"/arts/0036.jpg"}]'::jsonb, 135),
    ('art', 'Before Shigaraki', 'Illustration', 'Description for artwork 037...', array['iArtBook']::text[], '[{"src":"/arts/0037.jpg"}]'::jsonb, 136),
    ('art', 'Toga', 'Illustration', 'Description for artwork 038...', array['iArtBook']::text[], '[{"src":"/arts/0038.jpg"}]'::jsonb, 137),
    ('art', 'Spike', 'Commissioned', 'Description for artwork 039...', array['iArtBook']::text[], '[{"src":"/arts/0039.jpg"}]'::jsonb, 138),
    ('art', 'Uraraka and Katsuki', 'Illustration', 'Description for artwork 040...', array['iArtBook']::text[], '[{"src":"/arts/0040.jpg"}]'::jsonb, 139),
    ('art', 'Cold Night', 'Illustration', 'Description for artwork 041...', array['iArtBook']::text[], '[{"src":"/arts/0041.jpg"}]'::jsonb, 140)
) v(category, title, subtitle, description, tech_stack, images, display_order)
where not exists (select 1 from public.projects where category = 'art');

insert into public.projects (category, title, subtitle, description, tech_stack, images, display_order)
select * from (values
    ('graphics', 'Marketing', 'UI Design', null, array['Canva']::text[], '[{"src":"/graphics/09.jpg"}]'::jsonb, 100),
    ('graphics', 'Marketing', 'UI Design', null, array['Canva']::text[], '[{"src":"/graphics/11.jpg"}]'::jsonb, 101),
    ('graphics', 'Marketing', 'UI Design', null, array['Canva']::text[], '[{"src":"/graphics/10.jpg"}]'::jsonb, 102),
    ('graphics', 'Marketing', 'UI Design', null, array['Canva']::text[], '[{"src":"/graphics/12.jpeg"}]'::jsonb, 103),
    ('graphics', 'Marketing', 'UI Design', null, array['Canva']::text[], '[{"src":"/graphics/13.jpeg"}]'::jsonb, 104),
    ('graphics', 'STEAM Empower Countdown', 'Event Branding', null, array['Canva']::text[], '[{"src":"/graphics/01.jpg"}]'::jsonb, 105),
    ('graphics', 'Girl Up Davao Board Meeting', 'Publication Material', null, array['Canva']::text[], '[{"src":"/graphics/02.jpg"}]'::jsonb, 106),
    ('graphics', 'Board Members of Girl Up Davao', 'Social Media', null, array['Canva']::text[], '[{"src":"/graphics/03.jpg"}]'::jsonb, 107),
    ('graphics', 'Annual Report Layout', 'Editorial', null, array['InDesign']::text[], '[{"src":"/graphics/04.png"}]'::jsonb, 108),
    ('graphics', 'Mobile App UI Kit', 'UI Design', null, array['Figma']::text[], '[{"src":"/graphics/06.jpg"}]'::jsonb, 109),
    ('graphics', 'Mobile App UI Kit v2', 'UI Design', null, array['Figma']::text[], '[{"src":"/graphics/07.jpg"},{"src":"/graphics/08.jpg"}]'::jsonb, 110)
) v(category, title, subtitle, description, tech_stack, images, display_order)
where not exists (select 1 from public.projects where category = 'graphics');
