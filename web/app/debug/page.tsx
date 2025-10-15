"use client";
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/services';

export default function DebugPage() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const testClientSide = async () => {
      try {
        setStatus('Initializing data...');
        await api.initializeData();
        
        setStatus('Testing search...');
        const searchResults = api.search('diamond', { top_k: 3 });
        
        setStatus('Testing categories...');
        const categories = api.getCategories();
        
        setStatus('Testing celebrities...');
        const celebrities = api.getCelebrities();
        
        setStatus('Testing vibes...');
        const vibes = api.getVibes();
        
        setData({
          searchResults: searchResults.length,
          categories: categories.length,
          celebrities: celebrities.length,
          vibes: vibes.length,
          sampleProduct: searchResults[0] || null
        });
        
        setStatus('✅ All tests passed!');
      } catch (error) {
        setStatus(`❌ Error: ${error}`);
        console.error('Debug test failed:', error);
      }
    };

    testClientSide();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Client-Side Debug Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg">{status}</p>
        </div>

        {data && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Search Results</h3>
                <p>{data.searchResults} products found</p>
              </div>
              <div>
                <h3 className="font-medium">Categories</h3>
                <p>{data.categories} categories available</p>
              </div>
              <div>
                <h3 className="font-medium">Celebrities</h3>
                <p>{data.celebrities} celebrities available</p>
              </div>
              <div>
                <h3 className="font-medium">Vibes</h3>
                <p>{data.vibes} vibes available</p>
              </div>
            </div>
            
            {data.sampleProduct && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Sample Product</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Name:</strong> {data.sampleProduct.product_name}</p>
                  <p><strong>Category:</strong> {data.sampleProduct.category}</p>
                  <p><strong>Price:</strong> ₹{data.sampleProduct.price?.toLocaleString()}</p>
                  <p><strong>Vibes:</strong> {data.sampleProduct.vibes?.join(', ') || 'None'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <a 
            href="/" 
            className="bg-[#BA9456] text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go to Main App
          </a>
        </div>
      </div>
    </div>
  );
}
