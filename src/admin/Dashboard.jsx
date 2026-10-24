import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, ExternalLink, FolderGit2, LayoutDashboard, LogOut, Newspaper, Plus,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { db } from '../hooks/usePortfolioData'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BlogSection from './BlogSection'
import ExperienceSection from './ExperienceSection'
import ProjectsSection from './ProjectsSection'
import { Toast } from './ui'

const ICON = 'h-4 w-4 shrink-0'

const SECTIONS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', Icon: FolderGit2 },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'blog', label: 'Blog', Icon: Newspaper },
]

const fromHash = () => {
  const id = window.location.hash.slice(1)
  return SECTIONS.some((s) => s.id === id) ? id : 'overview'
}

// ─── Overview ──────────────────────────────────────────────────────────────────

function Overview({ go }) {
  const [counts, setCounts] = useState(null)

  useEffect(() => {
    let live = true
    Promise.all([db.projects.list(), db.experience.list(), db.blog.list()]).then(([p, e, b]) => {
      if (!live) return
      setCounts({
        projects: p.data?.length ?? 0,
        experience: e.data?.length ?? 0,
        posts: b.data?.length ?? 0,
        drafts: b.data?.filter((x) => !x.is_published).length ?? 0,
      })
    })
    return () => { live = false }
  }, [])

  const tiles = [
    { id: 'projects', label: 'Projects', value: counts?.projects, Icon: FolderGit2, add: 'Add new' },
    { id: 'experience', label: 'Experience', value: counts?.experience, Icon: Briefcase, add: 'Add new' },
    {
      id: 'blog', label: 'Blog posts', value: counts?.posts, Icon: Newspaper, add: 'Add new',
      note: counts?.drafts ? `${counts.drafts} ${counts.drafts === 1 ? 'draft' : 'drafts'} not shown on your site` : null,
    },
  ]

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick what you want to update. Changes show on your site right after you save.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-3">
        {tiles.map(({ id, label, value, Icon, add, note }) => (
          <li key={id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary-strong">
              <Icon size={18} />
            </span>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {value ?? <span className="inline-block h-9 w-10 animate-pulse rounded-lg bg-secondary" />}
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
            {note && <p className="mt-1 text-xs text-primary-strong">{note}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" className="rounded-full" onClick={() => go(id, true)}><Plus /> {add}</Button>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => go(id)}>Manage</Button>
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
    experience: <ExperienceSection key={`e${startNew}`} toast={toast} startNew={startNew} />,
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
