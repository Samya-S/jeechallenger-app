import SyllabusTrackerComponent from './SyllabusTrackerComponent';

export const metadata = {
  title: 'Syllabus Tracker | JEE Challenger',
  description: 'Track your JEE preparation progress across Physics, Chemistry, and Mathematics. Mark chapters as complete for Theory, PYQs, and Revision. Stay organized and motivated with our comprehensive syllabus tracker.',
  alternates: {
    canonical: '/syllabus-tracker',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Syllabus Tracker - JEE Challenger',
    description: 'Track your JEE preparation progress across Physics, Chemistry, and Mathematics. Mark chapters as complete for Theory, PYQs, and Revision.',
    url: '/syllabus-tracker',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'JEE Syllabus Tracker - Track Your Preparation Progress',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Syllabus Tracker - JEE Challenger',
    description: 'Track your JEE preparation progress across Physics, Chemistry, and Mathematics. Mark chapters as complete for Theory, PYQs, and Revision.',
    images: ['/images/jcicon.jpg'],
  },
};

export default function SyllabusTrackerPage() {
  return <SyllabusTrackerComponent />;
}
