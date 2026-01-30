import React from 'react';
import { contactInfo } from '../../data/portfolioData';
import { createResumeClickHandler } from '../../utils/resumeHandler';

/**
 * AmazonFooter Component
 * 
 * Footer component styled to match Amazon's multi-column footer design.
 * Includes links to sections, social media, and navigation back to main portfolio.
 * 
 * Requirements: 2.6, 10.1, 10.2
 */

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface AmazonFooterProps {
  /** Callback when contact link is clicked */
  onContactClick: () => void;
}

const AmazonFooter: React.FC<AmazonFooterProps> = ({ onContactClick }) => {
  // Define footer columns with links
  const footerColumns: FooterColumn[] = [
    {
      title: 'Get to Know Me',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Experience', href: '#experience' },
        { label: 'Skills', href: '#skills' },
        { label: 'Projects', href: '#projects' },
      ],
    },
    {
      title: 'Projects',
      links: [
        { label: 'All Projects', href: '#projects' },
        { label: 'Featured Work', href: '#featured' },
        { label: 'Open Source', href: contactInfo.github, external: true },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Contact Me', href: '#', onClick: onContactClick },
        { label: 'GitHub', href: contactInfo.github, external: true },
        { label: 'LinkedIn', href: contactInfo.linkedin, external: true },
        { label: 'Twitter', href: contactInfo.twitter, external: true },
        { label: 'YouTube', href: contactInfo.youtube, external: true },
        { label: 'Email', href: `mailto:${contactInfo.email}`, external: true },
      ],
    },
    {
      title: 'Other Portfolios',
      links: [
        { label: 'Terminal Portfolio', href: '/' },
        { label: 'Download Resume', href: contactInfo.amazonResume, external: true },
      ],
    },
  ];

  return (
    <footer 
      className="amazon-footer bg-amazon-dark text-white mt-12 md:mt-16"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-[1500px] mx-auto px-4 py-6 md:py-8">
        {/* Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {footerColumns.map((column, columnIndex) => (
            <div key={columnIndex}>
              <h3 
                className="font-bold mb-3 md:mb-4 text-sm md:text-base"
                id={`footer-column-${columnIndex}`}
              >
                {column.title}
              </h3>
              <ul 
                className="space-y-2 text-xs md:text-sm"
                aria-labelledby={`footer-column-${columnIndex}`}
              >
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="hover:text-amazon-orange transition-colors duration-200 focus:outline-none focus:text-amazon-orange text-left"
                        aria-label={link.label}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="hover:text-amazon-orange transition-colors duration-200 focus:outline-none focus:text-amazon-orange"
                        {...(link.external && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                        {...(link.label === 'Download Resume' && {
                          onClick: createResumeClickHandler(contactInfo.amazonResume),
                        })}
                        aria-label={link.external ? `${link.label} (opens in new tab)` : link.label}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom - Copyright and Disclaimer */}
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="text-center text-xs md:text-sm text-gray-400 space-y-2">
            <p>
              © {new Date().getFullYear()} Dheeraj Kumar. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Not affiliated with Amazon.com, Inc. This is a creative portfolio presentation.
            </p>
          </div>
          
          {/* Back to Top Link */}
          <div className="text-center mt-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-amazon-orange hover:text-amazon-orange-dark transition-colors duration-200 text-sm font-medium focus:outline-none focus:underline"
              aria-label="Back to top"
            >
              ↑ Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AmazonFooter;
