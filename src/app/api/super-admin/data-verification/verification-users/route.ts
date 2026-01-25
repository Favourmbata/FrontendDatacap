import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/super-admin/data-verification/verification-users
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Mock implementation - in real app, call your backend service
    const mockUsers = [
      {
        id: 'user-123',
        email: 'agent@example.com',
        fullName: 'John Doe',
        role: 'USER',
        permissions: ['data_verification'],
        createdAt: '2024-01-10T10:00:00.000Z'
      }
    ];

    const mockResponse = {
      success: true,
      data: {
        users: mockUsers,
        total: mockUsers.length
      },
      message: 'Data verification users retrieved successfully'
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error fetching verification users:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}