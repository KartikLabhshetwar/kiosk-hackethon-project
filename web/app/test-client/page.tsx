"use client";
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/services';
import { useDataInitialization } from '@/lib/hooks';

export default function TestClient() {
  const { isInitialized, isLoading, error } = useDataInitialization();
  const [testResults, setTestResults] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('diamond');

  const runTests = async () => {
    if (!isInitialized) return;

    const results: any = {};

    try {
      // Test 1: Basic search
      results.search = api.search('diamond', { top_k: 3 });
      
      // Test 2: Celebrity search
      results.celebrity = api.searchByCelebrity('deepika padukone', { top_k: 3 });
      
      // Test 3: Vibe search
      results.vibe = api.searchByVibe('elegant', { top_k: 3 });
      
      // Test 4: Get categories
      results.categories = api.getCategories();
      
      // Test 5: Get celebrities
      results.celebrities = api.getCelebrities();
      
      // Test 6: Get vibes
      results.vibes = api.getVibes();
      
      // Test 7: Vibe statistics
      results.vibeStats = api.getVibeStatistics();
      
      // Test 8: Price range
      results.priceRange = api.getPriceRange();
      
      // Test 9: Search suggestions
      results.suggestions = api.getSearchSuggestions('dia');
      
      setTestResults(results);
    } catch (err) {
      console.error('Test failed:', err);
    }
  };

  const testSearch = () => {
    if (!isInitialized) return;
    const results = api.search(searchQuery, { top_k: 5 });
    setTestResults({ search: results });
  };

  useEffect(() => {
    if (isInitialized) {
      runTests();
    }
  }, [isInitialized]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#BA9456] mx-auto mb-4"></div>
          <p className="text-xl">Initializing client-side database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#BA9456] mb-4">Client-Side Solution Test</h1>
          <p className="text-gray-600 mb-4">
            Status: <span className="text-green-600 font-semibold">✅ Initialized</span>
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={runTests}
              className="bg-[#BA9456] text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Run All Tests
            </button>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search query..."
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={testSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Test Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(testResults).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <h3 className="font-medium text-[#BA9456]">{key}</h3>
                  <pre className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Products Loaded:</strong> {testResults.search?.length || 0}</div>
              <div><strong>Categories:</strong> {testResults.categories?.length || 0}</div>
              <div><strong>Celebrities:</strong> {testResults.celebrities?.length || 0}</div>
              <div><strong>Vibes:</strong> {testResults.vibes?.length || 0}</div>
              <div><strong>Price Range:</strong> 
                {testResults.priceRange ? 
                  `₹${testResults.priceRange.min?.toLocaleString()} - ₹${testResults.priceRange.max?.toLocaleString()}` : 
                  'N/A'
                }
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-[#BA9456] text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Go to Main App
                </button>
                <button
                  onClick={() => window.location.href = '/suggestions'}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Test Recommendations
                </button>
                <button
                  onClick={() => window.location.href = '/celeb-matching'}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Test Celebrity Matching
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
