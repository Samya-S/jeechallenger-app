"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import Hero from "./Hero";
import FeatureHub from "./FeatureHub";
import FAQSection from "./FAQSection";

// Lazy load floating scroll to top button
const ScrollToTopButton = dynamic(() => import("@/components/ui/ScrollToTopButton"), {
  ssr: false,
  loading: () => null
});

const HomeComponent = ({ latestArticles }) => {
  return (
    <div className="min-h-screen text-left text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* 1. REVAMPED HERO SECTION WITH 3D CANVAS & ZERO GAP */}
      <Hero />

      {/* 2. UNIFIED FEATURE HUB (AI Tutor, Syllabus Tracker, PYQs, Subject Resources, JEE Papers, Articles) */}
      <FeatureHub latestArticles={latestArticles} />

      {/* 3. FREQUENTLY ASKED QUESTIONS (Smooth CSS Grid Accordion) */}
      <FAQSection />

      {/* SEO links for legal pages - visually hidden but accessible to crawlers */}
      <div className="sr-only">
        <Link href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
        <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
        <Link href="/disclaimer" target="_blank" rel="noopener noreferrer">Disclaimer</Link>
      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton
        gradientColors="from-blue-600 to-purple-600"
        hoverColors="hover:from-blue-700 hover:to-purple-700"
      />

    </div>
  );
};

export default HomeComponent;
