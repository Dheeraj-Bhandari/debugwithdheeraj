import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTerminal, FaUser, FaBriefcase, FaCode, FaProjectDiagram, FaTrophy, FaEnvelope } from 'react-icons/fa'

interface CommandPaletteProps {
  onToggleTerminal?: () => void
}

const CommandPalette = ({ onToggleTerminal }: CommandPaletteProps) => {
  const commands = [
    { id: 'terminal', label: 'Terminal View', icon: FaTerminal, action: () => onToggleTerminal?.() },
    { id: 'about', label: 'About Me', icon: FaUser, action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'experience', label: 'Experience', icon: FaBriefcase, action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'tech', label: 'Tech Stack', icon: FaCode, action: () => document.getElementById('tech')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram, action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy, action: () => document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'contact', label: 'Contact', icon: FaEnvelope, action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
  ]
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setSearch('')
        setSelectedIndex(0)
      }

      if (!isOpen) return

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
      }

      // Arrow navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      }

      // Enter to execute
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands])

  return (
    <>
      {/* Hint button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 px-3 py-2 md:px-4 md:py-2 bg-terminal/90 backdrop-blur-sm border border-accent/30 rounded-lg text-accent font-mono text-xs md:text-sm hover:border-accent/50 transition-all shadow-lg shadow-accent/10 flex items-center gap-2"
      >
        <FaTerminal className="text-sm md:text-base" />
        <span className="hidden sm:inline">Press</span>
        <kbd className="px-1.5 py-0.5 md:px-2 md:py-1 bg-accent/20 rounded text-xs">Ctrl+K</kbd>
        <span className="hidden sm:inline text-gray-500">or</span>
        <kbd className="px-1.5 py-0.5 md:px-2 md:py-1 bg-accent/20 rounded text-xs">Ctrl+`</kbd>
      </motion.button>

      {/* Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center"
            >
              {/* Palette */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
              >
              <div className="bg-terminal/95 backdrop-blur-xl border-2 border-accent/50 rounded-xl shadow-2xl shadow-accent/20 overflow-hidden flex flex-col max-h-full">
                {/* Header */}
                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2.5 md:py-4 border-b border-accent/20 flex-shrink-0">
                  <FaTerminal className="text-accent text-sm md:text-xl flex-shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setSelectedIndex(0)
                    }}
                    placeholder="Search..."
                    className="flex-1 bg-transparent text-white outline-none font-mono text-sm md:text-base placeholder:text-gray-600"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-shrink-0"
                  >
                    <kbd className="px-1.5 py-0.5 md:px-2 md:py-1 bg-accent/20 rounded text-accent text-xs font-mono">ESC</kbd>
                  </button>
                </div>

                {/* Commands */}
                <div className="overflow-y-auto flex-1 md:max-h-96">
                  {filteredCommands.length > 0 ? (
                    filteredCommands.map((cmd, index) => (
                      <motion.button
                        key={cmd.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          cmd.action()
                          setIsOpen(false)
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-6 py-2.5 md:py-4 text-left transition-all ${
                          index === selectedIndex
                            ? 'bg-accent/20 text-accent'
                            : 'text-gray-400 hover:bg-accent/10 hover:text-accent'
                        }`}
                      >
                        <cmd.icon className="text-sm md:text-xl flex-shrink-0" />
                        <span className="font-mono text-sm md:text-base">{cmd.label}</span>
                        {index === selectedIndex && (
                          <kbd className="ml-auto px-1.5 py-0.5 md:px-2 md:py-1 bg-accent/20 rounded text-xs flex-shrink-0 hidden md:inline-block">↵</kbd>
                        )}
                      </motion.button>
                    ))
                  ) : (
                    <div className="px-3 md:px-6 py-6 md:py-8 text-center text-gray-500 font-mono text-sm md:text-base">
                      No commands found
                    </div>
                  )}
                </div>

                {/* Footer - Hide on mobile */}
                <div className="hidden md:flex px-6 py-3 border-t border-accent/20 items-center gap-4 text-xs font-mono text-gray-500 flex-shrink-0">
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <kbd className="px-2 py-1 bg-accent/10 rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <kbd className="px-2 py-1 bg-accent/10 rounded">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <kbd className="px-2 py-1 bg-accent/10 rounded">ESC</kbd>
                    Close
                  </span>
                </div>
              </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default CommandPalette
