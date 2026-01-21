import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypingHeaderProps {
  number: string
  text: string
  inView: boolean
  delay?: number
}

const TypingHeader = ({ number, text, inView, delay = 0 }: TypingHeaderProps) => {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!inView) return

    const startDelay = setTimeout(() => {
      setIsTyping(true)
      let index = 0
      const timer = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index))
          index++
        } else {
          clearInterval(timer)
          setIsTyping(false)
        }
      }, 50) // Fast typing speed

      return () => clearInterval(timer)
    }, delay)

    return () => clearTimeout(startDelay)
  }, [inView, text, delay])

  return (
    <div className="flex items-center gap-3 mb-4">
      <motion.span
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, delay: delay / 1000 }}
        className="text-accent font-mono text-sm"
      >
        {number}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="text-3xl md:text-4xl font-bold text-white min-h-[2.5rem]"
      >
        {displayText}
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block text-accent ml-1"
          >
            |
          </motion.span>
        )}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: (delay / 1000) + 0.2 }}
        className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent origin-left"
      />
    </div>
  )
}

export default TypingHeader
