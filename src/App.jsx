import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useOutletContext } from 'react-router-dom'
import Home from './pages/home.jsx'
import AdminLock from './components/AdminLock.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SchemaMarkup from './components/SchemaMarkup.jsx'
import DashboardShell from './components/DashboardShell.jsx'
// TEMPORARY: remove with the component once the design is final.
import UnderConstructionNotice from './components/UnderConstructionNotice.jsx'
import { usePortfolioData } from './hooks/usePortfolioData'
import { scrollToTarget } from './lib/scroll'

const Experience     = lazy(() => import('./pages/experience.jsx'))
const Skills         = lazy(() => import('./pages/skills.jsx'))
const Certifications = lazy(() => import('./pages/certifications.jsx'))
const Education      = lazy(() => import('./pages/education.jsx'))
const Personal       = lazy(() => import('./pages/personal.jsx'))
const Project        = lazy(() => import('./pages/project.jsx'))
const Contact        = lazy(() => import('./pages/connect.jsx'))
const Dashboard      = lazy(() => import('./admin/Dashboard.jsx'))
const ReadMoreLoader = lazy(() => import('./components/ReadMoreLoader.jsx'))

const PROJECT_TABS = ['dev', 'art', 'graphics']

// Links from before the pages were split (…/#projects) still land somewhere sensible.
const LEGACY_HASHES = {
  '#about': '/experience',
  '#projects': '/projects/dev',
  '#connect': '/contact',
}

const SectionFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

// Everything the public site shares: the notice, the JSON-LD, the admin lock,
// and the loader. Portfolio data is fetched once here, so it is usually in
// hand by the time someone presses Read More.
function PublicLayout({ data }) {
  const { projects, experience, loading } = data

  return (
    <>
      {/* TEMPORARY: work-in-progress notice, shown on every visit. */}
      <UnderConstructionNotice />

      {/* Inject JSON-LD once data is ready */}
      {!loading && <SchemaMarkup projects={projects} experience={experience} />}

      <Outlet context={data} />

      {/* Ghost admin lock: bottom-right, invisible until hovered */}
      <AdminLock />
    </>
  )
}

// Every page, in sidebar order, as one continuous scroll. `render` entries
// are the blocks on the page; `NAV` entries are what the sidebar points at
// (Projects is one block holding three subsections, each with its own id).
const SECTIONS = [
  { id: 'experience', Component: Experience },
  { id: 'skills', Component: Skills },
  { id: 'certifications', Component: Certifications },
  { id: 'education', Component: Education },
  { id: 'personal', Component: Personal },
  { id: 'projects', Component: null },
  { id: 'contact', Component: Contact },
]

const NAV = [
  { id: 'experience', path: '/experience' },
  { id: 'skills', path: '/skills' },
  { id: 'certifications', path: '/certifications' },
  { id: 'education', path: '/education' },
  { id: 'personal', path: '/personal' },
  { id: 'projects-dev', path: '/projects/dev' },
  { id: 'projects-art', path: '/projects/art' },
  { id: 'projects-graphics', path: '/projects/graphics' },
  { id: 'contact', path: '/contact' },
]

const idForPath = (pathname) => {
  if (pathname.startsWith('/projects')) {
    const tab = pathname.split('/')[2]
    return PROJECT_TABS.includes(tab) ? `projects-${tab}` : 'projects-dev'
  }
  return NAV.find((n) => n.path === pathname)?.id ?? 'experience'
}

const getEl = (id) => document.getElementById(id)

// Clear of the sticky top bar that replaces the sidebar below `lg`.
const topOffset = () => (window.innerWidth < 1024 ? 56 : 0)

// The hero with the dashboard beneath it. Read More scrolls down to the
// dashboard; a link straight to a page opens already scrolled to it.
function DashboardLayout() {
  const data = useOutletContext()
  const { pathname, hash } = useLocation()
  const dashboardRef = useRef(null)
  // The loader belongs to the dashboard, so it waits until the visitor is there.
  const [entered, setEntered] = useState(pathname !== '/')
  const [activeId, setActiveId] = useState(idForPath(pathname))

  const dashboardTop = () =>
    dashboardRef.current ? dashboardRef.current.getBoundingClientRect().top + window.scrollY : 0

  // Keep the address bar honest without re-routing (a router navigation
  // would be treated as a request to scroll somewhere).
  const syncUrl = (path) => {
    if (window.location.pathname !== path) window.history.replaceState(null, '', path)
  }

  // A link straight to a page opens already scrolled to its section.
  useEffect(() => {
    if (pathname === '/') return
    const el = getEl(idForPath(pathname))
    if (!el) return
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - topOffset())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll-spy: the active entry is the last one whose top has passed
  // roughly a third of the way down the viewport.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.35
      let current = NAV[0].id
      for (const { id } of NAV) {
        const el = getEl(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Keep the address bar in step with the section being read.
  useEffect(() => {
    if (window.scrollY < dashboardTop() - 1) return
    syncUrl(NAV.find((n) => n.id === activeId).path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  const legacy = LEGACY_HASHES[hash]
  if (pathname === '/' && legacy) return <Navigate to={legacy} replace />

  const enter = () => {
    setEntered(true)
    scrollToTarget(dashboardRef.current)
  }

  const select = (to) => scrollToTarget(getEl(idForPath(to)), { offsetY: -topOffset() })

  const isActive = (to) => idForPath(to) === activeId

  return (
    <>
      <Home onReadMore={enter} />

      <div ref={dashboardRef}>
        <DashboardShell onHome={() => scrollToTarget(0)} isActive={isActive} onSelect={select}>
          <Suspense fallback={<SectionFallback />}>
            {SECTIONS.map(({ id, Component }, i) => (
              <div
                key={id}
                id={id === 'projects' ? undefined : id}
                className={i > 0 ? 'border-t border-border' : undefined}
              >
                {Component ? <Component /> : <Project projectsData={data.projects} />}
              </div>
            ))}
          </Suspense>
        </DashboardShell>
      </div>

      {/* Only while the portfolio data is actually being fetched. */}
      {entered && data.loading && (
        <Suspense fallback={null}>
          <ReadMoreLoader />
        </Suspense>
      )}
    </>
  )
}

function App() {
  const data = usePortfolioData()

  return (
    <Routes>
      <Route element={<PublicLayout data={data} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={null} />
          <Route path="/experience" element={null} />
          <Route path="/skills" element={null} />
          <Route path="/certifications" element={null} />
          <Route path="/education" element={null} />
          <Route path="/personal" element={null} />
          <Route path="/projects" element={null} />
          <Route path="/projects/:tab" element={null} />
          <Route path="/contact" element={null} />
        </Route>
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<SectionFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
