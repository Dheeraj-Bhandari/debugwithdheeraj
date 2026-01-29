import React from 'react';
import type { Review } from '../../amazon/types';

/**
 * CustomerReviewsSection Component
 * 
 * Displays testimonials and reviews in Amazon's review format.
 * Features:
 * - Aggregate rating with star distribution histogram
 * - Individual review cards
 * - Verified badge for verified reviews
 * - Helpful count
 * - Amazon review styling
 * 
 * Requirements: 9.1, 9.2, 9.4
 */

interface CustomerReviewsSectionProps {
  /** Array of reviews to display */
  reviews: Review[];
  
  /** Overall aggregate rating (calculated from reviews) */
  aggregateRating?: number;
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
    lg: 'w-6 h-6',
  };

  const starClass = sizeClasses[size];

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${starClass} text-amazon-orange fill-current`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className={`${starClass} text-amazon-orange`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="half-star-gradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#DDD" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-star-gradient)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${starClass} text-gray-300 fill-current`}
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
 * Star distribution histogram component
 */
const StarDistribution: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  // Calculate distribution
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="space-y-2">
      {distribution.map(({ stars, percentage }) => (
        <div key={stars} className="flex items-center gap-3">
          <button className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline">
            {stars} star
          </button>
          <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amazon-orange transition-all duration-300"
              style={{ width: `${percentage}%` }}
              aria-label={`${percentage.toFixed(0)}% of reviews are ${stars} stars`}
            />
          </div>
          <span className="text-sm text-gray-600 w-12 text-right">
            {percentage.toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Individual review card component
 */
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  // Handle both Date objects and serialized date strings
  const reviewDate = typeof review.date === 'string' ? new Date(review.date) : review.date;
  
  const formattedDate = reviewDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="review-card border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      {/* Reviewer Info */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-10 h-10 bg-amazon-dark text-white rounded-full flex items-center justify-center font-bold">
          {review.author.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-bold text-amazon-dark">
            {review.author}
          </div>
          {review.authorRole && (
            <div className="text-sm text-gray-600">
              {review.authorRole}
            </div>
          )}
        </div>
      </div>

      {/* Rating and Verified Badge */}
      <div className="flex items-center gap-3 mb-2">
        <StarRating rating={review.rating} size="sm" />
        {review.isVerified && (
          <span className="text-xs text-amazon-orange font-bold">
            ✓ Verified Project
          </span>
        )}
      </div>

      {/* Review Title */}
      <h3 className="font-bold text-amazon-dark mb-2">
        {review.title}
      </h3>

      {/* Review Content */}
      <p className="text-gray-700 leading-relaxed mb-3">
        {review.content}
      </p>

      {/* Review Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>{formattedDate}</span>
        <button className="text-amazon-blue hover:text-amazon-orange hover:underline">
          Helpful ({review.helpful})
        </button>
      </div>
    </article>
  );
};

const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  aggregateRating,
}) => {
  // Calculate aggregate rating if not provided
  const calculatedRating = aggregateRating || 
    (reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0);

  // Sort reviews by helpful count (descending)
  const sortedReviews = [...reviews].sort((a, b) => b.helpful - a.helpful);

  return (
    <section 
      id="customer-reviews" 
      className="customer-reviews-section py-12 px-4"
      aria-labelledby="customer-reviews-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
          {/* Section Header */}
          <h2 
            id="customer-reviews-heading"
            className="text-2xl font-bold text-amazon-dark mb-6"
          >
            Customer Reviews
          </h2>

          {/* Aggregate Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
            {/* Overall Rating */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-bold text-amazon-dark">
                  {calculatedRating.toFixed(1)}
                </div>
                <div>
                  <StarRating rating={calculatedRating} size="lg" />
                  <div className="text-sm text-gray-600 mt-1">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                Based on verified projects and client testimonials
              </p>
            </div>

            {/* Star Distribution */}
            <div>
              <h3 className="font-bold text-amazon-dark mb-4">
                Rating Distribution
              </h3>
              <StarDistribution reviews={reviews} />
            </div>
          </div>

          {/* Top Reviews */}
          <div>
            <h3 className="font-bold text-amazon-dark mb-6 text-lg">
              Top Reviews
            </h3>
            <div>
              {sortedReviews.slice(0, 5).map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* See All Reviews Link */}
            {reviews.length > 5 && (
              <div className="text-center pt-4">
                <button className="text-amazon-blue hover:text-amazon-orange hover:underline font-medium">
                  See all {reviews.length} reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
