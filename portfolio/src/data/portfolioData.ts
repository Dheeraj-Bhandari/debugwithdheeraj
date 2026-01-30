/**
 * Shared Portfolio Data Source
 * 
 * Single source of truth for all portfolio data used across
 * both the terminal-themed portfolio and Amazon-themed portfolio.
 * This ensures data consistency across all sections.
 */

// Import profile image for proper bundling
import dheerajKumarImg from '../assets/images/dheeraj_kumar.png';
import resumePdf from '../assets/resume/Dheeraj_Kumar_SDE.pdf';
import amazonResumePdf from '../assets/resume/Dheeraj_Kumar_Resume_Amazon_2026.pdf';

/**
 * Personal Information
 */
export const personalInfo = {
  name: 'Dheeraj Kumar',
  role: 'Senior Software Engineer',
  title: 'Senior Software Engineer | AI/ML Systems Architect',
  bio: "I'm a Senior Software Engineer with 5+ years of experience building scalable AI/ML systems and leading engineering teams. I specialize in full-stack development, LLM applications, distributed systems, and cloud infrastructure.",
  tagline: 'Available for Immediate Hire',
  profileImage: dheerajKumarImg,
};

/**
 * Contact Information
 * 
 * Centralized contact data constant used across all portfolio sections.
 * This ensures data consistency across the terminal portfolio, Amazon portfolio,
 * and all contact displays.
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */
export const contactInfo = {
  email: 'digitaldk.in@gmail.com',
  phone: '+91 99885-36242',
  website: 'debugwithdheeraj.com',
  location: 'Bathinda, Punjab, India',
  github: 'https://github.com/Dheeraj-Bhandari',
  linkedin: 'https://linkedin.com/in/debugwithdheeraj',
  twitter: 'https://twitter.com/digitaldk',
  youtube: 'https://youtube.com/@debugwithdheeraj',
  resume: resumePdf,
  amazonResume: amazonResumePdf, // Amazon-themed resume for /amazon route
};

/**
 * Career Highlights
 */
export const careerHighlights = [
  'Founded NeuralTalk AI - Privacy-first AI platform serving 100+ enterprises (acquired)',
  'Led engineering at Neo - Improved deployment speed by 70%',
  'Built systems at Monster API - 50K+ daily requests, 99.9% uptime',
  'Open source contributor - 1,500+ GitHub contributions annually',
];

/**
 * Key Statistics
 */
export const keyStats = [
  { label: 'Enterprise Clients', value: '100+' },
  { label: 'Performance Boost', value: '70%' },
  { label: 'System Uptime', value: '99.9%' },
  { label: 'GitHub Contributions', value: '1.5K+' },
];

/**
 * Work Experience
 */
export const workExperience = [
  {
    company: 'NeuralTalk AI',
    role: 'Founder & CEO',
    period: 'Apr 2025 - Present',
    achievements: [
      'Founded and architected privacy-first AI platform serving 100+ companies',
      'Reduced support costs by 60% while maintaining customer satisfaction',
      'Built RAG system with vector databases achieving <30s response times',
      'Acquired by investors',
    ],
    link: 'https://neuraltalk.ai',
  },
  {
    company: 'Neo',
    role: 'Lead Software Engineer',
    period: 'Apr 2024 - May 2025',
    achievements: [
      'Led team of 5+ engineers building autonomous ML platform',
      'Improved system performance by 40% through optimization',
      'Architected microservices handling 10,000+ concurrent workflows',
      'Reduced deployment time from hours to minutes',
    ],
    link: 'https://heyneo.so',
  },
  {
    company: 'Monster API',
    role: 'Lead Software Engineer',
    period: 'May 2023 - May 2025',
    achievements: [
      'Published NPM package used by 1,000+ developers',
      'Built AI Playground (flagship product)',
      '6x speed improvement through Redis caching',
      '99.9% uptime with Kubernetes architecture',
    ],
    link: 'https://www.linkedin.com/company/monster-api',
  },
  {
    company: 'Amazon',
    role: 'ML Data Associate',
    period: 'Aug 2020 - Aug 2022',
    achievements: [
      '2x Top Performer awards',
      'Led quality enhancement projects (15% accuracy improvement)',
      '25% productivity improvement through POC',
    ],
    link: 'https://www.amazon.com',
  },
];

/**
 * Projects
 */
