import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { contactInfo } from '../data/portfolioData'

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="contact" className="py-12 px-4 bg-primary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-accent font-mono text-sm">06.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Get In Touch</h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
            Whether you're looking for technical leadership, full-stack development, or AI/ML expertise, let's connect.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-terminal border border-accent/20 rounded-lg p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg hover:border-accent/50 hover:bg-accent/10 transition-colors group"
            >
              <FaEnvelope className="text-3xl text-accent" />
              <div className="text-left">
                <div className="text-gray-400 text-sm font-mono">Email</div>
                <div className="text-white group-hover:text-accent transition-colors">{contactInfo.email}</div>
              </div>
            </a>

            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg hover:border-accent/50 hover:bg-accent/10 transition-colors group"
            >
              <FaLinkedin className="text-3xl text-accent" />
              <div className="text-left">
                <div className="text-gray-400 text-sm font-mono">LinkedIn</div>
                <div className="text-white group-hover:text-accent transition-colors">{contactInfo.linkedin.replace('https://', '')}</div>
              </div>
            </a>

            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg hover:border-accent/50 hover:bg-accent/10 transition-colors group"
            >
              <FaGithub className="text-3xl text-accent" />
              <div className="text-left">
                <div className="text-gray-400 text-sm font-mono">GitHub</div>
                <div className="text-white group-hover:text-accent transition-colors">{contactInfo.github.replace('https://', '')}</div>
              </div>
            </a>

            <a
              href={contactInfo.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg hover:border-accent/50 hover:bg-accent/10 transition-colors group"
            >
              <FaXTwitter className="text-3xl text-accent" />
              <div className="text-left">
                <div className="text-gray-400 text-sm font-mono">Twitter/X</div>
                <div className="text-white group-hover:text-accent transition-colors">{contactInfo.twitter.replace('https://', '')}</div>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <FaMapMarkerAlt className="text-3xl text-accent" />
              <div className="text-left">
                <div className="text-gray-400 text-sm font-mono">Location</div>
                <div className="text-white">{contactInfo.location}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
