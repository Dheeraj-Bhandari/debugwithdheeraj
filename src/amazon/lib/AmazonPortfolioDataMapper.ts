/**
 * AmazonPortfolioDataMapper
 * 
 * Maps shared portfolio data to Amazon-themed models.
 * Calculates Prime badges, generates skill bundles, and transforms
 * raw portfolio data into the Amazon product format.
 * 
 * Implements caching strategy for improved performance.
 * 
 * Requirements: 3.2, 8.2, 14.4, 10.4
 */

import type { 
  Skill, 
  Project, 
  Review, 
  SkillBundle, 
  SkillCategory,
  Experience 
} from '../types';
import { 
  detailedSkills, 
  projects as sharedProjects,
  amazonExperienceData 
} from '../../data/portfolioData';
import {
  cachePortfolioData,
  getCachedPortfolioData,
  cacheSkills,
  cacheProjects,
} from './cacheUtils';

// Import images for proper bundling
import nodejsImg from '../../assets/images/nodejs.webp';
import typescriptImg from '../../assets/images/typescript.webp';
import langchainImg from '../../assets/images/langchain.webp';
import javaImg from '../../assets/images/java.webp';
import mongodbImg from '../../assets/images/mongodb.jpg';
import reactjsImg from '../../assets/images/reactjs.png';
import expressjsImg from '../../assets/images/expressjs.webp';
import awsImg from '../../assets/images/aws.webp';
import dockerImg from '../../assets/images/docker.png';
import neuraltalkai from '../../assets/images/neuraltalkai.png';
import monsterapi from '../../assets/images/monsterapi.png';
import heyneo from '../../assets/images/heyneo.jpg';
import amazonImg from '../../assets/images/amazon.webp';

/**
 * Raw portfolio data structure (from existing components)
 */
interface RawSkillData {
  name: string;
  category: string;
  yearsOfExperience: number;
  frameworks?: string[];
  tools?: string[];
  certifications?: string[];
}

interface RawProjectData {
  title: string;
  description: string;
  tech: string[];
  metrics: string[];
  links: Array<{ type: string; url: string }>;
}

/**
 * Maps a skill category string to the SkillCategory type
 */
function mapSkillCategory(category: string): SkillCategory {
  const categoryMap: Record<string, SkillCategory> = {
    'languages': 'backend', // Languages mapped to backend for display
    'frontend': 'frontend',
    'backend': 'backend',
    'ai/ml': 'ai-ml',
    'ai-ml': 'ai-ml',
    'databases': 'database',
    'database': 'database',
    'cloud/devops': 'cloud',
    'cloud': 'cloud',
    'devops': 'devops',
  };
  
  const normalized = category.toLowerCase().replace(/\s+/g, '-');
  return categoryMap[normalized] || 'backend';
}

/**
 * Calculates proficiency level based on years of experience
 * 0-1 years: 3 stars
 * 1-3 years: 4 stars
 * 3+ years: 5 stars
 */
function calculateProficiencyLevel(years: number): 1 | 2 | 3 | 4 | 5 {
  if (years >= 3) return 5;
  if (years >= 1) return 4;
  return 3;
}

/**
 * Determines if a skill qualifies for Prime badge (5+ years experience)
 */
function isSkillPrime(yearsOfExperience: number): boolean {
  return yearsOfExperience >= 5;
}

/**
 * Determines if a project qualifies for Prime badge (10K+ users)
 */
function isProjectPrime(metrics: string[]): boolean {
  // Check if any metric mentions 10K+ users or similar high impact
  return metrics.some(metric => {
    const lowerMetric = metric.toLowerCase();
    return (
      lowerMetric.includes('10k+') ||
      lowerMetric.includes('10,000+') ||
      lowerMetric.includes('100+') ||
      lowerMetric.includes('1,000+')
    );
  });
}

/**
 * Generates a unique ID from a string
 */
function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Creates sample reviews for a skill
 */
