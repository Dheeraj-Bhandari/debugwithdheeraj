import React from 'react';

/**
 * ProductDetailsSection Component
 * 
 * Displays developer information in Amazon's product description style.
 * Features:
 * - "About This Developer" heading
 * - Bullet points with key highlights
 * - Amazon product detail styling
 * - Responsive layout
 * 
 * Requirements: 4.2
 */

interface Highlight {
  /** Highlight text */
  text: string;
  
  /** Optional icon name (for future enhancement) */
  icon?: string;
}

interface ProductDetailsSectionProps {
  /** Array of key highlights about the developer */
  highlights: Highlight[] | string[];
  
  /** Optional detailed description */
  description?: string;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  highlights,
  description,
}) => {
  // Normalize highlights to array of objects
  const normalizedHighlights: Highlight[] = highlights.map(h => 
    typeof h === 'string' ? { text: h } : h
  );

  return (
    <section 
      id="product-details" 
      className="product-details-section py-12 px-4"
      aria-labelledby="product-details-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
          {/* Section Header */}
          <h2 
            id="product-details-heading"
            className="text-2xl font-bold text-amazon-dark mb-6 pb-4 border-b border-gray-200"
          >
            About This Developer
          </h2>

          {/* Optional Description */}
          {description && (
            <p className="text-gray-700 mb-6 leading-relaxed">
              {description}
            </p>
          )}

          {/* Highlights List */}
          <ul className="space-y-3" role="list">
            {normalizedHighlights.map((highlight, index) => (
              <li 
                key={index}
                className="flex items-start gap-3 text-gray-700"
              >
                {/* Bullet Point */}
                <span 
                  className="text-amazon-orange font-bold text-xl flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  •
                </span>
                
                {/* Highlight Text */}
                <span className="flex-1 leading-relaxed">
                  {highlight.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Additional Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-amazon-orange mb-2">
                  5+
                </div>
                <div className="text-sm text-gray-600">
                  Years Experience
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amazon-orange mb-2">
                  20+
                </div>
                <div className="text-sm text-gray-600">
                  Projects Delivered
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amazon-orange mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600">
                  Client Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsSection;
