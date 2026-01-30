/**
 * ContactSidebar Component
 * 
 * Slide-in sidebar displaying contact details and social media links.
 * Slides in from the right side of the screen when "Contact Me" is clicked.
 * 
 * Features:
 * - Display email, phone, website, location
 * - Display social media links (GitHub, LinkedIn, Twitter)
 * - Copy buttons for email and phone
 * - "Send Message" button (opens checkout modal)
 * - "Download Resume" button
 * - Slide-in animation from right
 * - Backdrop click to close
 * - ESC key to close
 * - Scroll lock when open
 * - Focus trap for accessibility
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import React, { useEffect, useRef } from 'react';
import { handleResumeAction } from '../../utils/resumeHandler';

interface ContactInfo {
  email: string;
  phone: string;
  website: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

interface ContactSidebarProps {
  /** Whether the sidebar is open */
  isOpen: boolean;
  
  /** Callback when sidebar should close */
  onClose: () => void;
  
  /** Contact information to display */
  contactInfo: ContactInfo;
  
  /** Callback when "Send Message" button is clicked */
  onSendMessage: () => void;
  
  /** URL to resume PDF */
  resumeUrl: string;
}

const ContactSidebar: React.FC<ContactSidebarProps> = ({
  isOpen,
  onClose,
  contactInfo,
  onSendMessage,
  resumeUrl,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Focus trap - keep focus within sidebar when open
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      // Focus the close button when sidebar opens
      closeButtonRef.current?.focus();
      
      const sidebar = sidebarRef.current;
      const focusableElements = sidebar.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };
      
      sidebar.addEventListener('keydown', handleTabKey);
      
      return () => {
        sidebar.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle download resume
  const handleDownloadResume = () => {
    handleResumeAction(resumeUrl);
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 amazon-smooth animate-fadeIn"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full bg-white z-50 shadow-2xl w-full md:w-[400px] flex flex-col amazon-sidebar-enter amazon-scrollbar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-sidebar-title"
      >
        {/* Header */}
        <div className="bg-amazon-dark text-white p-4 flex items-center justify-between">
          <h2 id="contact-sidebar-title" className="text-xl font-bold">
            Contact Me
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-white hover:text-amazon-orange transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close contact sidebar"
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
        </div>
        
        {/* Contact Details - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Email */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-amazon-orange"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <h3 className="text-sm font-bold text-gray-700">Email</h3>
              </div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-sm text-amazon-orange hover:text-amazon-orange-dark font-medium transition-colors block break-all"
                aria-label="Send email"
              >
                {contactInfo.email}
              </a>
            </div>
            
            {/* Phone */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-amazon-orange"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <h3 className="text-sm font-bold text-gray-700">Phone</h3>
              </div>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-sm text-amazon-orange hover:text-amazon-orange-dark font-medium transition-colors block"
                aria-label="Call phone number"
              >
                {contactInfo.phone}
              </a>
            </div>
            
            {/* Website */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-amazon-orange"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-700">Website</h3>
              </div>
              <a
                href={`https://${contactInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amazon-orange hover:text-amazon-orange-dark font-medium transition-colors block break-all"
                aria-label="Visit website"
              >
                {contactInfo.website}
              </a>
            </div>
            
            {/* Location */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-amazon-orange"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-700">Location</h3>
              </div>
              <p className="text-sm text-gray-900">
                {contactInfo.location}
              </p>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-amazon-dark mb-4">
                Connect on Social Media
              </h3>
              
              <div className="space-y-4">
                {/* GitHub */}
                <a
                  href={contactInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:border-amazon-orange hover:bg-amazon-light transition-colors min-h-[44px]"
                  aria-label="Visit GitHub profile"
                >
                  <svg
                    className="w-6 h-6 text-gray-700 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">GitHub</p>
                    <p className="text-xs text-gray-600 truncate">
                      {contactInfo.social.github.replace('https://github.com/', '')}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a
                  href={contactInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:border-amazon-orange hover:bg-amazon-light transition-colors min-h-[44px]"
                  aria-label="Visit LinkedIn profile"
                >
                  <svg
                    className="w-6 h-6 text-[#0077B5] flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">LinkedIn</p>
                    <p className="text-xs text-gray-600 truncate">
                      {contactInfo.social.linkedin.replace('https://linkedin.com/in/', '')}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                
                {/* Twitter */}
                <a
                  href={contactInfo.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:border-amazon-orange hover:bg-amazon-light transition-colors min-h-[44px]"
                  aria-label="Visit Twitter profile"
                >
                  <svg
                    className="w-6 h-6 text-[#1DA1F2] flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">Twitter</p>
                    <p className="text-xs text-gray-600 truncate">
                      {contactInfo.social.twitter.replace('https://twitter.com/', '@')}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer - Action Buttons */}
        <div className="border-t p-4 space-y-3 bg-white">
          {/* Send Message Button */}
          <button
            onClick={onSendMessage}
            className="w-full bg-amazon-orange hover:bg-amazon-orange-dark text-amazon-dark font-bold py-3 px-4 rounded transition-colors min-h-[44px] touch-manipulation"
            aria-label="Send message"
          >
            Send Message
          </button>
          
          {/* Download Resume Button */}
          <button
            onClick={handleDownloadResume}
            className="w-full bg-white hover:bg-gray-50 text-amazon-dark font-medium py-3 px-4 rounded border border-gray-300 transition-colors min-h-[44px] touch-manipulation"
            aria-label="Download resume"
          >
            Download Resume
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactSidebar;
