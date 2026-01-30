import React, { useState, useEffect } from 'react';
import awsImg from '../../assets/images/aws.webp';

/**
 * ImageWithFallback Component
 * 
 * Displays an image with automatic fallback to AWS logo if the primary image fails to load.
 * Useful for handling missing assets like the Amazon logo.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

interface ImageWithFallbackProps {
  /** Primary image source */
  src: string;
  
  /** Fallback image source (defaults to AWS logo) */
  fallbackSrc?: string;
  
  /** Alt text for the image */
  alt: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Callback when image loads successfully */
  onLoad?: () => void;
  
  /** Callback when image fails to load */
  onError?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = awsImg,
  alt,
  className = '',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Failed to load image: ${src}, using fallback: ${fallbackSrc}`);
      setImageSrc(fallbackSrc);
      setHasError(true);
      onError?.();
    }
  };

  const handleLoad = () => {
    onLoad?.();
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
