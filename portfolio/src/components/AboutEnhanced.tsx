import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import TypingHeader from './TypingHeader'

const AboutEnhanced = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const stats = [
    { label: 'Enterprise Clients', value: '100+', color: 'from-green-400 to-emerald-500', icon: '🏢' },
    { label: 'Performance Boost', value: '70%', color: 'from-blue-400 to-cyan-500', icon: '⚡' },
    { label: 'System Uptime', value: '99.9%', color: 'from-purple-400 to-pink-500', icon: '🎯' },
    { label: 'GitHub Contributions', value: '1.5K+', color: 'from-orange-400 to-red-500', icon: '💻' },
  ]

  return (
    <section id="about" className="py-16 px-4 bg-secondary relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <TypingHeader number="01." text="About Me" inView={inView} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-gray-300 leading-relaxed text-lg"
            >
              I'm a <span className="text-accent font-semibold">Senior Software Engineer</span> with 5+ years of experience building scalable AI/ML systems and leading engineering teams. I specialize in full-stack development, LLM applications, distributed systems, and cloud infrastructure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.01 }}
              className="bg-terminal/80 backdrop-blur-sm border border-accent/20 rounded-xl p-6 font-mono text-sm relative overflow-hidden group"
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0"
                animate={{ x: [-200, 800] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10">
                <div className="text-accent mb-4 flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    //
                  </motion.span>
                  Career Highlights
                </div>
                <ul className="space-y-3 text-gray-400">
                  {[
                    { text: 'Founded NeuralTalk AI', highlight: 'Privacy-first AI platform serving 100+ enterprises (acquired)' },
                    { text: 'Led engineering at Neo', highlight: 'Improved deployment speed by 70%' },
                    { text: 'Built systems at Monster API', highlight: '50K+ daily requests, 99.9% uptime' },
                    { text: 'Open source contributor', highlight: '1,500+ GitHub contributions annually' }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 group/item"
                    >
                      <motion.span
                        whileHover={{ scale: 1.5, rotate: 90 }}
                        className="text-accent mt-1"
                      >
                        ▸
                      </motion.span>
                      <span>
                        <span className="text-white font-semibold">{item.text}</span> - {item.highlight}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="text-gray-400 italic text-lg border-l-4 border-accent/50 pl-4"
            >
              "I'm passionate about building products that solve real problems, mentoring engineers, and sharing knowledge through content creation."
            </motion.p>
          </motion.div>

          {/* Stats with 3D effect */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {stats.map((stat, index) => (
              <Card3D key={index} stat={stat} index={index} inView={inView} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// 3D Card Component with mouse tracking
function Card3D({ stat, index, inView }: { stat: any; index: number; inView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.5 + index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      className="bg-terminal/80 backdrop-blur-sm border border-accent/20 rounded-xl p-6 hover:border-accent/50 transition-all cursor-pointer relative overflow-hidden group"
    >
      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.2 : 0,
        }}
        className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"
      />
      
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}
          </div>
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl"
          >
            {stat.icon}
          </motion.div>
        </div>
        <div className="text-gray-400 text-sm font-mono">{stat.label}</div>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: isHovered ? ["-100%", "200%"] : "-100%" }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  )
}

export default AboutEnhanced
