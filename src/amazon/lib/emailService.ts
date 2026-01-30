/**
 * Email Service - EmailJS integration for sending contact form emails
 * 
 * This service handles sending emails when users submit the checkout form.
 * It uses EmailJS to send emails without requiring a backend server.
 * 
 * TWO emails are sent:
 * 1. NOTIFICATION email to YOU (digitaldk.in@gmail.com) with contact details
 * 2. AUTO-REPLY email to CUSTOMER confirming their message was received
 * 
 * Setup Instructions:
 * 1. Create an account at https://www.emailjs.com/
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 
 * 3. Create NOTIFICATION template (for YOU):
 *    Template variables:
 *    - {{from_name}} - Customer's name
 *    - {{from_email}} - Customer's email
 *    - {{reply_to}} - Customer's email (for reply-to)
 *    - {{company}} - Customer's company
 *    - {{role}} - Customer's role
 *    - {{message}} - Customer's message
 *    - {{interested_items}} - List of skills/projects they're interested in
 *    - {{order_date}} - Date of submission
 *    - {{item_count}} - Number of items
 *    Template settings:
 *    - To Email: digitaldk.in@gmail.com (your email)
 *    - Reply To: {{reply_to}}
 * 
 * 4. Create AUTO-REPLY template (for CUSTOMER):
 *    Template variables:
 *    - {{to_name}} - Customer's name
 *    - {{to_email}} - Customer's email
 *    - {{from_name}} - Your name (Dheeraj Kumar)
 *    - {{reply_to}} - Your email (digitaldk.in@gmail.com)
 *    Template settings:
 *    - To Email: {{to_email}}
 *    - From Name: {{from_name}}
 *    - Reply To: {{reply_to}}
 *    Template content:
 *    Hi {{to_name}},
 *    Thanks for reaching out!
 *    This is an automated response to let you know your message has been received successfully...
 * 
 * 5. Set environment variables:
 *    - VITE_EMAILJS_SERVICE_ID
 *    - VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID
 *    - VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID
 *    - VITE_EMAILJS_PUBLIC_KEY
 * 
 * Requirements: 6.4, 6.5, 6.6
 */

import emailjs from '@emailjs/browser';
import type { CheckoutFormData, CartItem } from '../types';

/**
 * EmailJS configuration from environment variables
 */
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  // Support both old and new template ID names for backward compatibility
  notificationTemplateId: import.meta.env.VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '', // Template for YOU
  autoReplyTemplateId: import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || '', // Template for CUSTOMER
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

/**
 * Check if EmailJS is configured
 * For backward compatibility, only notification template is required
 * Auto-reply template is optional
 */
export const isEmailServiceConfigured = (): boolean => {
  return !!(
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.notificationTemplateId &&
    EMAILJS_CONFIG.publicKey
  );
};

/**
 * Initialize EmailJS with public key
 */
