import { NextRequest, NextResponse } from 'next/server';
import { Organization } from '@/types/staff';

// Mock organization data
let mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'ABC Manufacturing Ltd',
    registrationNumber: 'RC-123456',
    address: '123 Industrial Avenue, Lagos',
    contactEmail: 'info@abcmanufacturing.com',
    contactPhone: '+234 801 234 5678',
    verificationStatus: 'in_progress',
    verifiedBadge: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(),
  },
  {
    id: 'org-2',
    name: 'XYZ Services Ltd',
    registrationNumber: 'RC-789012',
    address: '456 Business Center, Abuja',
    contactEmail: 'contact@xyzservices.com',
    contactPhone: '+234 902 345 6789',
    verificationStatus: 'verified',
    verifiedBadge: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 'org-3',
    name: 'DEF Retail Group',
    registrationNumber: 'RC-345678',
    address: '789 Mall Street, Port Harcourt',
    contactEmail: 'hello@defretail.com',
    contactPhone: '+234 813 456 7890',
    verificationStatus: 'not_started',
    verifiedBadge: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // max limit 100

    // Filter organizations based on status if provided
    let filteredOrganizations = mockOrganizations;
    
    if (status) {
      filteredOrganizations = filteredOrganizations.filter(org => org.verificationStatus === status);
    }
    
    if (search) {
      filteredOrganizations = filteredOrganizations.filter(org => 
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        org.contactEmail.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrganizations = filteredOrganizations.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        organizations: paginatedOrganizations,
        total: filteredOrganizations.length,
        page,
        limit,
        totalPages: Math.ceil(filteredOrganizations.length / limit),
      },
      message: 'Organizations retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.registrationNumber || !body.address || !body.contactEmail) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, registrationNumber, address, contactEmail' },
        { status: 400 }
      );
    }

    // Check if registration number already exists
    const existingOrg = mockOrganizations.find(org => org.registrationNumber === body.registrationNumber);
    if (existingOrg) {
      return NextResponse.json(
        { success: false, message: 'Organization with this registration number already exists' },
        { status: 409 }
      );
    }

    // Create new organization
    const newOrganization: Organization = {
      id: `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      registrationNumber: body.registrationNumber,
      address: body.address,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || '',
      verificationStatus: body.verificationStatus || 'not_started',
      verifiedBadge: body.verifiedBadge || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock data
    mockOrganizations.push(newOrganization);

    return NextResponse.json({
      success: true,
      data: { organization: newOrganization },
      message: 'Organization created successfully',
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create organization' },
      { status: 500 }
    );
  }
}