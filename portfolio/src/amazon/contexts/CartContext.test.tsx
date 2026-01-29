/**
 * CartContext unit tests
 * Tests basic cart operations and session storage persistence
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import toast from 'react-hot-toast';
import { CartProvider, useCart } from './CartContext';
import type { CartItem } from '../types';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock session storage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('CartContext', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  const mockSkillItem: CartItem = {
    id: 'skill-1',
    type: 'skill',
    title: 'React.js Development',
    category: 'Frontend',
    image: '/images/react.png',
  };

  const mockProjectItem: CartItem = {
    id: 'project-1',
    type: 'project',
    title: 'E-commerce Platform',
    category: 'Full-Stack',
    image: '/images/ecommerce.png',
  };

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cartCount).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0]).toEqual(mockSkillItem);
    expect(result.current.cartCount).toBe(1);
  });

  it('should not add duplicate items', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
      result.current.addItem(mockSkillItem); // Try to add same item again
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cartCount).toBe(1);
  });

  it('should add multiple different items', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
      result.current.addItem(mockProjectItem);
    });

    expect(result.current.cart.items).toHaveLength(2);
    expect(result.current.cartCount).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
      result.current.addItem(mockProjectItem);
    });

    expect(result.current.cartCount).toBe(2);

    act(() => {
      result.current.removeItem('skill-1');
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].id).toBe('project-1');
    expect(result.current.cartCount).toBe(1);
  });

  it('should clear entire cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
      result.current.addItem(mockProjectItem);
    });

    expect(result.current.cartCount).toBe(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cartCount).toBe(0);
  });

  it('should check if item is in cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
    });

    expect(result.current.isInCart('skill-1')).toBe(true);
    expect(result.current.isInCart('skill-2')).toBe(false);
  });

  it('should track when items were added', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
    });

    expect(result.current.cart.addedAt['skill-1']).toBeInstanceOf(Date);
  });

  it('should persist cart to session storage', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockSkillItem);
    });

    const stored = sessionStorage.getItem('amazon-portfolio-cart');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].id).toBe('skill-1');
  });

  it('should load cart from session storage on mount', () => {
    // Pre-populate session storage
    const cartData = {
      items: [mockSkillItem],
      addedAt: {
        'skill-1': new Date().toISOString(),
      },
    };
    sessionStorage.setItem('amazon-portfolio-cart', JSON.stringify(cartData));

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    // Wait for useEffect to run
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].id).toBe('skill-1');
    expect(result.current.cartCount).toBe(1);
  });

  it('should handle corrupted session storage gracefully', () => {
    sessionStorage.setItem('amazon-portfolio-cart', 'invalid json');

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cartCount).toBe(0);
  });

  it('should throw error when useCart is used outside provider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
  });

  // Toast notification tests
  describe('Toast Notifications', () => {
    it('should show success toast when adding item to cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockSkillItem);
      });

      expect(toast.success).toHaveBeenCalledWith('Added to cart!', {
        duration: 2000,
        position: 'bottom-right',
        icon: '✅',
      });
    });

    it('should show error toast when adding duplicate item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockSkillItem);
      });

      // Clear previous toast calls
      vi.clearAllMocks();

      act(() => {
        result.current.addItem(mockSkillItem); // Try to add same item again
      });

      expect(toast.error).toHaveBeenCalledWith('Already in cart', {
        duration: 2000,
        position: 'bottom-right',
        icon: '🛒',
      });
    });

    it('should show success toast when removing item from cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockSkillItem);
      });

      act(() => {
        result.current.removeItem('skill-1');
      });

      expect(toast.success).toHaveBeenCalledWith('Removed from cart', {
        duration: 2000,
        position: 'bottom-right',
        icon: '🗑️',
      });
    });
  });
});
