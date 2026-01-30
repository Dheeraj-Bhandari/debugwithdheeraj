import { FaGithub, FaLinkedin, FaYoutube, FaTerminal, FaXTwitter } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-terminal border-t border-accent/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
            <FaTerminal className="text-accent" />
            <span>© 2025 Debug with Dheeraj</span>
          </div>

          <div className="flex gap-6 text-gray-400">
            <a href="https://linkedin.com/in/digitaldk" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="LinkedIn">
              <FaLinkedin className="text-xl" />
            </a>
            <a href="https://github.com/Dheeraj-Bhandari" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="GitHub">
              <FaGithub className="text-xl" />
            </a>
            <a href="https://twitter.com/dherajbhandari" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Twitter/X">
              <FaXTwitter className="text-xl" />
            </a>
            <a href="https://youtube.com/@debugwithdheeraj" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="YouTube">
              <FaYoutube className="text-xl" />
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <Link 
              to="/amazon" 
              className="text-[#FF9900] hover:text-[#E88B00] transition-colors text-sm font-mono"
            >
              🛒 View Amazon Store
            </Link>
            <div className="text-gray-500 text-xs font-mono">
              Built with React + Vite + Tailwind
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
