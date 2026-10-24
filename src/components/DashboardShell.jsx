import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowUpLeft, Award, Briefcase, Code, FolderGit2, GraduationCap, Mail, Menu, Newspaper, Palette, PenTool,
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

const BLOG_LINK = { name: 'Blog', to: '/blog', icon: <Newspaper className={ICON} /> }

const CONTACT_LINK = { name: 'Contact', to: '/contact', icon: <Mail className={ICON} /> }

// The active item is not filled: the panel's edge is cut away around it (see
// `Notch`), so it reads as the page opening into the sidebar. The rest are
// plain ink-grey. Each icon rides in its own small round tile.
const itemClass = (isActive) =>
  cn(
    'group relative flex w-full items-center gap-3 rounded-full py-1 pl-1.5 pr-4 text-left text-[13px]',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isActive
      ? 'font-semibold text-foreground'
      : 'font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
  )

const tileClass = (isActive) =>
  cn(
    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
    isActive ? 'bg-primary text-primary-strong' : 'bg-secondary text-primary-strong'
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
    <span className={tileClass(active)}>{link.icon}</span>
    {link.name}
  </a>
)

const GroupLabel = ({ children }) => (
  <p className="px-3 pb-2 text-xs font-medium text-muted-foreground/80">{children}</p>
)

const Divider = () => <hr className="my-4 border-t border-border" />

// Corner radius where the cut meets the panel's edge, and the pill's left inset
// (the nav's side padding, px-4).
const CORNER = 16
const PILL_INSET = 16
// Thickness of the outline. It sits on the panel side of the cut.
const EDGE = 2

// The notch: the panel is cut away beside the active item, so the page shows
// through it (it is a real hole, not a white patch). The hole runs from the
// panel's right edge round the item's rounded left end and back, with rounded
// corners where it meets the edge. `holeMask` punches it out of the panel's
// fill and edge line; `Notch` redraws its outline. Both slide to the next item
// rather than jumping.
const holeMask = ({ top, height, width }) => {
  const r = height / 2
  const c = CORNER
  const x = PILL_INSET + r
  const h = height + c * 2
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${h}'>` +
    `<path d='M${width} 0A${c} ${c} 0 0 1 ${width - c} ${c}L${x} ${c}A${r} ${r} 0 0 0 ${x} ${c + height}` +
    `L${width - c} ${c + height}A${c} ${c} 0 0 1 ${width} ${h}Z'/></svg>`
  const hole = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  const style = {
    maskImage: `${hole}, linear-gradient(#000, #000)`,
    maskSize: `${width}px ${h}px, 100% 100%`,
    maskPosition: `0px ${top - c}px, 0 0`,
    maskRepeat: 'no-repeat',
    maskComposite: 'exclude',
    transition: 'mask-position var(--spring-duration) var(--spring)',
  }
  for (const key of ['maskImage', 'maskSize', 'maskPosition', 'maskRepeat']) {
    style[`Webkit${key[0].toUpperCase()}${key.slice(1)}`] = style[key]
  }
  style.WebkitMaskComposite = 'xor'
  return style
}

const Notch = ({ top, height }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 -z-10"
    style={{
      transform: `translateY(${top - CORNER}px)`,
      height: height + CORNER * 2,
      transition: 'transform var(--spring-duration) var(--spring)',
    }}
  >
    <span
      className="absolute right-0 top-0 rounded-br-full border-b-2 border-r-2 border-border"
      style={{ width: CORNER, height: CORNER }}
    />
    <span
      className="absolute right-0 bottom-0 rounded-tr-full border-r-2 border-t-2 border-border"
      style={{ width: CORNER, height: CORNER }}
    />
    <span
      className="absolute rounded-l-full border-y-2 border-l-2 border-border"
      style={{ left: PILL_INSET - EDGE, right: CORNER, top: CORNER - EDGE, height: height + EDGE * 2 }}
    />
  </div>
)

const SidebarContent = ({ onHome, isActive, onSelect }) => {
  const ref = useRef(null)
  const [slot, setSlot] = useState(null)

  const measure = () => {
    const wrap = ref.current
    const el = wrap?.querySelector('[aria-current="location"]')
    const rect = el?.getBoundingClientRect()
    if (!rect?.height) return setSlot((prev) => (prev ? null : prev))
    const top = rect.top - wrap.getBoundingClientRect().top
    setSlot((prev) =>
      prev && prev.top === top && prev.height === rect.height && prev.width === wrap.clientWidth
        ? prev
        : { top, height: rect.height, width: wrap.clientWidth }
    )
  }

  // Runs after every render: the active item is decided by the parent.
  useLayoutEffect(measure)

  useEffect(() => {
    const ro = new ResizeObserver(measure)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const mask = slot ? holeMask(slot) : undefined

  return (
  <div ref={ref} className="relative isolate flex min-h-full flex-col px-4 py-7">
    {/* The panel's fill and its right edge (same rounded corners as the container), both with the hole punched out. */}
    <div className="pointer-events-none absolute inset-0 -z-10 rounded-r-[2rem] bg-background" style={mask} aria-hidden="true" />
    <div className="pointer-events-none absolute inset-0 -z-10 rounded-r-[2rem] border-r-2 border-border" style={mask} aria-hidden="true" />
    {slot && <Notch top={slot.top} height={slot.height} />}

    <button
      type="button"
      onClick={onHome}
      className="rounded text-left text-xl font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Desiree Soronio
    </button>
    <p className="mt-0.5 text-xs text-muted-foreground">Portfolio</p>

    <nav aria-label="About" className="mt-9 flex flex-col gap-2">
      <GroupLabel>About</GroupLabel>
      {ABOUT_LINKS.map((link) => <Item key={link.to} link={link} active={isActive(link.to)} onSelect={onSelect} />)}
    </nav>

    <Divider />

    <nav aria-label="Projects" className="flex flex-col gap-2">
      <GroupLabel>Projects</GroupLabel>
      {PROJECT_LINKS.map((link) => <Item key={link.to} link={link} active={isActive(link.to)} onSelect={onSelect} />)}
    </nav>

    <Divider />

    <nav aria-label="Blog" className="flex flex-col gap-2">
      <Item link={BLOG_LINK} active={isActive(BLOG_LINK.to)} onSelect={onSelect} />
    </nav>

    <Divider />

    <nav aria-label="Contact" className="flex flex-col gap-2">
      <Item link={CONTACT_LINK} active={isActive(CONTACT_LINK.to)} onSelect={onSelect} />
    </nav>

    <div className="mt-auto pt-4">
      <Divider />
      <button type="button" onClick={onHome} className={itemClass(false)}>
        <span className={tileClass(false)}><ArrowUpLeft className={ICON} /></span>
        Back to home
      </button>
    </div>
  </div>
  )
}

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
      <aside data-lenis-prevent className="hidden lg:block sticky top-0 h-screen w-64 shrink-0 self-start overflow-y-auto rounded-r-[2rem]">
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
          <div data-lenis-prevent className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto rounded-r-[2rem] animate-in slide-in-from-left duration-300">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
