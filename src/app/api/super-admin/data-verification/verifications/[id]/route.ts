import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/super-admin/data-verification/verifications/:id
export async function GET(
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

    // Mock implementation - in real app, call your backend service
    const mockVerification = {
      _id: id,
      verificationId: 'DV-1705320600000-ABC123',
      verifierUserId: 'user-123',
      verifierName: 'John Doe',
      country: 'Nigeria',
      state: 'Lagos',
      lga: 'Ikeja',
      city: 'Ikeja',
      cityRegion: 'Allen Avenue',
      organizationId: 'org-123',
      organizationName: 'Tech Company Ltd',
      targetUserId: 'user-456',
      targetUserFirstName: 'Jane',
      targetUserLastName: 'Smith',
      organizationDetails: {
        name: 'Tech Company Ltd',
        attachments: [
          {
            fileUrl: 'https://cloudinary.com/doc1.pdf',
            comments: 'Company registration certificate'
          }
        ],
        headquartersAddress: '123 Allen Avenue, Ikeja, Lagos',
        addressAttachments: [
          {
            fileUrl: 'https://cloudinary.com/address-proof.jpg',
            comments: 'Utility bill showing address'
          }
        ]
      },
      buildingPictures: {
        frontView: 'https://cloudinary.com/front-view.jpg',
        streetPicture: 'https://cloudinary.com/street-view.jpg',
        agentInFrontBuilding: 'https://cloudinary.com/agent-front.jpg',
        whatsappLocation: 'https://cloudinary.com/whatsapp-location.jpg',
        insideOrganization: 'https://cloudinary.com/inside-office.jpg',
        withStaffOrOwner: 'https://cloudinary.com/with-staff.jpg',
        videoWithNeighbor: 'https://cloudinary.com/neighbor-video.mp4'
      },
      transportationCost: {
        going: [
          {
            startPoint: 'Ojota',
            time: '08:00',
            nextDestination: 'Berger',
            fareSpent: 200,
            timeSpent: '30 minutes'
          }
        ],
        finalDestination: 'Allen Avenue',
        finalFareSpent: 100,
        finalTime: '09:15',
        totalJourneyTime: '1 hour 15 minutes',
        comingBack: {
          totalTransportationCost: 1200,
          otherExpensesCost: 500,
          receiptUrl: 'https://cloudinary.com/receipt.jpg'
        }
      },
      status: 'submitted',
      submittedAt: '2024-01-15T10:30:00.000Z',
      createdAt: '2024-01-15T09:00:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z'
    };

    const mockResponse = {
      success: true,
      data: {
        verification: mockVerification
      },
      message: 'Verification details retrieved successfully'
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error fetching verification details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}