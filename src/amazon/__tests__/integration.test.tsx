/**
 * Integration Tests for Amazon-Themed Portfolio
 * 
 * Task 21.1: Test complete user flow
 * - Browse skills → Open detail modal → Add to cart → Checkout → Confirmation
 * - Search → View results → Open detail → Add to cart
 * 
 * Requirements: All
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AmazonPortfolio from '../../pages/AmazonPortfolio';
import { CartProvider } from '../contexts/CartContext';
import { AnalyticsProvider } from '../contexts/AnalyticsContext';

// Mock EmailJS
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  },
}));

// Test wrapper with all required providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AnalyticsProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AnalyticsProvider>
    </BrowserRouter>
  );
}

describe('Amazon Portfolio Integration Tests', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    
    // Clear any mocks
    vi.clearAllMocks();
  });

  describe('User Flow 1: Browse → Detail Modal → Add to Cart → Checkout → Confirmation', () => {
    it('should complete the full user journey from browsing to checkout', async () => {
      const user = userEvent.setup();
      
      // Render the Amazon portfolio page
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Step 1: Verify page loads with hero section
      await waitFor(() => {
        expect(screen.getByText(/Dheeraj Kumar/i)).toBeInTheDocument();
      });

      // Step 2: Browse skills - verify Today's Deals section is visible
      const todaysDealsSection = await screen.findByText(/Today's Deals/i);
      expect(todaysDealsSection).toBeInTheDocument();

      // Step 3: Find and click "Learn More" on a skill card
      const learnMoreButtons = await screen.findAllByRole('button', { name: /Learn More/i });
      expect(learnMoreButtons.length).toBeGreaterThan(0);
      
      await user.click(learnMoreButtons[0]);

      // Step 4: Verify skill detail modal opens
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
      });

      // Step 5: Add skill to cart from modal
      const addToCartButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
      await user.click(addToCartButtons[0]);

      // Step 6: Close modal
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Step 7: Verify cart count updated in header
      await waitFor(() => {
        const cartIcon = screen.getByLabelText(/shopping cart/i);
        expect(cartIcon).toBeInTheDocument();
        // Cart should show count of 1
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      // Step 8: Open cart sidebar
      const cartButton = screen.getByLabelText(/shopping cart/i);
      await user.click(cartButton);

      // Step 9: Verify cart sidebar shows the added item
      await waitFor(() => {
        const cartSidebar = screen.getByRole('complementary');
        expect(cartSidebar).toBeInTheDocument();
      });

      // Step 10: Click "Proceed to Checkout"
      const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
      await user.click(checkoutButton);

      // Step 11: Verify checkout modal opens
      await waitFor(() => {
        const checkoutModal = screen.getByRole('dialog');
        expect(within(checkoutModal).getByText(/Checkout/i)).toBeInTheDocument();
      });

      // Step 12: Fill out checkout form
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const messageInput = screen.getByLabelText(/Message/i);

      await user.type(nameInput, 'Test Recruiter');
      await user.type(emailInput, 'recruiter@example.com');
      await user.type(messageInput, 'Interested in hiring for a senior role');

      // Step 13: Submit the form
      const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
      await user.click(placeOrderButton);

      // Step 14: Verify navigation to confirmation page
      // Note: In a real test, we'd check for URL change or confirmation page content
      await waitFor(() => {
        expect(screen.getByText(/Order Confirmed/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Step 15: Verify order summary is displayed
      expect(screen.getByText(/Estimated Delivery/i)).toBeInTheDocument();
    });

    it('should persist cart items across page refreshes', async () => {
      const user = userEvent.setup();
      
      // First render
      const { unmount } = render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Add item to cart
      await waitFor(() => {
        expect(screen.getByText(/Today's Deals/i)).toBeInTheDocument();
      });

      const addToCartButtons = await screen.findAllByRole('button', { name: /Add to Cart/i });
      await user.click(addToCartButtons[0]);

      // Verify cart count
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      // Unmount (simulate page refresh)
      unmount();

      // Re-render
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Verify cart count persisted
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });

    it('should allow removing items from cart', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Add item to cart
      await waitFor(() => {
        expect(screen.getByText(/Today's Deals/i)).toBeInTheDocument();
      });

      const addToCartButtons = await screen.findAllByRole('button', { name: /Add to Cart/i });
      await user.click(addToCartButtons[0]);

      // Open cart
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      const cartButton = screen.getByLabelText(/shopping cart/i);
      await user.click(cartButton);

      // Remove item
      const removeButton = await screen.findByRole('button', { name: /Remove/i });
      await user.click(removeButton);

      // Verify cart is empty
      await waitFor(() => {
        expect(screen.queryByText('1')).not.toBeInTheDocument();
      });
    });
  });

  describe('User Flow 2: Search → View Results → Open Detail → Add to Cart', () => {
    it('should complete search flow and add item to cart', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Step 1: Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/Dheeraj Kumar/i)).toBeInTheDocument();
      });

      // Step 2: Click on search bar in header
      const searchInput = screen.getByPlaceholderText(/Search skills and projects/i);
      await user.click(searchInput);

      // Step 3: Type search query
      await user.type(searchInput, 'React');

      // Step 4: Verify search overlay opens with results
      await waitFor(() => {
        const searchOverlay = screen.getByRole('search');
        expect(searchOverlay).toBeInTheDocument();
      });

      // Step 5: Verify autocomplete suggestions appear
      await waitFor(() => {
        expect(screen.getByText(/Suggestions/i)).toBeInTheDocument();
      });

      // Step 6: Click on a search result
      const searchResults = await screen.findAllByRole('article');
      expect(searchResults.length).toBeGreaterThan(0);
      
      await user.click(searchResults[0]);

      // Step 7: Verify detail modal opens
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
      });

      // Step 8: Add to cart from detail modal
      const addToCartButton = screen.getByRole('button', { name: /Add to Cart/i });
      await user.click(addToCartButton);

      // Step 9: Verify cart count updated
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      // Step 10: Close modal and verify item in cart
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Open cart to verify
      const cartButton = screen.getByLabelText(/shopping cart/i);
      await user.click(cartButton);

      await waitFor(() => {
        const cartSidebar = screen.getByRole('complementary');
        expect(cartSidebar).toBeInTheDocument();
      });
    });

    it('should handle empty search results gracefully', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Dheeraj Kumar/i)).toBeInTheDocument();
      });

      // Search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText(/Search skills and projects/i);
      await user.click(searchInput);
      await user.type(searchInput, 'NonexistentSkill12345');

      // Verify "No results found" message
      await waitFor(() => {
        expect(screen.getByText(/No results found/i)).toBeInTheDocument();
      });

      // Verify suggested alternatives are shown
      expect(screen.getByText(/Try searching for/i)).toBeInTheDocument();
    });

    it('should filter search results by category', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Dheeraj Kumar/i)).toBeInTheDocument();
      });

      // Open search
      const searchInput = screen.getByPlaceholderText(/Search skills and projects/i);
      await user.click(searchInput);
      await user.type(searchInput, 'React');

      // Wait for results
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });

      // Apply category filter
      const categoryFilter = screen.getByRole('button', { name: /Skills/i });
      await user.click(categoryFilter);

      // Verify only skills are shown
      await waitFor(() => {
        const results = screen.getAllByRole('article');
        results.forEach(result => {
          expect(within(result).getByText(/Skill/i)).toBeInTheDocument();
        });
      });
    });
  });

  describe('User Flow 3: Skill Bundles', () => {
    it('should add skill bundle to cart', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Wait for page load
      await waitFor(() => {
        expect(screen.getByText(/Frequently Bought Together/i)).toBeInTheDocument();
      });

      // Find and click "Add Bundle to Cart"
      const addBundleButton = screen.getByRole('button', { name: /Add Bundle to Cart/i });
      await user.click(addBundleButton);

      // Verify multiple items added to cart
      await waitFor(() => {
        const cartCount = screen.getByText(/\d+/);
        const count = parseInt(cartCount.textContent || '0');
        expect(count).toBeGreaterThan(1);
      });
    });
  });

  describe('User Flow 4: Modal Interactions', () => {
    it('should close modal on backdrop click', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Today's Deals/i)).toBeInTheDocument();
      });

      // Open modal
      const learnMoreButtons = await screen.findAllByRole('button', { name: /Learn More/i });
      await user.click(learnMoreButtons[0]);

      // Verify modal is open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click backdrop
      const backdrop = screen.getByTestId('modal-backdrop');
      await user.click(backdrop);

      // Verify modal is closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close modal on ESC key press', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Today's Deals/i)).toBeInTheDocument();
      });

      // Open modal
      const learnMoreButtons = await screen.findAllByRole('button', { name: /Learn More/i });
      await user.click(learnMoreButtons[0]);

      // Verify modal is open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Press ESC key
      await user.keyboard('{Escape}');

      // Verify modal is closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Today's Deals/i)).toBeInTheDocument();
      });

      // Open modal
      const learnMoreButtons = await screen.findAllByRole('button', { name: /Learn More/i });
      await user.click(learnMoreButtons[0]);

      // Verify modal is open
      const modal = await screen.findByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Tab through focusable elements
      await user.tab();
      
      // Verify focus stays within modal
      const focusedElement = document.activeElement;
      expect(modal.contains(focusedElement)).toBe(true);
    });
  });

  describe('User Flow 5: Form Validation', () => {
    it('should validate required fields in checkout form', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Add item to cart and go to checkout
      await waitFor(() => {
        expect(screen.getByText(/Today's Deals/i)).toBeInTheDocument();
      });

      const addToCartButtons = await screen.findAllByRole('button', { name: /Add to Cart/i });
      await user.click(addToCartButtons[0]);

      const cartButton = screen.getByLabelText(/shopping cart/i);
      await user.click(cartButton);

      const checkoutButton = await screen.findByRole('button', { name: /Proceed to Checkout/i });
      await user.click(checkoutButton);

      // Try to submit empty form
      const placeOrderButton = await screen.findByRole('button', { name: /Place Order/i });
      await user.click(placeOrderButton);

      // Verify validation errors are shown
      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      // Navigate to checkout
      await waitFor(() => {
        expect(screen.getByText(/Today's Deals/i)).toBeInTheDocument();
      });

      const addToCartButtons = await screen.findAllByRole('button', { name: /Add to Cart/i });
      await user.click(addToCartButtons[0]);

      const cartButton = screen.getByLabelText(/shopping cart/i);
      await user.click(cartButton);

      const checkoutButton = await screen.findByRole('button', { name: /Proceed to Checkout/i });
      await user.click(checkoutButton);

      // Fill form with invalid email
      const nameInput = await screen.findByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const messageInput = screen.getByLabelText(/Message/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'invalid-email');
      await user.type(messageInput, 'Test message');

      // Submit form
      const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
      await user.click(placeOrderButton);

      // Verify email validation error
      await waitFor(() => {
        expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Flow 6: Navigation', () => {
    it('should navigate between sections using nav bar', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Dheeraj Kumar/i)).toBeInTheDocument();
      });

      // Click on "Projects" in nav bar
      const projectsLink = screen.getByRole('link', { name: /Projects/i });
      await user.click(projectsLink);

      // Verify smooth scroll to projects section
      await waitFor(() => {
        const projectsSection = screen.getByText(/Customers Also Viewed/i);
        expect(projectsSection).toBeInTheDocument();
      });
    });

    it('should show sticky header on scroll', async () => {
      render(
        <TestWrapper>
          <AmazonPortfolio />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Dheeraj Kumar/i)).toBeInTheDocument();
      });

      // Get header element
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      // Verify header has sticky positioning
      const styles = window.getComputedStyle(header);
      expect(styles.position).toBe('sticky');
    });
  });
});
