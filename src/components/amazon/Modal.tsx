/**
 * Modal Component - Base modal with backdrop, close button, focus trap, and scroll lock
 * 
 * Features:
 * - Backdrop click to close
 * - ESC key to close
 * - Focus trap (keeps focus within modal)
 * - Scroll lock on body when open
 * - Accessible with ARIA attributes
 * - Smooth animations
 * 
 * Requirements: 3.7, 4.8
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback when modal should close */
  onClose: () => void;
  
  /** Modal content */
  children: React.ReactNode;
  
  /** Optional title for accessibility */
  title?: string;
  
  /** Optional CSS classes for the modal content */
  className?: string;
  
  /** Whether to show the close button (default: true) */
  showCloseButton?: boolean;
  
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Get focusable elements within a container
 */
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = 
    'a[href], button:not([disabled]), textarea:not([disabled]), ' +
    'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  
  return Array.from(container.querySelectorAll(selector));
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  showCloseButton = true,
  size = 'lg',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'w-full h-full max-w-full',
  };
  
  // Mobile full-width for all sizes except 'sm'
  const mobileClasses = size === 'sm' 
    ? 'w-full mx-4' 
    : 'w-full h-full md:h-auto md:w-auto md:mx-4';
  
  /**
   * Handle ESC key press
   */
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  
  /**
   * Focus trap - handle Tab key navigation
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !modalRef.current) {
      return;
    }
    
    const focusableElements = getFocusableElements(modalRef.current);
    
    if (focusableElements.length === 0) {
      return;
    }
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Shift + Tab on first element -> focus last element
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
    // Tab on last element -> focus first element
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };
  
  /**
   * Set up modal effects when opened
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;
    
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    // Add event listeners
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the modal
    if (modalRef.current) {
      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modalRef.current.focus();
      }
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the element that opened the modal
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleEscapeKey]);
  
  // Don't render if not open
  if (!isOpen) {
    return null;
  }
  
  // Render modal in a portal
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center md:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`
          relative bg-white ${size === 'full' ? '' : 'md:rounded-lg'} shadow-2xl
          ${mobileClasses} ${sizeClasses[size]}
          ${size === 'full' ? 'overflow-y-auto' : 'max-h-[100vh] md:max-h-[90vh] overflow-y-auto'}
          animate-slideUp
          ${className}
        `}
        tabIndex={-1}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            aria-label="Close modal"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        
        {/* Modal Body */}
        <div className="p-4 md:p-6">
          {title && (
            <h2 id="modal-title" className="sr-only">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
