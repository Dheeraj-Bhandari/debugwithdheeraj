import { useState } from 'react'
import TerminalLoader from './components/TerminalLoader'
import MatrixRain from './components/MatrixRain'
import ParticleBackground from './components/ParticleBackground'
import CommandPalette from './components/CommandPalette'
import HeroEnhanced from './components/HeroEnhanced'
import AboutEnhanced from './components/AboutEnhanced'
import Experience from './components/Experience'
import TechStack from './components/TechStack'
import ProjectsEnhanced from './components/ProjectsEnhanced'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <>
      {showLoader && <TerminalLoader onComplete={() => setShowLoader(false)} />}
      <div className="min-h-screen relative">
        <MatrixRain />
        <ParticleBackground />
        <CommandPalette />
        <HeroEnhanced />
        <AboutEnhanced />
        <Experience />
        <TechStack />
        <ProjectsEnhanced />
        <Achievements />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default App
