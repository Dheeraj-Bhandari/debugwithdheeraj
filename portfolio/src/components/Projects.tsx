import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaExternalLinkAlt, FaGithub, FaNpm } from 'react-icons/fa'

const projects = [
  {
    title: 'NeuralTalk AI Platform',
    description: 'Privacy-first AI customer support automation serving 100+ enterprises. Built with LangChain, RAG architecture and vector databases for intelligent, context-aware responses.',
    tech: ['React', 'Node.js', 'Python', 'FastAPI', 'LangChain', 'Pinecone', 'MongoDB', 'Redis', 'AWS'],
    metrics: ['60% cost reduction', '<30s response time', 'Zero data retention'],
    links: [
      { type: 'website', url: 'https://neuraltalk.ai?utm_source=portfolio&utm_medium=website&utm_campaign=dheeraj_kumar', icon: FaExternalLinkAlt },
    ],
  },
  {
    title: 'Monster API Integration',
    description: 'Official NPM package for seamless LLM API integration. Simplifies AI model deployment with TypeScript support and comprehensive documentation.',
    tech: ['TypeScript', 'Node.js', 'REST APIs', 'OpenAI'],
    metrics: ['1,000+ developers', 'Open source'],
    links: [
      { type: 'npm', url: 'https://www.npmjs.com/package/monsterapi', icon: FaNpm },
      { type: 'github', url: 'https://github.com/MonsterAPI/monsterapi-node', icon: FaGithub },
    ],
  },
  {
    title: 'Neo - Autonomous ML Platform',
    description: 'Autonomous ML engineering platform that improved deployment speed by 70%. Led team of 5+ engineers building scalable microservices architecture.',
    tech: ['React', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'Python'],
    metrics: ['70% faster deployments', '10K+ concurrent workflows'],
    links: [
      { type: 'website', url: 'https://heyneo.so?utm_source=portfolio&utm_medium=website&utm_campaign=dheeraj_kumar', icon: FaExternalLinkAlt },
    ],
  },
]

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="projects" className="py-12 px-4 bg-primary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-mono text-sm">04.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-terminal border border-accent/20 rounded-lg overflow-hidden hover:border-accent/50 transition-colors group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-3 ml-4">
                    {project.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-accent transition-colors text-xl"
                      >
                        <link.icon />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded font-mono border border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 text-sm font-mono">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-accent">▸</span>
                      <span className="text-gray-400">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
