"use client";
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Preferences, CartItem, Product } from '../types/api';

// Preferences Context
interface PreferencesState {
  preferences: Preferences;
}

type PreferencesAction =
  | { type: 'SET_OCCASION'; payload: string }
  | { type: 'SET_VIBE'; payload: string }
  | { type: 'SET_BUDGET'; payload: { min: number; max: number } }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_CELEBRITY'; payload: string }
  | { type: 'RESET_PREFERENCES' };

const preferencesReducer = (state: PreferencesState, action: PreferencesAction): PreferencesState => {
  switch (action.type) {
    case 'SET_OCCASION':
      return { ...state, preferences: { ...state.preferences, occasion: action.payload } };
    case 'SET_VIBE':
      return { ...state, preferences: { ...state.preferences, vibe: action.payload } };
    case 'SET_BUDGET':
      return { ...state, preferences: { ...state.preferences, budget: action.payload } };
    case 'SET_CATEGORY':
      return { ...state, preferences: { ...state.preferences, category: action.payload } };
    case 'SET_CELEBRITY':
      return { ...state, preferences: { ...state.preferences, celebrity: action.payload } };
    case 'RESET_PREFERENCES':
      return { ...state, preferences: {} };
    default:
      return state;
  }
};

const PreferencesContext = createContext<{
  preferences: Preferences;
  setOccasion: (occasion: string) => void;
  setVibe: (vibe: string) => void;
  setBudget: (budget: { min: number; max: number }) => void;
  setCategory: (category: string) => void;
  setCelebrity: (celebrity: string) => void;
  resetPreferences: () => void;
} | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(preferencesReducer, { preferences: {} });

  const setOccasion = (occasion: string) => dispatch({ type: 'SET_OCCASION', payload: occasion });
  const setVibe = (vibe: string) => dispatch({ type: 'SET_VIBE', payload: vibe });
  const setBudget = (budget: { min: number; max: number }) => dispatch({ type: 'SET_BUDGET', payload: budget });
  const setCategory = (category: string) => dispatch({ type: 'SET_CATEGORY', payload: category });
  const setCelebrity = (celebrity: string) => dispatch({ type: 'SET_CELEBRITY', payload: celebrity });
  const resetPreferences = () => dispatch({ type: 'RESET_PREFERENCES' });

  return (
    <PreferencesContext.Provider value={{
      preferences: state.preferences,
      setOccasion,
      setVibe,
      setBudget,
      setCategory,
      setCelebrity,
      resetPreferences
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

// Cart Context
interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const CartContext = createContext<{
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
} | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id: number) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: number, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getTotalItems = () => state.items.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => state.items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
