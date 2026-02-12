import { NextRequest } from 'next/server';

// Define the VerifiedSubscription interface
interface VerifiedSubscription {
  id: string;
  organizationName: string;
  organizationId: string;
  totalSubscriptionAmount: number; // in naira
  currency: string;
  totalNumberOfLocations: number;
  headquartersLocation: string;
  locationVerificationCost: number;
  subscriptionDuration: string; // e.g., "1 year", "6 months"
  address: string; // city's region
  city: string;
  lga: string;
  state: string;
  country: string;
  branches: Branch[];
  createdAt: string;
  updatedAt: string;
}

interface Branch {
  id: string;
  branchName: string;
  houseNumber: string;
  streetName: string;
  cityRegion: string;
  typeOfBuilding?: string; // optional
  lga: string;
  state: string;
  country: string;
  personName?: string; // optional
  position: string;
  emailAddress: string;
  phoneNumber: string;
  createdAt: string;
}

// In-memory storage for verified subscriptions (in production, this would be a database)
let verifiedSubscriptions: VerifiedSubscription[] = [
  {
    id: 'vs_001',
    organizationName: 'Global Tech Solutions',
    organizationId: 'org_001',
    totalSubscriptionAmount: 500000,
    currency: 'NGN',
    totalNumberOfLocations: 5,
    headquartersLocation: 'Lagos Mainland',
    locationVerificationCost: 250000,
    subscriptionDuration: '1 year',
    address: 'Ikoyi District',
    city: 'Lagos',
    lga: 'Lagos Mainland',
    state: 'Lagos',
    country: 'Nigeria',
    branches: [
      {
        id: 'br_001',
        branchName: 'Main Office',
        houseNumber: '123',
        streetName: 'Herbert Macaulay Way',
        cityRegion: 'Yaba',
        typeOfBuilding: 'Commercial Complex',
        lga: 'Yaba',
        state: 'Lagos',
        country: 'Nigeria',
        personName: 'John Doe',
        position: 'Manager',
        emailAddress: 'john.doe@example.com',
        phoneNumber: '+2348012345678',
        createdAt: '2024-01-01T00:00:00.000Z',
      }
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let filteredSubscriptions = [...verifiedSubscriptions];

    // Apply search filter if provided
    if (search) {
      filteredSubscriptions = filteredSubscriptions.filter(subscription =>
        subscription.organizationName.toLowerCase().includes(search.toLowerCase()) ||
        subscription.organizationId.toLowerCase().includes(search.toLowerCase()) ||
        subscription.headquartersLocation.toLowerCase().includes(search.toLowerCase())
      );
    }

    return Response.json({
      success: true,
      data: {
        subscriptions: filteredSubscriptions,
      },
      message: 'Verified subscriptions retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error retrieving verified subscriptions:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to retrieve verified subscriptions',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.organizationName || !body.totalSubscriptionAmount || !body.headquartersLocation) {
      return Response.json(
        { success: false, message: 'Organization name, total subscription amount, and headquarters location are required' },
        { status: 400 }
      );
    }

    // Create new verified subscription
    const newSubscription: VerifiedSubscription = {
      id: `vs_${Date.now()}`,
      organizationName: body.organizationName,
      organizationId: body.organizationId || `org_${Date.now()}`,
      totalSubscriptionAmount: body.totalSubscriptionAmount,
      currency: body.currency || 'NGN',
      totalNumberOfLocations: body.totalNumberOfLocations || 1,
      headquartersLocation: body.headquartersLocation,
      locationVerificationCost: body.locationVerificationCost || 0,
      subscriptionDuration: body.subscriptionDuration || '1 year',
      address: body.address || '',
      city: body.city || '',
      lga: body.lga || '',
      state: body.state || '',
      country: body.country || 'Nigeria',
      branches: body.branches || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    verifiedSubscriptions.push(newSubscription);

    return Response.json({
      success: true,
      data: {
        subscription: newSubscription,
      },
      message: 'Verified subscription created successfully',
    });
  } catch (error: any) {
    console.error('Error creating verified subscription:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to create verified subscription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle PUT and DELETE methods
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return Response.json(
        { success: false, message: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    const subscriptionIndex = verifiedSubscriptions.findIndex(sub => sub.id === body.id);
    
    if (subscriptionIndex === -1) {
      return Response.json(
        { success: false, message: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update subscription
    const updatedSubscription = {
      ...verifiedSubscriptions[subscriptionIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    verifiedSubscriptions[subscriptionIndex] = updatedSubscription;

    return Response.json({
      success: true,
      data: {
        subscription: updatedSubscription,
      },
      message: 'Verified subscription updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating verified subscription:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to update verified subscription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, message: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    const initialLength = verifiedSubscriptions.length;
    verifiedSubscriptions = verifiedSubscriptions.filter(sub => sub.id !== id);

    if (verifiedSubscriptions.length === initialLength) {
      return Response.json(
        { success: false, message: 'Subscription not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Verified subscription deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting verified subscription:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete verified subscription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}