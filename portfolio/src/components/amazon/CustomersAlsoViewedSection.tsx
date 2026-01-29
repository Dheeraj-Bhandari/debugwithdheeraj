import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import type { Project, Experience } from '../../amazon/types';
import { getProjectUrl } from '../../amazon/lib/projectUrls';

/**
 * CustomersAlsoViewedSection Component
 * 
 * Displays projects and experiences in a horizontal scrollable carousel.
 * Features:
 * - Projects and experiences displayed as ProductCards
 * - Horizontal scrollable layout
 * - Scroll buttons for navigation
 * - Amazon "Customers Also Viewed" styling
 * 
 * Requirements: 4.7, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */

interface CustomersAlsoViewedSectionProps {
  /** Array of projects to display */
  projects: Project[];
  
  /** Array of experiences to display */
  experiences?: Experience[];
  
  /** Callback when a project card is clicked */
  onProjectClick: (projectId: string) => void;
  
  /** Callback when "Add to Cart" is clicked */
  onAddToCart: (projectId: string) => void;
}

const CustomersAlsoViewedSection: React.FC<CustomersAlsoViewedSectionProps> = ({
  projects,
  experiences = [],
  onProjectClick,
  onAddToCart,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  // Combine projects and experiences into a single array for display
  const allItems = [
    ...projects.map(project => ({ type: 'project' as const, data: project })),
    ...experiences.map(experience => ({ type: 'experience' as const, data: experience })),
  ];

  // Don't render if no items
  if (allItems.length === 0) {
    return null;
  }

  return (
    <section 
      id="customers-also-viewed" 
      className="customers-also-viewed-section py-12 px-4 bg-gray-50"
      aria-labelledby="customers-also-viewed-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6">
          <h2 
            id="customers-also-viewed-heading"
            className="text-3xl font-bold text-amazon-dark mb-2"
          >
            Customers Also Viewed
          </h2>
          <p className="text-lg text-gray-600">
            Featured projects and work
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amazon-orange hidden md:block"
            aria-label="Scroll left"
          >
            <svg 
              className="w-6 h-6 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>

          {/* Scrollable Projects and Experiences Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {allItems.map((item) => {
              if (item.type === 'project') {
                const project = item.data;
                return (
                  <div 
                    key={project.id}
                    className="flex-shrink-0 w-72"
                  >
                    <ProductCard
                      id={project.id}
                      title={project.name}
                      category="project"
                      rating={project.rating}
                      reviewCount={project.reviews.length}
                      price={
                        project.metrics.users 
                          ? `${project.metrics.users.toLocaleString()}+ users` 
                          : project.metrics.impact
                      }
                      image={project.images[0]}
                      isPrime={project.isPrime}
                      learnMoreUrl={getProjectUrl(project.id) || undefined}
                      onAddToCart={onAddToCart}
                      onClick={onProjectClick}
                    />
                  </div>
                );
              } else {
                const experience = item.data;
                // Calculate rating based on achievements (more achievements = higher rating)
                const rating = Math.min(5, 4 + (experience.achievements.length > 3 ? 1 : 0)) as 1 | 2 | 3 | 4 | 5;
                
                return (
                  <div 
                    key={experience.id}
                    className="flex-shrink-0 w-72"
                  >
                    <ProductCard
                      id={experience.id}
                      title={`${experience.role} at ${experience.company}`}
                      category="project"
                      rating={rating}
                      reviewCount={experience.achievements.length}
                      price={`${experience.duration} • ${experience.location}`}
                      image={experience.logo}
                      isPrime={false}
                      learnMoreUrl={experience.companyUrl}
                      onAddToCart={onAddToCart}
                      onClick={onProjectClick}
                    />
                  </div>
                );
              }
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amazon-orange hidden md:block"
            aria-label="Scroll right"
          >
            <svg 
              className="w-6 h-6 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Scroll Hint */}
        <div className="md:hidden text-center mt-4 text-sm text-gray-500">
          ← Swipe to see more projects and experiences →
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CustomersAlsoViewedSection;
