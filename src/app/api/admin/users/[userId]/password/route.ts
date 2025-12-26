import { NextRequest, NextResponse } from 'next/server';

// PUT /api/admin/users/:userId/password - Update user password
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    
    console.log('🔄 Proxying password update request to backend for user:', userId, body);

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://datacapture-backend.onrender.com';
    
    // Get the authorization token from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the actual backend
    const response = await fetch(`${backendUrl}/admin/users/${userId}/password`, {
      method: 'PUT',
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
      { message: 'Failed to update user password', error: String(error) },
      { status: 500 }
    );
  }
}