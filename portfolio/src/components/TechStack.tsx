import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const TechStack = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const techCategories = [
    {
      title: 'Languages',
      items: ['JavaScript', 'TypeScript', 'Python', 'Java'],
    },
    {
      title: 'Frontend',
      items: ['React', 'Next.js', 'Vue.js', 'Redux', 'Tailwind CSS'],
    },
    {
      title: 'Backend',
      items: ['Node.js', 'Express', 'Django', 'FastAPI'],
    },
    {
      title: 'AI/ML',
      items: ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'HuggingFace', 'RAG', 'Vector DBs'],
    },
    {
      title: 'Databases',
      items: ['MongoDB', 'PostgreSQL', 'Redis', 'Pinecone'],
    },
    {
      title: 'DevOps',
      items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform'],
    },
  ]

  return (
    <section id="tech" className="py-12 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-mono text-sm">03.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Tech Stack</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-terminal border border-accent/20 rounded-lg p-5 hover:border-accent/50 transition-colors"
            >
              <h3 className="text-accent font-mono text-sm mb-3 flex items-center gap-2">
                <span className="text-accent">{'>'}</span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-accent/10 text-gray-300 text-sm rounded border border-accent/20 hover:border-accent/50 hover:bg-accent/20 transition-colors font-mono"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
