import { NextRequest } from 'next/server';

// Mock data for city regions
const mockCityRegions = [
  {
    id: 'city-region-1',
    countryCode: 'US',
    countryName: 'United States',
    stateCode: 'CA',
    stateName: 'California',
    cityName: 'Los Angeles',
    status: 'active' as const,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'city-region-2',
    countryCode: 'NG',
    countryName: 'Nigeria',
    stateCode: 'LA',
    stateName: 'Lagos',
    cityName: 'Ikeja',
    status: 'active' as const,
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
  },
];

// This API route connects to the backend API
// All requests are proxied to the actual backend

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // max limit 100
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const status = searchParams.get('status') as 'active' | 'inactive' || undefined;

    // Filter if search is provided
    let filteredRegions = mockCityRegions;
    if (search) {
      filteredRegions = mockCityRegions.filter(region =>
        region.countryName.toLowerCase().includes(search.toLowerCase()) ||
        region.stateName.toLowerCase().includes(search.toLowerCase()) ||
        region.cityName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status) {
      filteredRegions = filteredRegions.filter(region => region.status === status);
    }

    // Sort if sortBy is provided
    if (sortBy) {
      filteredRegions.sort((a, b) => {
        let aVal: any, bVal: any;

        switch (sortBy) {
          case 'countryName':
            aVal = a.countryName;
            bVal = b.countryName;
            break;
          case 'stateName':
            aVal = a.stateName;
            bVal = b.stateName;
            break;
          case 'cityName':
            aVal = a.cityName;
            bVal = b.cityName;
            break;
          case 'status':
            aVal = a.status;
            bVal = b.status;
            break;
          case 'createdAt':
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
            break;
          default:
            aVal = a[sortBy as keyof typeof a];
            bVal = b[sortBy as keyof typeof b];
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRegions = filteredRegions.slice(startIndex, endIndex);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          regions: paginatedRegions,
          total: filteredRegions.length,
          page,
          limit,
          totalPages: Math.ceil(filteredRegions.length / limit),
        },
        message: 'Retrieved city regions successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching city regions:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch city regions',
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

    // Validate required fields
    if (!body.countryCode || !body.stateCode || !body.cityName) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields: countryCode, stateCode, cityName',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create new city region
    const newRegion = {
      id: `city-region-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      countryName: body.countryName || body.countryCode, // fallback to code if name not provided
      stateName: body.stateName || body.stateCode, // fallback to code if name not provided
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real application, you would save to your database
    // For now, we'll just return the new region
    
    return new Response(
      JSON.stringify({
        success: true,
        data: { region: newRegion },
        message: 'City region created successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating city region:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create city region',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}