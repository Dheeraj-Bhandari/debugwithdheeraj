/**
 * CartSidebar Component
 * 
 * Slide-in sidebar displaying shopping cart contents with Amazon styling.
 * Slides in from the right side of the screen when cart icon is clicked.
 * 
 * Features:
 * - Slides from right (400px desktop, full width mobile)
 * - Display cart items with remove buttons
 * - "Proceed to Checkout" button
 * - Backdrop overlay with click-to-close
 * - ESC key to close
 * - Scroll lock when open
 * - Focus trap for accessibility
 * 
 * Requirements: 5.2, 5.3, 5.4, 5.5
 */

import React, { useEffect, useRef } from 'react';
import { useCart } from '../../amazon/contexts/CartContext';

interface CartSidebarProps {
  /** Whether the sidebar is open */
  isOpen: boolean;
  
  /** Callback when sidebar should close */
  onClose: () => void;
  
  /** Callback when user clicks "Proceed to Checkout" */
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { cart, cartCount, removeItem } = useCart();
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
  
  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (cartCount > 0) {
      onCheckout();
    }
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
        aria-labelledby="cart-sidebar-title"
      >
        {/* Header */}
        <div className="bg-amazon-dark text-white p-4 flex items-center justify-between">
          <h2 id="cart-sidebar-title" className="text-xl font-bold">
            Shopping Cart
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-white hover:text-amazon-orange transition-colors p-1"
            aria-label="Close cart"
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
        
        {/* Cart Count */}
        <div className="px-4 py-3 bg-amazon-light border-b">
          <p className="text-sm text-gray-700">
            {cartCount === 0 ? (
              'Your cart is empty'
            ) : (
              <>Items in cart: <span className="font-bold">{cartCount}</span></>
            )}
          </p>
        </div>
        
        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartCount === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-600 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-500">
                Add skills or projects to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {item.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        Type: <span className="capitalize">{item.type}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="mt-3 w-full text-sm text-amazon-orange hover:text-amazon-orange-dark font-medium transition-colors"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer - Action Buttons */}
        <div className="border-t p-4 space-y-3 bg-white">
          {cartCount > 0 && (
            <>
              {/* Proceed to Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-amazon-orange hover:bg-amazon-orange-dark text-amazon-dark font-bold py-3 px-4 rounded transition-colors"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </button>
              
              {/* Continue Shopping Button */}
              <button
                onClick={onClose}
                className="w-full bg-white hover:bg-gray-50 text-amazon-dark font-medium py-2 px-4 rounded border border-gray-300 transition-colors"
                aria-label="Continue shopping"
              >
                Continue Shopping
              </button>
            </>
          )}
          
          {cartCount === 0 && (
            <button
              onClick={onClose}
              className="w-full bg-amazon-orange hover:bg-amazon-orange-dark text-amazon-dark font-bold py-3 px-4 rounded transition-colors"
              aria-label="Start shopping"
            >
              Start Shopping
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
