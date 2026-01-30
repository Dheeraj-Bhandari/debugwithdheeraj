/**
 * Resume Handler Utility
 * 
 * Provides consistent resume download/view behavior across the application.
 * On mobile devices, forces download to avoid PDF font rendering issues.
 * On desktop, opens in a new tab for viewing.
 */

/**
 * Detects if the current device is a mobile device
 */
export const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

/**
 * Handles resume viewing/downloading with mobile-specific behavior
 * 
 * @param resumeUrl - URL to the resume PDF
 * @param filename - Optional custom filename for download (defaults to 'Dheeraj_Kumar_Resume.pdf')
 */
export const handleResumeAction = (
  resumeUrl: string,
  filename: string = 'Dheeraj_Kumar_Resume.pdf'
): void => {
  if (isMobileDevice()) {
    // Force download on mobile to avoid font rendering issues
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Open in new tab on desktop
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Creates an onClick handler for resume links
 * Use this for anchor tags that need to handle mobile downloads
 * 
 * @param resumeUrl - URL to the resume PDF
 * @param filename - Optional custom filename for download
 * @returns Event handler function
 */
export const createResumeClickHandler = (
  resumeUrl: string,
  filename: string = 'Dheeraj_Kumar_Resume.pdf'
) => {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobileDevice()) {
      e.preventDefault();
      handleResumeAction(resumeUrl, filename);
    }
    // On desktop, let the default behavior (open in new tab) happen
  };
};
