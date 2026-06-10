import { notFound } from "next/navigation";
import { ogImageMeta } from '@/lib/og-metadata';
// import AITutorPlansComponent from "./AITutorPlansComponent";

const pageOg = ogImageMeta({
  title: 'Subscription Plans - AI Tutor',
  subtitle: 'Pricing, limits, and features for AI Tutor',
  theme: 'ai-tutor',
  alt: 'AI Tutor Subscription Plans',
});

export const metadata = {
  title: "Subscription Plans - AI Tutor - JEE Challenger",
  description: "View all available subscription plans for the AI Tutor on JEE Challenger, including pricing, limits, and features.",
  alternates: {
    canonical: '/ai-tutor/plans',
  },
  // TODO: Change to index: true when AITutorPlansComponent is enabled
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Subscription Plans - AI Tutor | JEE Challenger',
    description: "View all available subscription plans for the AI Tutor on JEE Challenger, including pricing, limits, and features.",
    url: '/ai-tutor/plans',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subscription Plans - AI Tutor | JEE Challenger',
    description: "View all available subscription plans for the AI Tutor on JEE Challenger, including pricing, limits, and features.",
    images: pageOg.twitterImages,
  },
};

export default function AITutorPlansPage() {
  // return <AITutorPlansComponent />;
  return notFound();
}