import { NextRequest } from 'next/server';
import { VerificationData } from '@/types/staff';

// Mock verification data
const mockVerifications: VerificationData[] = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    // Find the verification by ID
    const verification = mockVerifications.find(v => v.id === id);

    if (!verification) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Verification not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { verification },
        message: 'Verification retrieved successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching verification:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch verification',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const body = await request.json();

    // Find the verification by ID
    const verificationIndex = mockVerifications.findIndex(v => v.id === id);

    if (verificationIndex === -1) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Verification not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update the verification
    const updatedVerification = {
      ...mockVerifications[verificationIndex],
      ...body,
      updatedAt: new Date(),
    };

    // Add to audit trail if status changed
    if (body.status && body.status !== mockVerifications[verificationIndex].status) {
      const action = body.status === 'approved' ? 'approved' : 
                    body.status === 'rejected' ? 'rejected' : 'updated';
      
      updatedVerification.auditTrail = [
        ...mockVerifications[verificationIndex].auditTrail,
        {
          id: `audit-${Date.now()}`,
          action,
          userId: body.userId || 'unknown', // In a real app, get from auth
          userName: body.userName || 'Unknown User',
          timestamp: new Date(),
          changes: { from: mockVerifications[verificationIndex].status, to: body.status },
        }
      ];
    }

    // Update the verification in the array
    mockVerifications[verificationIndex] = updatedVerification;

    return new Response(
      JSON.stringify({
        success: true,
        data: { verification: updatedVerification },
        message: 'Verification updated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating verification:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to update verification',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    // Find the verification by ID
    const verificationIndex = mockVerifications.findIndex(v => v.id === id);

    if (verificationIndex === -1) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Verification not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Remove the verification from the array
    const deletedVerification = mockVerifications.splice(verificationIndex, 1)[0];

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification deleted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting verification:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to delete verification',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}