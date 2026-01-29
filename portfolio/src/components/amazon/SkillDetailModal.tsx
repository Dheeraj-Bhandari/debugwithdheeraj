/**
 * SkillDetailModal Component
 * 
 * Displays detailed skill information in a modal overlay with Amazon product detail layout.
 * 
 * Features:
 * - Image gallery with skill icon
 * - Detailed description and specifications
 * - Customer reviews section
 * - Related skills recommendations
 * - "Add to Cart" and "Contact Now" action buttons
 * - Responsive design
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.7, 4.8
 */

import React from 'react';
import Modal from './Modal';
import type { Skill, Review } from '../../amazon/types';
import { useCart } from '../../amazon/contexts/CartContext';
import { getSkillDocUrl } from '../../amazon/lib/skillDocsUrls';

interface SkillDetailModalProps {
  /** Skill to display */
  skill: Skill | null;
  
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback when modal should close */
  onClose: () => void;
  
  /** Callback when "Contact Now" is clicked */
  onContactClick?: () => void;
  
  /** Related skills for recommendations */
  relatedSkills?: Skill[];
}

/**
 * Star rating display component
 */
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  rating, 
  size = 'md' 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${sizeClasses[size]} text-amazon-orange fill-current`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      
      {hasHalfStar && (
        <svg
          className={`${sizeClasses[size]} text-amazon-orange`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="half-star-detail">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#DDD" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-star-detail)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-300 fill-current`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};

/**
 * Prime badge component
 */
const PrimeBadge: React.FC = () => (
  <div 
    className="inline-flex items-center gap-1 bg-[#00A8E1] text-white text-sm font-bold px-3 py-1 rounded"
    aria-label="Prime featured skill"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path 
        fillRule="evenodd" 
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
        clipRule="evenodd" 
      />
    </svg>
    <span>prime</span>
  </div>
);

