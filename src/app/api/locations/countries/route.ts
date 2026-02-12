import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch from the backend API
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    
    if (!BACKEND_URL) {
      return NextResponse.json({
        success: false,
        message: 'Backend URL is not configured'
      }, { status: 500 });
    }
    
    const response = await fetch(`${BACKEND_URL}/api/locations/countries`, {
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
    // If the backend returns objects with name and stateCount, we need to normalize them
    if (result.success && result.data) {
      // Handle different possible response structures
      let countriesArray = [];
      if (result.data.countries) {
        // Standard format
        countriesArray = result.data.countries.map((country: any) => 
          typeof country === 'string' ? country : country.name
        );
      } else if (Array.isArray(result.data)) {
        // Some backends might return the array directly in data
        countriesArray = result.data.map((country: any) => 
          typeof country === 'string' ? country : country.name
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          countries: countriesArray
        }
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch countries',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}