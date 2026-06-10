import AITutorPrivacyComponent from "./AITutorPrivacyComponent";
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Privacy Policy - AI Tutor',
  subtitle: 'How we handle your personal information',
  theme: 'legal',
  alt: 'AI Tutor Privacy Policy',
});

export const metadata = {
  title: "Privacy Policy - AI Tutor - JEE Challenger",
  description: "Privacy Policy for JEE Challenger AI Tutor. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: '/ai-tutor/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy - AI Tutor | JEE Challenger',
    description: "Privacy Policy for JEE Challenger AI Tutor. Learn how we collect, use, and protect your personal information.",
    url: '/ai-tutor/privacy',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - AI Tutor | JEE Challenger',
    description: "Privacy Policy for JEE Challenger AI Tutor. Learn how we collect, use, and protect your personal information.",
    images: pageOg.twitterImages,
  },
};

export default function AITutorPrivacyPage() {
  return <AITutorPrivacyComponent />;
} 