import React from 'react';
import LazyImage from '../LazyImage';
import { useCart } from '../../amazon/contexts/CartContext';

/**
 * ProductCard Component
 * 
 * Displays a skill or project as an Amazon-style product card.
 * Features:
 * - Product image with hover effects and lazy loading
 * - Star rating display
 * - Prime badge for featured items
 * - "Learn More" and "Add to Cart" action buttons
 * - Responsive design with Amazon styling
 * 
 * Requirements: 3.3, 8.1, 10.6
 */

interface ProductCardProps {
  /** Unique identifier for the product */
  id: string;
  
  /** Product title (skill name or project name) */
  title: string;
  
  /** Type of product */
  category: 'skill' | 'project';
  
  /** Star rating (1-5) */
  rating: number;
  
  /** Number of reviews */
  reviewCount: number;
  
  /** Display text for price area (e.g., "5+ years" or "10K+ users") */
  price?: string;
  
  /** URL to product image */
  image: string;
  
  /** Whether this is a Prime/featured item */
  isPrime?: boolean;
  
  /** URL for "Learn More" button (official docs or company page) */
  learnMoreUrl?: string;
  
  /** Callback when "Add to Cart" is clicked */
  onAddToCart: (id: string) => void;
  
  /** Callback when card or "Learn More" is clicked */
  onClick: (id: string) => void;
}

/**
 * Renders star rating display
 */
const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ 
  rating, 
  reviewCount 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-amazon-orange fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <svg
          className="w-4 h-4 text-amazon-orange"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#DDD" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-star)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      
      <span className="text-sm text-amazon-blue ml-1">
        ({reviewCount})
      </span>
    </div>
  );
};

/**
 * Prime badge component
 */
const PrimeBadge: React.FC = () => (
  <div 
    className="inline-flex items-center gap-1 bg-[#00A8E1] text-white text-xs font-bold px-2 py-0.5 rounded"
    aria-label="Prime featured item"
  >
    <svg 
      className="w-3 h-3" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path 
        fillRule="evenodd" 
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
        clipRule="evenodd" 
      />
    </svg>
    <span>prime</span>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  category,
  rating,
  reviewCount,
  price,
  image,
  isPrime = false,
  learnMoreUrl,
  onAddToCart,
  onClick,
}) => {
  const { isInCart } = useCart();
  const itemInCart = isInCart(id);
  
  const handleCardClick = () => {
    onClick(id);
  };

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (learnMoreUrl) {
      // Open external link in new tab
      window.open(learnMoreUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to modal
      onClick(id);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  return (
    <article
      className="product-card bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer amazon-smooth hover:shadow-lg focus-within:ring-2 focus-within:ring-amazon-orange"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${title} - ${category}`}
    >
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <LazyImage
          src={image}
          alt={title}
          className="w-full h-full object-contain"
          width="100%"
          height={192}
        />
        {isPrime && (
          <div className="absolute top-2 right-2">
            <PrimeBadge />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        {/* Rating */}
        <StarRating rating={rating} reviewCount={reviewCount} />

        {/* Title */}
        <h3 className="text-base font-medium text-amazon-dark line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        {/* Price/Experience */}
        {price && (
          <p className="text-sm text-gray-600">
            {price}
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* Learn More Button */}
          <button
            onClick={handleLearnMoreClick}
            className="w-full py-3 px-4 bg-white border-2 border-amazon-orange text-amazon-orange rounded hover:bg-amazon-orange hover:text-white transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2 min-h-[44px] touch-manipulation"
            aria-label={`Learn more about ${title}`}
          >
            Learn More
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCartClick}
            className={`w-full py-3 px-4 rounded transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2 min-h-[44px] touch-manipulation ${
              itemInCart
                ? 'bg-gray-200 text-gray-700 cursor-default'
                : 'bg-amazon-orange text-white hover:bg-amazon-orange-dark'
            }`}
            aria-label={itemInCart ? `${title} is in cart` : `Add ${title} to cart`}
            disabled={itemInCart}
          >
            <span>{itemInCart ? 'Added to Cart' : 'Add to Cart'}</span>
            {itemInCart ? (
              <svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            ) : (
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
