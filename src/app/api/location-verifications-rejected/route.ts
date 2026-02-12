import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Location verifications rejected route working',
      data: []
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}