import { NextRequest, NextResponse } from 'next/server';
import { StaffUser } from '@/types/staff';

// Mock staff users for development - replace with actual database queries
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

// Mock password validation - replace with proper password hashing
const validatePassword = (email: string, password: string): boolean => {
  // For demo purposes, accept any password for existing users
  return mockStaffUsers.some(user => user.email === email);
};

// Mock JWT token generation - replace with proper JWT implementation
const generateToken = (user: StaffUser): string => {
  // In production, use a proper JWT library with secret key
  return `mock_token_${user.id}_${Date.now()}`;
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = mockStaffUsers.find(u => u.email === email && u.isActive);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Validate password
    if (!validatePassword(email, password)) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user);

    // Return success response
    return NextResponse.json({
      token,
      user,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Staff login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}