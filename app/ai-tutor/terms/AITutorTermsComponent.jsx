"use client";

import Link from "next/link";
import { FaArrowLeft, FaShieldAlt, FaUserCheck, FaExclamationTriangle, FaGavel } from "react-icons/fa";

const AITutorTermsComponent = () => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-black overflow-hidden">
      <div className="w-full h-full flex flex-col text-justify">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/ai-tutor"
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-4 py-2 rounded-full text-white"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm font-medium">Back to AI Tutor</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <FaGavel className="text-white text-xl" />
              <h1 className="text-xl font-bold">Terms of Service</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <FaShieldAlt className="text-blue-500" />
                  <span>Terms of Service</span>
                </h2>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      By accessing and using the JEE Challenger AI Tutor service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      JEE Challenger AI Tutor provides an AI-powered educational assistant designed to help students prepare for JEE (Joint Entrance Examination). The service includes personalized tutoring, practice questions, and study materials.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. User Accounts</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        • You must register with a valid Google account to use the AI Tutor service.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        • You are responsible for maintaining the confidentiality of your account.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        • You are responsible for all activities that occur under your account.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">4. Acceptable Use</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        You agree not to use the service to:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe upon the rights of others</li>
                        <li>Transmit harmful, offensive, or inappropriate content</li>
                        <li>Attempt to gain unauthorized access to the service</li>
                        <li>Use the service for commercial purposes without permission</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">5. Privacy and Data</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">6. Intellectual Property</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      The service and its original content, features, and functionality are owned by JEE Challenger and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">7. Disclaimers</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        • The service is provided "as is" without warranties of any kind.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        • We do not guarantee the accuracy, completeness, or usefulness of any information provided.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        • The service is not a substitute for professional educational guidance.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">8. Limitation of Liability</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      In no event shall JEE Challenger be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">9. Termination</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">10. Changes to Terms</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">11. Contact Information</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      If you have any questions about these Terms of Service, please contact us via{" "}
                      <Link href="/contact-us" className="text-blue-600 hover:underline">
                        our contact form
                      </Link>{" "}
                      or email us at{" "}
                      <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 hover:underline">
                        jeechallenger@gmail.com
                      </a>
                      .
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorTermsComponent; 