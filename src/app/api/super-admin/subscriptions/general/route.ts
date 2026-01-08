import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    // This is a mock response - in a real application, you would fetch from your database
    const mockSubscriptions = [
      {
        id: '1',
        name: 'Standard Plan',
        price: 5000,
        duration: 'Monthly',
        features: ['Basic Access', 'Email Support'],
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Premium Plan',
        price: 10000,
        duration: 'Monthly',
        features: ['Full Access', 'Priority Support', 'Advanced Features'],
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Filter if search is provided
    let filteredSubscriptions = mockSubscriptions;
    if (search) {
      filteredSubscriptions = mockSubscriptions.filter(sub => 
        sub.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          subscriptions: filteredSubscriptions,
          total: filteredSubscriptions.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        message: 'General subscriptions retrieved successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching general subscriptions:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch general subscriptions',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // This is a mock response - in a real application, you would save to your database
    const newSubscription = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    return new Response(
      JSON.stringify({
        success: true,
        data: { subscription: newSubscription },
        message: 'General subscription created successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating general subscription:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create general subscription',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}