import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AmazonHeader from '../components/amazon/AmazonHeader';
import AmazonNavBar from '../components/amazon/AmazonNavBar';
import AmazonFooter from '../components/amazon/AmazonFooter';
import CartSidebar from '../components/amazon/CartSidebar';
import CheckoutModal from '../components/amazon/CheckoutModal';
import SearchOverlay from '../components/amazon/SearchOverlay';
import ContactSidebar from '../components/amazon/ContactSidebar';
import { useCart } from '../amazon/contexts/CartContext';
import { useAnalytics, usePageViewTracking } from '../amazon/contexts/AnalyticsContext';
import { ContactProvider } from '../amazon/contexts/ContactContext';
import { portfolioDataMapper } from '../amazon/lib/AmazonPortfolioDataMapper';
import { contactInfo } from '../data/portfolioData';
import type { Skill, Project } from '../amazon/types';

interface AmazonLayoutProps {
  children: React.ReactNode;
}

const AmazonLayout: React.FC<AmazonLayoutProps> = ({ children }) => {
  const { cartCount, addItem } = useCart();
  const { 
    trackModalOpen, 
    trackModalClose, 
    trackAddToCart, 
    trackCheckoutStart,
    // trackSearch 
  } = useAnalytics();
  
  // Track page view for Amazon section
  usePageViewTracking('/amazon', 'Amazon Portfolio - Dheeraj Kumar');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load portfolio data for search
  useEffect(() => {
    portfolioDataMapper.loadPortfolioData();
    setSkills(portfolioDataMapper.getSkills());
    setProjects(portfolioDataMapper.getProjects());
  }, []);

  // Listen for custom event to open contact sidebar
  useEffect(() => {
    const handleOpenContact = () => {
      setIsContactOpen(true);
      trackModalOpen('contact');
    };

    window.addEventListener('openContactSidebar', handleOpenContact);

    return () => {
      window.removeEventListener('openContactSidebar', handleOpenContact);
    };
  }, [trackModalOpen]);

  // Listen for custom events to add items to cart
  useEffect(() => {
    const handleAddToCartEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; type: 'skill' | 'project' }>;
      const { id, type } = customEvent.detail;
      
      // Find the item and add to cart
      if (type === 'skill') {
        const skill = skills.find(s => s.id === id);
        if (skill) {
          addItem({
            id: skill.id,
            type: 'skill',
            title: skill.name,
            category: skill.category,
            image: skill.icon,
          });
          
          // Track add to cart event
          trackAddToCart(skill.id, 'skill', skill.name);
        }
      } else {
        const project = projects.find(p => p.id === id);
        if (project) {
          addItem({
            id: project.id,
            type: 'project',
            title: project.name,
            category: project.techStack[0] || 'project',
            image: project.images[0],
          });
          
          // Track add to cart event
          trackAddToCart(project.id, 'project', project.name);
        }
      }
    };

    const handleAddBundleToCartEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ bundleId: string }>;
      const { bundleId } = customEvent.detail;
      
      // Find the bundle and add all skills to cart
      const bundle = portfolioDataMapper.getSkillBundles().find(b => b.id === bundleId);
      if (bundle) {
        bundle.skills.forEach(skill => {
          addItem({
            id: skill.id,
            type: 'skill',
            title: skill.name,
            category: skill.category,
            image: skill.icon,
          });
        });
        
        // Track bundle add to cart
        trackAddToCart(bundleId, 'project', bundle.name);
      }
    };

    window.addEventListener('addToCart', handleAddToCartEvent);
    window.addEventListener('addBundleToCart', handleAddBundleToCartEvent);

    return () => {
      window.removeEventListener('addToCart', handleAddToCartEvent);
      window.removeEventListener('addBundleToCart', handleAddBundleToCartEvent);
    };
  }, [skills, projects, addItem, trackAddToCart]);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
    
    // Track search modal open
    trackModalOpen('search', query);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    // Track search modal close
    trackModalClose('search');
  };

  const handleSearchItemClick = (id: string, type: 'skill' | 'project') => {
    console.log('Search item clicked:', id, type);
    // Modal functionality to be implemented in later tasks
    // For now, just close the search overlay
    setIsSearchOpen(false);
  };

  const handleSearchAddToCart = (id: string, type: 'skill' | 'project') => {
    // Find the item and add to cart
    if (type === 'skill') {
      const skill = skills.find(s => s.id === id);
      if (skill) {
        addItem({
          id: skill.id,
          type: 'skill',
          title: skill.name,
          category: skill.category,
          image: skill.icon,
        });
        
        // Track add to cart event
        trackAddToCart(skill.id, 'skill', skill.name);
      }
    } else {
      const project = projects.find(p => p.id === id);
      if (project) {
        addItem({
          id: project.id,
          type: 'project',
          title: project.name,
          category: project.techStack[0] || 'project',
          image: project.images[0],
        });
        
        // Track add to cart event
        trackAddToCart(project.id, 'project', project.name);
      }
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
    
    // Track cart modal open
    trackModalOpen('cart');
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
    
    // Track cart modal close
    trackModalClose('cart');
  };

  const handleCheckout = () => {
    // Validate cart is not empty before proceeding to checkout
    if (cartCount === 0) {
      // Display error message with link to skills section
      toast.error(
        (t) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm">Add some skills or projects first!</p>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Scroll to technical specifications (skills) section
                const skillsSection = document.getElementById('technical-specifications');
                if (skillsSection) {
                  skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="mt-2 px-3 py-1.5 bg-amazon-orange hover:bg-amazon-orange-dark text-amazon-dark font-medium rounded text-sm transition-colors"
            >
              Browse Skills
            </button>
          </div>
        ),
        {
          duration: 5000,
          position: 'top-center',
          style: {
            minWidth: '300px',
          },
        }
      );
      return;
    }
    
    // Close cart sidebar and open checkout modal
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    
    // Track checkout start
    trackCheckoutStart(cartCount);
    trackModalClose('cart');
    trackModalOpen('checkout');
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
    
    // Track checkout modal close
    trackModalClose('checkout');
  };

  const handleContactClick = () => {
    setIsContactOpen(true);
    
    // Track contact sidebar open
    trackModalOpen('contact');
  };

  const handleContactClose = () => {
    setIsContactOpen(false);
    
    // Track contact sidebar close
    trackModalClose('contact');
  };

  const handleSendMessage = () => {
    // Validate cart is not empty before proceeding to checkout
    if (cartCount === 0) {
      // Display error message with link to skills section
      toast.error(
        (t) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm">Add some skills or projects first!</p>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Scroll to technical specifications (skills) section
                const skillsSection = document.getElementById('technical-specifications');
                if (skillsSection) {
                  skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="mt-2 px-3 py-1.5 bg-amazon-orange hover:bg-amazon-orange-dark text-amazon-dark font-medium rounded text-sm transition-colors"
            >
              Browse Skills
            </button>
          </div>
        ),
        {
          duration: 5000,
          position: 'top-center',
          style: {
            minWidth: '300px',
          },
        }
      );
      return;
    }
    
    // Close contact sidebar and open checkout modal
    setIsContactOpen(false);
    setIsCheckoutOpen(true);
    
    // Track transition from contact to checkout
    trackModalClose('contact');
    trackModalOpen('checkout');
  };

  return (
    <div className="amazon-layout min-h-screen bg-white font-amazon amazon-scrollbar amazon-smooth">
      {/* Amazon Header */}
      <AmazonHeader 
        cartItemCount={cartCount}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={handleCartClick}
      />

      {/* Amazon Navigation Bar */}
      <AmazonNavBar />

      {/* Main Content - Wrapped with ContactProvider */}
      <main className="amazon-content max-w-[1500px] mx-auto">
        <ContactProvider onContactClick={handleContactClick}>
          {children}
        </ContactProvider>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        initialQuery={searchQuery}
        skills={skills}
        projects={projects}
        onItemClick={handleSearchItemClick}
        onAddToCart={handleSearchAddToCart}
      />

      {/* Contact Sidebar */}
      <ContactSidebar
        isOpen={isContactOpen}
        onClose={handleContactClose}
        contactInfo={{
          email: contactInfo.email,
          phone: contactInfo.phone,
          website: contactInfo.website,
          location: contactInfo.location,
          social: {
            github: contactInfo.github,
            linkedin: contactInfo.linkedin,
            twitter: contactInfo.twitter,
          },
        }}
        onSendMessage={handleSendMessage}
        resumeUrl={contactInfo.amazonResume}
      />

      {/* Amazon Footer */}
      <AmazonFooter onContactClick={handleContactClick} />
    </div>
  );
};

export default AmazonLayout;