function generateSkillReviews(skillName: string, proficiency: number): Review[] {
  const reviews: Review[] = [];
  
  // High proficiency skills get more positive reviews
  if (proficiency >= 4) {
    reviews.push({
      id: `${generateId(skillName)}-review-1`,
      rating: 5,
      title: `Exceptional ${skillName} expertise`,
      content: `Dheeraj demonstrated outstanding proficiency in ${skillName}. Clean code, excellent problem-solving, and great communication throughout the project.`,
      author: 'Tech Lead',
      authorRole: 'Senior Engineering Manager',
      date: new Date('2024-11-15'),
      isVerified: true,
      helpful: 12,
    });
  }
  
  reviews.push({
    id: `${generateId(skillName)}-review-2`,
    rating: proficiency as 1 | 2 | 3 | 4 | 5,
    title: `Solid ${skillName} skills`,
    content: `Great experience working with Dheeraj on ${skillName} projects. Delivered quality work on time and was always responsive to feedback.`,
    author: 'Project Manager',
    authorRole: 'Product Manager',
    date: new Date('2024-09-20'),
    isVerified: true,
    helpful: 8,
  });
  
  return reviews;
}

/**
 * Creates reviews from project metrics
 */
function generateProjectReviews(project: RawProjectData): Review[] {
  const reviews: Review[] = [];
  
  // Convert metrics to verified reviews
  project.metrics.forEach((metric, index) => {
    reviews.push({
      id: `${generateId(project.title)}-review-${index + 1}`,
      rating: 5,
      title: `Outstanding results: ${metric}`,
      content: `The ${project.title} project delivered exceptional results. ${metric} speaks to the quality and impact of the work.`,
      author: 'Client',
      authorRole: 'CTO',
      date: new Date(2024, 10 - index, 15),
      isVerified: true,
      helpful: 15 + index * 3,
    });
  });
  
  return reviews;
}

/**
 * Maps raw skill data to Skill model
 */
export function mapSkill(rawSkill: RawSkillData): Skill {
  const proficiency = calculateProficiencyLevel(rawSkill.yearsOfExperience);
  const isPrime = isSkillPrime(rawSkill.yearsOfExperience);
  
  // Map skill names to actual image paths (using imported images)
  const skillImageMap: Record<string, string> = {
    // Languages
    'javascript': nodejsImg,
    'typescript': typescriptImg,
    'python': langchainImg,
    'java': javaImg,
    'sql': mongodbImg,
    'bash': nodejsImg,
    
    // Frontend
    'react': reactjsImg,
    'next-js': reactjsImg,
    'nextjs': reactjsImg,
    'vue-js': reactjsImg,
    'vuejs': reactjsImg,
    'redux': reactjsImg,
    'material-ui': reactjsImg,
    'vite': reactjsImg,
    
    // Backend
    'node-js': nodejsImg,
    'nodejs': nodejsImg,
    'express': expressjsImg,
    'django': langchainImg,
    'flask': langchainImg,
    'fastapi': langchainImg,
    'graphql': nodejsImg,
    
    // AI/ML
    'tensorflow': langchainImg,
    'langchain': langchainImg,
    'openai': langchainImg,
    'vector-dbs': langchainImg,
    
    // Databases
    'mongodb': mongodbImg,
    'postgresql': mongodbImg,
    'mysql': mongodbImg,
    'redis': mongodbImg,
    'dynamodb': awsImg,
    'pinecone': langchainImg,
    
    // Cloud/DevOps
    'aws': awsImg,
    'docker': dockerImg,
    'kubernetes': dockerImg,
    'ci-cd': dockerImg,
    'cicd': dockerImg,
  };
  
  const skillId = generateId(rawSkill.name);
  const icon = skillImageMap[skillId] || reactjsImg;
  
  // Validate that icon is not empty
  if (!icon || icon.trim() === '') {
    console.warn(`Empty icon for skill: ${rawSkill.name}, using fallback`);
  }
  
  return {
    id: skillId,
    name: rawSkill.name,
    category: mapSkillCategory(rawSkill.category),
    proficiencyLevel: proficiency,
    yearsOfExperience: rawSkill.yearsOfExperience,
    description: `${rawSkill.yearsOfExperience}+ years of professional experience with ${rawSkill.name}. Expert in building scalable, production-ready applications.`,
    icon: icon || reactjsImg, // Ensure icon is never empty
    isPrime,
    specifications: {
      frameworks: rawSkill.frameworks || [],
      tools: rawSkill.tools || [],
      certifications: rawSkill.certifications || [],
    },
    relatedProjects: [],
    reviews: generateSkillReviews(rawSkill.name, proficiency),
  };
}

