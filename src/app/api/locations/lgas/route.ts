import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const state = searchParams.get('state');

    if (!country || !state) {
      return NextResponse.json({
        success: false,
        message: 'Country and state parameters are required'
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
    
    const response = await fetch(`${BACKEND_URL}/api/locations/lgas?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`, {
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
      let lgasArray = [];
      if (result.data.lgas) {
        // Standard format
        lgasArray = result.data.lgas.map((lga: any) => 
          typeof lga === 'string' ? lga : (lga.name || lga)
        );
      } else if (Array.isArray(result.data)) {
        // Some backends might return the array directly in data
        lgasArray = result.data.map((lga: any) => 
          typeof lga === 'string' ? lga : (lga.name || lga)
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          lgas: lgasArray
        }
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching LGAs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch LGAs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}