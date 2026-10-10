import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
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

// The hero with the dashboard beneath it. Read More scrolls down to the
// dashboard; a link straight to a page opens already scrolled to it.
function DashboardLayout() {
  const data = useOutletContext()
  const { pathname, hash } = useLocation()
  const dashboardRef = useRef(null)
  const prevPath = useRef(null)
  // The loader belongs to the dashboard, so it waits until the visitor is there.
  const [entered, setEntered] = useState(pathname !== '/')

  const dashboardTop = () =>
    dashboardRef.current ? dashboardRef.current.getBoundingClientRect().top + window.scrollY : 0

  // A new page starts at the top of the dashboard rather than inheriting the
  // previous page's scroll position, and a link straight to a page opens there.
  // Keyed on the path itself (not a first-render flag) so a repeat run of the
  // same path, such as StrictMode's, does nothing.
  useEffect(() => {
    if (prevPath.current === pathname) return
    const initial = prevPath.current === null
    prevPath.current = pathname

    if (initial && pathname === '/') return
    window.scrollTo(0, dashboardTop())
  }, [pathname])

  const legacy = LEGACY_HASHES[hash]
  if (pathname === '/' && legacy) return <Navigate to={legacy} replace />

  const enter = () => {
    setEntered(true)
    scrollToTarget(dashboardRef.current)
  }

  return (
    <>
      <Home onReadMore={enter} />

      <div ref={dashboardRef}>
        <DashboardShell onHome={() => scrollToTarget(0)}>
          <Suspense fallback={<SectionFallback />}>
            <Outlet context={data} />
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

function ProjectsPage() {
  const { projects } = useOutletContext()
  const { tab } = useParams()
  const navigate = useNavigate()

  if (!PROJECT_TABS.includes(tab)) return <Navigate to="/projects/dev" replace />

  return (
    <Project
      projectsData={projects}
      activeTab={tab}
      onTabChange={(id) => navigate(`/projects/${id}`)}
    />
  )
}

function App() {
  const data = usePortfolioData()

  return (
    <Routes>
      <Route element={<PublicLayout data={data} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Experience />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/education" element={<Education />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/projects" element={<Navigate to="/projects/dev" replace />} />
          <Route path="/projects/:tab" element={<ProjectsPage />} />
          <Route path="/contact" element={<Contact />} />
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