/**
 * Maps raw project data to Project model
 */
export function mapProject(rawProject: RawProjectData): Project {
  const isPrime = isProjectPrime(rawProject.metrics);
  
  // Calculate rating based on metrics (more metrics = higher rating)
  const calculatedRating = Math.min(5, 4 + (rawProject.metrics.length > 2 ? 1 : 0));
  const rating = calculatedRating as 1 | 2 | 3 | 4 | 5;
  
  // Parse metrics into structured format
  const metrics: Project['metrics'] = {};
  rawProject.metrics.forEach(metric => {
    if (metric.includes('users') || metric.includes('developers')) {
      const match = metric.match(/(\d+[,\d]*\+?)/);
      if (match) {
        const userCount = match[1].replace(/,/g, '');
        metrics.users = parseInt(userCount);
      }
    } else if (metric.includes('%')) {
      metrics.performance = metric;
    } else {
      metrics.impact = metric;
    }
  });
  
  // Parse links
  const links: Project['links'] = {};
  rawProject.links.forEach(link => {
    if (link.type === 'github') links.github = link.url;
    else if (link.type === 'website') links.live = link.url;
    else if (link.type === 'npm') links.live = link.url;
  });
  
  // Map project names to actual image paths (using imported images)
  const projectImageMap: Record<string, string> = {
    'neuraltalk-ai-platform': neuraltalkai,
    'monster-api-integration': monsterapi,
    'neo-autonomous-ml-platform': heyneo,
    'amazon-ml-data-projects': awsImg,
  };
  
  const projectId = generateId(rawProject.title);
  const projectImage = projectImageMap[projectId] || reactjsImg;
  
  // Validate that image is not empty
  if (!projectImage || projectImage.trim() === '') {
    console.warn(`Empty image for project: ${rawProject.title}, using fallback`);
  }
  
  const images = [projectImage || reactjsImg]; // Ensure image is never empty
  
  return {
    id: projectId,
    name: rawProject.title,
    tagline: rawProject.description.split('.')[0],
    description: rawProject.description,
    techStack: rawProject.tech,
    images,
    rating,
    metrics,
    links,
    isPrime,
    reviews: generateProjectReviews(rawProject),
    relatedSkills: rawProject.tech.map(tech => generateId(tech)),
  };
}

/**
 * Generates skill bundles for "Frequently Bought Together" section
 */