if (isEmailServiceConfigured()) {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

/**
 * Format cart items for email
 */
const formatCartItems = (items: CartItem[]): string => {
  if (items.length === 0) {
    return 'No items selected';
  }
  
  return items
    .map((item, index) => {
      return `${index + 1}. ${item.title} (${item.type}) - ${item.category}`;
    })
    .join('\n');
};

/**
 * Email template parameters
 */
interface EmailTemplateParams extends Record<string, unknown> {
  from_name: string;
  from_email: string;
  reply_to: string;
  company: string;
  role: string;
  message: string;
  interested_items: string;
  order_date: string;
  item_count: number;
}

/**
 * Send checkout email via EmailJS
 * Sends TWO emails:
 * 1. Notification email to YOU (digitaldk.in@gmail.com) with contact details
 * 2. Auto-reply email to CUSTOMER confirming their message was received
 * 
 * @param formData - Checkout form data
 * @param cartItems - Items in the cart
 * @returns Promise that resolves when both emails are sent
 * @throws Error if email sending fails
 */
export const sendCheckoutEmail = async (
  formData: CheckoutFormData,
  cartItems: CartItem[]
): Promise<void> => {
  // Check if EmailJS is configured
  if (!isEmailServiceConfigured()) {
    console.warn('EmailJS is not configured. Email will not be sent.');
    console.warn('Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID, VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY environment variables.');
    
    // In development, just log the data instead of throwing
    if (import.meta.env.DEV) {
      console.log('Checkout form data:', formData);
      console.log('Cart items:', cartItems);
      return Promise.resolve();
    }
    
    throw new Error('Email service is not configured');
  }
  
  // Prepare template parameters for NOTIFICATION email (to YOU)
  const notificationParams: EmailTemplateParams = {
    from_name: formData.name,
    from_email: formData.email,
    reply_to: formData.email, // So you can reply directly to the customer
    company: formData.company || 'Not specified',
    role: formData.role || 'Not specified',
    message: formData.message || 'No message provided',
    interested_items: formatCartItems(cartItems),
    order_date: new Date().toLocaleString(),
    item_count: cartItems.length,
  };
  
  // Prepare template parameters for AUTO-REPLY email (to CUSTOMER)
  const autoReplyParams = {
    to_name: formData.name, // Customer's name
    to_email: formData.email, // Customer's email
    from_name: 'Dheeraj Kumar',
    reply_to: 'digitaldk.in@gmail.com', // Your email for customer to reply to
  };
  
  console.log('Sending notification email to you with params:', {
    ...notificationParams,
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.notificationTemplateId,
  });
  
  if (EMAILJS_CONFIG.autoReplyTemplateId) {
    console.log('Sending auto-reply email to customer with params:', {
      ...autoReplyParams,
      serviceId: EMAILJS_CONFIG.serviceId,
      templateId: EMAILJS_CONFIG.autoReplyTemplateId,
    });
  } else {
    console.warn('Auto-reply template not configured. Only notification email will be sent.');
  }
  
  try {
    // Send notification email to YOU (always)
    const notificationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.notificationTemplateId,
      notificationParams
    );
    
    if (notificationResponse.status !== 200) {
      throw new Error(`Notification email failed with status: ${notificationResponse.status}`);
    }
    
    console.log('Notification email sent successfully:', notificationResponse);
    
    // Send auto-reply email to CUSTOMER (only if template is configured)
    if (EMAILJS_CONFIG.autoReplyTemplateId) {
      const autoReplyResponse = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.autoReplyTemplateId,
        autoReplyParams
      );
      
      if (autoReplyResponse.status !== 200) {
        console.warn(`Auto-reply email failed with status: ${autoReplyResponse.status}`);
        // Don't throw error - notification email was sent successfully
      } else {
        console.log('Auto-reply email sent successfully:', autoReplyResponse);
      }
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    
    // Provide more specific error message
    if (error instanceof Error) {
      // Log the full error for debugging
      console.error('Error details:', {
        message: error.message,
        error: error,
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    throw new Error('Failed to send email. Please try again or contact us directly.');
  }
};

/**
 * Test email service configuration
 * Useful for debugging email setup
 */
export const testEmailService = async (): Promise<boolean> => {
  if (!isEmailServiceConfigured()) {
    console.error('EmailJS is not configured');
    return false;
  }
  
  try {
    const testNotificationParams = {
      from_name: 'Test User',
      from_email: 'test@example.com',
      reply_to: 'test@example.com',
      company: 'Test Company',
      role: 'Tester',
      message: 'This is a test email from the Amazon portfolio checkout form.',
      interested_items: 'Test Item 1\nTest Item 2',
      order_date: new Date().toLocaleString(),
      item_count: 2,
    };
    
    const notificationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.notificationTemplateId,
      testNotificationParams
    );
    
    console.log('Test notification email sent successfully:', notificationResponse);
    
    if (EMAILJS_CONFIG.autoReplyTemplateId) {
      const testAutoReplyParams = {
        to_name: 'Test User',
        to_email: 'test@example.com',
        from_name: 'Dheeraj Kumar',
        reply_to: 'digitaldk.in@gmail.com',
      };
      
      const autoReplyResponse = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.autoReplyTemplateId,
        testAutoReplyParams
      );
      
      console.log('Test auto-reply email sent successfully:', autoReplyResponse);
      return notificationResponse.status === 200 && autoReplyResponse.status === 200;
    }
    
    return notificationResponse.status === 200;
  } catch (error) {
    console.error('Test email failed:', error);
    return false;
  }
};


/**
 * Send newsletter subscription notification via EmailJS
 * 
 * Sends an email to YOU (digitaldk.in@gmail.com) when someone subscribes to the newsletter.
 * 
 * This function reuses the existing NOTIFICATION template (used for checkout form) to avoid
 * the EmailJS free tier limitation of 2 templates. It formats the newsletter subscription
 * as a contact form submission.
 * 
 * No additional template or environment variable needed - uses existing:
 * - VITE_EMAILJS_SERVICE_ID
 * - VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID
 * - VITE_EMAILJS_PUBLIC_KEY
 * 
 * @param email - Subscriber's email address
 * @returns Promise that resolves when email is sent
 * @throws Error if EmailJS is not configured or email fails to send
 */
export const sendNewsletterSubscription = async (
  email: string
): Promise<void> => {
  // Check if EmailJS is configured
  if (!isEmailServiceConfigured()) {
    console.warn('EmailJS is not configured. Newsletter subscription email will not be sent.');
    console.warn('Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY environment variables.');
    
    // In development, just log the data instead of throwing
    if (import.meta.env.DEV) {
      console.log('Newsletter subscription (dev mode):', { email });
      return;
    }
    
    throw new Error('Email service is not configured');
  }

  // Prepare email parameters using the same format as checkout notification
  // This reuses your existing notification template
  const templateParams = {
    from_name: 'Newsletter Subscriber',
    from_email: email,
    reply_to: email,
    company: 'N/A',
    role: 'Newsletter Subscriber',
    message: `📧 New newsletter subscription!\n\nSubscriber Email: ${email}\nSubscription Date: ${new Date().toLocaleString()}\n\nThis person wants to receive updates about your projects and tech insights.`,
    interested_items: 'Newsletter Updates',
    order_date: new Date().toLocaleString(),
    item_count: 0,
  };

  console.log('Sending newsletter subscription notification with params:', {
    ...templateParams,
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.notificationTemplateId,
  });

  try {
    // Send notification email to YOU using existing notification template
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.notificationTemplateId, // Reuse notification template
      templateParams
    );

    if (response.status !== 200) {
      throw new Error(`EmailJS returned status ${response.status}`);
    }

    console.log('Newsletter subscription email sent successfully:', response);
  } catch (error) {
    console.error('Failed to send newsletter subscription email:', error);
    throw new Error('Failed to send newsletter subscription notification');
  }
};
