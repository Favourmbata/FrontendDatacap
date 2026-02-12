import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/super-admin/data-verification/verifications
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // Mock implementation - in real app, call your backend service
    const mockVerifications = [
      {
        _id: 'verification-1',
        verificationId: 'DV-1705320600000-ABC123',
        verifierUserId: 'user-123',
        verifierName: 'John Doe',
        country: 'Nigeria',
        state: 'Lagos',
        organizationName: 'Tech Company Ltd',
        targetUserFirstName: 'Jane',
        targetUserLastName: 'Smith',
        status: status || 'submitted',
        submittedAt: '2024-01-15T10:30:00.000Z',
        createdAt: '2024-01-15T09:00:00.000Z'
      }
    ];

    const mockResponse = {
      success: true,
      data: {
        verifications: mockVerifications,
        total: mockVerifications.length
      },
      message: 'All verifications retrieved successfully'
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}