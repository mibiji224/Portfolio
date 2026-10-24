import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award, Briefcase, ExternalLink, FolderGit2, GraduationCap, LayoutDashboard, LogOut, Newspaper, Plus,
  Sparkles, Wrench,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { db } from '../hooks/usePortfolioData'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BlogSection from './BlogSection'
import CollectionSection from './CollectionSection'
import ProjectsSection from './ProjectsSection'
import TagsSection from './TagsSection'
import { aboutConfig, certificationsConfig, educationConfig, experienceConfig, skillsConfig } from './configs'
import { Toast } from './ui'

const ICON = 'h-4 w-4 shrink-0'

const SECTIONS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', Icon: FolderGit2 },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'skills', label: 'Skills', Icon: Wrench },
  { id: 'certifications', label: 'Certifications', Icon: Award },
  { id: 'education', label: 'Education', Icon: GraduationCap },
  { id: 'about', label: 'About me', Icon: Sparkles },
  { id: 'blog', label: 'Blog', Icon: Newspaper },
]

const fromHash = () => {
  const id = window.location.hash.slice(1)
  return SECTIONS.some((s) => s.id === id) ? id : 'overview'
}

// ─── Overview ──────────────────────────────────────────────────────────────────

const TILES = [
  { id: 'projects', label: 'Projects', source: db.projects, Icon: FolderGit2 },
  { id: 'experience', label: 'Experience', source: db.experience, Icon: Briefcase },
  { id: 'skills', label: 'Skills', source: db.skills, Icon: Wrench, noAdd: true },
  { id: 'certifications', label: 'Certificates', source: db.certifications, Icon: Award },
  { id: 'education', label: 'Education', source: db.education, Icon: GraduationCap },
  { id: 'about', label: 'About me tags', source: db.tags, Icon: Sparkles, noAdd: true },
  { id: 'blog', label: 'Blog posts', source: db.blog, Icon: Newspaper },
]

function Overview({ go }) {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    let live = true
    TILES.forEach(async ({ id, source }) => {
      const { data } = await source.list()
      if (!live) return
      setCounts((c) => ({
        ...c,
        [id]: data?.length ?? 0,
        ...(id === 'blog' && { drafts: data?.filter((x) => !x.is_published).length ?? 0 }),
      }))
    })
    return () => { live = false }
  }, [])

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick what you want to update. Changes show on your site right after you save.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TILES.map(({ id, label, Icon, noAdd }) => (
          <li key={id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary-strong">
              <Icon size={18} />
            </span>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {counts[id] ?? <span className="inline-block h-9 w-10 animate-pulse rounded-lg bg-secondary" />}
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
            {id === 'blog' && counts.drafts > 0 && (
              <p className="mt-1 text-xs text-primary-strong">
                {counts.drafts} {counts.drafts === 1 ? 'draft' : 'drafts'} not shown on your site
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {!noAdd && (
                <Button size="sm" className="rounded-full" onClick={() => go(id, true)}><Plus /> Add new</Button>
              )}
              <Button size="sm" variant={noAdd ? 'default' : 'outline'} className="rounded-full" onClick={() => go(id)}>Manage</Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

// ─── Shell ─────────────────────────────────────────────────────────────────────

const navItem = (active) =>
  cn(
    'flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
  )

const tile = (active) =>
  cn(
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-primary-strong',
    active ? 'bg-primary' : 'bg-secondary'
  )

export default function Dashboard() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState(fromHash)
  // Bumped to remount a section when a shortcut should open its editor.
  const [startNew, setStartNew] = useState(false)
  const [toastState, setToastState] = useState({ message: '', type: '' })
  const timer = useRef(0)

  const toast = useCallback((message, type) => {
    setToastState({ message, type })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastState({ message: '', type: '' }), 3500)
  }, [])

  const go = (id, create = false) => {
    setStartNew(create)
    setSection(id)
    window.history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    const onHash = () => { setStartNew(false); setSection(fromHash()) }
    window.addEventListener('hashchange', onHash)
    return () => { window.removeEventListener('hashchange', onHash); clearTimeout(timer.current) }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const view = {
    overview: <Overview go={go} />,
    projects: <ProjectsSection key={`p${startNew}`} toast={toast} startNew={startNew} />,
    experience: <CollectionSection key={`e${startNew}`} config={experienceConfig} toast={toast} startNew={startNew} />,
    skills: <TagsSection config={skillsConfig} toast={toast} />,
    certifications: <CollectionSection key={`c${startNew}`} config={certificationsConfig} toast={toast} startNew={startNew} />,
    education: <CollectionSection key={`d${startNew}`} config={educationConfig} toast={toast} startNew={startNew} />,
    about: <TagsSection config={aboutConfig} toast={toast} />,
    blog: <BlogSection key={`b${startNew}`} toast={toast} startNew={startNew} />,
  }[section]

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <Toast message={toastState.message} type={toastState.type} />

      {/* Desktop: a fixed side panel in the same language as the public site's. */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col self-start rounded-r-[2rem] border-r-2 border-border px-4 py-7 lg:flex">
        <p className="px-2 text-xl font-semibold tracking-tight">Desiree Soronio</p>
        <p className="mt-0.5 px-2 text-xs text-muted-foreground">Site manager</p>

        <nav aria-label="Sections" className="mt-9 flex flex-col gap-2">
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-current={section === id ? 'page' : undefined}
              className={cn(navItem(section === id), 'w-full text-left')}
            >
              <span className={tile(section === id)}><Icon className={ICON} /></span>
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <hr className="mb-4 border-border" />
          <a href="/" target="_blank" rel="noopener noreferrer" className={navItem(false)}>
            <span className={tile(false)}><ExternalLink className={ICON} /></span>
            View my site
          </a>
          <button type="button" onClick={handleSignOut} className={cn(navItem(false), 'w-full text-left')}>
            <span className={tile(false)}><LogOut className={ICON} /></span>
            Sign out
          </button>
          <p className="truncate px-2 pt-2 text-xs text-muted-foreground" title={session?.user?.email}>
            {session?.user?.email}
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile: a top bar with the same sections as scrolling pills. */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="font-semibold tracking-tight">Site manager</p>
            <div className="flex items-center gap-1">
              <Button asChild variant="ghost" size="icon-sm" aria-label="View my site">
                <a href="/" target="_blank" rel="noopener noreferrer"><ExternalLink /></a>
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={handleSignOut} aria-label="Sign out"><LogOut /></Button>
            </div>
          </div>
          <nav aria-label="Sections" className="flex gap-2 overflow-x-auto px-4 pb-3">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                aria-current={section === id ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  section === id ? 'border-primary-strong bg-primary-soft text-primary-strong' : 'border-border text-muted-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 lg:py-12">{view}</main>
      </div>
    </div>
  )
}
