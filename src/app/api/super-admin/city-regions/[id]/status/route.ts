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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  try {
    const body = await request.json();
    const { status } = body;
    
    if (!status || (status !== 'active' && status !== 'inactive')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid status. Must be either "active" or "inactive".',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
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
    
    // Update the status of the region
    const updatedRegion = {
      ...mockCityRegions[regionIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    // In a real application, you would update the database
    // For now, we'll just return the updated region
    
    return new Response(
      JSON.stringify({
        success: true,
        data: { region: updatedRegion },
        message: 'City region status updated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating city region status:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to update city region status',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}