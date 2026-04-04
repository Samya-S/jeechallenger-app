import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-screen border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual Side - Mobile First */}
          <div className="relative order-1 lg:order-2">
            <div className="relative w-full aspect-square">
              <Image
                src="/images/home.webp"
                alt="JEE Challenger - Free IIT JEE Study Materials, AI Tutor, Previous Year Questions and Complete Preparation Platform for JEE Main and Advanced"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover rounded-2xl"
                priority
                fetchPriority="high"
              />
            </div>
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
                <Link
                  href="/ai-tutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-64 sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 items-center justify-center whitespace-nowrap"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform flex-shrink-0" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38.33-62.14-49.94-112.62-112-112.62zm-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96-96 42.98-96 96 42.98 96 96 96zM592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0z"/>
                  </svg>
                  Try AI Tutor
                </Link>
              </div>

              <div className="flex justify-center sm:justify-start">
                <Link
                  href="https://t.me/+oOnj4y_ZYqYyZjA1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-64 sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 items-center justify-center whitespace-nowrap"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                  Join us on Telegram
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