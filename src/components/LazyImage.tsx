/**
 * LazyImage Component
 * 
 * Provides lazy loading for images with WebP format support and fallbacks.
 * Implements Intersection Observer API for efficient lazy loading.
 * 
 * Requirements: 10.6
 */

import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  /** Image source (will be converted to WebP if available) */
  src: string;
  
  /** Alt text for accessibility */
  alt: string;
  
  /** Optional CSS classes */
  className?: string;
  
  /** Optional width */
  width?: number | string;
  
  /** Optional height */
  height?: number | string;
  
  /** Placeholder color while loading */
  placeholderColor?: string;
  
  /** Callback when image loads */
  onLoad?: () => void;
  
  /** Callback when image fails to load */
  onError?: () => void;
}

/**
 * Converts image path to WebP format
 * Example: image.png -> image.webp
 */
function getWebPPath(src: string): string {
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return src;
  
  return src.substring(0, lastDot) + '.webp';
}

/**
 * LazyImage component with WebP support and lazy loading
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderColor = '#f3f4f6',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Stop observing once in view
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    // Start observing
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Get WebP path for modern browsers
  const webpSrc = getWebPPath(src);

  return (
    <picture ref={imgRef as any} className={className}>
      {/* WebP source for modern browsers */}
      {isInView && !hasError && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      
      {/* Fallback image */}
      <img
        src={isInView ? src : ''}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{
          backgroundColor: isLoaded ? 'transparent' : placeholderColor,
          minHeight: height ? `${height}px` : '200px',
        }}
      />
    </picture>
  );
};

export default LazyImage;
