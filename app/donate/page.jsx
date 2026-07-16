import DonateComponent from './DonateComponent';
import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: 'Support Us',
  subtitle: 'Help keep JEE Challenger free for everyone',
  theme: 'brand',
  alt: 'Support JEE Challenger',
});

export const metadata = {
  title: "Support Us | JEE Challenger",
  description: "Support JEE Challenger to help us cover server costs, maintain the AI Tutor, and keep the platform completely free for all aspirants.",
  alternates: {
    canonical: '/donate',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Support Us - JEE Challenger",
    description: "Support JEE Challenger to help us cover server costs, maintain the AI Tutor, and keep the platform completely free for all aspirants.",
    url: '/donate',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Support Us - JEE Challenger",
    description: "Support JEE Challenger to help us cover server costs, maintain the AI Tutor, and keep the platform completely free for all aspirants.",
    images: pageOg.twitterImages,
  },
};

export default function DonatePage() {
  return <DonateComponent />;
}