export const projects = [
  {
    title: 'NeuralTalk AI Platform',
    description: 'Privacy-first AI customer support automation serving 100+ enterprises. Built with LangChain, RAG architecture and vector databases for intelligent, context-aware responses.',
    tech: ['React', 'Node.js', 'Python', 'FastAPI', 'LangChain', 'Pinecone', 'MongoDB', 'Redis', 'AWS'],
    metrics: [
      { label: 'Cost Reduction', value: '60%' },
      { label: 'Response Time', value: '<30s' },
      { label: 'Data Retention', value: 'Zero' },
      { label: 'Companies', value: '100+' },
    ],
    links: [
      { label: 'Website', url: 'https://neuraltalk.ai?utm_source=portfolio&utm_medium=website&utm_campaign=dheeraj_kumar', type: 'website' },
    ],
  },
  {
    title: 'Monster API Integration',
    description: 'Official NPM package for seamless LLM API integration. Simplifies AI model deployment with TypeScript support and comprehensive documentation.',
    tech: ['TypeScript', 'Node.js', 'REST APIs', 'OpenAI'],
    metrics: [
      { label: 'Developers', value: '1,000+' },
      { label: 'Downloads', value: 'Growing' },
      { label: 'License', value: 'Open Source' },
    ],
    links: [
      { label: 'NPM', url: 'https://www.npmjs.com/package/monsterapi', type: 'npm' },
      { label: 'GitHub', url: 'https://github.com/MonsterAPI/monsterapi-node', type: 'github' },
    ],
  },
  {
    title: 'Neo - Autonomous ML Platform',
    description: 'Autonomous ML engineering platform that improved deployment speed by 70%. Led team of 5+ engineers building scalable microservices architecture.',
    tech: ['React', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'Python'],
    metrics: [
      { label: 'Faster Deploys', value: '70%' },
      { label: 'Workflows', value: '10K+' },
      { label: 'Team Size', value: '5+' },
    ],
    links: [
      { label: 'Website', url: 'https://heyneo.so?utm_source=portfolio&utm_medium=website&utm_campaign=dheeraj_kumar', type: 'website' },
    ],
  },
  {
    title: 'Amazon ML Data Projects',
    description: 'Machine Learning data associate working on ML training data projects. Recognized as Top Performer with quality enhancement initiatives.',
    tech: ['Python', 'Machine Learning', 'Data Analysis', 'Quality Assurance'],
    metrics: [
      { label: 'Top Performer', value: '2x Awards' },
      { label: 'Accuracy Improvement', value: '15%' },
      { label: 'Performance Boost', value: '25%' },
    ],
    links: [
      { label: 'Website', url: 'https://www.amazon.com', type: 'website' },
    ],
  },
];

/**
 * Technical Skills
 */
export const technicalSkills = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
  frameworks: ['React', 'Next.js', 'Vue.js', 'Redux', 'Tailwind CSS', 'Node.js', 'Express', 'Django', 'FastAPI'],
  tools: ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'HuggingFace', 'RAG', 'Vector DBs', 'AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform'],
  databases: ['MongoDB', 'PostgreSQL', 'Redis', 'Pinecone'],
};

/**
 * Detailed Skills with Experience
 * Extended catalog with 12 total skills organized by category
 * Skills with 5+ years marked as Prime
 */
