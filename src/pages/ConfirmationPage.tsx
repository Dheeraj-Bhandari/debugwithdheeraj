/**
 * ConfirmationPage Component
 * 
 * Amazon-styled order confirmation page shown after successful checkout.
 * Displays order summary with selected items and delivery information.
 * 
 * Features:
 * - Amazon order confirmation styling
 * - "Estimated Delivery: Immediate" easter egg
 * - Order summary with selected items
 * - Success message and next steps
 * 
 * Requirements: 6.5, 13.5
 */

import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { CheckoutFormData, CartItem } from '../amazon/types';

interface LocationState {
  orderData: CheckoutFormData;
  items: CartItem[];
}

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  
  // Redirect to home if no order data
  React.useEffect(() => {
    if (!state || !state.orderData) {
      navigate('/amazon');
    }
  }, [state, navigate]);
  
  if (!state || !state.orderData) {
    return null;
  }
  
  const { orderData, items } = state;
  const orderNumber = `AMZ-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-amazon-dark text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            to="/amazon"
            className="text-amazon-orange hover:text-amazon-orange-dark transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Success Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
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
              </div>
            </div>
            
            {/* Success Message */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Thank you for your order!
              </h1>
              <p className="text-gray-700 mb-1">
                Your inquiry has been received and I will get back to you shortly.
              </p>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to{' '}
                <span className="font-medium">{orderData.email}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b">
            Order Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Order Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                Order Information
              </h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Order Number:</dt>
                  <dd className="font-medium text-gray-900">{orderNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Order Date:</dt>
                  <dd className="font-medium text-gray-900">{orderDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Items:</dt>
                  <dd className="font-medium text-gray-900">{items.length}</dd>
                </div>
              </dl>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                Contact Information
              </h3>
              <dl className="space-y-1 text-sm">
                <div>
                  <dt className="text-gray-600">Name:</dt>
                  <dd className="font-medium text-gray-900">{orderData.name}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Email:</dt>
                  <dd className="font-medium text-gray-900">{orderData.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Company:</dt>
                  <dd className="font-medium text-gray-900">{orderData.company}</dd>
                </div>
                {orderData.role && (
                  <div>
                    <dt className="text-gray-600">Role:</dt>
                    <dd className="font-medium text-gray-900">{orderData.role}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Delivery Info - Easter Egg */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-green-900 mb-1">
                  Estimated Delivery: Immediate
                </h3>
                <p className="text-sm text-green-800">
                  I will get back to you soon!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Items Ordered */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b">
            Items in Your Order
          </h2>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    Type: <span className="capitalize">{item.type}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Your Message */}
        {orderData.message && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b">
              Your Message
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap break-words">
              {orderData.message}
            </p>
          </div>
        )}
        
        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3">
            What happens next?
          </h2>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">1.</span>
              <span>I will review your inquiry and the skills/projects you're interested in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">2.</span>
              <span>You'll receive a personalized response within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">3.</span>
              <span>We'll schedule a call to discuss your project in detail</span>
            </li>
          </ol>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/amazon"
            className="flex-1 bg-amazon-orange hover:bg-amazon-orange-dark text-amazon-dark font-bold py-3 px-6 rounded text-center transition-colors"
          >
            Continue Browsing Portfolio
          </Link>
          <a
            href="mailto:dheeraj@example.com"
            className="flex-1 bg-white hover:bg-gray-50 text-amazon-dark font-bold py-3 px-6 rounded text-center border border-gray-300 transition-colors"
          >
            Contact Directly
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
