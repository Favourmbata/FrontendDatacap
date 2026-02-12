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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  try {
    
    // Find the city region by ID
    const region = mockCityRegions.find(r => r.id === id);
    
    if (!region) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'City region not found',
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
        data: { region },
        message: 'City region retrieved successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching city region:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch city region',
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
    
    // Find the city region by ID
    const regionIndex = mockCityRegions.findIndex(r => r.id === id);
    
    if (regionIndex === -1) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'City region not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Update the region
    const updatedRegion = {
      ...mockCityRegions[regionIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    // In a real application, you would update the database
    // For now, we'll just return the updated region
    
    return new Response(
      JSON.stringify({
        success: true,
        data: { region: updatedRegion },
        message: 'City region updated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating city region:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to update city region',
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
    
    // Find the city region by ID
    const regionIndex = mockCityRegions.findIndex(r => r.id === id);
    
    if (regionIndex === -1) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'City region not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Remove the region from the array
    const deletedRegion = mockCityRegions.splice(regionIndex, 1)[0];
    
    // In a real application, you would delete from the database
    // For now, we'll just return success
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'City region deleted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting city region:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to delete city region',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}