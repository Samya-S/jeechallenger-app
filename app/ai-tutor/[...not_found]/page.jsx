import { notFound } from "next/navigation";
import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: '404 - Page Not Found',
  subtitle: "The AI Tutor couldn't find the page you are looking for.",
  theme: 'ai-tutor',
  alt: 'AI Tutor - Page Not Found',
});

export const metadata = {
  title: "Page Not Found - AI Tutor | JEE Challenger",
  description: "Oops! It looks like the AI Tutor couldn't find the page you are looking for.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Page Not Found - AI Tutor | JEE Challenger",
    description: "Oops! It looks like the AI Tutor couldn't find the page you are looking for.",
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Page Not Found - AI Tutor | JEE Challenger",
    description: "Oops! It looks like the AI Tutor couldn't find the page you are looking for.",
    images: pageOg.twitterImages,
  },
};

export default function AITutorCatchAll() {
  // This explicitly triggers the app/ai-tutor/not-found.jsx file 
  // whenever a user visits a URL under /ai-tutor/ that doesn't exist.
  notFound();
}