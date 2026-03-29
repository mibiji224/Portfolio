import { lazy, Suspense } from 'react';
import Head from './components/Header.jsx';
import Home from './pages/home.jsx';

const Exp = lazy(() => import('./pages/exp.jsx'));
const Project = lazy(() => import('./pages/project.jsx'));
const Contact = lazy(() => import('./pages/connect.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));

const SectionFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-[#080707]">
    <div className="w-8 h-8 border-2 border-[#db0a0a] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return(
    <>
    <Head/>
    <Home/>
    <Suspense fallback={<SectionFallback />}>
      <Exp/>
    </Suspense>
    <Suspense fallback={<SectionFallback />}>
      <Project/>
    </Suspense>
    <Suspense fallback={<SectionFallback />}>
      <Contact/>
    </Suspense>
    <Suspense fallback={<SectionFallback />}>
      <Footer/>
    </Suspense>
    </>
  );
}

export default App
