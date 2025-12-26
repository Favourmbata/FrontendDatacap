import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/measurements - Retrieve body measurements for all users in the organization
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId') || undefined;
    
    console.log('🔄 Proxying get measurements request to backend with params:', { page, limit, userId });

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://datacapture-backend.onrender.com';
    
    // Build query string
    let queryString = `page=${page}&limit=${limit}`;
    if (userId) {
      queryString += `&userId=${userId}`;
    }
    
    // Get the authorization token from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the actual backend
    const response = await fetch(`${backendUrl}/admin/measurements?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve measurements', error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/admin/measurements - Create a body measurement record for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔄 Proxying create measurement request to backend with payload:', body);

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://datacapture-backend.onrender.com';
    
    // Get the authorization token from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the actual backend
    const response = await fetch(`${backendUrl}/admin/measurements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { message: 'Failed to create measurement', error: String(error) },
      { status: 500 }
    );
  }
}