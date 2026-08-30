import TermsOfServiceComponent from './TermsOfServiceComponent';
import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: 'Terms of Service',
  subtitle: 'Rules governing your use of JEE Challenger and all its features',
  theme: 'legal',
  alt: 'JEE Challenger Terms of Service',
});

export const metadata = {
  title: "Terms of Service | JEE Challenger",
  description: "Terms of Service for JEE Challenger - Read the rules governing your use of JEE Challenger and all its features, including the AI Tutor.",
  alternates: {
    canonical: '/terms-of-service',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | JEE Challenger",
    description: "Terms of Service for JEE Challenger - Read the rules governing your use of JEE Challenger and all its features.",
    url: '/terms-of-service',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms of Service | JEE Challenger",
    description: "Terms of Service for JEE Challenger - Read the rules governing your use of JEE Challenger and all its features.",
    images: pageOg.twitterImages,
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceComponent />;
}
