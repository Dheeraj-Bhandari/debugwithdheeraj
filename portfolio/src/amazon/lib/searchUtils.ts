/**
 * Search Utilities
 * 
 * Provides fuzzy search, filtering, and relevance sorting functionality
 * for skills and projects in the Amazon-themed portfolio.
 * 
 * Implements caching for search results to improve performance.
 * 
 * Requirements: 7.2, 7.3, 7.5, 10.4
 */

import type { Skill, Project, SkillCategory } from '../types';
import { cacheSearchResults, getCachedSearchResults } from './cacheUtils';

/**
 * Search result with relevance score
 */
export interface SearchResult<T> {
  item: T;
  score: number;
  matchedFields: string[];
}

/**
 * Search options for customizing search behavior
 */
export interface SearchOptions {
  /** Minimum score threshold (0-100) */
  minScore?: number;
  
  /** Maximum number of results to return */
  limit?: number;
  
  /** Category filter for skills */
  category?: SkillCategory;
  
  /** Filter for Prime items only */
  primeOnly?: boolean;
}

/**
 * Calculates fuzzy match score between query and text
 * Uses simple substring matching with position weighting
 * 
 * @param query - Search query
 * @param text - Text to search in
 * @returns Score from 0-100
 */
function calculateFuzzyScore(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  
  // Exact match gets highest score
  if (lowerText === lowerQuery) {
    return 100;
  }
  
  // Check if query is contained in text
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) {
    return 0;
  }
  
  // Score based on position (earlier matches score higher)
  const positionScore = 100 - (index / lowerText.length) * 50;
  
  // Score based on length ratio (closer lengths score higher)
  const lengthRatio = lowerQuery.length / lowerText.length;
  const lengthScore = lengthRatio * 50;
  
  return Math.round(positionScore + lengthScore);
}

/**
 * Searches skills with fuzzy matching and relevance scoring
 * Uses cache for improved performance (5 minute TTL)
 * 
 * @param skills - Array of skills to search
 * @param query - Search query
 * @param options - Search options
 * @returns Sorted array of search results
 */
export function searchSkills(
  skills: Skill[],
  query: string,
  options: SearchOptions = {}
): SearchResult<Skill>[] {
  const { minScore = 0, limit, category, primeOnly = false } = options;
  
  if (!query.trim()) {
    return [];
  }

  // Create cache key from query and options
  const cacheKey = `skills_${query}_${JSON.stringify(options)}`;
  
  // Try to get from cache
  const cached = getCachedSearchResults<SearchResult<Skill>[]>(cacheKey);
  if (cached) {
    console.log('Using cached search results for:', query);
    return cached;
  }
  
  const results: SearchResult<Skill>[] = [];
  
  for (const skill of skills) {
    // Apply filters
    if (category && skill.category !== category) {
      continue;
    }
    
    if (primeOnly && !skill.isPrime) {
      continue;
    }
    
    // Calculate relevance scores for different fields
    const nameScore = calculateFuzzyScore(query, skill.name) * 3; // Name matches weighted highest
    const descScore = calculateFuzzyScore(query, skill.description) * 1.5;
    
    // Check frameworks and tools
    let frameworkScore = 0;
    const matchedFrameworks: string[] = [];
    for (const framework of skill.specifications.frameworks) {
      const score = calculateFuzzyScore(query, framework);
      if (score > frameworkScore) {
        frameworkScore = score;
        matchedFrameworks.push(framework);
      }
    }
    frameworkScore *= 2;
    
    let toolScore = 0;
    for (const tool of skill.specifications.tools) {
      const score = calculateFuzzyScore(query, tool);
      if (score > toolScore) {
        toolScore = score;
      }
    }
    
    // Calculate total score
    const totalScore = Math.max(nameScore, descScore, frameworkScore, toolScore);
    
    if (totalScore >= minScore) {
      const matchedFields: string[] = [];
      if (nameScore > 0) matchedFields.push('name');
      if (descScore > 0) matchedFields.push('description');
      if (frameworkScore > 0) matchedFields.push('frameworks');
      if (toolScore > 0) matchedFields.push('tools');
      
      results.push({
        item: skill,
        score: totalScore,
        matchedFields,
      });
    }
  }
  
  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);
  
  // Apply limit if specified
  const finalResults = limit ? results.slice(0, limit) : results;
  
  // Cache the results
  cacheSearchResults(cacheKey, finalResults);
  
  return finalResults;
}

/**
 * Searches projects with fuzzy matching and relevance scoring
 * Uses cache for improved performance (5 minute TTL)
 * 
 * @param projects - Array of projects to search
 * @param query - Search query
 * @param options - Search options
 * @returns Sorted array of search results
 */
