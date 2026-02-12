import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');

    if (!country) {
      return NextResponse.json({
        success: false,
        message: 'Country parameter is required'
      }, { status: 400 });
    }
    
    // Fetch from the backend API
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    
    if (!BACKEND_URL) {
      return NextResponse.json({
        success: false,
        message: 'Backend URL is not configured'
      }, { status: 500 });
    }
    
    const response = await fetch(`${BACKEND_URL}/api/locations/states?country=${encodeURIComponent(country)}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add any required authorization headers here if needed
        // 'Authorization': `Bearer ${token}`
      },
      cache: 'no-store' // Disable cache to always fetch fresh data
    });
    
    if (!response.ok) {
      console.error(`Backend responded with status ${response.status}`);
      return NextResponse.json({
        success: false,
        message: `Backend responded with status ${response.status}`
      }, { status: response.status });
    }
    
    const result = await response.json();
    
    // Transform the response to ensure it matches the expected format
    // If the backend returns objects with name and other properties, we need to normalize them
    if (result.success && result.data) {
      // Handle different possible response structures
      let statesArray = [];
      if (result.data.states) {
        // Standard format
        statesArray = result.data.states.map((state: any) => 
          typeof state === 'string' ? state : (state.name || state)
        );
      } else if (Array.isArray(result.data)) {
        // Some backends might return the array directly in data
        statesArray = result.data.map((state: any) => 
          typeof state === 'string' ? state : (state.name || state)
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          states: statesArray
        }
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch states',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}