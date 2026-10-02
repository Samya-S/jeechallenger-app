"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, BookOpen } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";

// Dynamically import 3D Canvas for smooth client-side hydration
const HeroAnimation3D = dynamic(() => import("./HeroAnimation3D"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
    </div>
  ),
});

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-14 lg:pb-20 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Background Decorative Glow Spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: High-Impact Typography & Action Suite */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-50/90 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-sm mx-auto lg:mx-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>JEE Main & Advanced Ready</span>
              <span className="w-px h-3.5 bg-blue-300 dark:bg-blue-700/80" aria-hidden="true" />
              <span className="font-bold text-indigo-600 dark:text-indigo-400">All-in-One Platform</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.12]">
                <span className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                  All That You Need
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  to Excel in JEE
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-200 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed pt-2">
                Your complete preparation ecosystem. Practice authentic chapter-wise PYQs, solve doubts 24/7 with our AI Tutor, access curated revision notes, and track all 88 syllabus chapters.
              </p>
            </div>

            {/* Primary & Secondary Action Buttons (Side-by-side with natural widths) */}
            <div className="flex flex-row flex-nowrap gap-2.5 sm:gap-4 justify-center lg:justify-start items-center pt-2">
              {/* Primary Action: AI Tutor */}
              <Link
                href="/ai-tutor"
                className="group relative inline-flex items-center justify-center px-4 sm:px-7 py-3 sm:py-4 rounded-xl font-bold text-white text-xs sm:text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
              >
                <FaChalkboardTeacher className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2.5 text-blue-200 group-hover:scale-110 transition-transform shrink-0" />
                <span>Try AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>

              {/* Secondary Action: Question Bank */}
              <Link
                href="/previous-year-questions"
                className="group inline-flex items-center justify-center px-3.5 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-white text-xs sm:text-base bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 mr-1.5 sm:mr-2 text-amber-100 group-hover:rotate-6 transition-transform shrink-0" />
                <span>Solve PYQs</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>

          </div>

          {/* Right Column: 3D Interactive Quantum Simulation Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <HeroAnimation3D />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;