import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Head from './components/Header.jsx'
import Home from './pages/home.jsx'
import AdminLock from './components/AdminLock.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SchemaMarkup from './components/SchemaMarkup.jsx'
import DashboardShell from './components/DashboardShell.jsx'
// TEMPORARY: remove with the component once the design is final.
import UnderConstructionNotice from './components/UnderConstructionNotice.jsx'
import { usePortfolioData } from './hooks/usePortfolioData'
import { scrollToSection } from './lib/scroll'

const Exp      = lazy(() => import('./pages/exp.jsx'))
const Project  = lazy(() => import('./pages/project.jsx'))
const Contact  = lazy(() => import('./pages/connect.jsx'))
const Footer   = lazy(() => import('./components/Footer.jsx'))
const Dashboard = lazy(() => import('./admin/Dashboard.jsx'))
const ReadMoreLoader = lazy(() => import('./components/ReadMoreLoader.jsx'))

// How long the loader holds before the portfolio opens (one loop at 2x speed).
const READ_MORE_DELAY = 1200

const SectionFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

// The public portfolio. Fetches dynamic data here so SchemaMarkup
// and child sections can both consume it.
function Portfolio() {
  const { projects, experience, education, skills, loading } = usePortfolioData()

  // The landing view is the hero alone: every section below it stays hidden
  // until "Read More" opens the portfolio.
  const [isExpanded, setIsExpanded] = useState(false)
  const [pendingScroll, setPendingScroll] = useState(null)
  const [isOpening, setIsOpening] = useState(false)
  const [projectTab, setProjectTab] = useState('dev')
  const openTimer = useRef(null)

  useEffect(() => () => clearTimeout(openTimer.current), [])

  // Sections un-hide in the same commit as isExpanded, so the scroll has to wait
  // for that render; a display:none target has no position to scroll to. On a
  // deep link the target also mounts lazily, so give it a moment to appear.
  useEffect(() => {
    if (!pendingScroll) return

    let timer
    let attempts = 0
    const attempt = () => {
      if (document.querySelector(pendingScroll) || attempts++ > 40) {
        scrollToSection(pendingScroll)
        setPendingScroll(null)
        return
      }
      timer = setTimeout(attempt, 50)
    }
    attempt()

    return () => clearTimeout(timer)
  }, [pendingScroll])

  // A deep link (…/#projects) should open the portfolio at that section instead
  // of landing on a collapsed hero.
  useEffect(() => {
    const { hash } = window.location
    if (!hash || hash === '#home') return
    setIsExpanded(true)
    setPendingScroll(hash)
  }, [])

  const expandTo = (href) => {
    setIsExpanded(true)
    setPendingScroll(href)
  }

  const openWithLoader = () => {
    if (isOpening) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      expandTo('#about')
      return
    }
    setIsOpening(true)
    openTimer.current = setTimeout(() => {
      expandTo('#about')
      setIsOpening(false)
    }, READ_MORE_DELAY)
  }

  const collapse = () => {
    setIsExpanded(false)
    window.scrollTo({ top: 0 })
  }

  // The hero is always mounted, so navigating home never needs to expand.
  const handleNavigate = (href) => {
    if (href === '#home') scrollToSection(href)
    else expandTo(href)
  }

  return (
    <>
      {/* TEMPORARY: work-in-progress notice, shown on every visit. */}
      <UnderConstructionNotice />

      {/* Inject JSON-LD once data is ready */}
      {!loading && <SchemaMarkup projects={projects} experience={experience} />}

      <Head onNavigate={handleNavigate} />
      <Home
        onReadMore={() => (isExpanded ? collapse() : openWithLoader())}
        isExpanded={isExpanded}
      />

      {/* Kept mounted so the markup stays crawlable and the nav's scroll-spy can
          find its targets; the shell hides it until Read More asks for it. */}
      <DashboardShell
        hidden={!isExpanded}
        projectTab={projectTab}
        onSection={handleNavigate}
        onProjectTab={(id) => {
          setProjectTab(id)
          // Let the new tab's content mount first: gsap clamps its target to the
          // page height at the moment it starts, and a shorter tab ends too early.
          setTimeout(() => scrollToSection('#projects'), 60)
        }}
        onHome={collapse}
      >
        <Suspense fallback={<SectionFallback />}>
          <Exp
            experienceData={experience}
            educationData={education}
            skillsData={skills}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Project
            projectsData={projects}
            activeTab={projectTab}
            onTabChange={setProjectTab}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </DashboardShell>

      {isOpening && (
        <Suspense fallback={null}>
          <ReadMoreLoader />
        </Suspense>
      )}

      {/* Ghost admin lock: bottom-right, invisible until hovered */}
      <AdminLock />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
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
