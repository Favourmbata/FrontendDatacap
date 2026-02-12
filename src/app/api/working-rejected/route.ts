import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Simple working response
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Rejected locations route working',
      data: []
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}