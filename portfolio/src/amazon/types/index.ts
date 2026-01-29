/**
 * Amazon-themed portfolio data models
 * These interfaces define the structure for skills, projects, reviews, and cart items
 * used throughout the Amazon section of the portfolio.
 */

/**
 * Skill categories for organizing technical expertise
 */
export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'ai-ml' 
  | 'cloud' 
  | 'devops' 
  | 'database';

/**
 * Skill model representing a technical skill or expertise area
 * Displayed as a product in the Amazon-themed interface
 */
export interface Skill {
  /** Unique identifier for the skill */
  id: string;
  
  /** Display name of the skill (e.g., "React.js Development") */
  name: string;
  
  /** Category for organizing skills */
  category: SkillCategory;
  
  /** Proficiency level from 1-5, maps to star rating */
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
  
  /** Years of professional experience with this skill */
  yearsOfExperience: number;
  
  /** Detailed description of expertise and experience */
  description: string;
  
  /** URL or path to skill icon/image */
  icon: string;
  
  /** Whether this skill qualifies for Prime badge (5+ years) */
  isPrime: boolean;
  
  /** Technical specifications and details */
  specifications: {
    /** Frameworks and libraries used */
    frameworks: string[];
    
    /** Tools and technologies */
    tools: string[];
    
    /** Relevant certifications */
    certifications: string[];
  };
  
  /** IDs of projects that use this skill */
  relatedProjects: string[];
  
  /** Customer reviews and testimonials */
  reviews: Review[];
}

/**
 * Project model representing a portfolio project
 * Displayed as a product in the Amazon-themed interface
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  
  /** Project name/title */
  name: string;
  
  /** Short tagline or subtitle */
  tagline: string;
  
  /** Detailed project description */
  description: string;
  
  /** Technologies and frameworks used */
  techStack: string[];
  
  /** URLs to project screenshots/images */
  images: string[];
  
  /** Overall rating (1-5 stars) */
  rating: number;
  
  /** Project metrics and impact */
  metrics: {
    /** Number of users (if applicable) */
    users?: number;
    
    /** Performance improvements (e.g., "70% faster") */
    performance?: string;
    
    /** Business impact (e.g., "60% cost reduction") */
    impact?: string;
  };
  
  /** External links */
  links: {
    /** GitHub repository URL */
    github?: string;
    
    /** Live demo/production URL */
    live?: string;
    
    /** Demo video URL */
    demo?: string;
  };
  
  /** Whether this project qualifies for Prime badge (10K+ users) */
  isPrime: boolean;
  
  /** Customer reviews and testimonials */
  reviews: Review[];
  
  /** IDs of skills used in this project */
  relatedSkills: string[];
}

/**
 * Review model for testimonials and feedback
 * Displayed in Amazon's review card format
 */
export interface Review {
  /** Unique identifier for the review */
  id: string;
  
  /** Star rating from 1-5 */
  rating: 1 | 2 | 3 | 4 | 5;
  
  /** Review title/headline */
  title: string;
  
  /** Full review text */
  content: string;
  
  /** Name of the reviewer */
  author: string;
  
  /** Reviewer's role/title (optional) */
  authorRole?: string;
  
  /** Date the review was written */
  date: Date;
  
  /** Whether this is a verified project/purchase */
  isVerified: boolean;
  
  /** Number of "helpful" votes */
  helpful: number;
}

/**
 * Cart item model for shopping cart functionality
 * Represents a skill or project added to the cart
 */
export interface CartItem {
  /** Unique identifier (matches skill or project ID) */
  id: string;
  
  /** Type of item in cart */
  type: 'skill' | 'project';
  
  /** Display title */
  title: string;
  
  /** Category or tech stack summary */
  category: string;
  
  /** URL to thumbnail image */
  image: string;
}

/**
 * Cart state model for managing shopping cart
 */
export interface CartState {
  /** Array of items in the cart */
  items: CartItem[];
  
  /** Timestamp when each item was added (keyed by item ID) */
  addedAt: Record<string, Date>;
}

/**
 * Skill bundle model for "Frequently Bought Together" section
 */
export interface SkillBundle {
  /** Unique identifier for the bundle */
  id: string;
  
  /** Bundle name (e.g., "Full-Stack Development Bundle") */
  name: string;
  
  /** Skills included in the bundle */
  skills: Skill[];
  
  /** Description of the bundle */
  description: string;
}

/**
 * Experience model representing work experience
 * Displayed as a card in the Amazon-themed interface
 */
export interface Experience {
  /** Unique identifier for the experience */
  id: string;
  
  /** Company name */
  company: string;
  
  /** Job role/title */
  role: string;
  
  /** Duration of employment (e.g., "Aug 2020 - Aug 2022") */
  duration: string;
  
  /** Work location */
  location: string;
  
  /** URL or path to company logo */
  logo: string;
  
  /** Key achievements and responsibilities */
  achievements: string[];
  
  /** Type identifier for rendering */
  type: 'experience';
  
  /** Company website URL for "Learn More" redirect (optional) */
  companyUrl?: string;
}

/**
 * Checkout form data model
 */
export interface CheckoutFormData {
  /** Full name of the person submitting */
  name: string;
  
  /** Email address */
  email: string;
  
  /** Company name */
  company: string;
  
  /** Job role/title (optional) */
  role?: string;
  
  /** Message or inquiry */
  message: string;
  
  /** IDs of items they're interested in */
  interestedItems: string[];
}
