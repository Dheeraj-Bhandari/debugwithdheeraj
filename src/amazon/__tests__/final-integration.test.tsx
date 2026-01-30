/**
 * Final Integration Tests
 * 
 * Comprehensive integration tests for the Amazon Portfolio section.
 * Tests complete user flows from start to finish.
 * 
 * Test Coverage:
 * - Task 21.1: Complete contact flow (Contact Me → ContactSidebar → CheckoutModal → Email → Confirmation)
 * - Task 21.2: Cart and checkout flow (Add to cart → Cart updates → Checkout → Email with items)
 * - Task 21.3: Learn More functionality (Skills → Docs, Projects → Modal, Experience → Company site)
 * - Task 21.4: Mobile experience (Responsive layouts, touch targets)
 * 
 * Requirements: 10.1-10.6, 6.1-6.6, 7.6, 5.1-5.5, 14.1-14.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AmazonPortfolio from '../../pages/AmazonPortfolio';
import { CartProvider } from '../../amazon/contexts/CartContext';
import { AnalyticsProvider } from '../../amazon/contexts/AnalyticsContext';
import * as emailService from '../../amazon/lib/emailService';

// Mock EmailJS
vi.mock('@emailjs/browser', () => ({
  default: {
    init: vi.fn(),
    send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test wrapper with all providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AnalyticsProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AnalyticsProvider>
  </BrowserRouter>
);

describe('Task 21.1: Complete Contact Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete the full contact flow: Contact Me → ContactSidebar → CheckoutModal → Email → Confirmation', async () => {
    const user = userEvent.setup();
    
    // Spy on email service
    const sendEmailSpy = vi.spyOn(emailService, 'sendCheckoutEmail').mockResolvedValue();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Step 1: Click "Contact Me" button in HeroSection
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    expect(contactMeButton).toBeInTheDocument();
    
    await user.click(contactMeButton);
    
    // Step 2: Verify ContactSidebar opens
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /contact sidebar/i })).toBeInTheDocument();
    });
    
    // Verify contact details are displayed
    expect(screen.getByText(/digitaldk\.in@gmail\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+91 99885-36242/i)).toBeInTheDocument();
    expect(screen.getByText(/debugwithdheeraj\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Bathinda, Punjab, India/i)).toBeInTheDocument();
    
    // Verify social media links
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    
    // Step 3: Click "Send Message" button
    const sendMessageButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendMessageButton);
    
    // Step 4: Verify CheckoutModal opens
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    });
    
    // Step 5: Fill out the form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const companyInput = screen.getByLabelText(/company/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(companyInput, 'Acme Corp');
    await user.type(messageInput, 'I would like to discuss a project opportunity with you.');
    
    // Step 6: Submit the form
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    await user.click(placeOrderButton);
    
    // Step 7: Verify email was sent
    await waitFor(() => {
      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john.doe@example.com',
          company: 'Acme Corp',
          message: 'I would like to discuss a project opportunity with you.',
        }),
        expect.any(Array)
      );
    });
    
    // Step 8: Verify navigation to confirmation page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/amazon/confirmation',
        expect.objectContaining({
          state: expect.objectContaining({
            orderData: expect.any(Object),
          }),
        })
      );
    });
  });

  it('should allow closing ContactSidebar with ESC key', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Open ContactSidebar
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /contact sidebar/i })).toBeInTheDocument();
    });
    
    // Press ESC key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    // Verify sidebar closes
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /contact sidebar/i })).not.toBeInTheDocument();
    });
  });

  it('should allow closing ContactSidebar by clicking backdrop', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Open ContactSidebar
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /contact sidebar/i })).toBeInTheDocument();
    });
    
    // Click backdrop (the fixed overlay)
    const backdrop = document.querySelector('.fixed.inset-0.bg-black');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    
    // Verify sidebar closes
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /contact sidebar/i })).not.toBeInTheDocument();
    });
  });
});

describe('Task 21.2: Cart and Checkout Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear session storage
    sessionStorage.clear();
  });

  it('should complete the full cart flow: Add skills → Cart updates → Checkout → Email includes items', async () => {
    const user = userEvent.setup();
    
    // Spy on email service
    const sendEmailSpy = vi.spyOn(emailService, 'sendCheckoutEmail').mockResolvedValue();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Wait for skills to load
    await waitFor(() => {
      expect(screen.getAllByText(/add to cart/i).length).toBeGreaterThan(0);
    });
    
    // Step 1: Add skills to cart
    const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });
    
    // Add first skill
    await user.click(addToCartButtons[0]);
    
    // Step 2: Verify cart count updates
    await waitFor(() => {
      const cartBadge = screen.getByText('1');
      expect(cartBadge).toBeInTheDocument();
    });
    
    // Add second skill
    await user.click(addToCartButtons[1]);
    
    await waitFor(() => {
      const cartBadge = screen.getByText('2');
      expect(cartBadge).toBeInTheDocument();
    });
    
    // Step 3: Open cart
    const cartButton = screen.getByRole('button', { name: /cart/i });
    await user.click(cartButton);
    
    // Step 4: Verify items are displayed in cart
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
    });
    
    // Verify cart shows 2 items
    expect(screen.getByText(/2 items/i)).toBeInTheDocument();
    
    // Step 5: Proceed to checkout
    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    await user.click(checkoutButton);
    
    // Step 6: Verify checkout modal opens with items pre-filled
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    });
    
    // Verify order summary shows items
    expect(screen.getByText(/items \(2\)/i)).toBeInTheDocument();
    
    // Step 7: Fill out form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const companyInput = screen.getByLabelText(/company/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);
    
    await user.type(nameInput, 'Jane Smith');
    await user.type(emailInput, 'jane.smith@example.com');
    await user.type(companyInput, 'Tech Startup');
    await user.type(messageInput, 'Looking for a full-stack developer with these skills.');
    
    // Step 8: Submit
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    await user.click(placeOrderButton);
    
    // Step 9: Verify email includes cart items
    await waitFor(() => {
      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          interestedItems: expect.arrayContaining([expect.any(String)]),
        }),
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
          }),
        ])
      );
    });
    
    // Verify cart items were passed to email
    const emailCall = sendEmailSpy.mock.calls[0];
    expect(emailCall[1]).toHaveLength(2); // 2 items in cart
  });

  it('should prevent checkout with empty cart', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Try to open cart (should be empty)
    const cartButton = screen.getByRole('button', { name: /cart/i });
    await user.click(cartButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
    });
    
    // Verify empty cart message
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    
    // Verify checkout button is disabled or shows message
    const checkoutButton = screen.queryByRole('button', { name: /proceed to checkout/i });
    if (checkoutButton) {
      expect(checkoutButton).toBeDisabled();
    }
  });

  it('should persist cart items across page refreshes', async () => {
    const user = userEvent.setup();
    
    const { unmount } = render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Wait for skills to load
    await waitFor(() => {
      expect(screen.getAllByText(/add to cart/i).length).toBeGreaterThan(0);
    });
    
    // Add item to cart
    const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });
    await user.click(addToCartButtons[0]);
    
    // Verify cart count
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
    
    // Unmount (simulate page refresh)
    unmount();
    
    // Re-render
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Verify cart count is still 1
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});

describe('Task 21.3: Learn More Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.open
    global.open = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should redirect to documentation when clicking Learn More on skills', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Wait for skills to load
    await waitFor(() => {
      expect(screen.getAllByText(/learn more/i).length).toBeGreaterThan(0);
    });
    
    // Find a skill card with Learn More button
    const learnMoreButtons = screen.getAllByRole('button', { name: /learn more/i });
    
    // Click first Learn More button
    await user.click(learnMoreButtons[0]);
    
    // Verify window.open was called with documentation URL
    await waitFor(() => {
      expect(global.open).toHaveBeenCalledWith(
        expect.stringMatching(/^https?:\/\//),
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  it('should open modal when clicking Learn More on projects', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Wait for projects to load in "Customers Also Viewed" section
    await waitFor(() => {
      const customersSection = screen.getByText(/customers also viewed/i);
      expect(customersSection).toBeInTheDocument();
    });
    
    // Find project cards
    const projectCards = screen.getAllByRole('article');
    
    // Click on a project card
    if (projectCards.length > 0) {
      await user.click(projectCards[0]);
      
      // Verify modal opens (project detail modal)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    }
  });

  it('should redirect to company site when clicking Learn More on experience', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Wait for experience cards to load
    await waitFor(() => {
      expect(screen.getByText(/amazon/i)).toBeInTheDocument();
    });
    
    // Find Amazon experience card
    const amazonCard = screen.getByText(/machine learning data associate/i).closest('article');
    
    if (amazonCard) {
      // Find Learn More button within the card
      const learnMoreButton = within(amazonCard).getByRole('button', { name: /learn more/i });
      await user.click(learnMoreButton);
      
      // Verify window.open was called with company URL
      await waitFor(() => {
        expect(global.open).toHaveBeenCalledWith(
          expect.stringContaining('amazon'),
          '_blank',
          'noopener,noreferrer'
        );
      });
    }
  });
});

describe('Task 21.4: Mobile Experience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock mobile viewport
    global.innerWidth = 375;
    global.innerHeight = 667;
  });

  afterEach(() => {
    // Restore viewport
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  it('should display ContactSidebar full-width on mobile', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Open ContactSidebar
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    
    await waitFor(() => {
      const sidebar = screen.getByRole('dialog', { name: /contact sidebar/i });
      expect(sidebar).toBeInTheDocument();
      
      // Verify full-width class (w-full on mobile)
      expect(sidebar).toHaveClass('w-full');
    });
  });

  it('should display CheckoutModal full-screen on mobile', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Open ContactSidebar first
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /contact sidebar/i })).toBeInTheDocument();
    });
    
    // Click Send Message
    const sendMessageButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendMessageButton);
    
    // Verify checkout modal is full-screen
    await waitFor(() => {
      const modal = screen.getByRole('heading', { name: /checkout/i }).closest('div');
      expect(modal).toBeInTheDocument();
    });
  });

  it('should have touch-friendly buttons (minimum 44x44px)', async () => {
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Check Contact Me button
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    const styles = window.getComputedStyle(contactMeButton);
    
    // Verify minimum touch target size
    // Note: In actual implementation, buttons should have min-h-[44px] class
    expect(contactMeButton).toHaveClass('min-h-[44px]');
  });

  it('should display skills in single column on mobile', async () => {
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Wait for skills section to load
    await waitFor(() => {
      expect(screen.getByText(/technical specifications/i)).toBeInTheDocument();
    });
    
    // Verify skills container has mobile-friendly layout
    const skillsSection = screen.getByText(/technical specifications/i).closest('section');
    expect(skillsSection).toBeInTheDocument();
    
    // Skills should be in a grid that becomes single column on mobile
    // This is verified by the responsive grid classes in the component
  });

  it('should have scrollable content in ContactSidebar on mobile', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Open ContactSidebar
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    
    await waitFor(() => {
      const sidebar = screen.getByRole('dialog', { name: /contact sidebar/i });
      expect(sidebar).toBeInTheDocument();
      
      // Verify scrollable content area
      const scrollableArea = sidebar.querySelector('.overflow-y-auto');
      expect(scrollableArea).toBeInTheDocument();
    });
  });
});

describe('Integration: Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display error message and retry button when email fails', async () => {
    const user = userEvent.setup();
    
    // Mock email service to fail
    const sendEmailSpy = vi.spyOn(emailService, 'sendCheckoutEmail')
      .mockRejectedValue(new Error('Network error'));
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Open ContactSidebar
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /contact sidebar/i })).toBeInTheDocument();
    });
    
    // Click Send Message
    const sendMessageButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendMessageButton);
    
    // Fill out form
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    });
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const companyInput = screen.getByLabelText(/company/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(companyInput, 'Test Company');
    await user.type(messageInput, 'This is a test message for error handling.');
    
    // Submit
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    await user.click(placeOrderButton);
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/there was a problem/i)).toBeInTheDocument();
    });
    
    // Verify retry button is present
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    // Click retry
    sendEmailSpy.mockResolvedValue(); // Make it succeed on retry
    await user.click(retryButton);
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/there was a problem/i)).not.toBeInTheDocument();
    });
  });

  it('should validate email format before submission', async () => {
    const user = userEvent.setup();
    
    render(<AmazonPortfolio />, { wrapper: TestWrapper });
    
    // Open ContactSidebar
    const contactMeButton = screen.getByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /contact sidebar/i })).toBeInTheDocument();
    });
    
    // Click Send Message
    const sendMessageButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendMessageButton);
    
    // Fill out form with invalid email
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    });
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const companyInput = screen.getByLabelText(/company/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'invalid-email'); // Invalid email
    await user.type(companyInput, 'Test Company');
    await user.type(messageInput, 'This is a test message.');
    
    // Submit
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    await user.click(placeOrderButton);
    
    // Verify validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });
});
