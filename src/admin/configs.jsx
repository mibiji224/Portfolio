import { Award, Briefcase, GraduationCap } from 'lucide-react'
import { db } from '@/hooks/usePortfolioData'
import { SKILL_GROUPS } from '@/lib/skillGroups'
import { Chip } from './ui'

// What each plain-records section stores and how its list reads.

export const experienceConfig = {
  source: db.experience,
  noun: 'Experience',
  title: 'Experience',
  description: 'Work and leadership roles, in the order you set.',
  icon: Briefcase,
  newHint: 'A job, internship, freelance gig or leadership role.',
  describe: (r) => `${r.title} at ${r.company}`,
  empty: { title: 'No experience yet', body: 'Add a role to start your timeline.' },
  searchText: (r) => `${r.title} ${r.company}`,
  filter: {
    key: 'kind',
    options: [
      { value: 'work', label: 'Work' },
      { value: 'leadership', label: 'Leadership' },
    ],
  },
  fields: [
    {
      key: 'kind', label: 'Where does it show?', type: 'segmented', default: 'work',
      options: [
        { value: 'work', label: 'Work experience' },
        { value: 'leadership', label: 'Leadership & affiliations' },
      ],
    },
    { key: 'title', label: 'Role', required: true, placeholder: 'Executive Assistant' },
    { key: 'company', label: 'Company or organization', required: true, placeholder: 'Inventiv' },
    { key: 'date', label: 'When', required: true, hint: 'Write it the way you want it shown.', placeholder: 'June 2025 - October 2026' },
    { key: 'type', label: 'Note', nullable: true, hint: 'Optional. Shown as a small badge, such as Contract or Full time.', placeholder: 'Contract · Full time' },
    { key: 'points', label: 'What you did', type: 'lines', rows: 8, hint: 'One point per line. Each becomes a bullet.' },
  ],
  rowOf: (r) => ({
    noThumb: true,
    label: r.title,
    meta: `${r.company} · ${r.date}`,
    chip: <Chip tone={r.kind === 'leadership' ? 'draft' : 'live'}>{r.kind === 'leadership' ? 'Leadership' : 'Work'}</Chip>,
  }),
}

export const certificationsConfig = {
  source: db.certifications,
  noun: 'Certificate',
  title: 'Certifications & awards',
  description: 'Courses, credentials and recognition, in the order you set.',
  icon: Award,
  newHint: 'A course, credential or award.',
  describe: (r) => r.title,
  empty: { title: 'No certificates yet', body: 'Add a course or award to show on your site.' },
  searchText: (r) => `${r.title} ${r.issuer}`,
  fields: [
    { key: 'title', label: 'Title', required: true, placeholder: 'Introduction to AI' },
    { key: 'issuer', label: 'Issued by', required: true, placeholder: 'Google' },
    { key: 'date', label: 'When', nullable: true, placeholder: 'Apr 2026' },
    { key: 'credential_id', label: 'Credential ID', nullable: true, hint: 'Optional.' },
    { key: 'url', label: 'Link to verify it', type: 'url', nullable: true, hint: 'Optional. Adds a "Show credential" link.', placeholder: 'https://' },
  ],
  rowOf: (r) => ({ noThumb: true, label: r.title, meta: `${r.issuer}${r.date ? ` · ${r.date}` : ''}` }),
}

export const educationConfig = {
  source: db.education,
  noun: 'Education',
  title: 'Education',
  description: 'Schools and programs, in the order you set.',
  icon: GraduationCap,
  newHint: 'A school, program or degree.',
  describe: (r) => r.degree,
  empty: { title: 'No education yet', body: 'Add a school or program.' },
  searchText: (r) => `${r.degree} ${r.institution}`,
  fields: [
    { key: 'institution', label: 'School', required: true, placeholder: 'University of Mindanao' },
    { key: 'degree', label: 'Program or degree', required: true, placeholder: 'Bachelor of Science in Computer Science' },
    { key: 'period', label: 'When', required: true, placeholder: '2022 - 2025' },
    { key: 'description', label: 'Status or honors', nullable: true, hint: 'Optional, such as With High Honors.', placeholder: 'With High Honors' },
  ],
  rowOf: (r) => ({ noThumb: true, label: r.degree, meta: `${r.institution} · ${r.period}` }),
}

export const skillsConfig = {
  source: db.skills,
  noun: 'Skill',
  nameKey: 'name',
  groupKey: 'category',
  title: 'Skills',
  description: 'The competencies and tools shown on your Skills page.',
  groups: [
    { key: 'core', label: 'Core competencies', hint: 'What you do day to day.', placeholder: 'Project management' },
    ...SKILL_GROUPS.map((g) => ({ key: g.key, label: g.label, placeholder: 'Add a tool' })),
  ],
}

export const aboutConfig = {
  source: db.tags,
  noun: 'Tag',
  nameKey: 'label',
  groupKey: 'kind',
  title: 'About me',
  description: 'The short lists on your site: the homepage roles, your hobbies and your personality.',
  groups: [
    { key: 'role', label: 'Homepage roles', hint: 'These type out under your name, in order. Start each with “a” or “an”.', placeholder: 'a Designer' },
    { key: 'hobby', label: 'Hobbies', placeholder: 'Reading' },
    { key: 'trait', label: 'Personality', placeholder: 'Detail-oriented' },
  ],
}
