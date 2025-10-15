"use client";
import React, { useState } from 'react';

export default function DebugApi() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    setResult('Testing direct fetch...\n');
    
    try {
      const response = await fetch('http://localhost:8000/celebrities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(prev => prev + `✅ Direct fetch successful:\n${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
      setResult(prev => prev + `❌ Direct fetch failed: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testAxios = async () => {
    setLoading(true);
    setResult(prev => prev + 'Testing axios...\n');
    
    try {
      const axios = (await import('axios')).default;
      const response = await axios.get('http://localhost:8000/celebrities');
      setResult(prev => prev + `✅ Axios successful:\n${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
      setResult(prev => prev + `❌ Axios failed: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testApiService = async () => {
    setLoading(true);
    setResult(prev => prev + 'Testing API service...\n');
    
    try {
      // Test the API client directly
      const { apiRequest } = await import('@/lib/api/client');
      setResult(prev => prev + 'API client imported successfully\n');
      
      const data = await apiRequest({
        method: 'GET',
        url: '/celebrities'
      });
      setResult(prev => prev + `✅ API service successful:\n${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
      setResult(prev => prev + `❌ API service failed: ${error}\n`);
      console.error('API service error:', error);
    }
    
    setLoading(false);
  };

  const clearResult = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Debug Tool</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="bg-gray-200 p-4 rounded">
            <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'Not set'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Buttons</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={testDirectFetch}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Test Direct Fetch
            </button>
            <button
              onClick={testAxios}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Test Axios
            </button>
            <button
              onClick={testApiService}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Test API Client
            </button>
            <button
              onClick={async () => {
                setLoading(true);
                setResult(prev => prev + 'Testing getCelebrities service...\n');
                try {
                  const { getCelebrities } = await import('@/lib/api/services');
                  const data = await getCelebrities();
                  setResult(prev => prev + `✅ getCelebrities successful:\n${JSON.stringify(data, null, 2)}\n`);
                } catch (error) {
                  setResult(prev => prev + `❌ getCelebrities failed: ${error}\n`);
                  console.error('getCelebrities error:', error);
                }
                setLoading(false);
              }}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Test getCelebrities
            </button>
            <button
              onClick={clearResult}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Clear Results
            </button>
          </div>
        </div>

        {loading && (
          <div className="mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="bg-white p-4 rounded border">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {result || 'No results yet. Click a test button above.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
