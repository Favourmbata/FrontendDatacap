import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/users/:userId - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    console.log('🔄 Proxying user fetch request to backend for user:', userId);

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://datacapture-backend.onrender.com';
    
    // Get the authorization token from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the actual backend
    const response = await fetch(`${backendUrl}/admin/users/${userId}`, {
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
      { message: 'Failed to fetch user', error: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/:userId - Update user information
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    
    console.log('🔄 Proxying user update request to backend for user:', userId, body);

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://datacapture-backend.onrender.com';
    
    // Transform the data format to match backend expectations
    const transformedBody = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.emailAddress || body.email,
      phoneNumber: body.phoneNumber
    };

    // Get the authorization token from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the actual backend
    const response = await fetch(`${backendUrl}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(transformedBody),
    });

    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { message: 'Failed to update user', error: String(error) },
      { status: 500 }
    );
  }
}