import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    
    // This is a mock response - in a real application, you would fetch from your database
    const mockServices = [
      {
        id: '1',
        serviceName: 'Tailoring Service',
        description: 'Professional tailoring service',
        category: 'Fashion',
        price: 5000,
        duration: 7,
        features: ['Custom fitting', 'Quality materials'],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        serviceName: 'Consultation Service',
        description: 'Expert consultation service',
        category: 'Business',
        price: 10000,
        duration: 14,
        features: ['Strategy planning', 'Implementation support'],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    // Filter if search is provided
    let filteredServices = mockServices;
    if (search) {
      filteredServices = mockServices.filter(service => 
        service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          services: paginatedServices,
          total: filteredServices.length,
          page,
          limit,
          totalPages: Math.ceil(filteredServices.length / limit),
        },
        message: 'Services retrieved successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching services:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch services',
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
    const newService = {
      id: Date.now().toString(),
      ...body,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return new Response(
      JSON.stringify({
        success: true,
        data: { service: newService },
        message: 'Service created successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create service',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}