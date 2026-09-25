"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Mail, Send, Clock, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import { submitContactUsForm } from "@/server/contact-actions";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const ScrollToTopButton = dynamic(() => import('@/components/ui/ScrollToTopButton'), {
  ssr: false
});

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ContactUsComponent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = 
    formData.name.trim() !== "" && 
    validateEmail(formData.email) && 
    formData.message.trim() !== "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);

    try {
      const result = await submitContactUsForm(formData);

      if (result.success) {
        setResponseMessage("Woohoo! Your message is on its way. Thank you!");
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitted(true);
        setIsError(false);
        setTimeout(() => setIsSubmitted(false), 10000);
      } else {
        setErrorMessage("Oops! Something went wrong. Please try again.");
        setIsError(true);
        setIsSubmitted(false);
        setTimeout(() => setIsError(false), 10000);
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
      setIsError(true);
      setIsSubmitted(false);
      setTimeout(() => setIsError(false), 10000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-[#090d16] text-left [main:has(&)]:min-h-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Standard Breadcrumb - No hero banner */}
        <Breadcrumbs
          crumbs={[
            { label: "Contact Us", href: "/contact-us" }
          ]} 
          className="mb-6"
        />

        {/* Connected Card: Left Info Panel + Right Message Form */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-md shadow-slate-200/70 dark:shadow-none border border-slate-200 dark:border-gray-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Context & Direct Reachout */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-[#0d1320] p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-gray-800 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/80 dark:border-blue-800/60 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>We&apos;re here to help</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Get in Touch
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Have questions about study materials, feature suggestions, paper error reports, or feedback? Drop us a note anytime.
                </p>
              </div>

              {/* Direct Channels */}
              <div className="space-y-3.5">
                {/* Email Card */}
                <a
                  href="mailto:jeechallenger@gmail.com"
                  className="group flex items-start gap-3.5 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        Direct Email
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      jeechallenger@gmail.com
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                      Fastest channel for official inquiries
                    </span>
                  </div>
                </a>

                {/* Telegram Channel Card */}
                <a
                  href="https://t.me/+oOnj4y_ZYqYyZjA1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-800 hover:border-sky-500/60 dark:hover:border-sky-500/60 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FaTelegram className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        Telegram Channel
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-sky-500 transition-colors truncate">
                      Join our Telegram Channel
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                      Instant discussions, paper updates &amp; resources
                    </span>
                  </div>
                </a>

                {/* Response Time Info - Clean inline text, no border box */}
                <div className="flex items-center gap-2 pt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>
                    We typically review and respond within <strong className="whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">24–48 hours</strong>.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="pt-4 border-t border-slate-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
              <span>Looking for policies? Read our </span>
              <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</Link>
              <span> and </span>
              <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Terms</Link>.
            </div>
          </div>

          {/* Right Panel: Interactive Message Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-white dark:bg-[#111827] flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Send us a Message
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Fill in your details below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 dark:text-white placeholder-gray-400 text-sm transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-[#090d16] border rounded-xl focus:outline-none dark:text-white placeholder-gray-400 text-sm transition-colors ${
                      formData.email && !validateEmail(formData.email)
                        ? "border-red-500 dark:border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-400"
                    }`}
                  />
                  {formData.email && !validateEmail(formData.email) && (
                    <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us what's on your mind or how we can assist you..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 dark:text-white placeholder-gray-400 text-sm transition-colors resize-none custom-scrollbar"
                  />
                </div>

                {/* Submit CTA */}
                <button 
                  type="submit" 
                  disabled={isLoading || !isFormValid}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              {/* Status Notifications */}
              {isSubmitted && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-xs sm:text-sm font-medium">
                    {responseMessage || "Woohoo! Your message is on its way. Thank you!"}
                  </p>
                </div>
              )}

              {isError && (
                <div className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <p className="text-xs sm:text-sm font-medium">
                    {errorMessage || "Oops! Something went wrong. Please try again."}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 text-center">
              We respect your privacy. Your information is never sold or shared with third parties.
            </p>
          </div>

        </div>
      </div>

      <ScrollToTopButton 
        gradientColors="from-blue-600 to-purple-600" 
        hoverColors="hover:from-blue-700 hover:to-purple-700" 
      />
    </div>
  );
};

export default ContactUsComponent;
