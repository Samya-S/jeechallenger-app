import AITutorPrivacyComponent from "./AITutorPrivacyComponent";

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
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tutor Privacy Policy',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - AI Tutor | JEE Challenger',
    description: "Privacy Policy for JEE Challenger AI Tutor. Learn how we collect, use, and protect your personal information.",
    images: ['/images/jcicon.jpg'],
  },
};

export default function AITutorPrivacyPage() {
  return <AITutorPrivacyComponent />;
} 