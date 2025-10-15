/**
 * User Preferences Context
 * Global state management for user selections across the app
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserPreferences } from '../types/api';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  setOccasion: (occasion: string) => void;
  setBudget: (min: number, max: number) => void;
  setVibe: (vibe: string) => void;
  setCategory: (category: string) => void;
  setCelebrity: (celebrity: string) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const initialPreferences: UserPreferences = {
  occasion: undefined,
  budget: undefined,
  vibe: undefined,
  category: undefined,
  celebrity: undefined,
};

interface PreferencesProviderProps {
  children: ReactNode;
}

/**
 * Provider component for user preferences
 */
export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(initialPreferences);
  }, []);

  const setOccasion = useCallback((occasion: string) => {
    updatePreferences({ occasion });
  }, [updatePreferences]);

  const setBudget = useCallback((min: number, max: number) => {
    updatePreferences({ budget: { min, max } });
  }, [updatePreferences]);

  const setVibe = useCallback((vibe: string) => {
    updatePreferences({ vibe });
  }, [updatePreferences]);

  const setCategory = useCallback((category: string) => {
    updatePreferences({ category });
  }, [updatePreferences]);

  const setCelebrity = useCallback((celebrity: string) => {
    updatePreferences({ celebrity });
  }, [updatePreferences]);

  const value: PreferencesContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    setOccasion,
    setBudget,
    setVibe,
    setCategory,
    setCelebrity,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

/**
 * Hook to use preferences context
 */
export function usePreferences() {
  const context = useContext(PreferencesContext);
  
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  
  return context;
}

/**
 * Hook to check if preferences are complete
 */
export function usePreferencesComplete() {
  const { preferences } = usePreferences();

  const isComplete = !!(
    preferences.occasion &&
    preferences.budget &&
    preferences.vibe
  );

  const missingFields: string[] = [];
  if (!preferences.occasion) missingFields.push('occasion');
  if (!preferences.budget) missingFields.push('budget');
  if (!preferences.vibe) missingFields.push('vibe');

  return {
    isComplete,
    missingFields,
    preferences,
  };
}

