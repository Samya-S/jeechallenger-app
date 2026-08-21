"use client";

import Breadcrumbs from '@/components/common/Breadcrumbs';
import Image from 'next/image';

const DonateComponent = () => {
  return (
    <div className="min-h-screen pt-4 pb-16 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        crumbs={[
          { label: "Support Us", href: "/donate" }
        ]}
        className="pb-12"
      />

      <div className="text-center w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in">

        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <span className="text-4xl">🚀</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          Keep JEE Challenger Running
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          We are committed to keeping our tools, trackers, and AI assistant free for all aspirants. However, high-traffic server architecture and API resources cost money. We currently rely on ads to keep the site running, but we hate them as much as you do! If our platform has added value to your preparation journey, consider chipping in. <strong>Once we reach our bare minimum funding goal to cover server costs, we will remove all pop-up ads and redirects completely!</strong>
        </p>

        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <Image
              src="/images/donation-qr.png"
              alt="Support us with UPI"
              className="w-56 h-56 sm:w-64 sm:h-64 object-cover"
              width={1000}
              height={1000}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
            Scan to pay with any UPI app
          </p>

          <div className="flex items-center w-full my-4">
            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
            <span className="px-4 text-sm text-gray-400 font-medium uppercase">OR</span>
            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
          </div>

          {/* UPI Button */}
          <a
            href="upi://pay?pa=samyasaha@upi&pn=JEE%20Challenger&cu=INR"
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-lg"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Pay via UPI App
          </a>
        </div>

      </div>
    </div>
  );
};

export default DonateComponent;