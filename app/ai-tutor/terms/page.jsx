import AITutorTermsComponent from "./AITutorTermsComponent";

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
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tutor Terms of Service',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - AI Tutor | JEE Challenger',
    description: "Terms of Service for JEE Challenger AI Tutor. Read our terms and conditions for using the AI Tutor service.",
    images: ['/images/jcicon.jpg'],
  },
};

export default function AITutorTermsPage() {
  return <AITutorTermsComponent />;
} 