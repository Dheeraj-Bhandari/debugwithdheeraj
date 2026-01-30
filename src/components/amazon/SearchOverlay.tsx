import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import type { Skill, Project } from '../../amazon/types';
import { searchSkills, searchProjects, generateAutocompleteSuggestions } from '../../amazon/lib/searchUtils';

/**
 * SearchOverlay Component
 * 
 * Expandable search overlay with autocomplete functionality.
 * Features:
 * - Expands from header search bar
 * - Autocomplete suggestions for skills and projects
 * - Recent searches stored in localStorage
 * - Results grid with ProductCards
 * - Category filtering
 * - Closes on backdrop click or ESC key
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'skill' | 'project';
  category: string;
}

interface SearchOverlayProps {
  /** Whether the overlay is open */
  isOpen: boolean;
  
  /** Callback to close the overlay */
  onClose: () => void;
  
  /** Initial search query */
  initialQuery?: string;
  
  /** All available skills */
  skills: Skill[];
  
  /** All available projects */
  projects: Project[];
  
  /** Callback when a skill/project is clicked */
  onItemClick: (id: string, type: 'skill' | 'project') => void;
  
  /** Callback when an item is added to cart */
  onAddToCart: (id: string, type: 'skill' | 'project') => void;
}

const RECENT_SEARCHES_KEY = 'amazon-portfolio-recent-searches';
const MAX_RECENT_SEARCHES = 5;
const MAX_SUGGESTIONS = 8;

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  skills,
  projects,
  onItemClick,
  onAddToCart,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<{
    skills: Skill[];
    projects: Project[];
  }>({ skills: [], projects: [] });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'skills' | 'projects'>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Generate autocomplete suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matchedSuggestions = generateAutocompleteSuggestions(
      skills,
      projects,
      query,
      MAX_SUGGESTIONS
    );

    setSuggestions(matchedSuggestions);
    setShowSuggestions(true);
  }, [query, skills, projects]);

  // Perform search
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults({ skills: [], projects: [] });
      return;
    }

    // Use search utilities for fuzzy search with relevance scoring
    const skillResults = searchSkills(skills, searchQuery, { minScore: 20 });
    const projectResults = searchProjects(projects, searchQuery, { minScore: 20 });

    setSearchResults({
      skills: skillResults.map(r => r.item),
      projects: projectResults.map(r => r.item),
    });
    setShowSuggestions(false);

    // Save to recent searches
    saveRecentSearch(searchQuery);
  };

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter(s => s !== trimmed)
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    performSearch(suggestion.title);
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    performSearch(search);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Filter results based on selected filter
  const getFilteredResults = () => {
    if (selectedFilter === 'skills') {
      return { skills: searchResults.skills, projects: [] };
    } else if (selectedFilter === 'projects') {
      return { skills: [], projects: searchResults.projects };
    }
    return searchResults;
  };

  const filteredResults = getFilteredResults();
  const hasResults = filteredResults.skills.length > 0 || filteredResults.projects.length > 0;
  const showNoResults = query.trim() && !hasResults && !showSuggestions;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Search overlay"
    >
      <div
        ref={overlayRef}
        className="min-h-screen bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="max-w-[1200px] mx-auto px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
              <div className="flex-1 flex">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search skills, projects..."
                  className="flex-1 px-4 py-3 text-lg text-gray-900 border-2 border-gray-300 rounded-l focus:border-amazon-orange focus:outline-none transition-colors"
                  aria-label="Search input"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="bg-amazon-orange hover:bg-amazon-orange-dark px-6 py-3 rounded-r transition-colors"
                  aria-label="Submit search"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
              
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-amazon-dark transition-colors p-2"
                aria-label="Close search"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-3"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <div>
                      <div className="text-amazon-dark font-medium">
                        {suggestion.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suggestion.type === 'skill' ? 'Skill' : 'Project'} • {suggestion.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-amazon-dark transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filters */}
          {hasResults && (
            <div className="mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-amazon-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({searchResults.skills.length + searchResults.projects.length})
                </button>
                <button
                  onClick={() => setSelectedFilter('skills')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'skills'
                      ? 'bg-amazon-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Skills ({searchResults.skills.length})
                </button>
                <button
                  onClick={() => setSelectedFilter('projects')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'projects'
                      ? 'bg-amazon-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Projects ({searchResults.projects.length})
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {hasResults && (
            <div>
              {/* Skills Results */}
              {filteredResults.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-amazon-dark mb-4">
                    Skills ({filteredResults.skills.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredResults.skills.map((skill) => (
                      <ProductCard
                        key={skill.id}
                        id={skill.id}
                        title={skill.name}
                        category="skill"
                        rating={skill.proficiencyLevel}
                        reviewCount={skill.reviews.length}
                        price={`${skill.yearsOfExperience}+ years`}
                        image={skill.icon}
                        isPrime={skill.isPrime}
                        onAddToCart={(id) => onAddToCart(id, 'skill')}
                        onClick={(id) => onItemClick(id, 'skill')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Results */}
              {filteredResults.projects.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-amazon-dark mb-4">
                    Projects ({filteredResults.projects.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredResults.projects.map((project) => (
                      <ProductCard
                        key={project.id}
                        id={project.id}
                        title={project.name}
                        category="project"
                        rating={project.rating}
                        reviewCount={project.reviews.length}
                        price={project.metrics.users ? `${project.metrics.users}+ users` : undefined}
                        image={project.images[0]}
                        isPrime={project.isPrime}
                        onAddToCart={(id) => onAddToCart(id, 'project')}
                        onClick={(id) => onItemClick(id, 'project')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No results found for "{query}"
              </h3>
              <p className="text-gray-500 mb-6">
                Try searching for different keywords or browse our categories
              </p>
              
              {/* Suggested Alternatives */}
              <div className="max-w-md mx-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Popular searches:
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['React', 'Node.js', 'AWS', 'Python', 'AI/ML'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        performSearch(term);
                      }}
                      className="px-4 py-2 bg-amazon-orange text-white rounded-full text-sm hover:bg-amazon-orange-dark transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!query && recentSearches.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start searching
              </h3>
              <p className="text-gray-500">
                Search for skills, projects, or technologies
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
