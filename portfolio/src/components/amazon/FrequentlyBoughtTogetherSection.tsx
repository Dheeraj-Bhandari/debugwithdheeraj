import React from 'react';
import type { SkillBundle } from '../../amazon/types';

/**
 * FrequentlyBoughtTogetherSection Component
 * 
 * Displays skill bundles in Amazon's "Frequently Bought Together" format.
 * Features:
 * - Shows complementary skill combinations
 * - Visual representation with skill icons and plus signs
 * - "Add Bundle to Cart" functionality
 * - Bundle description
 * 
 * Requirements: 3.6
 */

interface FrequentlyBoughtTogetherSectionProps {
  /** Array of skill bundles to display */
  bundles: SkillBundle[];
  
  /** Callback when "Add Bundle to Cart" is clicked */
  onAddBundleToCart: (bundleId: string) => void;
}

/**
 * Individual bundle card component
 */
const BundleCard: React.FC<{
  bundle: SkillBundle;
  onAddToCart: (bundleId: string) => void;
}> = ({ bundle, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(bundle.id);
  };

  return (
    <div className="bundle-card bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Bundle Name */}
      <h3 className="text-xl font-bold text-amazon-dark mb-4">
        {bundle.name}
      </h3>

      {/* Skills Display */}
      <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
        {bundle.skills.map((skill, index) => (
          <React.Fragment key={skill.id}>
            {/* Skill Icon */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center max-w-[80px] truncate">
                {skill.name}
              </span>
            </div>

            {/* Plus Sign (except after last item) */}
            {index < bundle.skills.length - 1 && (
              <div className="text-2xl font-bold text-gray-400" aria-hidden="true">
                +
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bundle Description */}
      <p className="text-sm text-gray-700 mb-6 text-center">
        {bundle.description}
      </p>

      {/* Add Bundle Button */}
      <button
        onClick={handleAddToCart}
        className="w-full py-3 px-6 bg-amazon-orange text-white rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2"
        aria-label={`Add ${bundle.name} to cart`}
      >
        Add Bundle to Cart
      </button>

      {/* Bundle Details */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {bundle.skills.length} skills included
      </div>
    </div>
  );
};

const FrequentlyBoughtTogetherSection: React.FC<FrequentlyBoughtTogetherSectionProps> = ({
  bundles,
  onAddBundleToCart,
}) => {
  // Don't render if no bundles
  if (!bundles || bundles.length === 0) {
    return null;
  }

  return (
    <section 
      id="frequently-bought-together" 
      className="frequently-bought-together-section py-12 px-4 bg-gray-50"
      aria-labelledby="frequently-bought-together-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h2 
            id="frequently-bought-together-heading"
            className="text-3xl font-bold text-amazon-dark mb-2"
          >
            Frequently Bought Together
          </h2>
          <p className="text-lg text-gray-600">
            Complementary skill combinations for complete solutions
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onAddToCart={onAddBundleToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyBoughtTogetherSection;
