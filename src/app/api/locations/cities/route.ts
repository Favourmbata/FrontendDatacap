import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const state = searchParams.get('state');
    const lga = searchParams.get('lga');

    if (!country || !state || !lga) {
      return NextResponse.json({
        success: false,
        message: 'Country, state, and lga parameters are required'
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
    
    const response = await fetch(`${BACKEND_URL}/api/locations/cities?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}&lga=${encodeURIComponent(lga)}`, {
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
      let citiesArray = [];
      if (result.data.cities) {
        // Standard format
        citiesArray = result.data.cities.map((city: any) => 
          typeof city === 'string' ? city : (city.name || city)
        );
      } else if (Array.isArray(result.data)) {
        // Some backends might return the array directly in data
        citiesArray = result.data.map((city: any) => 
          typeof city === 'string' ? city : (city.name || city)
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          cities: citiesArray
        }
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch cities',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}