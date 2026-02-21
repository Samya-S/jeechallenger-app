import { notFound } from "next/navigation";
// import AITutorPlansComponent from "./AITutorPlansComponent";

export const metadata = {
  title: "Subscription Plans - AI Tutor - JEE Challenger",
  description: "View all available subscription plans for the AI Tutor on JEE Challenger, including pricing, limits, and features.",
  openGraph: {
    title: 'Subscription Plans - AI Tutor | JEE Challenger',
    description: "View all available subscription plans for the AI Tutor on JEE Challenger, including pricing, limits, and features.",
    url: '/ai-tutor/plans',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tutor Subscription Plans',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subscription Plans - AI Tutor | JEE Challenger',
    description: "View all available subscription plans for the AI Tutor on JEE Challenger, including pricing, limits, and features.",
    images: ['/images/jcicon.jpg'],
  },
};

export default function AITutorPlansPage() {
  // return <AITutorPlansComponent />;
  return notFound();
}