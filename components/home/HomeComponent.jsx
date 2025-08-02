"use client";
import Styles from "./Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import Hero from "./Hero";
import ScrollToTopButton from '@/components/utils/ScrollToTopButton';

import { YouTubeEmbed } from '@next/third-parties/google'

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
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <Hero />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              JEE Papers and Official Links
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access official JEE Main and Advanced papers, answer keys, and important resources directly from the source.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-200 dark:border-green-800 overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  JEE Main
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                  Official JEE Main papers and important updates from NTA
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 mb-6 space-y-2 w-fit mx-auto flex-grow">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Previous year question papers
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Official answer keys
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Important notifications
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Exam pattern updates
                  </li>
                </ul>
                <div className="text-center">
                  <Link href="/official-links/jee-main" aria-label="Access official JEE Main resources and links" className="mt-auto">
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Papers
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-sky-200 dark:border-sky-800 overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  JEE Advanced
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                  Official JEE Advanced papers and resources from IITs
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 mb-6 space-y-2 w-fit mx-auto flex-grow">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mr-3"></div>
                    Previous year papers
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mr-3"></div>
                    Official solutions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mr-3"></div>
                    Cut-off analysis
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mr-3"></div>
                    Admission information
                  </li>
                </ul>
                <div className="text-center">
                  <Link href="/official-links/jee-advanced" aria-label="Access official JEE Advanced resources and links" className="mt-auto">
                    <button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Papers
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 p-6">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4 text-center">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="https://jeemain.nta.ac.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center justify-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                JEE Main Official Website
              </Link>
              <Link href="https://jeeadv.ac.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center justify-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                JEE Advanced Official Website
              </Link>
              <Link href="https://nta.ac.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center justify-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                NTA Official Website
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Subjects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Master the three core subjects of JEE with our comprehensive study materials and resources
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-grow">
                <Image
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  src="/images/physics.jpg"
                  alt="Physics"
                  width={180}
                  height={180}
                />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Physics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic flex-grow">
                  "Physics is an attempt conceptually to grasp reality as something that is considered to be independent of its being observed. In this sense one speaks of physical reality."
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">- Albert Einstein</p>
                <div className="mt-auto">
                  <Link href="/materials/physics" aria-label="Explore Physics study materials" className="mt-auto">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Find out more
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-grow">
                <Image
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  src="/images/chemistry.jpg"
                  alt="Chemistry"
                  width={180}
                  height={180}
                />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Chemistry</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic flex-grow">
                  "Chemists do not usually stutter. It would be very awkward if they did, seeing that they have at times to get out such words as methylethylamylophenylium."
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">- William Crookes</p>
                <div className="mt-auto">
                  <Link href="/materials/chemistry" aria-label="Explore Chemistry study materials" className="mt-auto">
                    <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Find out more
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-grow">
                <Image
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  src="/images/maths.jpg"
                  alt="Mathematics"
                  width={180}
                  height={180}
                />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Mathematics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic flex-grow">
                  "A man is like a fraction whose numerator is what he is and whose denominator is what he thinks of himself. The larger the denominator, the smaller the fraction."
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">- Leo Tolstoy</p>
                <div className="mt-auto">
                  <Link href="/materials/mathematics" aria-label="Explore Mathematics study materials" className="mt-auto">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Find out more
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              More Contents
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Additional study materials and learning platforms to enhance your JEE preparation
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Study Materials Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Study Materials</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                <div className="p-6 h-full flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">📚 Chapter-wise Solved PYQs</h4>
                  <Image
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    src="/images/pyqs.jpg"
                    alt="Chapter wise solved PYQs"
                    width={1080}
                    height={540}
                  />
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Get chapter-wise solved previous 43 years' JEE papers published by Arihant and Disha publication
                  </p>
                  <Link href="/materials/chapterwise-solved-pyqs" aria-label="View Chapter wise solved previous years' JEE papers" className="mt-auto">
                    <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View PYQs
                      </span>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                <div className="p-6 h-full flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">📖 NCERT Books (PDF)</h4>
                  <Image
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    src="/images/ncertpdfs.jpg"
                    alt="NCERT PDFs"
                    width={1080}
                    height={540}
                  />
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Access official NCERT textbooks in PDF format from the NCERT official website
                  </p>
                  <Link href="https://ncert.nic.in/textbook.php" target="_blank" aria-label="Get official NCERT textbooks in PDF format" className="mt-auto">
                    <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Get NCERT Books
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Platforms Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Learning Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-grow">
                  <Image
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    src="/images/Unacademy-banner.jpg"
                    alt="Unacademy"
                    width={1080}
                    height={540}
                  />
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Unacademy</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                    India's Largest Learning Platform. Coaching by Top Educators.
                  </p>
                  <Link href="/more-platforms/unacademy" aria-label="Visit Unacademy for India's largest learning platform" className="mt-auto">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Platform
                      </span>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-grow">
                  <Image
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    src="/images/apnikaksha2.jpg"
                    alt="Apni Kaksha"
                    width={1080}
                    height={540}
                  />
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Apni Kaksha</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                    Premium Education for All for free or at the most affordable price
                  </p>
                  <Link href="/more-platforms/apnikaksha" aria-label="Visit Apni Kaksha for affordable education" className="mt-auto">
                    <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Platform
                      </span>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-grow">
                  <Image
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    src="/images/pwallah.jpg"
                    alt="Physics Wallah"
                    width={1080}
                    height={540}
                  />
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Physics Wallah</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                    The most affordable learning platform that cares about you
                  </p>
                  <Link href="/more-platforms/physicswallah" aria-label="Visit Physics Wallah for affordable learning" className="mt-auto">
                    <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Platform
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contribute to JEE Challenger
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Help fellow JEE aspirants by sharing your study materials, notes, and resources
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg border border-green-200 dark:border-green-800 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 text-center">📚 Study Notes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Share your handwritten notes, summaries, and important formulas
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 text-center">📝 Practice Papers</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Upload solved papers, mock tests, and practice questions
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 text-center">🎯 Tips & Tricks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Share your study strategies, time management tips, and shortcuts
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl shadow-lg border border-yellow-200 dark:border-yellow-800 p-6 mb-6">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-center">How to Contribute:</h4>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left max-w-2xl mx-auto">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">1</span>
                Click the "Upload Files" button below
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</span>
                You'll be redirected to our Google Drive folder
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</span>
                Upload your study materials (PDF, images, documents)
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">4</span>
                Add a brief description of your content
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">5</span>
                Your materials will be reviewed and added to the website
              </li>
            </ol>
          </div>

          <marquee
            ref={marqueeRef}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            scrollamount={15}
            className="text-2xl pb-4 text-red-600 dark:text-red-400 font-semibold"
          >
            🎉 Join our community of contributors! Your materials can help thousands of JEE aspirants 👇
          </marquee>

          <div className="text-center">
            <Link
              href="https://drive.google.com/drive/folders/1gs_ehca1F1-K9g3q_Q0mTteUSGzd6z8F?usp=sharing"
              target="_blank"
              aria-label="Upload your study materials to the website"
              className="inline-block"
            >
              <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-lg">
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Files
                </span>
              </button>
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              All contributions are reviewed to ensure quality and relevance
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ISI Aspirant?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Planning to pursue Mathematics and Statistics at the Indian Statistical Institute? We've got you covered!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="max-w-[720px] mx-auto mb-8">
            <YouTubeEmbed videoid="6Ebb-oe2IUc" params="" />
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Guide to ISI</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              A comprehensive website for ISI aspirants with admission information, course details, and helpful resources
            </p>
            <Link href="https://samya-s.github.io/guidetoisi/" target="_blank" aria-label="Visit the Guide to ISI website">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Website
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO links for AI Tutor pages - visually hidden but accessible to crawlers */}
      <div className="sr-only">
        <Link href="/ai-tutor/privacy">AI Tutor Privacy Policy</Link>
        <Link href="/ai-tutor/terms">AI Tutor Terms of Service</Link>
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
