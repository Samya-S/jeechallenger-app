import PrivacyPolicyComponent from "./PrivacyPolicyComponent";

export const metadata = {
  title: "Privacy Policy | JEE Challenger",
  description: "Privacy Policy for JEE Challenger - Learn how we collect, use, and protect your information when you use our platform.",
  openGraph: {
    title: "Privacy Policy - JEE Challenger",
    description: "Privacy Policy for JEE Challenger - Learn how we collect, use, and protect your information.",
    url: '/privacy-policy',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'JEE Challenger Privacy Policy',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy - JEE Challenger",
    description: "Privacy Policy for JEE Challenger - Learn how we collect, use, and protect your information.",
    images: ['/images/jcicon.jpg'],
  },
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyComponent />;
}
