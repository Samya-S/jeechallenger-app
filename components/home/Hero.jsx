"use client";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-screen border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual Side - Mobile First */}
          <div className="relative order-1 lg:order-2">
            <Image
              src="/images/home.webp"
              alt="JEE Challenger - Your Path to Success"
              width={600}
              height={600}
              className="w-full h-auto rounded-2xl"
              priority
            />
          </div>

          {/* Content Side */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1 mb-5 md:mb-10 lg:mb-0">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  All That You Need
                </span>
                <br />
                <span className="text-gray-800 dark:text-gray-100">
                  to Excel in JEE
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0">
                Comprehensive study materials, solved papers, and expert guidance for JEE Main & Advanced aspirants
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex justify-center sm:justify-start">
                <Link href="/ai-tutor" className="group w-64 sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Try AI Tutor 🤖
                  </button>
                </Link>
              </div>

              <div className="flex justify-center sm:justify-start">
                <Link href="https://t.me/+oOnj4y_ZYqYyZjA1" target="_blank" className="group w-64 sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                    Join us on Telegram
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 