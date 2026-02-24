import AITutorComponent from "./AITutorComponent";

export const metadata = {
  title: "Free AI Tutor for JEE - 24/7 Doubt Solving & Step-by-Step Solutions",
  description: "Free AI-Powered JEE Tutor: Get instant doubt resolution for Physics, Chemistry & Maths. Step-by-step solutions, LaTeX support, file uploads. Available 24/7. Ask unlimited questions. Your personal JEE mentor - Start learning now!",
  alternates: {
    canonical: '/ai-tutor',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Tutor - JEE Challenger",
    description: "Get personalized JEE preparation help from our AI tutor. Ask questions about physics, chemistry, mathematics, and more.",
    url: '/ai-tutor',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tutor - Your Personal JEE Preparation Assistant',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Tutor - JEE Challenger",
    description: "Get personalized JEE preparation help from our AI tutor. Ask questions about physics, chemistry, mathematics, and more.",
    images: ['/images/jcicon.jpg'],
  },
};

export default function AITutorPage() {
  return <AITutorComponent />;
} 