export function searchProjects(
  projects: Project[],
  query: string,
  options: SearchOptions = {}
): SearchResult<Project>[] {
  const { minScore = 0, limit, primeOnly = false } = options;
  
  if (!query.trim()) {
    return [];
  }

  // Create cache key from query and options
  const cacheKey = `projects_${query}_${JSON.stringify(options)}`;
  
  // Try to get from cache
  const cached = getCachedSearchResults<SearchResult<Project>[]>(cacheKey);
  if (cached) {
    console.log('Using cached search results for:', query);
    return cached;
  }
  
  const results: SearchResult<Project>[] = [];
  
  for (const project of projects) {
    // Apply filters
    if (primeOnly && !project.isPrime) {
      continue;
    }
    
    // Calculate relevance scores for different fields
    const nameScore = calculateFuzzyScore(query, project.name) * 3; // Name matches weighted highest
    const descScore = calculateFuzzyScore(query, project.description) * 1.5;
    const taglineScore = calculateFuzzyScore(query, project.tagline) * 2;
    
    // Check tech stack
    let techScore = 0;
    const matchedTech: string[] = [];
    for (const tech of project.techStack) {
      const score = calculateFuzzyScore(query, tech);
      if (score > techScore) {
        techScore = score;
        matchedTech.push(tech);
      }
    }
    techScore *= 2;
    
    // Calculate total score
    const totalScore = Math.max(nameScore, descScore, taglineScore, techScore);
    
    if (totalScore >= minScore) {
      const matchedFields: string[] = [];
      if (nameScore > 0) matchedFields.push('name');
      if (descScore > 0) matchedFields.push('description');
      if (taglineScore > 0) matchedFields.push('tagline');
      if (techScore > 0) matchedFields.push('techStack');
      
      results.push({
        item: project,
        score: totalScore,
        matchedFields,
      });
    }
  }
  
  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);
  
  // Apply limit if specified
  const finalResults = limit ? results.slice(0, limit) : results;
  
  // Cache the results
  cacheSearchResults(cacheKey, finalResults);
  
  return finalResults;
}

/**
 * Searches both skills and projects
 * 
 * @param skills - Array of skills to search
 * @param projects - Array of projects to search
 * @param query - Search query
 * @param options - Search options
 * @returns Object with skills and projects results
 */
export function searchAll(
  skills: Skill[],
  projects: Project[],
  query: string,
  options: SearchOptions = {}
): {
  skills: SearchResult<Skill>[];
  projects: SearchResult<Project>[];
} {
  return {
    skills: searchSkills(skills, query, options),
    projects: searchProjects(projects, query, options),
  };
}

/**
 * Filters skills by category
 * 
 * @param skills - Array of skills to filter
 * @param category - Category to filter by
 * @returns Filtered skills
 */
export function filterSkillsByCategory(
  skills: Skill[],
  category: SkillCategory
): Skill[] {
  return skills.filter(skill => skill.category === category);
}

/**
 * Filters items by Prime status
 * 
 * @param items - Array of skills or projects
 * @returns Filtered items with Prime badge
 */
export function filterPrimeItems<T extends { isPrime: boolean }>(
  items: T[]
): T[] {
  return items.filter(item => item.isPrime);
}

/**
 * Sorts items by rating (descending)
 * 
 * @param items - Array of items with rating
 * @returns Sorted items
 */
export function sortByRating<T extends { rating?: number; proficiencyLevel?: number }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const ratingA = a.rating || a.proficiencyLevel || 0;
    const ratingB = b.rating || b.proficiencyLevel || 0;
    return ratingB - ratingA;
  });
}

/**
 * Generates autocomplete suggestions from search query
 * 
 * @param skills - Array of skills
 * @param projects - Array of projects
 * @param query - Search query
 * @param limit - Maximum number of suggestions
 * @returns Array of suggestions
 */
export function generateAutocompleteSuggestions(
  skills: Skill[],
  projects: Project[],
  query: string,
  limit: number = 8
): Array<{ id: string; title: string; type: 'skill' | 'project'; category: string }> {
  if (query.length < 2) {
    return [];
  }
  
  const suggestions: Array<{ id: string; title: string; type: 'skill' | 'project'; category: string; score: number }> = [];
  
  // Search skills
  const skillResults = searchSkills(skills, query, { minScore: 30 });
  for (const result of skillResults) {
    suggestions.push({
      id: result.item.id,
      title: result.item.name,
      type: 'skill',
      category: result.item.category,
      score: result.score,
    });
  }
  
  // Search projects
  const projectResults = searchProjects(projects, query, { minScore: 30 });
  for (const result of projectResults) {
    suggestions.push({
      id: result.item.id,
      title: result.item.name,
      type: 'project',
      category: result.item.techStack[0] || 'project',
      score: result.score,
    });
  }
  
  // Sort by score and limit
  suggestions.sort((a, b) => b.score - a.score);
  
  return suggestions.slice(0, limit).map(({ id, title, type, category }) => ({
    id,
    title,
    type,
    category,
  }));
}
