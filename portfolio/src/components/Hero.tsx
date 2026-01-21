import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaYoutube, FaEnvelope, FaTerminal, FaXTwitter } from 'react-icons/fa6'
import profileImage from '../assets/images/dheeraj_kumar.png'
import resumePDF from '../assets/resume/Dheeraj_Kumar_SDE.pdf'

const Hero = () => {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = "Senior Software Engineer | AI/ML Systems Architect"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(timer)
      clearInterval(cursorTimer)
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center bg-primary px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <img
                src={profileImage}
                alt="Dheeraj Kumar - Senior Software Engineer"
                className="relative w-full h-full rounded-full border-4 border-accent object-cover terminal-shadow"
              />
            </div>
          </motion.div>

          {/* Right side - Terminal-style content */}
          <div className="flex-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-terminal border border-accent/30 rounded-lg p-6 terminal-shadow font-mono text-sm"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/20">
                <FaTerminal className="text-accent" />
                <span className="text-accent">dheeraj@portfolio</span>
                <span className="text-gray-500">~</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-accent">$</span>
                  <span className="text-gray-400">cat about.txt</span>
                </div>
                
                <div className="pl-4 space-y-2 mb-4">
                  <p className="text-white text-2xl md:text-4xl font-bold">
                    Dheeraj Kumar
                  </p>
                  <div className="text-accent text-base md:text-lg min-h-[2rem] md:min-h-[2.5rem]">
                    {text}
                    <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-6">
                  <span className="text-accent">$</span>
                  <span className="text-gray-400">cat mission.txt</span>
                </div>
                
                <p className="pl-4 text-gray-300 leading-relaxed mb-4">
                  Building scalable AI systems and leading teams to ship production-grade software. 
                  5+ years of experience turning complex problems into elegant solutions.
                </p>

                <div className="flex items-start gap-2 mt-6">
                  <span className="text-accent">$</span>
                  <span className="text-gray-400">ls -la ./social</span>
                </div>
                
                <div className="pl-4 flex gap-4 mt-2 mb-4">
                  <a
                    href="https://linkedin.com/in/digitaldk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent transition-colors text-xl"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://github.com/Dheeraj-Bhandari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent transition-colors text-xl"
                    title="GitHub"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://twitter.com/dherajbhandari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent transition-colors text-xl"
                    title="Twitter/X"
                  >
                    <FaXTwitter />
                  </a>
                  <a
                    href="https://youtube.com/@debugwithdheeraj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent transition-colors text-xl"
                    title="YouTube"
                  >
                    <FaYoutube />
                  </a>
                  <a
                    href="mailto:digitaldk.in@gmail.com"
                    className="text-gray-400 hover:text-accent transition-colors text-xl"
                    title="Email"
                  >
                    <FaEnvelope />
                  </a>
                </div>

                <div className="flex items-start gap-2 mt-6">
                  <span className="text-accent">$</span>
                  <span className="text-gray-400">./download_resume.sh</span>
                </div>
                
                <div className="pl-4 flex flex-wrap gap-3 mt-2 mb-6">
                  <a
                    href="#projects"
                    className="px-4 py-2 bg-accent hover:bg-accent-dark text-black font-semibold rounded transition-colors"
                  >
                    View Projects
                  </a>
                  <a
                    href={resumePDF}
                    download="Dheeraj_Kumar_Resume.pdf"
                    className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-black font-semibold rounded transition-colors"
                  >
                    Download CV
                  </a>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-accent/20">
                  <span className="text-accent animate-pulse">●</span>
                  <span className="text-gray-500 text-xs">Open to solving complex problems & CS discussions</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          {/* <div className="flex flex-col items-center gap-2 text-accent/50">
            <span className="text-xs font-mono">scroll down</span>
            <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent animate-pulse"></div>
          </div> */}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