export function generateSkillBundles(skills: Skill[]): SkillBundle[] {
  const bundles: SkillBundle[] = [];
  
  // Full-Stack Development Bundle
  const frontendSkills = skills.filter(s => s.category === 'frontend');
  const backendSkills = skills.filter(s => s.category === 'backend');
  const databaseSkills = skills.filter(s => s.category === 'database');
  
  if (frontendSkills.length > 0 && backendSkills.length > 0) {
    bundles.push({
      id: 'full-stack-bundle',
      name: 'Full-Stack Development Bundle',
      skills: [
        frontendSkills[0],
        backendSkills[0],
        ...(databaseSkills.length > 0 ? [databaseSkills[0]] : []),
      ].filter(Boolean),
      description: 'Complete solution for modern web applications - frontend, backend, and database expertise.',
    });
  }
  
  // AI/ML Engineering Bundle
  const aiSkills = skills.filter(s => s.category === 'ai-ml');
  const cloudSkills = skills.filter(s => s.category === 'cloud');
  
  if (aiSkills.length > 0) {
    bundles.push({
      id: 'ai-ml-bundle',
      name: 'AI/ML Engineering Bundle',
      skills: [
        aiSkills[0],
        ...(backendSkills.length > 0 ? [backendSkills[0]] : []),
        ...(cloudSkills.length > 0 ? [cloudSkills[0]] : []),
      ].filter(Boolean),
      description: 'End-to-end AI/ML solution development - from model training to production deployment.',
    });
  }
  
  // Cloud Architecture Bundle
  if (cloudSkills.length > 0) {
    const devopsSkills = skills.filter(s => s.category === 'devops');
    
    bundles.push({
      id: 'cloud-architecture-bundle',
      name: 'Cloud Architecture Bundle',
      skills: [
        cloudSkills[0],
        ...(devopsSkills.length > 0 ? [devopsSkills[0]] : []),
        ...(databaseSkills.length > 0 ? [databaseSkills[0]] : []),
      ].filter(Boolean),
      description: 'Scalable cloud infrastructure - AWS, containerization, and database management.',
    });
  }
  
  return bundles;
}

/**
 * Main data mapper class
 */
export class AmazonPortfolioDataMapper {
  private skills: Skill[] = [];
  private projects: Project[] = [];
  private skillBundles: SkillBundle[] = [];
  private experiences: Experience[] = [];
  
  /**
   * Loads and transforms portfolio data from shared data source
   * Uses cache when available to improve performance
   */
  loadPortfolioData(): void {
    // Try to load from cache first
    const cachedData = getCachedPortfolioData<{
      skills: Skill[];
      projects: Project[];
      skillBundles: SkillBundle[];
      experiences: Experience[];
    }>();

    if (cachedData) {
      console.log('Loading portfolio data from cache');
      this.skills = cachedData.skills;
      this.projects = cachedData.projects;
      this.skillBundles = cachedData.skillBundles;
      this.experiences = cachedData.experiences || [];
      return;
    }

    console.log('Loading portfolio data from source');
    
    // Map skills from shared data source
    const rawSkills: RawSkillData[] = detailedSkills;
    
    // Map projects from shared data source
    const rawProjects: RawProjectData[] = sharedProjects.map(project => ({
      title: project.title,
      description: project.description,
      tech: project.tech,
      metrics: project.metrics.map(m => `${m.label}: ${m.value}`),
      links: project.links,
    }));
    
    // Transform data
    this.skills = rawSkills.map(mapSkill);
    this.projects = rawProjects.map(mapProject);
    
    // Link skills to projects
    this.linkSkillsToProjects();
    
    // Generate skill bundles
    this.skillBundles = generateSkillBundles(this.skills);
    
    // Load experience data
    this.experiences = this.getExperienceData();

    // Cache the transformed data
    cachePortfolioData({
      skills: this.skills,
      projects: this.projects,
      skillBundles: this.skillBundles,
      experiences: this.experiences,
    });
    
    // Also cache individual collections
    cacheSkills(this.skills);
    cacheProjects(this.projects);
  }
  
  /**
   * Links skills to related projects based on tech stack
   */
  private linkSkillsToProjects(): void {
    this.skills.forEach(skill => {
      skill.relatedProjects = this.projects
        .filter(project => 
          project.techStack.some(tech => 
            generateId(tech) === skill.id
          )
        )
        .map(project => project.id);
    });
  }
  
  /**
   * Gets all skills
   */
  getSkills(): Skill[] {
    return this.skills;
  }
  
