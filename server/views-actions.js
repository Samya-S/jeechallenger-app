'use server';

import { Redis } from '@upstash/redis';

// This automatically uses the Upstash env variables we set earlier
const redis = Redis.fromEnv();

export async function incrementViewCount(slug) {
  if (!slug) return null;
  
  try {
    const views = await redis.incr(`views:articles:${slug}`);
    return views;
  } catch (error) {
    console.error('Failed to increment views:', error);
    return null;
  }
}

export async function getViewCount(slug) {
  if (!slug) return null;
  
  try {
    const views = await redis.get(`views:articles:${slug}`);
    return views || 0;
  } catch (error) {
    console.error('Failed to fetch views:', error);
    return null;
  }
}

export async function getBatchViewCounts(slugs) {
  if (!slugs || slugs.length === 0) return {};
  
  try {
    const keys = slugs.map(slug => `views:articles:${slug}`);
    
    // mget fetches multiple keys in a single Redis command
    const viewsArray = await redis.mget(...keys);
    
    // Map the results back to their slugs
    const viewsMap = {};
    slugs.forEach((slug, index) => {
      viewsMap[slug] = viewsArray[index] || 0;
    });
    
    return viewsMap;
  } catch (error) {
    console.error('Failed to fetch batch views:', error);
    return {};
  }
}