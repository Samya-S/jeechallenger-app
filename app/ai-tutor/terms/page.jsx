import AITutorTermsComponent from "./AITutorTermsComponent";
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Terms of Service - AI Tutor',
  subtitle: 'Terms and conditions for using the AI Tutor',
  theme: 'legal',
  alt: 'AI Tutor Terms of Service',
});

export const metadata = {
  title: "Terms of Service - AI Tutor - JEE Challenger",
  description: "Terms of Service for JEE Challenger AI Tutor. Read our terms and conditions for using the AI Tutor service.",
  alternates: {
    canonical: '/ai-tutor/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service - AI Tutor | JEE Challenger',
    description: "Terms of Service for JEE Challenger AI Tutor. Read our terms and conditions for using the AI Tutor service.",
    url: '/ai-tutor/terms',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - AI Tutor | JEE Challenger',
    description: "Terms of Service for JEE Challenger AI Tutor. Read our terms and conditions for using the AI Tutor service.",
    images: pageOg.twitterImages,
  },
};

export default function AITutorTermsPage() {
  return <AITutorTermsComponent />;
} 