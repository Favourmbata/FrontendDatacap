import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Simple rejected locations route working',
      data: []
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}