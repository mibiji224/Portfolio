import { useEffect, useState } from 'react'
import { ArrowUpLeft, Code, FolderGit2, Mail, Menu, Palette, PenTool, User, X } from 'lucide-react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

const ICON = 'w-4 h-4 shrink-0'

const SECTION_LINKS = [
  { name: 'About', href: '#about', icon: <User className={ICON} /> },
  { name: 'Projects', href: '#projects', icon: <FolderGit2 className={ICON} /> },
  { name: 'Contact', href: '#connect', icon: <Mail className={ICON} /> },
]

const PROJECT_TABS = [
  { id: 'dev', label: 'Development', icon: <Code className={ICON} /> },
  { id: 'art', label: 'Creative Arts', icon: <Palette className={ICON} /> },
  { id: 'graphics', label: 'Graphics', icon: <PenTool className={ICON} /> },
]

const SECTION_HREFS = SECTION_LINKS.map((l) => l.href)

const itemClass = (active) =>
  cn(
    'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-mono text-[13px]',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    active
      ? 'bg-secondary text-foreground'
      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
  )

// Active marker: a short bar on the item's left edge, in the brand pink.
const Marker = () => (
  <span className="absolute -left-px top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary-strong" aria-hidden="true" />
)

const Divider = () => <hr className="my-4 border-t border-border" />

const SidebarContent = ({ activeSection, projectTab, onSection, onProjectTab, onHome }) => (
  <div className="flex h-full flex-col px-5 py-6">
    <button
      type="button"
      onClick={onHome}
      className="text-left text-lg font-medium tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
    >
      Desiree Soronio
    </button>
    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Portfolio</p>

    <nav aria-label="Sections" className="mt-8 flex flex-col gap-0.5">
      {SECTION_LINKS.map(({ name, href, icon }) => {
        const active = activeSection === href
        return (
          <a
            key={href}
            href={href}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey) return
              e.preventDefault()
              onSection(href)
            }}
            aria-current={active ? 'page' : undefined}
            className={itemClass(active)}
          >
            {active && <Marker />}
            {icon}
            {name}
          </a>
        )
      })}
    </nav>

    <Divider />

    <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/80">Projects</p>
    <nav aria-label="Project categories" className="flex flex-col gap-0.5">
      {PROJECT_TABS.map(({ id, label, icon }) => {
        const active = activeSection === '#projects' && projectTab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onProjectTab(id)}
            aria-pressed={active}
            className={itemClass(active)}
          >
            {active && <Marker />}
            {icon}
            {label}
          </button>
        )
      })}
    </nav>

    <div className="mt-auto pt-6">
      <Divider />
      <button type="button" onClick={onHome} className={itemClass(false)}>
        <ArrowUpLeft className={ICON} />
        Back to home
      </button>
    </div>
  </div>
)

// Sticky left sidebar on desktop; a sticky top bar plus drawer below `lg`.
// It sits in normal flow after the hero, so it appears as the hero scrolls off.
const DashboardShell = ({ hidden, projectTab, onSection, onProjectTab, onHome, children }) => {
  const [activeSection, setActiveSection] = useScrollSpy(SECTION_HREFS, SECTION_HREFS[0])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  const handlers = {
    activeSection,
    projectTab,
    onSection: (href) => {
      setActiveSection(href)
      setDrawerOpen(false)
      onSection(href)
    },
    onProjectTab: (id) => {
      setActiveSection('#projects')
      setDrawerOpen(false)
      onProjectTab(id)
    },
    onHome: () => {
      setDrawerOpen(false)
      onHome()
    },
  }

  return (
    <div id="portfolio-sections" className={cn('bg-background', hidden ? 'hidden' : 'lg:flex')}>
      <aside className="hidden lg:block sticky top-0 h-screen w-64 shrink-0 self-start border-r border-border bg-background overflow-y-auto">
        <SidebarContent {...handlers} />
      </aside>

      <div className="min-w-0 flex-1">
        <div className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur">
          <span className="text-base font-medium tracking-tight">Desiree Soronio</span>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-in fade-in duration-200"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-background shadow-lift animate-in slide-in-from-left duration-300">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent {...handlers} />
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardShell
