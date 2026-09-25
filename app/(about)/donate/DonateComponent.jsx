"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShieldCheck, Smartphone, Copy, Check } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const UPI_ID = "samyasaha@upi";

const DonateComponent = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors silently
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-[#090d16] text-left [main:has(&)]:min-h-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <Breadcrumbs
          crumbs={[
            { label: "Support Us", href: "/donate" }
          ]}
          className="mb-6"
        />

        {/* Connected Split-Panel Card */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-md shadow-slate-200/70 dark:shadow-none border border-slate-200 dark:border-gray-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Mission & Motivation */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#111827]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/80 dark:border-blue-800/60 mb-4">
                <Heart className="w-3.5 h-3.5" />
                <span>Support Us</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Keep JEE Challenger Running
              </h1>

              <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                We are committed to keeping our tools, trackers, resources, and AI assistant free for all aspirants. However, maintaining our infrastructure and keeping the platform running smoothly costs money.
              </p>

              <p className="mt-3.5 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                We currently rely on ads to keep the site running, but we hate them as much as you do! If our platform has added value to your preparation journey, consider chipping in.
              </p>

              {/* Highlighted Goal Callout */}
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/25 border border-blue-200/90 dark:border-blue-800/50 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-[15px] font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                  Once we reach our bare minimum funding goal to cover infrastructure costs, we will remove all pop-up ads and redirects completely!
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: QR Code & UPI Payment */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-[#0d1320] p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
            {/* QR Code */}
            <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
              <Image
                src="/images/donation-qr.png"
                alt="Support us with UPI"
                className="w-48 h-48 sm:w-52 sm:h-52 object-cover rounded-lg"
                width={1000}
                height={1000}
                priority
              />
            </div>

            <p className="mt-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
              Scan to pay with any UPI app
            </p>

            {/* Copyable UPI ID Chip */}
            <button
              type="button"
              onClick={handleCopyUpi}
              className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-2xs text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
              title="Copy UPI ID"
            >
              <span className="font-mono text-gray-900 dark:text-white">{UPI_ID}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>

            <div className="flex items-center w-full max-w-xs my-5">
              <div className="flex-grow border-t border-slate-200 dark:border-gray-800" />
              <span className="px-3 text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">OR</span>
              <div className="flex-grow border-t border-slate-200 dark:border-gray-800" />
            </div>

            {/* UPI Button */}
            <a
              href="upi://pay?pa=samyasaha@upi&pn=JEE%20Challenger&cu=INR"
              className="w-full max-w-xs inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-150"
            >
              <Smartphone className="w-4 h-4" />
              <span>Pay via UPI App</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonateComponent;