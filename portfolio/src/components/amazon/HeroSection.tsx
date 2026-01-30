import React from 'react';
import { handleResumeAction } from '../../utils/resumeHandler';

/**
 * HeroSection Component
 * 
 * Eye-catching banner at the top of the Amazon portfolio page.
 * Features:
 * - Profile image with Prime badge
 * - Name and title (simplified branding)
 * - Enhanced professional highlights including AI expertise
 * - "Contact Me" button (opens ContactSidebar)
 * - "View Resume" button (opens PDF in new tab)
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.7, 4.1, 4.2, 4.3, 4.4
 */

interface HeroSectionProps {
  /** Developer's full name */
  name: string;
  
  /** Professional title */
  title: string;
  
  /** Tagline or availability message */
  tagline: string;
  
  /** URL to profile image */
  profileImage: string;
  
  /** Callback when "Contact Me" button is clicked */
  onContactClick: () => void;
  
  /** URL to resume PDF */
  resumeUrl?: string;
}

/**
 * Prime badge component indicating featured/available status
 */
const PrimeBadge: React.FC<{ text: string }> = ({ text }) => (
  <div 
    className="inline-flex items-center gap-2 bg-[#00A8E1] text-white px-6 py-3 rounded font-bold shadow-md"
    aria-label="Prime developer status"
  >
    <svg 
      className="w-5 h-5" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path 
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
      />
    </svg>
    <span>{text}</span>
  </div>
);

const HeroSection: React.FC<HeroSectionProps> = ({
  name,
  title,
  tagline,
  profileImage,
  onContactClick,
  resumeUrl = '/resume.pdf',
}) => {
  const handleResumeClick = () => {
    handleResumeAction(resumeUrl);
  };

  return (
    <section 
      className="hero-section py-8 md:py-16 px-4 bg-gradient-to-b from-white to-gray-50"
      aria-label="Hero section"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={profileImage}
                alt={`${name} profile`}
                className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-amazon-orange shadow-xl"
              />
              {/* Prime badge overlay */}
              <div className="absolute -bottom-3 md:-bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#00A8E1] text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-md">
                  prime
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Name and Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amazon-dark mb-2">
              {name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-4 md:mb-6">
              {title}
            </p>

            {/* Prime Badge */}
            <div className="mb-6 md:mb-8 flex justify-center md:justify-start">
              <PrimeBadge text={tagline} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              {/* Contact Me Button */}
              <button
                onClick={onContactClick}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-amazon-orange text-white rounded-lg font-bold text-base md:text-lg hover:bg-amazon-orange-dark transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2"
                aria-label="Contact me"
              >
                Contact Me
              </button>

              {/* View Resume Button */}
              <button
                onClick={handleResumeClick}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-amazon-orange border-2 border-amazon-orange rounded-lg font-bold text-base md:text-lg hover:bg-amazon-orange hover:text-white transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2"
                aria-label="View resume"
              >
                View Resume
              </button>
            </div>

            {/* Enhanced Professional Highlights */}
            <div className="mt-4 md:mt-6 text-xs sm:text-sm text-gray-500 space-y-1">
              <p>✓ Available for immediate hire</p>
              <p>✓ Open to remote and on-site opportunities</p>
              <p>✓ Expert in AI-driven development - building smarter, not harder</p>
              <p>✓ Proven ability to debug AI-generated code without AI assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
