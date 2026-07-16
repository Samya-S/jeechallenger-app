// const PRODUCTION_URL = 'https://jeechallenger.vercel.app';
const PRODUCTION_URL = 'https://www.jeechallenger.com';

export function getSiteUrl() {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3000';
    return `http://localhost:${port}`;
  }
  return PRODUCTION_URL;
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}
