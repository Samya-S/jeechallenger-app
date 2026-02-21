'use server';

export async function fetchNews() {
  const apiKey = process.env.GNEWS_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key is not configured');
  }

  const response = await fetch(
    `https://gnews.io/api/v4/search?q=iit%20jee&lang=en&country=in&max=10&apikey=${apiKey}`,
    {
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