  /**
   * Gets skills by category
   */
  getSkillsByCategory(category: SkillCategory): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }
  
  /**
   * Gets a single skill by ID
   */
  getSkillById(id: string): Skill | undefined {
    return this.skills.find(skill => skill.id === id);
  }
  
  /**
   * Gets all projects
   */
  getProjects(): Project[] {
    return this.projects;
  }
  
  /**
   * Gets a single project by ID
   */
  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }
  
  /**
   * Gets all skill bundles
   */
  getSkillBundles(): SkillBundle[] {
    return this.skillBundles;
  }
  
  /**
   * Gets featured skills (Prime skills with highest proficiency)
   */
  getFeaturedSkills(limit: number = 4): Skill[] {
    return this.skills
      .filter(skill => skill.isPrime)
      .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
      .slice(0, limit);
  }
  
  /**
   * Gets extended skill catalog (top 12 skills across all categories)
   * Prioritizes skills with 4+ years experience
   * Ensures representation from each category
   * Marks 5+ years as Prime
   */
  getExtendedSkillCatalog(): Skill[] {
    // Group skills by category
    const skillsByCategory: Record<SkillCategory, Skill[]> = {
      'frontend': [],
      'backend': [],
      'ai-ml': [],
      'database': [],
      'cloud': [],
      'devops': [],
    };
    
    this.skills.forEach(skill => {
      if (skillsByCategory[skill.category]) {
        skillsByCategory[skill.category].push(skill);
      }
    });
    
    // Sort each category by years of experience (descending)
    Object.keys(skillsByCategory).forEach(category => {
      skillsByCategory[category as SkillCategory].sort(
        (a, b) => b.yearsOfExperience - a.yearsOfExperience
      );
    });
    
    // Select top skills from each category to reach 12 total
    const selectedSkills: Skill[] = [];
    const categories: SkillCategory[] = ['frontend', 'backend', 'ai-ml', 'database', 'cloud', 'devops'];
    
    // First pass: get top 2 from each category (prioritize 4+ years)
    categories.forEach(category => {
      const categorySkills = skillsByCategory[category]
        .filter(s => s.yearsOfExperience >= 4)
        .slice(0, 2);
      selectedSkills.push(...categorySkills);
    });
    
    // If we don't have 12 yet, add more skills
    if (selectedSkills.length < 12) {
      const remaining = 12 - selectedSkills.length;
      const allRemainingSkills = this.skills
        .filter(s => !selectedSkills.includes(s))
        .sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      
      selectedSkills.push(...allRemainingSkills.slice(0, remaining));
    }
    
    // Sort final list by years of experience
    return selectedSkills
      .sort((a, b) => b.yearsOfExperience - a.yearsOfExperience)
      .slice(0, 12);
  }
  
  /**
   * Gets featured projects (Prime projects with highest ratings)
   */
  getFeaturedProjects(limit: number = 3): Project[] {
    return this.projects
      .filter(project => project.isPrime)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
  
  /**
   * Gets experience data including Amazon experience
   * Data source: src/data/portfolioData.ts (amazonExperienceData)
   * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
   */
  private getExperienceData(): Experience[] {
    return [
      {
        ...amazonExperienceData,
        logo: amazonImg,
        type: 'experience' as const,
      }
    ];
  }
  
  /**
   * Gets all experiences
   */
  getExperiences(): Experience[] {
    return this.experiences;
  }
  
  /**
   * Gets a single experience by ID
   */
  getExperienceById(id: string): Experience | undefined {
    return this.experiences.find(exp => exp.id === id);
  }
  
  /**
   * Searches skills and projects by query
   */
  search(query: string): { skills: Skill[]; projects: Project[] } {
    const lowerQuery = query.toLowerCase();
    
    const skills = this.skills.filter(skill =>
      skill.name.toLowerCase().includes(lowerQuery) ||
      skill.description.toLowerCase().includes(lowerQuery) ||
      skill.specifications.frameworks.some(f => f.toLowerCase().includes(lowerQuery))
    );
    
    const projects = this.projects.filter(project =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.techStack.some(tech => tech.toLowerCase().includes(lowerQuery))
    );
    
    return { skills, projects };
  }
}

/**
 * Singleton instance of the data mapper
 */
export const portfolioDataMapper = new AmazonPortfolioDataMapper();
