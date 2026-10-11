import { useEffect, useState } from 'react'
import {
  ArrowUpLeft, Award, Briefcase, Code, FolderGit2, GraduationCap, Mail, Menu, Palette, PenTool,
  Sparkles, Wrench, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON = 'w-4 h-4 shrink-0'

const ABOUT_LINKS = [
  { name: 'Experience', to: '/experience', icon: <Briefcase className={ICON} /> },
  { name: 'Skills', to: '/skills', icon: <Wrench className={ICON} /> },
  { name: 'Certifications', to: '/certifications', icon: <Award className={ICON} /> },
  { name: 'Education', to: '/education', icon: <GraduationCap className={ICON} /> },
  { name: 'More About Me', to: '/personal', icon: <Sparkles className={ICON} /> },
]

const PROJECT_LINKS = [
  { name: 'Development', to: '/projects/dev', icon: <Code className={ICON} /> },
  { name: 'Creative Arts', to: '/projects/art', icon: <Palette className={ICON} /> },
  { name: 'Graphics', to: '/projects/graphics', icon: <PenTool className={ICON} /> },
]

const CONTACT_LINK = { name: 'Contact', to: '/contact', icon: <Mail className={ICON} /> }

const itemClass = (isActive) =>
  cn(
    'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-mono text-[13px]',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isActive
      ? 'bg-secondary text-foreground'
      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
  )

const Marker = () => (
  <span className="absolute -left-px top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary-strong" aria-hidden="true" />
)

// `active` is decided by the page (scroll position), not the URL, because
// every page now lives in one continuous scroll.
const Item = ({ link, active, onSelect }) => (
  <a
    href={link.to}
    onClick={(e) => {
      e.preventDefault()
      onSelect(link.to)
    }}
    aria-current={active ? 'location' : undefined}
    className={itemClass(active)}
  >
    {active && <Marker />}
    {link.icon}
    {link.name}
  </a>
)

const GroupLabel = ({ children }) => (
  <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/80">{children}</p>
)

const Divider = () => <hr className="my-4 border-t border-border" />

const SidebarContent = ({ onHome, isActive, onSelect }) => (
  <div className="flex h-full flex-col px-5 py-6">
    <button
      type="button"
      onClick={onHome}
      className="rounded text-left text-lg font-medium tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Desiree Soronio
    </button>
    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Portfolio</p>

    <nav aria-label="About" className="mt-8 flex flex-col gap-0.5">
      <GroupLabel>About</GroupLabel>
      {ABOUT_LINKS.map((link) => <Item key={link.to} link={link} active={isActive(link.to)} onSelect={onSelect} />)}
    </nav>

    <Divider />

    <nav aria-label="Projects" className="flex flex-col gap-0.5">
      <GroupLabel>Projects</GroupLabel>
      {PROJECT_LINKS.map((link) => <Item key={link.to} link={link} active={isActive(link.to)} onSelect={onSelect} />)}
    </nav>

    <Divider />

    <nav aria-label="Contact" className="flex flex-col gap-0.5">
      <Item link={CONTACT_LINK} active={isActive(CONTACT_LINK.to)} onSelect={onSelect} />
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
// `onHome` scrolls back up to the hero; it is a scroll, not a navigation.
const DashboardShell = ({ onHome, isActive, onSelect, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const select = (to) => {
    setDrawerOpen(false)
    onSelect(to)
  }

  const goHome = () => {
    setDrawerOpen(false)
    onHome?.()
  }

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden lg:block sticky top-0 h-screen w-64 shrink-0 self-start border-r border-border overflow-y-auto">
        <SidebarContent onHome={goHome} isActive={isActive} onSelect={select} />
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
            <SidebarContent onHome={goHome} isActive={isActive} onSelect={select} />
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardShell
