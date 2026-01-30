import React from 'react';
import { useContact } from '../../amazon/contexts/ContactContext';
import { amazonPortfolioText } from '../../data/portfolioData';

/**
 * EasterEggSection Component
 * 
 * Humorous "Customers Who Hired Dheeraj Also Hired" section with fictional profiles.
 * Features:
 * - Amazon recommendation styling
 * - Fictional humorous developer profiles
 * - Easter egg content for entertainment
 * - Professional yet playful tone
 * 
 * Data Source: src/data/portfolioData.ts (amazonPortfolioText.easterEgg & fictionalProfiles)
 * 
 * Requirements: 13.1
 */

interface FictionalProfile {
  /** Developer name */
  name: string;
  
  /** Job title */
  title: string;
  
  /** Humorous description */
  description: string;
  
  /** Star rating */
  rating: number;
  
  /** Number of projects */
  projects: number;
  
  /** Avatar emoji or icon */
  avatar: string;
}

/**
 * Individual profile card component
 */
const ProfileCard: React.FC<{ profile: FictionalProfile }> = ({ profile }) => {
  const { easterEgg } = amazonPortfolioText;
  const fullStars = Math.floor(profile.rating);
  const hasHalfStar = profile.rating % 1 >= 0.5;

  return (
    <div className="profile-card bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Avatar */}
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">
          {profile.avatar}
        </div>
        <h3 className="font-bold text-amazon-dark text-lg mb-1">
          {profile.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {profile.title}
        </p>
        
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(fullStars)].map((_, i) => (
            <svg
              key={`full-${i}`}
              className="w-4 h-4 text-amazon-orange fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
          {hasHalfStar && (
            <svg
              className="w-4 h-4 text-amazon-orange"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id={`half-star-${profile.name}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#DDD" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#half-star-${profile.name})`}
                d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
              />
            </svg>
          )}
          <span className="text-sm text-gray-600 ml-1">
            {profile.rating}
          </span>
        </div>
        
        <p className="text-xs text-gray-500">
          {profile.projects} projects completed
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed text-center">
        {profile.description}
      </p>

      {/* Fake "View Profile" Button */}
      <button 
        className="w-full mt-4 py-2 px-4 bg-white border-2 border-amazon-orange text-amazon-orange rounded hover:bg-amazon-orange hover:text-white transition-colors duration-200 font-medium text-sm"
        onClick={() => alert(easterEgg.viewProfileAlert)}
      >
        {easterEgg.viewProfileButton}
      </button>
    </div>
  );
};

const EasterEggSection: React.FC = () => {
  const { openContactSidebar } = useContact();
  const { easterEgg, fictionalProfiles } = amazonPortfolioText;
  
  return (
    <section 
      id="easter-egg" 
      className="easter-egg-section py-12 px-4 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="easter-egg-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 
            id="easter-egg-heading"
            className="text-3xl font-bold text-amazon-dark mb-2"
          >
            {easterEgg.heading}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            {easterEgg.disclaimer}
          </p>
          <div className="inline-block bg-yellow-100 border border-yellow-400 rounded-lg px-4 py-2 text-sm text-yellow-800">
            <span className="font-bold">{easterEgg.alert.title}</span> {easterEgg.alert.message}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fictionalProfiles.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-4">
            {easterEgg.callToAction.text}
          </p>
          <button 
            onClick={openContactSidebar}
            className="px-8 py-3 bg-amazon-orange text-white rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2"
            aria-label="Hire the real developer - open contact sidebar"
          >
            {easterEgg.callToAction.button}
          </button>
        </div>
      </div>
    </section>
  );
};

export default EasterEggSection;
