import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Head from './components/Header.jsx'
import Home from './pages/home.jsx'
import AdminLock from './components/AdminLock.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SchemaMarkup from './components/SchemaMarkup.jsx'
// TEMPORARY: remove with the component once the design is final.
import UnderConstructionNotice from './components/UnderConstructionNotice.jsx'
import { usePortfolioData } from './hooks/usePortfolioData'
import { scrollToSection } from './lib/scroll'

const Exp      = lazy(() => import('./pages/exp.jsx'))
const Project  = lazy(() => import('./pages/project.jsx'))
const Contact  = lazy(() => import('./pages/connect.jsx'))
const Footer   = lazy(() => import('./components/Footer.jsx'))
const Dashboard = lazy(() => import('./admin/Dashboard.jsx'))

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
        onReadMore={() => (isExpanded ? collapse() : expandTo('#about'))}
        isExpanded={isExpanded}
      />

      {/* Kept mounted so the markup stays crawlable and the nav's scroll-spy can
          find its targets; `hidden` is what keeps it out of view until asked for. */}
      <div id="portfolio-sections" hidden={!isExpanded}>
        <Suspense fallback={<SectionFallback />}>
          <Exp
            experienceData={experience}
            educationData={education}
            skillsData={skills}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Project projectsData={projects} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>

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
