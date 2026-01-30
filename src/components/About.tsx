import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { mainPortfolioText } from '../data/portfolioData'

const About = () => {
  const { about } = mainPortfolioText;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const stats = [
    { label: 'Enterprise Clients', value: '100+', color: 'from-green-400 to-emerald-500' },
    { label: 'Performance Boost', value: '70%', color: 'from-blue-400 to-cyan-500' },
    { label: 'System Uptime', value: '99.9%', color: 'from-purple-400 to-pink-500' },
    { label: 'GitHub Contributions', value: '1.5K+', color: 'from-orange-400 to-red-500' },
  ]

  return (
    <section id="about" className="py-12 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-mono text-sm">01.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">About Me</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 space-y-4 text-gray-300 leading-relaxed"
          >
            <p>
              {about.intro}
            </p>

            <div className="bg-terminal border border-accent/20 rounded-lg p-4 font-mono text-sm">
              <div className="text-accent mb-2">// Career Highlights</div>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▸</span>
                  <span><span className="text-white">Founded NeuralTalk AI</span> - Privacy-first AI platform serving 100+ enterprises (acquired)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▸</span>
                  <span><span className="text-white">Led engineering at Neo</span> - Improved deployment speed by 70%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▸</span>
                  <span><span className="text-white">Built systems at Monster API</span> - 50K+ daily requests, 99.9% uptime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">▸</span>
                  <span><span className="text-white">Open source contributor</span> - 1,500+ GitHub contributions annually</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-400 italic">
              "I'm passionate about building products that solve real problems, mentoring engineers, and sharing knowledge through content creation."
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-terminal border border-accent/20 rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-mono">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
