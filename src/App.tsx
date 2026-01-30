import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TerminalLoader from './components/TerminalLoader'
import MatrixRain from './components/MatrixRain'
import ParticleBackground from './components/ParticleBackground'
import CommandPalette from './components/CommandPalette'
import Hero from './components/Hero'
import AboutEnhanced from './components/AboutEnhanced'
import Experience from './components/Experience'
import TechStack from './components/TechStack'
import ProjectsEnhanced from './components/ProjectsEnhanced'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { TerminalView } from './components/Terminal'
import { PortfolioDataMapper } from './lib/terminal'
import { lazy, Suspense } from 'react'
import { CartProvider } from './amazon/contexts/CartContext'
import { AnalyticsProvider } from './amazon/contexts/AnalyticsContext'

// Lazy load Amazon section components for code splitting
const AmazonPortfolio = lazy(() => import('./pages/AmazonPortfolio'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))

function MainPortfolio() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  // Get portfolio data for terminal
  const portfolioData = PortfolioDataMapper.getPortfolioData()

  // Toggle terminal view - use useCallback to stabilize the function reference
  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen(prev => !prev)
  }, [])

  // Handle keyboard shortcut (Ctrl+` or Cmd+` - backtick key, like VS Code)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+` (Windows/Linux) or Cmd+` (Mac)
      // Using backtick key to avoid conflicts with browser shortcuts
      if ((event.ctrlKey || event.metaKey) && event.key === '`') {
        // Prevent default behavior
        event.preventDefault()
        // Stop event from bubbling to other handlers
        event.stopPropagation()
        toggleTerminal()
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggleTerminal])

  return (
    <>
      {/* GUI View - Always rendered, but may be behind terminal */}
      <div className={`min-h-screen relative ${isTerminalOpen ? 'pointer-events-none' : ''}`}>
        <MatrixRain />
        <ParticleBackground />
        <CommandPalette onToggleTerminal={toggleTerminal} />
        <Hero onToggleTerminal={toggleTerminal} />
        <AboutEnhanced />
        <Experience />
        <TechStack />
        <ProjectsEnhanced />
        <Achievements />
        <Contact />
        <Footer />
      </div>

      {/* Terminal View - Rendered on top when open */}
      {isTerminalOpen && (
        <TerminalView
          isOpen={isTerminalOpen}
          onClose={toggleTerminal}
          portfolioData={portfolioData}
        />
      )}
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortfolioWithLoader />} />
        <Route 
          path="/amazon" 
          element={
            <Suspense fallback={
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading Amazon Store...</p>
                </div>
              </div>
            }>
              <AnalyticsProvider>
                <CartProvider>
                  <AmazonPortfolio />
                </CartProvider>
              </AnalyticsProvider>
            </Suspense>
          } 
        />
        <Route 
          path="/amazon/confirmation" 
          element={
            <Suspense fallback={
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            }>
              <AnalyticsProvider>
                <CartProvider>
                  <ConfirmationPage />
                </CartProvider>
              </AnalyticsProvider>
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  )
}

function MainPortfolioWithLoader() {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <>
      {showLoader && <TerminalLoader onComplete={() => setShowLoader(false)} />}
      <MainPortfolio />
    </>
  )
}

export default App
