import React from 'react';
import ProductCard from './ProductCard';
import type { Skill } from '../../amazon/types';
import { getSkillDocUrl } from '../../amazon/lib/skillDocsUrls';

/**
 * TodaysDealsSection Component
 * 
 * Showcases featured skills in an Amazon "Today's Deals" format.
 * Features:
 * - Grid layout (4 columns desktop, 2 tablet, 1 mobile)
 * - Displays 4 featured skills as ProductCards
 * - Section header with description
 * - "See All Skills" link
 * 
 * Requirements: 3.5
 */

interface TodaysDealsSectionProps {
  /** Array of featured skills to display */
  featuredSkills: Skill[];
  
  /** Callback when a skill card is clicked */
  onSkillClick: (skillId: string) => void;
  
  /** Callback when "Add to Cart" is clicked */
  onAddToCart: (skillId: string) => void;
  
  /** Optional callback when "See All Skills" is clicked */
  onSeeAllClick?: () => void;
}

const TodaysDealsSection: React.FC<TodaysDealsSectionProps> = ({
  featuredSkills,
  onSkillClick,
  onAddToCart,
  onSeeAllClick,
}) => {
  const handleSeeAllClick = () => {
    if (onSeeAllClick) {
      onSeeAllClick();
    } else {
      // Default behavior: scroll to skills section
      const skillsSection = document.getElementById('all-skills');
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      id="todays-deals" 
      className="todays-deals-section py-8 md:py-12 px-4"
      aria-labelledby="todays-deals-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <h2 
            id="todays-deals-heading"
            className="text-2xl md:text-3xl font-bold text-amazon-dark mb-2"
          >
            Today's Deals
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Featured skills and expertise
          </p>
        </div>

        {/* Skills Grid - Single column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8">
          {featuredSkills.slice(0, 4).map((skill) => (
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
              learnMoreUrl={getSkillDocUrl(skill.id) || undefined}
              onAddToCart={onAddToCart}
              onClick={onSkillClick}
            />
          ))}
        </div>

        {/* See All Link */}
        <div className="text-center">
          <button
            onClick={handleSeeAllClick}
            className="inline-flex items-center gap-2 text-amazon-blue hover:text-amazon-orange hover:underline transition-colors duration-200 font-medium text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2 rounded px-4 py-2"
            aria-label="See all skills"
          >
            <span>See All Skills</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
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
      </div>
    </section>
  );
};

export default TodaysDealsSection;
