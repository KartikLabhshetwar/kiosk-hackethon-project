"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePreferences } from '@/lib/context';
import { usePersonalizedRecommendations } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const Suggestions = () => {
  const router = useRouter();
  const { preferences } = usePreferences();
  const { data: products, isLoading, error, getRecommendations } = usePersonalizedRecommendations();

  useEffect(() => {
    // Fetch recommendations when component mounts
    if (preferences.occasion || preferences.vibe || preferences.budget) {
      getRecommendations({
        occasion: preferences.occasion,
        budget: preferences.budget,
        vibe: preferences.vibe,
        category: preferences.category,
      });
    }
  }, [preferences.occasion, preferences.vibe, preferences.budget, preferences.category, getRecommendations]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" message="Finding your perfect jewelry..." fullScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <ErrorMessage 
          message={error} 
          onRetry={() => getRecommendations({
            occasion: preferences.occasion,
            budget: preferences.budget,
            vibe: preferences.vibe,
            category: preferences.category,
          })}
          fullScreen 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/evollogo.png"
            alt="Evol Studio Logo"
            width={150}
            height={60} 
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-medium mb-8 bg-white py-4 jakarta">
            We've handpicked {products?.length || 0} Jewels according to your choices
          </h2>
          
          {/* Preferences Summary */}
          <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-4 justify-center">
              {preferences.occasion && (
                <span className="px-4 py-2 bg-[#BA9456] text-white rounded-full">
                  Occasion: {preferences.occasion}
                </span>
              )}
              {preferences.budget && (
                <span className="px-4 py-2 bg-[#BA9456] text-white rounded-full">
                  Budget: ₹{(preferences.budget.min / 100000).toFixed(1)}L - ₹{(preferences.budget.max / 100000).toFixed(1)}L
                </span>
              )}
              {preferences.vibe && (
                <span className="px-4 py-2 bg-[#BA9456] text-white rounded-full">
                  Vibe: {preferences.vibe}
                </span>
              )}
              {preferences.category && (
                <span className="px-4 py-2 bg-[#BA9456] text-white rounded-full">
                  Category: {preferences.category}
                </span>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 justify-end max-w-7xl mx-auto">
            <button 
              onClick={() => router.push("/try-on")} 
              className="bg-[#BA9456] text-xl hover:bg-[#af894b] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Try on me
            </button> 
            <button 
              onClick={() => router.push("/cart")} 
              className="bg-[#BA9456] text-xl hover:bg-[#af894b] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              View Cart
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              No products found matching your preferences.
            </p>
            <button
              onClick={() => router.push("/occasion")}
              className="bg-[#BA9456] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#af894b] transition-colors"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => router.push("/type")}
            className="bg-white border-2 border-[#BA9456] text-[#BA9456] px-12 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Back to Type Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