/**
 * Review card component
 */
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Reviewer Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 font-medium text-sm">
            {review.author.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{review.author}</span>
            {review.isVerified && (
              <span className="text-xs text-amazon-orange font-medium">
                Verified Project
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm font-bold">{review.title}</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Reviewed on {new Date(review.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <p className="text-sm text-gray-800">{review.content}</p>
          
          <div className="mt-2 flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-gray-800">
              Helpful ({review.helpful})
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-800">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  isOpen,
  onClose,
  onContactClick,
  relatedSkills = [],
}) => {
  const { addItem, isInCart } = useCart();
  
  if (!skill) {
    return null;
  }
  
  const handleAddToCart = () => {
    addItem({
      id: skill.id,
      type: 'skill',
      title: skill.name,
      category: skill.category,
      image: skill.icon,
    });
  };
  
  const inCart = isInCart(skill.id);
  
  // Check if skill has documentation URL
  const docUrl = getSkillDocUrl(skill.name);
  
  const handleLearnMore = () => {
    if (docUrl) {
      window.open(docUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Calculate average rating
  const averageRating = skill.reviews.length > 0
    ? skill.reviews.reduce((sum, r) => sum + r.rating, 0) / skill.reviews.length
    : skill.proficiencyLevel;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${skill.name} - Skill Details`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>Home</li>
            <li aria-hidden="true">&gt;</li>
            <li>Skills</li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-amazon-dark font-medium">{skill.name}</li>
          </ol>
        </nav>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              {/* Main Image */}
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-amazon-dark mb-2">
                {skill.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-3">
                <StarRating rating={averageRating} size="lg" />
                <span className="text-sm text-amazon-blue">
                  {skill.reviews.length} reviews
                </span>
              </div>
              
              {skill.isPrime && <PrimeBadge />}
            </div>
            
            {/* About This Skill */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-base md:text-lg font-bold mb-3">About this skill</h2>
              <ul className="space-y-2 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-amazon-orange mt-1">•</span>
                  <span>{skill.yearsOfExperience}+ years professional experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amazon-orange mt-1">•</span>
                  <span>Proficiency level: {skill.proficiencyLevel}/5 stars</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amazon-orange mt-1">•</span>
                  <span>{skill.description}</span>
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`
                  flex-1 py-3 px-6 rounded font-medium transition-colors text-sm md:text-base
                  ${inCart 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-amazon-orange text-white hover:bg-amazon-orange-dark'
                  }
                `}
                aria-label={inCart ? 'Already in cart' : `Add ${skill.name} to cart`}
              >
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>
              
              {onContactClick && (
                <button
                  onClick={onContactClick}
                  className="flex-1 py-3 px-6 bg-yellow-400 text-amazon-dark rounded font-medium hover:bg-yellow-500 transition-colors text-sm md:text-base"
                  aria-label="Contact now"
                >
                  Contact Now
                </button>
              )}
            </div>
            
            {/* Learn More Button - Opens official documentation if available */}
            {docUrl && (
              <div className="pt-2">
                <button
                  onClick={handleLearnMore}
                  className="w-full py-3 px-6 bg-white border-2 border-amazon-blue text-amazon-blue rounded font-medium hover:bg-amazon-blue hover:text-white transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                  aria-label={`Learn more about ${skill.name} - Opens official documentation in new tab`}
                >
                  <span>Learn More</span>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Technical Specifications */}
        <div className="border-t border-gray-200 pt-4 lg:pt-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Technical Specifications</h2>
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <table className="w-full text-sm md:text-base">
              <tbody className="divide-y divide-gray-200">
                {skill.specifications.frameworks.length > 0 && (
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-700 w-1/3">
                      Frameworks
                    </td>
                    <td className="py-3 text-gray-900">
                      {skill.specifications.frameworks.join(', ')}
                    </td>
                  </tr>
                )}
                
                {skill.specifications.tools.length > 0 && (
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-700 w-1/3">
                      Tools
                    </td>
                    <td className="py-3 text-gray-900">
                      {skill.specifications.tools.join(', ')}
                    </td>
                  </tr>
                )}
                
                {skill.specifications.certifications.length > 0 && (
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-700 w-1/3">
                      Certifications
                    </td>
                    <td className="py-3 text-gray-900">
                      {skill.specifications.certifications.join(', ')}
                    </td>
                  </tr>
                )}
                
                <tr>
                  <td className="py-3 pr-4 font-medium text-gray-700 w-1/3">
                    Experience Level
                  </td>
                  <td className="py-3 text-gray-900">
                    {skill.yearsOfExperience}+ years
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 pr-4 font-medium text-gray-700 w-1/3">
                    Category
                  </td>
                  <td className="py-3 text-gray-900 capitalize">
                    {skill.category.replace('-', ' ')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Customer Reviews */}
        {skill.reviews.length > 0 && (
          <div className="border-t border-gray-200 pt-4 lg:pt-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">Customer Reviews</h2>
            
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amazon-dark">
                    {averageRating.toFixed(1)}
                  </div>
                  <StarRating rating={averageRating} size="md" />
                  <div className="text-sm text-gray-600 mt-1">
                    {skill.reviews.length} reviews
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review List */}
            <div className="space-y-4">
              {skill.reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
        
        {/* Related Skills */}
        {relatedSkills.length > 0 && (
          <div className="border-t border-gray-200 pt-4 lg:pt-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">Related Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedSkills.slice(0, 4).map((relatedSkill) => (
                <div
                  key={relatedSkill.id}
                  className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={relatedSkill.icon}
                    alt={relatedSkill.name}
                    className="w-full aspect-square object-cover rounded mb-2"
                  />
                  <h3 className="text-xs md:text-sm font-medium line-clamp-2">
                    {relatedSkill.name}
                  </h3>
                  <div className="mt-1">
                    <StarRating rating={relatedSkill.proficiencyLevel} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SkillDetailModal;
