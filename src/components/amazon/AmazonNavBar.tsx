import React, { useState } from 'react';

interface NavCategory {
  id: string;
  label: string;
  sectionId: string; // ID of the section to scroll to
}

interface AmazonNavBarProps {
  categories?: NavCategory[];
}

const defaultCategories: NavCategory[] = [
  { id: 'all', label: 'All', sectionId: 'hero' },
  { id: 'skills', label: 'Skills', sectionId: 'todays-deals' },
  { id: 'projects', label: 'Projects', sectionId: 'customers-also-viewed' },
  { id: 'experience', label: 'Experience', sectionId: 'product-details' },
  { id: 'contact', label: 'Contact', sectionId: 'subscribe' },
];

const AmazonNavBar: React.FC<AmazonNavBarProps> = ({ 
  categories = defaultCategories 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(sectionId);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav 
        className="amazon-navbar bg-amazon-blue sticky top-[60px] z-40"
        role="navigation"
        aria-label="Category navigation"
      >
        {/* Desktop Navigation */}
        <div className="hidden md:block h-[39px]">
          <div className="max-w-[1500px] mx-auto px-4 h-full">
            <ul className="flex items-center gap-6 text-white text-sm h-full">
              {/* Hamburger Menu Icon */}
              <li>
                <button
                  className="flex items-center gap-1 hover:text-amazon-orange transition-colors focus:outline-none focus:text-amazon-orange"
                  aria-label="All categories menu"
                  onClick={() => handleCategoryClick('hero')}
                >
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
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                  <span className="font-medium">All</span>
                </button>
              </li>

              {/* Category Links */}
              {categories.slice(1).map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.sectionId)}
                    onKeyDown={(e) => handleKeyDown(e, category.sectionId)}
                    className="relative hover:text-amazon-orange transition-colors focus:outline-none focus:text-amazon-orange group"
                    aria-label={`Navigate to ${category.label} section`}
                  >
                    {category.label}
                    {/* Orange hover underline */}
                    <span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-amazon-orange transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Navigation - Hamburger Button */}
        <div className="md:hidden h-[39px] flex items-center px-4">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center gap-2 text-white hover:text-amazon-orange transition-colors focus:outline-none focus:text-amazon-orange"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
            <span className="font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden bg-amazon-blue border-t border-amazon-dark sticky top-[99px] z-30 animate-slideDown"
          role="menu"
        >
          <ul className="py-2">
            {categories.map((category) => (
              <li key={category.id} role="none">
                <button
                  onClick={() => handleCategoryClick(category.sectionId)}
                  onKeyDown={(e) => handleKeyDown(e, category.sectionId)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-amazon-dark hover:text-amazon-orange transition-colors focus:outline-none focus:bg-amazon-dark focus:text-amazon-orange"
                  role="menuitem"
                  aria-label={`Navigate to ${category.label} section`}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AmazonNavBar;
