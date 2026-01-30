/**
 * CheckoutModal Component
 * 
 * Contact form styled as Amazon checkout with order summary sidebar.
 * Opens when user clicks "Proceed to Checkout" from cart.
 * 
 * Features:
 * - Form fields: name, email, company, role, message
 * - Order summary sidebar with cart items
 * - Zod validation with error messages
 * - Amazon checkout styling
 * - Success/failure state handling with retry
 * - Email integration
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Modal from './Modal';
import { useCart } from '../../amazon/contexts/CartContext';
import { sendCheckoutEmail } from '../../amazon/lib/emailService';
import { contactInfo } from '../../data/portfolioData';
import type { CheckoutFormData } from '../../amazon/types';

interface CheckoutModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Zod validation schema for checkout form
 * Only name and email are required
 * Requirements: 7.4
 */
const checkoutFormSchema = z.object({
  name: z.string()
    .min(1, 'Please enter your name')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),
  
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  
  role: z.string()
    .max(100, 'Role must be less than 100 characters')
    .optional(),
  
  message: z.string()
    .max(2000, 'Message must be less than 2000 characters')
    .optional(),
});

/**
 * Form validation errors
 */
interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  message?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { cart, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<Partial<CheckoutFormData>>({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
  });
  
  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen]);
  
  /**
   * Handle input change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  /**
   * Handle form submission
   * Requirements: 7.3, 7.4, 7.5, 7.6, 7.7, 7.8
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form using Zod
    try {
      checkoutFormSchema.parse({
        name: formData.name?.trim(),
        email: formData.email?.trim(),
        company: formData.company?.trim(),
        role: formData.role?.trim(),
        message: formData.message?.trim(),
      });
      
      // Clear any previous errors
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          validationErrors[field] = err.message;
        });
        setErrors(validationErrors);
        return;
      }
    }
    
    // Prepare checkout data (only name and email are required)
    const checkoutData: CheckoutFormData = {
      name: formData.name!.trim(),
      email: formData.email!.trim(),
      company: formData.company?.trim() || '',
      role: formData.role?.trim(),
      message: formData.message?.trim() || '',
      interestedItems: cart.items.map(item => item.id),
    };
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Send email via EmailJS
      await sendCheckoutEmail(checkoutData, cart.items);
      
      // Clear cart on success
      clearCart();
      
      // Close modal
      onClose();
      
      // Navigate to confirmation page
      navigate('/amazon/confirmation', {
        state: {
          orderData: checkoutData,
          items: cart.items,
        },
      });
    } catch (error) {
      console.error('Failed to submit checkout form:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : `We encountered an error processing your request. Please try again or contact us directly at ${contactInfo.email}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle retry after error
   * Requirements: 15.3, 15.4
   */
  const handleRetry = () => {
    setSubmitError(null);
    // Form data is preserved, user can click submit again
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Checkout"
      size="xl"
      className="checkout-modal"
    >
      <div className="checkout-container">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-amazon-dark mb-2">
            Checkout
          </h2>
          <p className="text-sm text-gray-600">
            Complete your order to connect with Me
          </p>
        </div>
        
        {/* Error Alert with Retry */}
        {submitError && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  There was a problem with your submission
                </h3>
                <p className="text-sm text-red-700 mb-3">{submitError}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 min-h-[44px] touch-manipulation"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate>
              {/* Contact Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-amazon-dark mb-4 pb-2 border-b">
                  1. Contact Information
                </h3>
                
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`
                        w-full px-3 py-3 border rounded text-base text-gray-900
                        focus:outline-none focus:ring-2 focus:ring-amazon-orange
                        touch-manipulation
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}
                      `}
                      placeholder="John Doe"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full px-3 py-3 border rounded text-base text-gray-900
                        focus:outline-none focus:ring-2 focus:ring-amazon-orange
                        touch-manipulation
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      `}
                      placeholder="john.doe@company.com"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  {/* Company (Optional) */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Company <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-amazon-orange touch-manipulation"
                      placeholder="Your company or organization"
                    />
                  </div>
                  
                  {/* Your Role (Optional) */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Your Role <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-amazon-orange touch-manipulation"
                      placeholder="Recruiter, Hiring Manager, CTO, etc."
                    />
                  </div>
                </div>
              </div>
              
              {/* Message Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-amazon-dark mb-4 pb-2 border-b">
                  2. Your Message
                </h3>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-gray-700"
                    >
                      Message <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {formData.message?.length || 0} / 2000
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={2000}
                    rows={6}
                    className="w-full px-3 py-3 border border-gray-300 rounded text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-amazon-orange resize-vertical touch-manipulation"
                    placeholder="Tell me about your opportunity, project requirements, or how I can help your team..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Submit Button - Desktop (hidden on mobile, shown in sidebar) */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  disabled={isSubmitting || cartCount === 0}
                  className={`
                    w-full py-3 px-6 rounded font-bold text-amazon-dark
                    transition-colors min-h-[44px] touch-manipulation
                    ${
                      isSubmitting || cartCount === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-amazon-orange hover:bg-amazon-orange-dark'
                    }
                  `}
                  aria-label="Place order"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-4">
              <h3 className="text-lg font-bold text-amazon-dark mb-4">
                Order Summary
              </h3>
              
              {/* Items Count */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-700">
                  Items ({cartCount}):
                </p>
              </div>
              
              {/* Cart Items */}
              <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-2 text-sm">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {item.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Delivery Info */}
              <div className="pt-4 border-t">
                <div className="flex items-start gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Delivery: Immediate
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      I will get back to you soon!
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Submit Button - Mobile */}
              <div className="lg:hidden mt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || cartCount === 0}
                  className={`
                    w-full py-3 px-6 rounded font-bold text-amazon-dark
                    transition-colors min-h-[44px] touch-manipulation
                    ${
                      isSubmitting || cartCount === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-amazon-orange hover:bg-amazon-orange-dark'
                    }
                  `}
                  aria-label="Place order"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
