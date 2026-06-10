import PrivacyPolicyComponent from "./PrivacyPolicyComponent";
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Privacy Policy',
  subtitle: 'How we collect, use, and protect your information',
  theme: 'legal',
  alt: 'JEE Challenger Privacy Policy',
});

export const metadata = {
  title: "Privacy Policy | JEE Challenger",
  description: "Privacy Policy for JEE Challenger - Learn how we collect, use, and protect your information when you use our platform.",
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy - JEE Challenger",
    description: "Privacy Policy for JEE Challenger - Learn how we collect, use, and protect your information.",
    url: '/privacy-policy',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy - JEE Challenger",
    description: "Privacy Policy for JEE Challenger - Learn how we collect, use, and protect your information.",
    images: pageOg.twitterImages,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyComponent />;
}
