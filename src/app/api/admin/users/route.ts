import { NextRequest, NextResponse } from 'next/server';

// POST /api/admin/users - Create a new admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔄 Proxying admin user creation request to backend:', body);

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://datacapture-backend.onrender.com';
    
    // Transform the data format to match backend expectations
    const transformedBody = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.emailAddress || body.email,
      phoneNumber: body.phoneNumber,
      password: body.password, // Optional password
      existingUserId: body.existingUsersID || body.existingUserId, // For linking existing users
      role: body.role || 'CUSTOMER' // CUSTOMER, TAILOR (not ADMIN)
    };

    // Get the authorization token from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the actual backend
    const response = await fetch(`${backendUrl}/admin/users`, {
      method: 'POST',
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
      { message: 'Failed to create admin user', error: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/admin/users - Get all users with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    console.log('🔄 Proxying admin user listing request to backend:', { page, limit });

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://datacapture-backend.onrender.com';
    
    // Get the authorization token from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the actual backend to get ALL users (no status filter)
    const response = await fetch(`${backendUrl}/admin/users?page=${page}&limit=${limit}`, {
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
      { message: 'Failed to fetch admin users', error: String(error) },
      { status: 500 }
    );
  }
}