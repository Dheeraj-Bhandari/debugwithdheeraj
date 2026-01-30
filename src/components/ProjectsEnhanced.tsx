import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaExternalLinkAlt, FaGithub, FaNpm } from 'react-icons/fa'
import { useState } from 'react'
import TypingHeader from './TypingHeader'

const projects = [
  {
    title: 'NeuralTalk AI Platform',
    description: 'Privacy-first AI customer support automation serving 100+ enterprises. Built with LangChain, RAG architecture and vector databases for intelligent, context-aware responses.',
    tech: ['React', 'Node.js', 'Python', 'FastAPI', 'LangChain', 'Pinecone', 'MongoDB', 'Redis', 'AWS'],
    metrics: [
      { label: 'Cost Reduction', value: '60%', icon: '💰' },
      { label: 'Response Time', value: '<30s', icon: '⚡' },
      { label: 'Data Retention', value: 'Zero', icon: '🔒' }
    ],
    links: [
      { type: 'website', url: 'https://neuraltalk.ai?utm_source=portfolio&utm_medium=website&utm_campaign=dheeraj_kumar', icon: FaExternalLinkAlt },
    ],
    accentColor: '#22c55e',
    bgGradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
  },
  {
    title: 'Monster API Integration',
    description: 'Official NPM package for seamless LLM API integration. Simplifies AI model deployment with TypeScript support and comprehensive documentation.',
    tech: ['TypeScript', 'Node.js', 'REST APIs', 'OpenAI'],
    metrics: [
      { label: 'Developers', value: '1,000+', icon: '👥' },
      { label: 'Downloads', value: 'Growing', icon: '📦' },
      { label: 'License', value: 'Open Source', icon: '🌟' }
    ],
    links: [
      { type: 'npm', url: 'https://www.npmjs.com/package/monsterapi', icon: FaNpm },
      { type: 'github', url: 'https://github.com/MonsterAPI/monsterapi-node', icon: FaGithub },
    ],
    accentColor: '#a855f7',
    bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
  },
  {
    title: 'Neo - Autonomous ML Platform',
    description: 'Autonomous ML engineering platform that improved deployment speed by 70%. Led team of 5+ engineers building scalable microservices architecture.',
    tech: ['React', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'Python'],
    metrics: [
      { label: 'Faster Deploys', value: '70%', icon: '🚀' },
      { label: 'Workflows', value: '10K+', icon: '⚙️' },
      { label: 'Team Size', value: '5+', icon: '👨‍💻' }
    ],
    links: [
      { type: 'website', url: 'https://heyneo.so?utm_source=portfolio&utm_medium=website&utm_campaign=dheeraj_kumar', icon: FaExternalLinkAlt },
    ],
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
  },
]

const ProjectsEnhanced = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="projects" className="py-16 px-4 bg-primary relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <TypingHeader number="04." text="Featured Projects" inView={inView} />
        </motion.div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Enhanced Project Card Component
function ProjectCard({ project, index, inView }: { project: any; index: number; inView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseXSpring = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top
    const xPct = mouseXPos / width - 0.5
    const yPct = mouseYPos / height - 0.5
    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group perspective-1000"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-br from-terminal via-terminal to-secondary/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden"
        style={{
          boxShadow: isHovered 
            ? `0 20px 60px -15px ${project.accentColor}40, 0 0 0 1px ${project.accentColor}30`
            : '0 10px 30px -15px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} opacity-0 transition-opacity duration-500`}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Spotlight effect following mouse */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mouseXSpring}px ${mouseYSpring}px, ${project.accentColor}15, transparent 40%)`,
          }}
        />

        {/* Border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(90deg, ${project.accentColor}00, ${project.accentColor}40, ${project.accentColor}00)`,
            opacity: 0,
          }}
          animate={{
            opacity: isHovered ? [0, 0.5, 0] : 0,
            x: isHovered ? ['-100%', '200%'] : '-100%',
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />

        <div className="relative z-10 p-8" style={{ transform: "translateZ(20px)" }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <motion.div
                className="flex items-center gap-3 mb-3"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.accentColor }}
                  animate={{
                    scale: isHovered ? [1, 1.5, 1] : 1,
                    boxShadow: isHovered 
                      ? [`0 0 0 0 ${project.accentColor}80`, `0 0 0 8px ${project.accentColor}00`]
                      : `0 0 0 0 ${project.accentColor}00`,
                  }}
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                />
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {project.title}
                </h3>
              </motion.div>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                {project.description}
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-3">
              {project.links.map((link: any, i: number) => (
                <motion.a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-all"
                  style={{
                    boxShadow: isHovered ? `0 0 20px ${project.accentColor}40` : 'none',
                  }}
                >
                  <link.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {project.metrics.map((metric: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 + i * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 text-center group/metric"
                style={{
                  boxShadow: `0 0 0 1px ${project.accentColor}20`,
                }}
              >
                <motion.div
                  className="text-3xl mb-2"
                  animate={{
                    rotate: isHovered ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {metric.icon}
                </motion.div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: project.accentColor }}
                >
                  {metric.value}
                </div>
                <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech: string, i: number) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.2 + i * 0.05 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -3,
                  boxShadow: `0 5px 15px ${project.accentColor}40`,
                }}
                className="px-3 py-1.5 bg-gray-900/50 backdrop-blur-sm rounded-lg font-mono text-sm border border-gray-800 hover:border-gray-700 transition-all cursor-default"
                style={{
                  color: project.accentColor,
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 opacity-20"
          style={{
            background: `radial-gradient(circle at top right, ${project.accentColor}, transparent 70%)`,
          }}
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Floating particles around card */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: project.accentColor,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -30],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}

export default ProjectsEnhanced
