import ProfileComponent from "./ProfileComponent";
import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: 'Profile - JEE Challenger',
  subtitle: 'Manage your settings and preferences',
  theme: 'default',
  alt: 'JEE Challenger Profile Settings',
});

export const metadata = {
  title: "Profile - JEE Challenger",
  description: "Manage your JEE Challenger profile, settings, and preferences.",
  alternates: {
    canonical: '/profile',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Profile | JEE Challenger',
    description: "Manage your JEE Challenger profile, settings, and preferences.",
    url: '/profile',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile | JEE Challenger',
    description: "Manage your JEE Challenger profile, settings, and preferences.",
    images: pageOg.twitterImages,
  },
};

export default function ProfilePage() {
  return <ProfileComponent />;
}
