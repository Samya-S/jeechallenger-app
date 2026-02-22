import "./globals.css";
import ConditionalLayout from "@/components/AiTutorComponents/ConditionalLayout";
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
// import SplashCursor from "@/components/utils/SplashCursor";

export const metadata = {
  title: "JEE Challenger - Complete JEE Preparation Platform",
  description: "A one-stop platform for all your JEE preparation needs, featuring books, notes, PYQs, and other study materials. Get free access to Physics, Chemistry, and Mathematics resources.",
  keywords: ["JEE", "JEE Main", "JEE Advanced", "JEE preparation", "study materials", "PYQ", "previous year questions", "physics", "chemistry", "mathematics", "notes", "books"],
  authors: [{ name: "JEE Challenger" }],
  creator: "JEE Challenger",
  publisher: "JEE Challenger",
  metadataBase: new URL('https://jeechallenger.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: "JEE Challenger - Complete JEE Preparation Platform",
    description: "A one-stop platform for all your JEE preparation needs, featuring books, notes, PYQs, and other study materials. Get free access to Physics, Chemistry, and Mathematics resources.",
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        secureUrl: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'JEE Challenger - Your JEE Preparation Partner',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "JEE Challenger - Complete JEE Preparation Platform",
    description: "A one-stop platform for all your JEE preparation needs, featuring books, notes, PYQs, and other study materials.",
    images: ['/images/jcicon.jpg'],
    creator: '@JEEChallenger',
    site: '@JEEChallenger',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'dhTZDOYU3j0wTAQ4ttTfL9hupgGzAAOVHVJofDPIaKQ',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for external domains - improve cache performance */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        
        <link rel="preload" href="/fonts/Jost-VariableFont_wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/images/home.webp" as="image" media="(max-width: 900px)" />
        {/* <meta name="google-site-verification" content="dhTZDOYU3j0wTAQ4ttTfL9hupgGzAAOVHVJofDPIaKQ" /> */}
        <meta name="google-adsense-account" content="ca-pub-5566043353022333" />
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566043353022333" crossOrigin="anonymous" /> */}
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          {/* <SplashCursor /> */}
        </ThemeProvider>

        {/* Lazy load Google AdSense only when needed */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566043353022333"
          strategy="lazyOnload"
          crossOrigin="anonymous"
          onLoad={() => {
            // Set longer cache in memory after load
            if (typeof window !== 'undefined') {
              window.adsLoaded = true;
            }
          }}
        />
      </body>
      <GoogleAnalytics gaId="G-6YPF169T9S" />
    </html>
  );
}
