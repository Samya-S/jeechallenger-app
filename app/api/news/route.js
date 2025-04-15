import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=jee&lang=en&country=in&max=10&apikey=${process.env.GNEWS_API_KEY}`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }
} 