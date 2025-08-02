"use client";
import Styles from "./Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import Hero from "./Hero";

import { YouTubeEmbed } from '@next/third-parties/google'
// import dynamic from 'next/dynamic';
// const YouTubeEmbed = dynamic(() =>
//   import('@next/third-parties/google').then((mod) => mod.YouTubeEmbed), { ssr: false }
// );

const HomeComponent = () => {
  const marqueeRef = useRef(null);

  const handleMouseOver = () => {
    if (marqueeRef.current) {
      marqueeRef.current.stop();
    }
  };

  const handleMouseOut = () => {
    if (marqueeRef.current) {
      marqueeRef.current.start();
    }
  };

  return (
    <div>
      <Hero />

      <section className="px-5 py-10 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 border-b border-gray-200 dark:border-b-0">
        <p className="heading text-4xl mb-6">JEE Papers and Official Links</p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Access official JEE Main and Advanced papers, answer keys, and important resources directly from the source.
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 pb-8 rounded-xl border border-green-200 dark:border-green-800">
              <p className="subheading text-2xl !text-green-700 dark:!text-green-300">JEE Main</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Official JEE Main papers and important updates from NTA
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                <li>• Previous year question papers</li>
                <li>• Official answer keys</li>
                <li>• Important notifications</li>
                <li>• Exam pattern updates</li>
              </ul>
              <Link href="/official-links/jee-main" aria-label="Access official JEE Main resources and links">
                <button className={`button1 mb-4 mt-2`}>View Papers</button>
              </Link>
            </div>

            <div className="bg-sky-50 dark:bg-sky-900/20 p-6 pb-8 rounded-xl border border-sky-200 dark:border-sky-800">
              <p className="subheading text-2xl !text-sky-700 dark:!text-sky-300">JEE Advanced</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Official JEE Advanced papers and resources from IITs
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                <li>• Previous year papers</li>
                <li>• Official solutions</li>
                <li>• Cut-off analysis</li>
                <li>• Admission information</li>
              </ul>
              <Link href="/official-links/jee-advanced" aria-label="Access official JEE Advanced resources and links">
                <button className={`button1 mb-4 mt-2`}>View Papers</button>
              </Link>
            </div>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <p className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Quick Links</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="https://jeemain.nta.ac.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                JEE Main Official Website
              </Link>
              <Link href="https://jeeadv.ac.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                JEE Advanced Official Website
              </Link>
              <Link href="https://nta.ac.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                NTA Official Website
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 px-5 py-10 border-b border-gray-200 dark:border-b-0">
        <div className="text-center max-w-6xl mx-auto">
          <p className="heading text-4xl mb-4">The Subjects</p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Master the three core subjects of JEE with our comprehensive study materials and resources
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-xl hover:shadow-lg transition-shadow flex flex-col h-full">
              <Image
                className="thumbnailImg rounded-lg mb-4 w-full h-auto"
                src="/images/physics.jpg"
                alt="Physics"
                width={180}
                height={180}
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Physics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic">
                "Physics is an attempt conceptually to grasp reality as something that is considered to be independent of its being observed. In this sense one speaks of physical reality."
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">- Albert Einstein</p>
              <div className="mt-auto">
                <Link href="/materials/physics" aria-label="Explore Physics study materials">
                  <button className="button1">Find out more</button>
                </Link>
              </div>
            </div>
            
                        <div className="p-6 rounded-xl hover:shadow-lg transition-shadow flex flex-col h-full">
              <Image
                className="thumbnailImg rounded-lg mb-4 w-full h-auto"
                src="/images/chemistry.jpg"
                alt="Chemistry"
                width={180}
                height={180}
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Chemistry</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic">
                "Chemists do not usually stutter. It would be very awkward if they did, seeing that they have at times to get out such words as methylethylamylophenylium."
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">- William Crookes</p>
              <div className="mt-auto">
                <Link href="/materials/chemistry" aria-label="Explore Chemistry study materials">
                  <button className="button1">Find out more</button>
                </Link>
              </div>
            </div>
            
                        <div className="p-6 rounded-xl hover:shadow-lg transition-shadow flex flex-col h-full">
              <Image
                className="thumbnailImg rounded-lg mb-4 w-full h-auto"
                src="/images/maths.jpg"
                alt="Mathematics"
                width={180}
                height={180}
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Mathematics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic">
                "A man is like a fraction whose numerator is what he is and whose denominator is what he thinks of himself. The larger the denominator, the smaller the fraction."
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">- Leo Tolstoy</p>
              <div className="mt-auto">
                <Link href="/materials/mathematics" aria-label="Explore Mathematics study materials">
                  <button className="button1">Find out more</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 border-b border-gray-200 dark:border-b-0">
        <div className="text-center max-w-6xl mx-auto">
          <p className="heading text-4xl mb-4">More Contents</p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Additional study materials and learning platforms to enhance your JEE preparation
          </p>
          
          {/* Study Materials Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Study Materials</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             <div className="p-6 rounded-xl hover:shadow-lg transition-shadow">
                 <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">📚 Chapter-wise Solved PYQs</h4>
                <Image
                  className="thumbnailImg rounded-lg mb-4"
                  src="/images/pyqs.jpg"
                  alt="Chapter wise solved PYQs"
                  width={1080}
                  height={540}
                />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get chapter-wise solved previous 43 years' JEE papers published by Arihant and Disha publication
                </p>
                                 <Link href="/materials/chapterwise-solved-pyqs" aria-label="View Chapter wise solved previous years' JEE papers">
                   <button className="button1">View PYQs</button>
                 </Link>
              </div>
              
                             <div className="p-6 rounded-xl hover:shadow-lg transition-shadow">
                 <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">📖 NCERT Books (PDF)</h4>
                <Image
                  className="thumbnailImg rounded-lg mb-4"
                  src="/images/ncertpdfs.jpg"
                  alt="NCERT PDFs"
                  width={1080}
                  height={540}
                />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Access official NCERT textbooks in PDF format from the NCERT official website
                </p>
                                 <Link href="https://ncert.nic.in/textbook.php" target="_blank" aria-label="Get official NCERT textbooks in PDF format">
                   <button className="button1">Get NCERT Books</button>
                 </Link>
              </div>
            </div>
          </div>
          
          {/* Learning Platforms Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Learning Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="p-6 rounded-xl hover:shadow-lg transition-shadow">
                 <Image
                   className="thumbnailImg rounded-lg mb-4"
                   src="/images/Unacademy-banner.jpg"
                   alt="Unacademy"
                   width={1080}
                   height={540}
                 />
                 <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Unacademy</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  India's Largest Learning Platform. Coaching by Top Educators.
                </p>
                                 <Link href="/more-platforms/unacademy" aria-label="Visit Unacademy for India's largest learning platform">
                   <button className="button1">Visit Platform</button>
                 </Link>
              </div>
              
                             <div className="p-6 rounded-xl hover:shadow-lg transition-shadow">
                 <Image
                   className="thumbnailImg rounded-lg mb-4"
                   src="/images/apnikaksha2.jpg"
                   alt="Apni Kaksha"
                   width={1080}
                   height={540}
                 />
                 <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Apni Kaksha</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Premium Education for All for free or at the most affordable price
                </p>
                                 <Link href="/more-platforms/apnikaksha" aria-label="Visit Apni Kaksha for affordable education">
                   <button className="button1">Visit Platform</button>
                 </Link>
              </div>
              
                             <div className="p-6 rounded-xl hover:shadow-lg transition-shadow">
                 <Image
                   className="thumbnailImg rounded-lg mb-4"
                   src="/images/pwallah.jpg"
                   alt="Physics Wallah"
                   width={1080}
                   height={540}
                 />
                 <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Physics Wallah</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  The most affordable learning platform that cares about you
                </p>
                                 <Link href="/more-platforms/physicswallah" aria-label="Visit Physics Wallah for affordable learning">
                   <button className="button1">Visit Platform</button>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="message bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 px-5 py-10 border-b border-gray-200 dark:border-b-0">
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Contribute to JEE Challenger
          </h3>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Help fellow JEE aspirants by sharing your study materials, notes, and resources
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">📚 Study Notes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share your handwritten notes, summaries, and important formulas
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">📝 Practice Papers</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload solved papers, mock tests, and practice questions
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">🎯 Tips & Tricks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share your study strategies, time management tips, and shortcuts
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800 mb-6">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">How to Contribute:</h4>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left max-w-2xl mx-auto">
              <li>1. Click the "Upload Files" button below</li>
              <li>2. You'll be redirected to our Google Drive folder</li>
              <li>3. Upload your study materials (PDF, images, documents)</li>
              <li>4. Add a brief description of your content</li>
              <li>5. Your materials will be reviewed and added to the website</li>
            </ol>
          </div>

          <marquee
            ref={marqueeRef}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            scrollamount={15}
            className="subheading text-2xl pb-4 text-red-600 dark:text-red-400"
          >
            🎉 Join our community of contributors! Your materials can help thousands of JEE aspirants 👇
          </marquee>

          <Link
            href="https://drive.google.com/drive/folders/1gs_ehca1F1-K9g3q_Q0mTteUSGzd6z8F?usp=sharing"
            target="_blank"
            aria-label="Upload your study materials to the website"
            className="inline-block"
          >
            <button className="button2 text-lg !px-4 !py-2 whitespace-nowrap">Upload Files</button>
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            All contributions are reviewed to ensure quality and relevance
          </p>
        </div>
      </section>

      <section className="px-5 py-10 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 border-b border-gray-200 dark:border-b-0">
        <div className="text-center max-w-4xl mx-auto">
          <p className="heading text-4xl mb-4">ISI Aspirant?</p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Planning to pursue Mathematics and Statistics at the Indian Statistical Institute? We've got you covered!
          </p>

          <div className="max-w-[720px] mx-auto mb-8">
            <YouTubeEmbed videoid="6Ebb-oe2IUc" params="" />
          </div>

          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Guide to ISI</p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            A comprehensive website for ISI aspirants with admission information, course details, and helpful resources
          </p>
          <Link href="https://samya-s.github.io/guidetoisi/" target="_blank" aria-label="Visit the Guide to ISI website">
            <button className="button2 !px-6 !py-2">Visit Website</button>
          </Link>
        </div>
      </section>

      {/* SEO links for AI Tutor pages - visually hidden but accessible to crawlers */}
      <div className="sr-only">
        <Link href="/ai-tutor/privacy">AI Tutor Privacy Policy</Link>
        <Link href="/ai-tutor/terms">AI Tutor Terms of Service</Link>
      </div>
    </div>
  );
};

export default HomeComponent;
