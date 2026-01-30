import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

const experiences = [
  {
    company: 'NeuralTalk AI',
    role: 'Founder & CEO',
    period: 'Apr 2025 - Present',
    color: 'green',
    link: 'https://neuraltalk.ai',
    achievements: [
      'Founded and architected privacy-first AI platform serving 100+ companies',
      'Reduced support costs by 60% while maintaining customer satisfaction',
      'Built RAG system with vector databases achieving <30s response times',
      'Acquired by investors',
    ],
  },
  {
    company: 'Neo',
    role: 'Lead Software Engineer',
    period: 'Apr 2024 - May 2025',
    color: 'blue',
    link: 'https://heyneo.so',
    achievements: [
      'Led team of 5+ engineers building autonomous ML platform',
      'Improved system performance by 40% through optimization',
      'Architected microservices handling 10,000+ concurrent workflows',
      'Reduced deployment time from hours to minutes',
    ],
  },
  {
    company: 'Monster API',
    role: 'Lead Software Engineer',
    period: 'May 2023 - May 2025',
    color: 'purple',
    link: 'https://www.linkedin.com/company/monster-api',
    achievements: [
      'Published NPM package used by 1,000+ developers',
      'Built AI Playground (flagship product)',
      '6x speed improvement through Redis caching',
      '99.9% uptime with Kubernetes architecture',
    ],
  },
  {
    company: 'Amazon',
    role: 'ML Data Associate',
    period: 'Aug 2020 - Aug 2022',
    color: 'orange',
    link: 'https://www.amazon.com',
    achievements: [
      '2x Top Performer awards',
      'Led quality enhancement projects (15% accuracy improvement)',
      '25% productivity improvement through POC',
    ],
  },
]

const Experience = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="experience" className="py-12 px-4 bg-primary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-mono text-sm">02.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Experience</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Company tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-48 flex md:flex-col gap-2 overflow-x-auto"
          >
            {experiences.map((exp, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-3 text-left font-mono text-sm whitespace-nowrap md:whitespace-normal border-l-2 transition-all ${
                  activeIndex === index
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-gray-700 text-gray-400 hover:bg-accent/5 hover:text-accent'
                }`}
              >
                {exp.company}
              </button>
            ))}
          </motion.div>

          {/* Experience details */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1"
          >
            <div className="bg-terminal border border-accent/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {experiences[activeIndex].role}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-semibold">
                      @ {experiences[activeIndex].company}
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400 text-sm font-mono">
                      {experiences[activeIndex].period}
                    </span>
                  </div>
                </div>
                {experiences[activeIndex].link && (
                  <a
                    href={experiences[activeIndex].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent transition-colors text-xl"
                    title={`Visit ${experiences[activeIndex].company}`}
                  >
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>

              <ul className="space-y-3">
                {experiences[activeIndex].achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-accent mt-1 text-xs">▹</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Experience
