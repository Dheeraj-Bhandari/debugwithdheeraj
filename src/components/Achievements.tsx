import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const achievements = [
  '🚀 Founded and exited AI SaaS startup (100+ enterprise clients)',
  '👥 Led engineering teams delivering 70% faster deployment cycles',
  '📦 Published open source NPM package (1,000+ users)',
  '🏆 2x Amazon Top Performer awards',
  '⚡ Achieved 6x performance improvement through architecture optimization',
  '🎯 Built systems with 99.9% uptime serving 10,000+ users',
  '🤝 Open source contributor (Portkey AI Gateway, various projects)',
]

const Achievements = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="achievements" className="py-12 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-mono text-sm">05.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Achievements</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-terminal border border-accent/20 rounded-lg p-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-accent mt-1">▹</span>
                <span>{achievement}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Achievements
