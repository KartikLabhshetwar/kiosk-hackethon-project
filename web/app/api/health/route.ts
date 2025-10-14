/**
 * API Route: Health Check
 * Tests connection to backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHealthStatus } from '@/lib/api/services';

export async function GET(request: NextRequest) {
  try {
    console.log('Health check API route called');
    
    // Test backend connection
    const healthStatus = await getHealthStatus();
    
    return NextResponse.json({
      status: 'success',
      message: 'Frontend API route working',
      backend: healthStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Backend connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
