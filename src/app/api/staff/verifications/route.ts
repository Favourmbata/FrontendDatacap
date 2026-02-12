import { NextRequest, NextResponse } from 'next/server';
import { VerificationData } from '@/types/staff';

// Mock verification data
let mockVerifications: VerificationData[] = [
  {
    id: 'verification-1',
    organizationId: 'org-1',
    taskId: 'task-1',
    collectedBy: '1',
    data: {
      'org-name': 'ABC Manufacturing Ltd',
      'reg-number': 'RC-123456',
      'address': '123 Industrial Avenue, Lagos',
      'contact-email': 'info@abcmanufacturing.com',
      'contact-phone': '+234 801 234 5678',
      'business-type': 'Manufacturing',
      'employees-count': '150',
      'annual-revenue': '500,000,000',
      'operating-years': '8',
    },
    documents: [
      {
        id: 'doc-1',
        filename: 'certificate.pdf',
        originalName: 'Certificate_of_Incorporation.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        url: '#',
        uploadedAt: new Date(),
      },
      {
        id: 'doc-2',
        filename: 'license.jpg',
        originalName: 'Business_License.jpg',
        mimeType: 'image/jpeg',
        size: 512000,
        url: '#',
        uploadedAt: new Date(),
      },
    ],
    status: 'submitted',
    auditTrail: [
      {
        id: 'audit-1',
        action: 'created',
        userId: '1',
        userName: 'John Doe',
        timestamp: new Date(),
        changes: {},
      },
      {
        id: 'audit-2',
        action: 'submitted',
        userId: '1',
        userName: 'John Doe',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        changes: {},
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verification-2',
    organizationId: 'org-2',
    taskId: 'task-2',
    collectedBy: '1',
    data: {
      'org-name': 'XYZ Services Ltd',
      'reg-number': 'RC-789012',
      'address': '456 Business Center, Abuja',
      'contact-email': 'contact@xyzservices.com',
      'contact-phone': '+234 902 345 6789',
      'business-type': 'Services',
      'employees-count': '75',
      'annual-revenue': '300,000,000',
      'operating-years': '5',
    },
    documents: [
      {
        id: 'doc-3',
        filename: 'certificate.pdf',
        originalName: 'Certificate_of_Incorporation.pdf',
        mimeType: 'application/pdf',
        size: 2048000,
        url: '#',
        uploadedAt: new Date(),
      },
    ],
    status: 'approved',
    auditTrail: [
      {
        id: 'audit-3',
        action: 'created',
        userId: '1',
        userName: 'John Doe',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        changes: {},
      },
      {
        id: 'audit-4',
        action: 'approved',
        userId: '2',
        userName: 'Jane Smith',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        changes: {},
      },
    ],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // max limit 100

    // Filter verifications based on status if provided
    let filteredVerifications = mockVerifications;
    
    if (status) {
      filteredVerifications = filteredVerifications.filter(v => v.status === status);
    }
    
    if (search) {
      filteredVerifications = filteredVerifications.filter(v => 
        v.data['org-name']?.toLowerCase().includes(search.toLowerCase()) ||
        v.data['reg-number']?.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVerifications = filteredVerifications.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        verifications: paginatedVerifications,
        total: filteredVerifications.length,
        page,
        limit,
        totalPages: Math.ceil(filteredVerifications.length / limit),
      },
      message: 'Verifications retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.organizationId || !body.taskId || !body.collectedBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: organizationId, taskId, collectedBy' },
        { status: 400 }
      );
    }

    // Create new verification
    const newVerification: VerificationData = {
      id: `verification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organizationId: body.organizationId,
      taskId: body.taskId,
      collectedBy: body.collectedBy,
      data: body.data || {},
      documents: body.documents || [],
      status: body.status || 'draft',
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          action: 'created',
          userId: body.collectedBy,
          userName: 'Unknown User', // In a real app, get user name from auth
          timestamp: new Date(),
          changes: {},
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock data
    mockVerifications.push(newVerification);

    return NextResponse.json({
      success: true,
      data: { verification: newVerification },
      message: 'Verification created successfully',
    });
  } catch (error) {
    console.error('Error creating verification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create verification' },
      { status: 500 }
    );
  }
}