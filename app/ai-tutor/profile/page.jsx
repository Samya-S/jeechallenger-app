import AITutorProfileComponent from "./AITutorProfileComponent";
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Profile - AI Tutor',
  subtitle: 'Manage your settings and preferences',
  theme: 'ai-tutor',
  alt: 'AI Tutor Profile Settings',
});

export const metadata = {
  title: "Profile - AI Tutor - JEE Challenger",
  description: "Manage your AI Tutor profile, settings, and preferences for personalized JEE preparation.",
  alternates: {
    canonical: '/ai-tutor/profile',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Profile - AI Tutor | JEE Challenger',
    description: "Manage your AI Tutor profile, settings, and preferences for personalized JEE preparation.",
    url: '/ai-tutor/profile',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile - AI Tutor | JEE Challenger',
    description: "Manage your AI Tutor profile, settings, and preferences for personalized JEE preparation.",
    images: pageOg.twitterImages,
  },
};

export default function AITutorProfilePage() {
  return <AITutorProfileComponent />;
} 