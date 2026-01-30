/**
 * ContactContext
 * 
 * Provides contact sidebar functionality throughout the Amazon portfolio.
 * Allows any component to trigger the contact sidebar without prop drilling.
 * 
 * Requirements: 10.1, 10.2, 10.3
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface ContactContextType {
  /** Function to open the contact sidebar */
  openContactSidebar: () => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
  onContactClick: () => void;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ 
  children, 
  onContactClick 
}) => {
  return (
    <ContactContext.Provider value={{ openContactSidebar: onContactClick }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};