export const detailedSkills = [
  // Languages (6 skills)
  { name: 'JavaScript', category: 'Languages', yearsOfExperience: 5, frameworks: ['ES6+', 'Node.js'], tools: ['Babel', 'ESLint'] },
  { name: 'TypeScript', category: 'Languages', yearsOfExperience: 5, frameworks: ['React', 'Node.js'], tools: ['ESLint', 'Prettier'] },
  { name: 'Python', category: 'Languages', yearsOfExperience: 5, frameworks: ['FastAPI', 'Django', 'Flask'], tools: ['Poetry', 'Pytest'] },
  { name: 'Java', category: 'Languages', yearsOfExperience: 3, frameworks: ['Spring Boot'], tools: ['Maven', 'JUnit'] },
  { name: 'SQL', category: 'Languages', yearsOfExperience: 4, frameworks: ['PostgreSQL', 'MySQL'], tools: ['Query Optimization'] },
  { name: 'Bash', category: 'Languages', yearsOfExperience: 4, frameworks: ['Shell Scripting'], tools: ['Automation'] },
  
  // Frontend (6 skills)
  { name: 'React', category: 'Frontend', yearsOfExperience: 5, frameworks: ['Next.js', 'Redux', 'React Router'], tools: ['Vite', 'Webpack'] },
  { name: 'Next.js', category: 'Frontend', yearsOfExperience: 4, frameworks: ['React', 'Vercel'], tools: ['App Router', 'Server Components'] },
  { name: 'Vue.js', category: 'Frontend', yearsOfExperience: 2, frameworks: ['Vuex', 'Vue Router'], tools: ['Vite'] },
  { name: 'Redux', category: 'Frontend', yearsOfExperience: 4, frameworks: ['React', 'Redux Toolkit'], tools: ['State Management'] },
  { name: 'Material-UI', category: 'Frontend', yearsOfExperience: 3, frameworks: ['React'], tools: ['Component Library'] },
  { name: 'Vite', category: 'Frontend', yearsOfExperience: 2, frameworks: ['React', 'Vue'], tools: ['Build Tool'] },
  
  // Backend (6 skills)
  { name: 'Node.js', category: 'Backend', yearsOfExperience: 5, frameworks: ['Express', 'Fastify', 'NestJS'], tools: ['PM2', 'Docker'] },
  { name: 'Express', category: 'Backend', yearsOfExperience: 5, frameworks: ['Node.js'], tools: ['Middleware', 'REST APIs'] },
  { name: 'Django', category: 'Backend', yearsOfExperience: 3, frameworks: ['Python'], tools: ['ORM', 'Admin Panel'] },
  { name: 'Flask', category: 'Backend', yearsOfExperience: 2, frameworks: ['Python'], tools: ['Microservices'] },
  { name: 'FastAPI', category: 'Backend', yearsOfExperience: 3, frameworks: ['Python'], tools: ['Pydantic', 'Async'] },
  { name: 'GraphQL', category: 'Backend', yearsOfExperience: 3, frameworks: ['Apollo', 'Node.js'], tools: ['Schema Design'] },
  
  // AI/ML (4 skills)
  { name: 'TensorFlow', category: 'AI/ML', yearsOfExperience: 2, frameworks: ['Keras'], tools: ['Model Training'] },
  { name: 'LangChain', category: 'AI/ML', yearsOfExperience: 2, frameworks: ['OpenAI', 'HuggingFace'], tools: ['Vector DBs', 'RAG'] },
  { name: 'OpenAI', category: 'AI/ML', yearsOfExperience: 2, frameworks: ['GPT-4', 'Embeddings'], tools: ['API Integration'] },
  { name: 'Vector DBs', category: 'AI/ML', yearsOfExperience: 2, frameworks: ['Pinecone', 'Weaviate'], tools: ['RAG', 'Embeddings'] },
  
  // Databases (6 skills)
  { name: 'MongoDB', category: 'Databases', yearsOfExperience: 5, frameworks: ['Mongoose'], tools: ['Atlas', 'Aggregation'] },
  { name: 'PostgreSQL', category: 'Databases', yearsOfExperience: 4, frameworks: ['Prisma', 'TypeORM'], tools: ['SQL', 'Indexing'] },
  { name: 'MySQL', category: 'Databases', yearsOfExperience: 3, frameworks: ['Sequelize'], tools: ['SQL', 'Replication'] },
  { name: 'Redis', category: 'Databases', yearsOfExperience: 4, frameworks: ['Redis Cache'], tools: ['Pub/Sub', 'Caching'] },
  { name: 'DynamoDB', category: 'Databases', yearsOfExperience: 3, frameworks: ['AWS'], tools: ['NoSQL', 'Serverless'] },
  { name: 'Pinecone', category: 'Databases', yearsOfExperience: 2, frameworks: ['Vector DB'], tools: ['Embeddings', 'Similarity Search'] },
  
  // Cloud/DevOps (4 skills)
  { name: 'AWS', category: 'Cloud/DevOps', yearsOfExperience: 4, frameworks: ['Lambda', 'EC2', 'S3', 'EKS'], tools: ['CloudFormation', 'CDK'], certifications: ['AWS Certified'] },
  { name: 'Docker', category: 'Cloud/DevOps', yearsOfExperience: 4, frameworks: ['Docker Compose'], tools: ['Containerization'] },
  { name: 'Kubernetes', category: 'Cloud/DevOps', yearsOfExperience: 3, frameworks: ['Helm'], tools: ['K8s Orchestration'] },
  { name: 'CI/CD', category: 'Cloud/DevOps', yearsOfExperience: 4, frameworks: ['GitHub Actions', 'Jenkins'], tools: ['Automation', 'Deployment'] },
];

/**
 * Developer Highlights for About Section
 */
export const developerHighlights = [
  '5+ years building scalable systems',
  'Led teams of 5+ engineers',
  'Shipped 20+ production applications',
  'Expert in AI/ML, Cloud Architecture, Full-Stack Development',
  'Specialized in React, TypeScript, Node.js, Python, and AWS',
  'Strong focus on code quality, testing, and documentation',
];

/**
 * Questions & Answers (FAQ)
 * Used in Amazon-themed portfolio Q&A section
 */
