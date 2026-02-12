import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const state = searchParams.get('state');
    const lga = searchParams.get('lga');
    const city = searchParams.get('city');

    if (!country || !state || !lga || !city) {
      return NextResponse.json({
        success: false,
        message: 'Country, state, lga, and city parameters are required'
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
    
    const response = await fetch(`${BACKEND_URL}/api/locations/city-regions?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}&lga=${encodeURIComponent(lga)}&city=${encodeURIComponent(city)}`, {
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
    // If the backend returns objects with name and fee properties, we preserve them
    if (result.success && result.data && result.data.cityRegions) {
      // The city regions should already have the correct format with name and fee
      return NextResponse.json({
        success: true,
        data: {
          cityRegions: result.data.cityRegions
        }
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching city regions:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch city regions',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}