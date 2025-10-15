"use client";
import React, { useEffect, useState } from 'react';
import { useDataInitialization } from '../hooks';
import LoadingSpinner from '@/components/LoadingSpinner';

interface DataInitializerProps {
  children: React.ReactNode;
}

export const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const { isInitialized, isLoading, error } = useDataInitialization();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" message="Initializing jewelry database..." fullScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Initialization Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#BA9456] text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Database Not Ready</h2>
          <p className="text-gray-600">Please wait while we prepare the jewelry database...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