export interface QAItem {
  question: string;
  answer: string;
  answeredBy?: string;
  date?: Date;
}

export const questionsAndAnswers: QAItem[] = [
  {
    question: "What's your availability?",
    answer: "Immediate - Ready to start on your next project! I'm currently available for full-time positions, contract work, or consulting engagements. Think of me as Amazon Prime for developers: fast, reliable, and always delivering quality.",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-15'),
  },
  {
    question: "Do you work remotely?",
    answer: "Yes! I've been working with distributed teams globally for years. I'm comfortable with async communication, different time zones, and have a home office setup that would make Jeff Bezos jealous (okay, maybe not that nice, but it's pretty good).",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-14'),
  },
  {
    question: "What's your preferred tech stack?",
    answer: "I'm fluent in React, TypeScript, Node.js, Python, and AWS - but I'm not married to any particular stack. I believe in using the right tool for the job. That said, if you're still using jQuery in 2025, we need to talk.",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-13'),
  },
  {
    question: "Can you work on legacy codebases?",
    answer: "Absolutely! I've refactored more spaghetti code than an Italian restaurant. I approach legacy code with respect (someone wrote it under pressure) and pragmatism (let's make it better, not perfect). No judgment, just improvements.",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-12'),
  },
  {
    question: "Do you do code reviews?",
    answer: "Yes, and I promise to be constructive, not destructive. My code reviews focus on knowledge sharing, not ego crushing. I believe in 'praise in public, critique in private' - though I'll definitely celebrate clever solutions publicly!",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-11'),
  },
  {
    question: "What's your rate?",
    answer: "Let's discuss your project first! My rates are competitive and depend on the scope, duration, and complexity. I'm happy to work within your budget and can offer flexible arrangements. Contact me and we'll figure out something that works for both of us.",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-10'),
  },
  {
    question: "Can you add this to my cart?",
    answer: "You're already thinking like an Amazon customer! Yes, click the 'Add to Cart' button on any skill or project card. Then proceed to checkout to get in touch. It's like shopping, but instead of getting a package, you get a developer!",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-09'),
  },
  {
    question: "Is this portfolio really Amazon-themed?",
    answer: "You caught that! Yes, this entire portfolio is styled like Amazon's e-commerce platform. It's my way of showing creativity while demonstrating technical skills. Plus, if Amazon recruiters visit, they'll feel right at home. (Disclaimer: Not affiliated with Amazon.com, Inc.)",
    answeredBy: 'Dheeraj Kumar',
    date: new Date('2025-01-08'),
  },
];

/**
 * Amazon Experience Data
 * Detailed experience data for Amazon-themed portfolio
 * This is separate from workExperience to include additional Amazon-specific details
 */
export const amazonExperienceData = {
  id: 'amazon-experience',
  company: 'Amazon',
  role: 'Machine Learning Data Associate',
  duration: 'Aug 2020 - Aug 2022',
  location: 'Chennai, India',
  achievements: [
    'Recognized as Top Performer with 2 awards for ML training data projects',
    'Spearheaded POC enhancing team performance by 25%',
    'Managed quality enhancement projects improving accuracy by 15%',
    'Streamlined workflows reducing processing time by 30%',
  ],
  companyUrl: 'https://www.amazon.com',
};

/**
 * Main Portfolio UI Text
 * All text content for main portfolio components (Hero, Terminal, etc.)
 */
export const mainPortfolioText = {
  // Hero Section
  hero: {
    name: 'Dheeraj Kumar',
    title: 'Senior Software Engineer | AI/ML Systems Architect',
    mission: 'Building scalable AI systems and leading teams to ship production-grade software. 5+ years of experience turning complex problems into elegant solutions.',
    status: 'Open to solving complex problems & CS discussions',
    altText: 'Dheeraj Kumar - Senior Software Engineer',
  },

  // Terminal
  terminal: {
    welcomeTitle: 'Welcome to Dheeraj Kumar\'s Portfolio Terminal',
    windowTitle: 'Terminal - Dheeraj Kumar',
    username: 'dheeraj',
    hostname: 'portfolio',
  },

  // Terminal Loader
  terminalLoader: {
    bootSequence: [
      'Initializing portfolio system...',
      'Loading user profile: Dheeraj Kumar',
      'Connecting to GitHub... ✓',
      'Fetching projects... ✓',
      'Loading AI/ML credentials... ✓',
      'Compiling 5+ years of experience... ✓',
      'Initializing NeuralTalk AI systems... ✓',
      'Loading 100+ enterprise clients data... ✓',
      'System ready. Welcome!',
    ],
  },

  // About Section
  about: {
    intro: 'I\'m a Senior Software Engineer with 5+ years of experience building scalable AI/ML systems and leading engineering teams. I specialize in full-stack development, LLM applications, distributed systems, and cloud infrastructure.',
  },
};

