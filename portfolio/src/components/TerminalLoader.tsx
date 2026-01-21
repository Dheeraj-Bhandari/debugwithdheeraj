import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TerminalLoaderProps {
  onComplete: () => void
}

const TerminalLoader = ({ onComplete }: TerminalLoaderProps) => {
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const bootSequence = [
    { text: 'Initializing portfolio system...', delay: 100 },
    { text: 'Loading user profile: Dheeraj Kumar', delay: 150 },
    { text: 'Connecting to GitHub... ✓', delay: 120 },
    { text: 'Fetching projects... ✓', delay: 130 },
    { text: 'Loading AI/ML credentials... ✓', delay: 110 },
    { text: 'Compiling 5+ years of experience... ✓', delay: 140 },
    { text: 'Initializing NeuralTalk AI systems... ✓', delay: 120 },
    { text: 'Loading 100+ enterprise clients data... ✓', delay: 130 },
    { text: 'System ready. Welcome!', delay: 200 },
  ]

  useEffect(() => {
    if (currentLine < bootSequence.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, bootSequence[currentLine].text])
        setCurrentLine(prev => prev + 1)
      }, bootSequence[currentLine].delay)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setTimeout(() => {
        setIsComplete(true)
        setTimeout(onComplete, 500)
      }, 800)
    }
  }, [currentLine, isComplete, onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <div className="w-full max-w-3xl px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-terminal border-2 border-accent/50 rounded-lg p-8 shadow-2xl shadow-accent/20"
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-accent/30">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-accent font-mono text-sm ml-4">dheeraj@portfolio:~$</span>
              </div>

              {/* Boot sequence */}
              <div className="font-mono text-sm space-y-2">
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-400"
                  >
                    <span className="text-accent mr-2">{'>'}</span>
                    {line}
                  </motion.div>
                ))}
                {currentLine < bootSequence.length && (
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-accent"
                  >
                    <span className="mr-2">{'>'}</span>
                    <span className="inline-block w-2 h-4 bg-accent" />
                  </motion.div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-8">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentLine / bootSequence.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-accent to-emerald-500"
                  />
                </div>
                <div className="text-accent text-xs font-mono mt-2 text-right">
                  {Math.round((currentLine / bootSequence.length) * 100)}%
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TerminalLoader
