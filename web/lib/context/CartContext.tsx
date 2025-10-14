/**
 * Shopping Cart Context
 * Global state management for cart items
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product } from '../types/api';

interface CartItem extends Product {
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'evol_jewels_cart';

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provider component for shopping cart
 */
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Convert date strings back to Date objects
        const cartWithDates = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setItems(cartWithDates);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [items, isInitialized]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Add new item
      return [...prev, { ...product, quantity, addedAt: new Date() }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const isInCart = useCallback(
    (productId: number) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to use cart context
 */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

