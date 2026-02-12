import { NextRequest, NextResponse } from 'next/server';
import { StaffUser } from '@/types/staff';

// Mock staff users - same as in login route
const mockStaffUsers: StaffUser[] = [
  {
    id: '1',
    email: 'agent@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'field_agent',
    region: 'North',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'supervisor@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'supervisor',
    region: 'Central',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    region: 'All',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock token validation - replace with proper JWT verification
const verifyToken = (token: string): StaffUser | null => {
  // Extract user ID from mock token
  const match = token.match(/mock_token_(\d+)_/);
  if (!match) return null;
  
  const userId = match[1];
  return mockStaffUsers.find(user => user.id === userId && user.isActive) || null;
};

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token and get user
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user,
      message: 'Token verified successfully'
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}