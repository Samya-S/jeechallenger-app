import AITutorProfileComponent from "./AITutorProfileComponent";

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
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tutor Profile Settings',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile - AI Tutor | JEE Challenger',
    description: "Manage your AI Tutor profile, settings, and preferences for personalized JEE preparation.",
    images: ['/images/jcicon.jpg'],
  },
};

export default function AITutorProfilePage() {
  return <AITutorProfileComponent />;
} 