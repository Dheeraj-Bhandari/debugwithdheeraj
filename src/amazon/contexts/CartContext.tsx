/**
 * CartContext - Shopping cart state management for Amazon-themed portfolio
 * 
 * Provides cart functionality including:
 * - Add items to cart
 * - Remove items from cart
 * - Clear entire cart
 * - Session storage persistence
 * - Cart count calculation
 * - Toast notifications for cart operations
 * 
 * Requirements: 5.1, 5.4, 14.5, 15.1, 15.2
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { ReactNode } from 'react';
import type { CartItem, CartState } from '../types';

/**
 * Session storage key for persisting cart data
 */
const CART_STORAGE_KEY = 'amazon-portfolio-cart';

/**
 * Cart action types
 */
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // item ID
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState };

/**
 * Cart context value interface
 */
interface CartContextValue {
  /** Current cart state */
  cart: CartState;
  
  /** Number of items in cart */
  cartCount: number;
  
  /** Add an item to the cart */
  addItem: (item: CartItem) => void;
  
  /** Remove an item from the cart by ID */
  removeItem: (itemId: string) => void;
  
  /** Clear all items from the cart */
  clearCart: () => void;
  
  /** Check if an item is in the cart */
  isInCart: (itemId: string) => boolean;
}

/**
 * Cart context
 */
const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * Cart reducer - handles all cart state mutations
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { payload: item } = action;
      
      // Check if item already exists in cart
      const existingIndex = state.items.findIndex(i => i.id === item.id);
      
      if (existingIndex !== -1) {
        // Item already in cart, don't add duplicate
        return state;
      }
      
      // Add new item
      return {
        items: [...state.items, item],
        addedAt: {
          ...state.addedAt,
          [item.id]: new Date(),
        },
      };
    }
    
    case 'REMOVE_ITEM': {
      const itemId = action.payload;
      
      // Remove item from items array
      const newItems = state.items.filter(item => item.id !== itemId);
      
      // Remove timestamp for this item
      const newAddedAt = { ...state.addedAt };
      delete newAddedAt[itemId];
      
      return {
        items: newItems,
        addedAt: newAddedAt,
      };
    }
    
    case 'CLEAR_CART': {
      return {
        items: [],
        addedAt: {},
      };
    }
    
    case 'LOAD_FROM_STORAGE': {
      return action.payload;
    }
    
    default:
      return state;
  }
}

/**
 * Initial cart state
 */
const initialCartState: CartState = {
  items: [],
  addedAt: {},
};

/**
 * Load cart state from session storage
 */
function loadCartFromStorage(): CartState {
  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return initialCartState;
    }
    
    const parsed = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    const addedAt: Record<string, Date> = {};
    for (const [key, value] of Object.entries(parsed.addedAt || {})) {
      addedAt[key] = new Date(value as string);
    }
    
    return {
      items: parsed.items || [],
      addedAt,
    };
  } catch (error) {
    console.error('Failed to load cart from session storage:', error);
    return initialCartState;
  }
}

/**
 * Save cart state to session storage
 */
function saveCartToStorage(state: CartState): void {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save cart to session storage:', error);
  }
}

/**
 * CartProvider props
 */
interface CartProviderProps {
  children: ReactNode;
}

/**
 * CartProvider - Provides cart context to children
 * 
 * Automatically loads cart from session storage on mount
 * and saves to session storage on every state change.
 */
export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  
  // Load cart from session storage on mount
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    if (storedCart.items.length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedCart });
    }
  }, []);
  
  // Save cart to session storage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);
  
  // Calculate cart count
  const cartCount = cart.items.length;
  
  // Cart operations
  const addItem = (item: CartItem) => {
    // Check if item already exists before dispatching
    const alreadyInCart = cart.items.some(i => i.id === item.id);
    
    if (alreadyInCart) {
      // Show "Already in cart" toast
      toast.error('Already in cart', {
        duration: 2000,
        position: 'bottom-right',
        icon: '🛒',
      });
    } else {
      // Add item and show success toast
      dispatch({ type: 'ADD_ITEM', payload: item });
      toast.success('Added to cart!', {
        duration: 2000,
        position: 'bottom-right',
        icon: '✅',
      });
    }
  };
  
  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    // Show "Removed from cart" toast
    toast.success('Removed from cart', {
      duration: 2000,
      position: 'bottom-right',
      icon: '🗑️',
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const isInCart = (itemId: string): boolean => {
    return cart.items.some(item => item.id === itemId);
  };
  
  const value: CartContextValue = {
    cart,
    cartCount,
    addItem,
    removeItem,
    clearCart,
    isInCart,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart hook - Access cart context
 * 
 * @throws Error if used outside of CartProvider
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}
