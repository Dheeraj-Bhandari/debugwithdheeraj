import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaGithub, FaLinkedin, FaYoutube, FaEnvelope, FaTerminal } from 'react-icons/fa6'
import { FaXTwitter } from 'react-icons/fa6'
import profileImage from '../assets/images/dheeraj_kumar.png'
import resumePDF from '../assets/resume/Dheeraj_Kumar_SDE.pdf'

const HeroEnhanced = () => {
  const [nameText, setNameText] = useState('')
  const [titleText, setTitleText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [nameComplete, setNameComplete] = useState(false)
  
  const fullName = "Dheeraj Kumar"
  const fullTitle = "Senior Software Engineer | AI/ML Systems Architect"
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Typing effect for name
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullName.length) {
        setNameText(fullName.slice(0, index))
        index++
      } else {
        clearInterval(timer)
        setNameComplete(true)
      }
    }, 100) // Faster typing for name

    return () => clearInterval(timer)
  }, [])

  // Typing effect for title (starts after name)
  useEffect(() => {
    if (!nameComplete) return

    let index = 0
    const timer = setInterval(() => {
      if (index <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50) // Fast typing for title

    return () => clearInterval(timer)
  }, [nameComplete])

  // Cursor blink
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.section 
      style={{ y, opacity }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary via-primary to-secondary px-4 relative overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Grid background with animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"
      />
      
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          {/* Left side - Enhanced Image with 3D effect */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              {/* Animated rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-accent/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-2 border-accent/10"
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-emerald-500/30 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              
              {/* Profile image */}
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={profileImage}
                alt="Dheeraj Kumar - Senior Software Engineer"
                className="relative w-full h-full rounded-full border-4 border-accent object-cover shadow-2xl shadow-accent/20"
              />
              
              {/* Floating particles */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-accent/30 rounded-full blur-md"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/20 rounded-full blur-md"
              />
            </div>
          </motion.div>

          {/* Right side - Enhanced Terminal */}
          <motion.div
            variants={itemVariants}
            className="flex-1 w-full max-w-2xl"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-terminal/80 backdrop-blur-xl border border-accent/30 rounded-2xl p-8 shadow-2xl shadow-accent/10 relative overflow-hidden"
            >
              {/* Animated border glow */}
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 rounded-2xl"
              />
              
              <div className="relative z-10">
                {/* Terminal header */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 mb-6 pb-4 border-b border-accent/20"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <FaTerminal className="text-accent text-xl" />
                  </motion.div>
                  <span className="text-accent font-mono">dheeraj@portfolio</span>
                  <span className="text-gray-500">~</span>
                  <div className="flex gap-2 ml-auto">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </motion.div>

                <div className="space-y-4 font-mono text-sm">
                  {/* Name section with typing */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-accent">$</span>
                      <span className="text-gray-400">cat about.txt</span>
                    </div>
                    <div className="pl-4 space-y-2 mb-4">
                      <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white text-3xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text min-h-[3rem] lg:min-h-[4rem]"
                      >
                        {nameText}
                        {!nameComplete && (
                          <motion.span
                            animate={{ opacity: showCursor ? 1 : 0 }}
                            className="inline-block text-accent"
                          >
                            |
                          </motion.span>
                        )}
                      </motion.h1>
                      <div className="text-accent text-lg lg:text-xl min-h-[2rem] lg:min-h-[2.5rem]">
                        {titleText}
                        {nameComplete && titleText.length < fullTitle.length && (
                          <motion.span
                            animate={{ opacity: showCursor ? 1 : 0 }}
                            className="inline-block"
                          >
                            |
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Mission section */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-accent">$</span>
                      <span className="text-gray-400">cat mission.txt</span>
                    </div>
                    <p className="pl-4 text-gray-300 leading-relaxed mb-4">
                      Building scalable AI systems and leading teams to ship production-grade software. 
                      5+ years of experience turning complex problems into elegant solutions.
                    </p>
                  </motion.div>

                  {/* Social links */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-accent">$</span>
                      <span className="text-gray-400">ls -la ./social</span>
                    </div>
                    <div className="pl-4 flex gap-4 mb-4">
                      {[
                        { icon: FaLinkedin, href: "https://linkedin.com/in/digitaldk", label: "LinkedIn" },
                        { icon: FaGithub, href: "https://github.com/Dheeraj-Bhandari", label: "GitHub" },
                        { icon: FaXTwitter, href: "https://twitter.com/dherajbhandari", label: "Twitter" },
                        { icon: FaYoutube, href: "https://youtube.com/@debugwithdheeraj", label: "YouTube" },
                        { icon: FaEnvelope, href: "mailto:digitaldk.in@gmail.com", label: "Email" }
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          target={social.href.startsWith('http') ? "_blank" : undefined}
                          rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-accent transition-colors text-2xl"
                          title={social.label}
                        >
                          <social.icon />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA buttons */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-accent">$</span>
                      <span className="text-gray-400">./download_resume.sh</span>
                    </div>
                    <div className="pl-4 flex flex-wrap gap-4 mb-6">
                      <motion.a
                        href="#projects"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-accent hover:bg-accent-dark text-black font-semibold rounded-lg transition-all shadow-lg shadow-accent/20"
                      >
                        View Projects
                      </motion.a>
                      <motion.a
                        href={resumePDF}
                        download="Dheeraj_Kumar_Resume.pdf"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-black font-semibold rounded-lg transition-all"
                      >
                        Download CV
                      </motion.a>
                    </div>
                  </motion.div>

                  {/* Status */}
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2 pt-4 border-t border-accent/20"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-accent"
                    >
                      ●
                    </motion.span>
                    <span className="text-gray-500 text-xs">Open to solving complex problems & CS discussions</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
        </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-accent/70"
          >
            <span className="text-xs font-mono">scroll down</span>
            <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
          </motion.div>
      </div>
    </motion.section>
  )
}

export default HeroEnhanced