/**
 * Amazon Portfolio UI Text
 * All text content for Amazon-themed portfolio components
 */
export const amazonPortfolioText = {
  // Header
  header: {
    logoFull: 'Dheeraj Kumar',
    logoShort: 'DK',
    logoTitle: 'Dheeraj Kumar - Professional Portfolio',
    logoAriaLabel: 'Dheeraj Kumar - Home',
    accountGreeting: 'Hello, Recruiter',
    accountLabel: 'Account',
  },

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} Dheeraj Kumar. All rights reserved.`,
    disclaimer: 'Not affiliated with Amazon.com, Inc. This is a creative portfolio presentation.',
    backToTop: '↑ Back to Top',
  },

  // Hero Section
  hero: {
    professionalHighlights: [
      'Available for immediate hire',
      'Open to remote and on-site opportunities',
      'Expert in AI-driven development - building smarter, not harder',
      'Proven ability to debug AI-generated code without AI assistance',
    ],
    buttons: {
      contact: 'Contact Me',
      resume: 'View Resume',
    },
  },

  // Today's Deals Section
  todaysDeals: {
    heading: "Today's Deals",
    subheading: 'Featured skills and expertise',
    seeAllButton: 'See All Skills',
  },

  // Customer Reviews Section
  customerReviews: {
    heading: 'Customer Reviews',
    verifiedBadge: 'Verified Project',
    ratingDistribution: 'Rating Distribution',
    topReviews: 'Top Reviews',
    basedOn: 'Based on verified projects and client testimonials',
    helpful: 'Helpful',
    seeAllReviews: 'See all {count} reviews',
  },

  // Easter Egg Section
  easterEgg: {
    heading: 'Customers Who Hired Dheeraj Also Hired',
    disclaimer: '(Disclaimer: These are fictional profiles for entertainment purposes)',
    alert: {
      title: 'Easter Egg Alert!',
      message: 'These profiles are jokes. But if you need a real developer, Dheeraj is your person! 😄',
    },
    viewProfileAlert: 'Just kidding! These are fictional profiles for fun. But Dheeraj is very real and available for hire!',
    callToAction: {
      text: 'Enjoyed the humor? Now let\'s talk about real work!',
      button: 'Hire the Real Developer',
    },
    viewProfileButton: 'View Profile',
  },

  // Fictional Profiles (Easter Eggs)
  fictionalProfiles: [
    {
      name: "Sarah 'Stack Overflow' Chen",
      title: 'Copy-Paste Engineer',
      description: 'Expert at finding solutions on Stack Overflow and adapting them to your needs. Has memorized every error message known to humanity. 10+ years of Googling experience.',
      rating: 4.8,
      projects: 127,
      avatar: '👩‍💻',
    },
    {
      name: "Bob 'The Debugger' Martinez",
      title: 'Console.log Specialist',
      description: "Will add console.log() statements until the bug reveals itself. Has never met a problem that couldn't be solved with enough logging. Debugger? Never heard of it.",
      rating: 4.9,
      projects: 89,
      avatar: '🐛',
    },
    {
      name: "Alex 'Async/Await' Johnson",
      title: 'Promise Keeper',
      description: 'Turns callback hell into async heaven. Can explain Promises to your grandmother. Still has nightmares about nested callbacks from 2015.',
      rating: 5.0,
      projects: 156,
      avatar: '⏳',
    },
    {
      name: "Emma 'CSS Wizard' Thompson",
      title: 'Flexbox Whisperer',
      description: 'Can center a div in under 30 seconds. Knows the difference between margin and padding (unlike some people). Has strong opinions about CSS-in-JS.',
      rating: 4.7,
      projects: 203,
      avatar: '🎨',
    },
    {
      name: "Mike 'Merge Conflict' Davis",
      title: 'Git Archaeologist',
      description: 'Specializes in resolving merge conflicts and recovering lost commits. Can read git logs like ancient scrolls. Has never force-pushed to main (okay, maybe once).',
      rating: 4.6,
      projects: 94,
      avatar: '🔀',
    },
    {
      name: "Lisa 'The Optimizer' Park",
      title: 'Performance Perfectionist',
      description: 'Will shave milliseconds off your load time. Obsessed with Lighthouse scores. Dreams in Web Vitals. Has strong feelings about bundle sizes.',
      rating: 4.9,
      projects: 112,
      avatar: '⚡',
    },
  ],
};
