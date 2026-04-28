import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Head from './components/Header.jsx'
import Home from './pages/home.jsx'
import AdminLock from './components/AdminLock.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SchemaMarkup from './components/SchemaMarkup.jsx'
import { usePortfolioData } from './hooks/usePortfolioData'

const Exp      = lazy(() => import('./pages/exp.jsx'))
const Project  = lazy(() => import('./pages/project.jsx'))
const Certs    = lazy(() => import('./pages/certs.jsx'))
const Contact  = lazy(() => import('./pages/connect.jsx'))
const Footer   = lazy(() => import('./components/Footer.jsx'))
const Dashboard = lazy(() => import('./admin/Dashboard.jsx'))

const SectionFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-[#080707]">
    <div className="w-8 h-8 border-2 border-[#db0a0a] border-t-transparent rounded-full animate-spin" />
  </div>
)

// The public portfolio. Fetches dynamic data here so SchemaMarkup
// and child sections can both consume it.
function Portfolio() {
  const { projects, experience, education, skills, loading } = usePortfolioData()

  return (
    <>
      {/* Inject JSON-LD once data is ready */}
      {!loading && <SchemaMarkup projects={projects} experience={experience} />}

      <Head />
      <Home />
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
        <Certs />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Contact />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>

      {/* Ghost admin lock — bottom-right, invisible until hovered */}
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
