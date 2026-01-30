/**
 * Unit tests for AmazonPortfolioDataMapper
 * 
 * These tests verify that the data mapper correctly transforms
 * portfolio data into Amazon-themed models.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  AmazonPortfolioDataMapper,
  mapSkill,
  mapProject,
  generateSkillBundles,
} from './AmazonPortfolioDataMapper';

describe('AmazonPortfolioDataMapper', () => {
  let mapper: AmazonPortfolioDataMapper;
  
  beforeEach(() => {
    mapper = new AmazonPortfolioDataMapper();
    mapper.loadPortfolioData();
  });
  
  describe('loadPortfolioData', () => {
    it('should load skills from portfolio data', () => {
      const skills = mapper.getSkills();
      expect(skills.length).toBeGreaterThan(0);
    });
    
    it('should load projects from portfolio data', () => {
      const projects = mapper.getProjects();
      expect(projects.length).toBeGreaterThan(0);
    });
    
    it('should generate skill bundles', () => {
      const bundles = mapper.getSkillBundles();
      expect(bundles.length).toBeGreaterThan(0);
    });
  });
  
  describe('mapSkill', () => {
    it('should map raw skill data to Skill model', () => {
      const rawSkill = {
        name: 'React',
        category: 'Frontend',
        yearsOfExperience: 5,
        frameworks: ['Next.js', 'Redux'],
        tools: ['Vite', 'Webpack'],
        certifications: [],
      };
      
      const skill = mapSkill(rawSkill);
      
      expect(skill.id).toBe('react');
      expect(skill.name).toBe('React');
      expect(skill.category).toBe('frontend');
      expect(skill.yearsOfExperience).toBe(5);
      expect(skill.proficiencyLevel).toBe(5);
      expect(skill.isPrime).toBe(true);
      expect(skill.specifications.frameworks).toEqual(['Next.js', 'Redux']);
      expect(skill.reviews.length).toBeGreaterThan(0);
    });
    
    it('should calculate Prime badge for 5+ years experience', () => {
      const skill5Years = mapSkill({ name: 'Test', category: 'Frontend', yearsOfExperience: 5 });
      const skill4Years = mapSkill({ name: 'Test', category: 'Frontend', yearsOfExperience: 4 });
      
      expect(skill5Years.isPrime).toBe(true);
      expect(skill4Years.isPrime).toBe(false);
    });
    
    it('should calculate proficiency level based on years', () => {
      const skill3Years = mapSkill({ name: 'Test', category: 'Frontend', yearsOfExperience: 3 });
      const skill2Years = mapSkill({ name: 'Test', category: 'Frontend', yearsOfExperience: 2 });
      const skill1Year = mapSkill({ name: 'Test', category: 'Frontend', yearsOfExperience: 0.5 });
      
      expect(skill3Years.proficiencyLevel).toBe(5);
      expect(skill2Years.proficiencyLevel).toBe(4);
      expect(skill1Year.proficiencyLevel).toBe(3);
    });
  });
  
  describe('mapProject', () => {
    it('should map raw project data to Project model', () => {
      const rawProject = {
        title: 'Test Project',
        description: 'A test project for unit testing.',
        tech: ['React', 'Node.js'],
        metrics: ['1,000+ users', '50% faster'],
        links: [
          { type: 'github', url: 'https://github.com/test' },
          { type: 'website', url: 'https://test.com' },
        ],
      };
      
      const project = mapProject(rawProject);
      
      expect(project.id).toBe('test-project');
      expect(project.name).toBe('Test Project');
      expect(project.techStack).toEqual(['React', 'Node.js']);
      expect(project.links.github).toBe('https://github.com/test');
      expect(project.links.live).toBe('https://test.com');
      expect(project.reviews.length).toBeGreaterThan(0);
    });
    
    it('should calculate Prime badge for high-impact projects', () => {
      const highImpact = mapProject({
        title: 'High Impact',
        description: 'Test',
        tech: [],
        metrics: ['10K+ users'],
        links: [],
      });
      
      const lowImpact = mapProject({
        title: 'Low Impact',
        description: 'Test',
        tech: [],
        metrics: ['Small project'],
        links: [],
      });
      
      expect(highImpact.isPrime).toBe(true);
      expect(lowImpact.isPrime).toBe(false);
    });
    
    it('should parse metrics into structured format', () => {
      const project = mapProject({
        title: 'Test',
        description: 'Test',
        tech: [],
        metrics: ['1,000+ users', '70% faster', 'High impact'],
        links: [],
      });
      
      expect(project.metrics.users).toBe(1000);
      expect(project.metrics.performance).toBe('70% faster');
      expect(project.metrics.impact).toBe('High impact');
    });
  });
  
  describe('generateSkillBundles', () => {
    it('should generate skill bundles from skills', () => {
      const skills = mapper.getSkills();
      const bundles = generateSkillBundles(skills);
      
      expect(bundles.length).toBeGreaterThan(0);
      
      bundles.forEach(bundle => {
        expect(bundle.id).toBeDefined();
        expect(bundle.name).toBeDefined();
        expect(bundle.skills.length).toBeGreaterThan(0);
        expect(bundle.description).toBeDefined();
      });
    });
    
    it('should create Full-Stack Development Bundle', () => {
      const skills = mapper.getSkills();
      const bundles = generateSkillBundles(skills);
      
      const fullStackBundle = bundles.find(b => b.id === 'full-stack-bundle');
      expect(fullStackBundle).toBeDefined();
      expect(fullStackBundle?.skills.length).toBeGreaterThan(0);
    });
  });
  
  describe('getSkillsByCategory', () => {
    it('should filter skills by category', () => {
      const frontendSkills = mapper.getSkillsByCategory('frontend');
      
      expect(frontendSkills.length).toBeGreaterThan(0);
      frontendSkills.forEach(skill => {
        expect(skill.category).toBe('frontend');
      });
    });
  });
  
  describe('getSkillById', () => {
    it('should return skill by ID', () => {
      const skill = mapper.getSkillById('react');
      
      expect(skill).toBeDefined();
      expect(skill?.name).toBe('React');
    });
    
    it('should return undefined for non-existent ID', () => {
      const skill = mapper.getSkillById('non-existent');
      expect(skill).toBeUndefined();
    });
  });
  
  describe('getProjectById', () => {
    it('should return project by ID', () => {
      const projects = mapper.getProjects();
      const firstProject = projects[0];
      
      const project = mapper.getProjectById(firstProject.id);
      expect(project).toBeDefined();
      expect(project?.id).toBe(firstProject.id);
    });
  });
  
  describe('getFeaturedSkills', () => {
    it('should return Prime skills with highest proficiency', () => {
      const featured = mapper.getFeaturedSkills(4);
      
      expect(featured.length).toBeLessThanOrEqual(4);
      featured.forEach(skill => {
        expect(skill.isPrime).toBe(true);
      });
    });
    
    it('should sort by proficiency level', () => {
      const featured = mapper.getFeaturedSkills();
      
      for (let i = 1; i < featured.length; i++) {
        expect(featured[i - 1].proficiencyLevel).toBeGreaterThanOrEqual(
          featured[i].proficiencyLevel
        );
      }
    });
  });
  
  describe('getFeaturedProjects', () => {
    it('should return Prime projects with highest ratings', () => {
      const featured = mapper.getFeaturedProjects(3);
      
      expect(featured.length).toBeLessThanOrEqual(3);
      featured.forEach(project => {
        expect(project.isPrime).toBe(true);
      });
    });
  });
  
  describe('search', () => {
    it('should search skills by name', () => {
      const results = mapper.search('React');
      
      expect(results.skills.length).toBeGreaterThan(0);
      expect(results.skills.some(s => s.name.includes('React'))).toBe(true);
    });
    
    it('should search projects by name', () => {
      const results = mapper.search('NeuralTalk');
      
      expect(results.projects.length).toBeGreaterThan(0);
      expect(results.projects.some(p => p.name.includes('NeuralTalk'))).toBe(true);
    });
    
    it('should search by tech stack', () => {
      const results = mapper.search('Node.js');
      
      expect(results.skills.length + results.projects.length).toBeGreaterThan(0);
    });
    
    it('should return empty results for non-matching query', () => {
      const results = mapper.search('NonExistentTechnology12345');
      
      expect(results.skills.length).toBe(0);
      expect(results.projects.length).toBe(0);
    });
    
    it('should be case-insensitive', () => {
      const resultsLower = mapper.search('react');
      const resultsUpper = mapper.search('REACT');
      
      expect(resultsLower.skills.length).toBe(resultsUpper.skills.length);
    });
  });
  
  describe('skill-project linking', () => {
    it('should link skills to related projects', () => {
      const reactSkill = mapper.getSkillById('react');
      
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.relatedProjects.length).toBeGreaterThan(0);
    });
    
    it('should link projects to related skills', () => {
      const projects = mapper.getProjects();
      
      projects.forEach(project => {
        expect(project.relatedSkills.length).toBeGreaterThan(0);
      });
    });
  });
  
  describe('getExperiences', () => {
    it('should load Amazon experience data', () => {
      const experiences = mapper.getExperiences();
      
      expect(experiences.length).toBeGreaterThan(0);
      
      const amazonExp = experiences.find(exp => exp.id === 'amazon-experience');
      expect(amazonExp).toBeDefined();
      expect(amazonExp?.company).toBe('Amazon');
      expect(amazonExp?.role).toBe('Machine Learning Data Associate');
      expect(amazonExp?.duration).toBe('Aug 2020 - Aug 2022');
      expect(amazonExp?.location).toBe('Chennai, India');
      expect(amazonExp?.logo).toBeDefined();
      expect(amazonExp?.achievements.length).toBe(4);
      expect(amazonExp?.type).toBe('experience');
      expect(amazonExp?.companyUrl).toBe('https://www.amazon.com');
    });
  });
  
  describe('getExperienceById', () => {
    it('should return experience by ID', () => {
      const experience = mapper.getExperienceById('amazon-experience');
      
      expect(experience).toBeDefined();
      expect(experience?.company).toBe('Amazon');
    });
    
    it('should return undefined for non-existent ID', () => {
      const experience = mapper.getExperienceById('non-existent');
      expect(experience).toBeUndefined();
    });
  });
});
