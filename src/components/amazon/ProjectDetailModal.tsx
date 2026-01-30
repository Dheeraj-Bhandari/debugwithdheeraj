/**
 * ProjectDetailModal Component
 * 
 * Displays detailed project information in a modal overlay with Amazon product detail layout.
 * 
 * Features:
 * - Screenshot carousel with navigation
 * - Tech stack badges
 * - GitHub and live demo links
 * - Project metrics displayed as verified reviews
 * - Related projects recommendations
 * - "Add to Cart" and "View Live" action buttons
 * - Responsive design
 * 
 * Requirements: 4.5, 4.6, 9.5
 */

import React, { useState } from 'react';
import Modal from './Modal';
import type { Project, Review } from '../../amazon/types';
import { useCart } from '../../amazon/contexts/CartContext';

interface ProjectDetailModalProps {
  /** Project to display */
  project: Project | null;
  
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback when modal should close */
  onClose: () => void;
  
  /** Related projects for recommendations */
  relatedProjects?: Project[];
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
            <linearGradient id="half-star-project">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#DDD" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-star-project)"
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
    aria-label="Prime featured project"
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

/**
 * Metrics as verified review component
 */
const MetricsReview: React.FC<{ 
  metric: string; 
  value: string | number; 
  icon: string;
}> = ({ metric, value, icon }) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amazon-orange bg-opacity-10 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">Project Metrics</span>
            <span className="text-xs text-amazon-orange font-medium">
              Verified Data
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={5} size="sm" />
            <span className="text-sm font-bold">{metric}</span>
          </div>
          
          <p className="text-sm text-gray-800 font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  relatedProjects = [],
}) => {
  const { addItem, isInCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (!project) {
    return null;
  }
  
  const handleAddToCart = () => {
    addItem({
      id: project.id,
      type: 'project',
      title: project.name,
      category: project.techStack.slice(0, 3).join(', '),
      image: project.images[0] || '',
    });
  };
  
  const inCart = isInCart(project.id);
  
  const handlePrevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setSelectedImage((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${project.name} - Project Details`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>Home</li>
            <li aria-hidden="true">&gt;</li>
            <li>Projects</li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-amazon-dark font-medium">{project.name}</li>
          </ol>
        </nav>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Carousel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Main Image */}
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {project.images.length > 0 ? (
                  <>
                    <img
                      src={project.images[selectedImage]}
                      alt={`${project.name} screenshot ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {project.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                          aria-label="Previous image"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                          aria-label="Next image"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No images available
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {project.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`
                        aspect-video rounded overflow-hidden border-2 transition-all
                        ${selectedImage === index 
                          ? 'border-amazon-orange' 
                          : 'border-gray-200 hover:border-gray-400'
                        }
                      `}
                      aria-label={`View screenshot ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${project.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-2xl font-bold text-amazon-dark mb-2">
                {project.name}
              </h1>
              
              <p className="text-gray-600 mb-3">{project.tagline}</p>
              
              <div className="flex items-center gap-3 mb-3">
                <StarRating rating={project.rating} size="lg" />
                <span className="text-sm text-amazon-blue">
                  {project.reviews.length} reviews
                </span>
              </div>
              
              {project.isPrime && <PrimeBadge />}
            </div>
            
            {/* Tech Stack */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-bold mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-bold mb-3">About this project</h2>
              <p className="text-gray-800 leading-relaxed">{project.description}</p>
            </div>
            
            {/* Links */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-bold mb-3">Project Links</h2>
              <div className="flex flex-wrap gap-3">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>View on GitHub</span>
                  </a>
                )}
                
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amazon-orange text-white rounded hover:bg-amazon-orange-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View Live Demo</span>
                  </a>
                )}
                
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Watch Demo</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`
                  flex-1 py-3 px-6 rounded font-medium transition-colors
                  ${inCart 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-amazon-orange text-white hover:bg-amazon-orange-dark'
                  }
                `}
                aria-label={inCart ? 'Already in cart' : `Add ${project.name} to cart`}
              >
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Project Metrics as Verified Reviews */}
        {(project.metrics.users || project.metrics.performance || project.metrics.impact) && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Project Metrics</h2>
            <div className="space-y-4">
              {project.metrics.users && (
                <MetricsReview
                  metric="User Base"
                  value={`${project.metrics.users.toLocaleString()}+ active users`}
                  icon="👥"
                />
              )}
              
              {project.metrics.performance && (
                <MetricsReview
                  metric="Performance Improvement"
                  value={project.metrics.performance}
                  icon="⚡"
                />
              )}
              
              {project.metrics.impact && (
                <MetricsReview
                  metric="Business Impact"
                  value={project.metrics.impact}
                  icon="📈"
                />
              )}
            </div>
          </div>
        )}
        
        {/* Customer Reviews */}
        {project.reviews.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amazon-dark">
                    {project.rating.toFixed(1)}
                  </div>
                  <StarRating rating={project.rating} size="md" />
                  <div className="text-sm text-gray-600 mt-1">
                    {project.reviews.length} reviews
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review List */}
            <div className="space-y-4">
              {project.reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
        
        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Related Projects</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProjects.slice(0, 4).map((relatedProject) => (
                <div
                  key={relatedProject.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={relatedProject.images[0] || ''}
                    alt={relatedProject.name}
                    className="w-full aspect-video object-cover rounded mb-2"
                  />
                  <h3 className="text-sm font-medium line-clamp-2">
                    {relatedProject.name}
                  </h3>
                  <div className="mt-1">
                    <StarRating rating={relatedProject.rating} size="sm" />
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

export default ProjectDetailModal;
