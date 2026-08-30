import { Suspense } from "react";
import LoginClient from "./LoginClient";
import StructuredData from "@/components/common/StructuredData";
import { FaSpinner } from "react-icons/fa";

import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: 'Sign In',
  subtitle: 'Access your personalized JEE Challenger account',
  theme: 'dark',
  alt: 'Login to JEE Challenger',
});

export const metadata = {
  title: "Login | JEE Challenger",
  description: "Sign in to access your personalized JEE Challenger account and unlock all premium features seamlessly.",
  alternates: {
    canonical: '/login',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Login | JEE Challenger",
    description: "Sign in to access your personalized JEE Challenger account and unlock all premium features seamlessly.",
    url: '/login',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Login | JEE Challenger",
    description: "Sign in to access your personalized JEE Challenger account and unlock all premium features seamlessly.",
    images: pageOg.twitterImages,
  },
};

export default function LoginPage() {
  return (
    <>
      <StructuredData
        type="breadcrumb"
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Login", path: "/login" },
          ],
        }}
      />
      <div className="min-h-[100dvh] w-full flex flex-col">
        <Suspense
          fallback={
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          }
        >
          <LoginClient />
        </Suspense>
      </div>
    </>
  );
}
