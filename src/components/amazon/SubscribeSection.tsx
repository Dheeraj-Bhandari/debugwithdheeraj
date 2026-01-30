import React, { useState } from 'react';

/**
 * SubscribeSection Component
 * 
 * Newsletter signup styled as Amazon's "Subscribe & Save" feature.
 * Features:
 * - Email input with validation
 * - Amazon Subscribe & Save styling
 * - Success/error states
 * - Engaging copy
 * 
 * Requirements: 13.4
 */

interface SubscribeSectionProps {
  /** Optional callback when user subscribes */
  onSubscribe?: (email: string) => Promise<void>;
}

const SubscribeSection: React.FC<SubscribeSectionProps> = ({
  onSubscribe,
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Default behavior: simulate subscription
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Newsletter subscription:', email);
      }
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section 
      id="subscribe" 
      className="subscribe-section py-16 px-4 bg-gray-50"
      aria-labelledby="subscribe-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-amazon-orange to-[#FF9933] rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Text Content */}
            <div className="p-8 md:p-12 text-white">
              {/* Subscribe & Save Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm mb-6">
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>Subscribe & Save</span>
              </div>

              <h2 
                id="subscribe-heading"
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
              >
                Get Updates on New Projects
              </h2>
              <p className="text-lg mb-8 text-white leading-relaxed">
                Subscribe to receive updates on new projects, tech insights, and occasional dad jokes about programming. No spam, just quality content delivered to your inbox.
              </p>
              
              {/* Benefits List */}
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Monthly project updates</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Tech tips and insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Unsubscribe anytime</span>
                </li>
              </ul>
            </div>

            {/* Right: Subscription Form */}
            <div className="bg-white p-8 md:p-12 flex items-center">
              {status === 'success' ? (
                // Success State
                <div className="w-full text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-amazon-dark mb-2">
                    You're Subscribed!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thanks for subscribing! Check your inbox for a confirmation email.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-amazon-orange hover:text-amazon-orange-dark font-medium transition-colors"
                  >
                    Subscribe another email
                  </button>
                </div>
              ) : (
                // Form State
                <form onSubmit={handleSubmit} className="w-full">
                  <label htmlFor="subscribe-email" className="block text-amazon-dark font-bold text-lg mb-3">
                    Email Address
                  </label>
                  <input
                    id="subscribe-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatus('idle');
                      setErrorMessage('');
                    }}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-4 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange transition-colors ${
                      status === 'error' 
                        ? 'border-red-500' 
                        : 'border-gray-300 focus:border-amazon-orange'
                    }`}
                    disabled={status === 'loading'}
                    aria-invalid={status === 'error'}
                    aria-describedby={status === 'error' ? 'subscribe-error' : undefined}
                  />
                  
                  {/* Error Message */}
                  {status === 'error' && errorMessage && (
                    <p id="subscribe-error" className="mt-2 text-red-600 text-sm font-medium">
                      {errorMessage}
                    </p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full mt-4 px-6 py-4 bg-amazon-orange text-white text-lg rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2 shadow-lg hover:shadow-xl"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  
                  {/* Privacy Note */}
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
