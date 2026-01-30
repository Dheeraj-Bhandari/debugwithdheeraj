import React, { useState } from 'react';
import { amazonPortfolioText } from '../../data/portfolioData';

interface AmazonHeaderProps {
  cartItemCount?: number;
  onSearchSubmit?: (query: string) => void;
  onCartClick?: () => void;
}

const AmazonHeader: React.FC<AmazonHeaderProps> = ({
  cartItemCount = 0,
  onSearchSubmit,
  onCartClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setIsSearchExpanded(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const { header } = amazonPortfolioText;

  return (
    <header 
      className="amazon-header bg-amazon-dark sticky top-0 z-50"
      role="banner"
    >
      {/* Main Header Row */}
      <div className="h-[60px] flex items-center px-2 sm:px-4">
        <div className="max-w-[1500px] mx-auto w-full flex items-center gap-2 sm:gap-4">
          {/* Logo */}
          <div 
            className="amazon-logo text-white text-lg sm:text-2xl font-bold hover:text-amazon-orange transition-colors cursor-pointer flex-shrink-0"
            title={header.logoTitle}
            role="link"
            tabIndex={0}
            onClick={() => window.location.href = '/amazon'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = '/amazon';
              }
            }}
            aria-label={header.logoAriaLabel}
          >
            <span className="hidden sm:inline">{header.logoFull}</span>
            <span className="sm:hidden">{header.logoShort}</span>
          </div>
          
          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1"
            role="search"
          >
            <div className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search skills, projects..."
                className="flex-1 px-4 py-2 text-gray-900 rounded-l border-2 border-transparent focus:border-amazon-orange focus:outline-none transition-colors"
                aria-label="Search skills and projects"
              />
              <button 
                type="submit"
                className="bg-amazon-orange hover:bg-amazon-orange-dark px-4 py-2 rounded-r transition-colors"
                aria-label="Submit search"
              >
                <svg 
                  className="w-5 h-5 text-amazon-dark" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            </div>
          </form>
          
          {/* Search Icon - Mobile */}
          <button
            onClick={toggleSearch}
            className="md:hidden text-white hover:text-amazon-orange transition-colors p-2"
            aria-label="Toggle search"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>
          
          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden" />
          
          {/* Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-4 text-white flex-shrink-0">
            {/* Account Section - Hidden on mobile */}
            <div 
              className="hidden lg:block hover:text-amazon-orange transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Account menu"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Account menu functionality to be implemented
                }
              }}
            >
              <div className="text-xs">{header.accountGreeting}</div>
              <div className="text-sm font-bold">{header.accountLabel}</div>
            </div>
            
            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className="relative hover:text-amazon-orange transition-colors p-1"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg 
                className="w-7 h-7 sm:w-8 sm:h-8" 
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
              {cartItemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-amazon-orange text-amazon-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`${cartItemCount} items in cart`}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar - Expandable */}
      {isSearchExpanded && (
        <div className="md:hidden px-2 pb-3 animate-slideDown">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search skills, projects..."
              className="flex-1 px-4 py-2 text-gray-900 rounded-l border-2 border-transparent focus:border-amazon-orange focus:outline-none transition-colors"
              aria-label="Search skills and projects"
              autoFocus
            />
            <button 
              type="submit"
              className="bg-amazon-orange hover:bg-amazon-orange-dark px-4 py-2 rounded-r transition-colors"
              aria-label="Submit search"
            >
              <svg 
                className="w-5 h-5 text-amazon-dark" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default AmazonHeader;
