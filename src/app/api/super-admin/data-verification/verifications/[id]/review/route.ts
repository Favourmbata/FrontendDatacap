import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/super-admin/data-verification/verifications/:id/review
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const awaitedParams = await params;
    const { id } = awaitedParams;
    const body = await req.json();
    const { status, comments } = body;

    // Mock implementation - in real app, call your backend service
    const mockResponse = {
      success: true,
      data: {
        verification: {
          _id: id,
          status,
          reviewedBy: 'super-admin-id',
          reviewedAt: new Date().toISOString(),
          reviewComments: comments
        }
      },
      message: `Verification ${status} successfully`
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error reviewing verification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}