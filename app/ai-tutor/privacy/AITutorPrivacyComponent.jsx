"use client";

import Link from "next/link";
import { FaArrowLeft, FaShieldAlt, FaUserCheck, FaExclamationTriangle, FaLock } from "react-icons/fa";

const AITutorPrivacyComponent = () => {
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
              <FaLock className="text-white text-xl" />
              <h1 className="text-xl font-bold">Privacy Policy</h1>
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
                  <span>Privacy Policy</span>
                </h2>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Information We Collect</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Personal Information</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          When you sign in with Google, we collect your name, email address, and profile picture. This information is used to personalize your AI Tutor experience and maintain your account.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Usage Data</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          We collect information about how you interact with the AI Tutor, including chat messages, study preferences, and learning progress to improve your experience.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Technical Information</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          We automatically collect certain technical information such as your IP address, browser type, device information, and usage patterns to ensure service functionality and security.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        We use the collected information for the following purposes:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        <li>To provide and maintain the AI Tutor service</li>
                        <li>To personalize your learning experience</li>
                        <li>To improve our service and develop new features</li>
                        <li>To communicate with you about service updates</li>
                        <li>To ensure security and prevent fraud</li>
                        <li>To comply with legal obligations</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. Information Sharing</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                    </p>
                    <div className="space-y-2 mt-3">
                      <p className="text-gray-600 dark:text-gray-400">
                        • <strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our service.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        • <strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        • <strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred to the new entity.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">4. Data Security</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        We implement appropriate security measures to protect your personal information:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        <li>Encryption of data in transit and at rest</li>
                        <li>Regular security assessments and updates</li>
                        <li>Access controls and authentication measures</li>
                        <li>Secure data storage practices</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">5. Data Retention</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Chat history and learning data are stored locally on your device and can be cleared at any time.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">6. Your Rights</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        You have the following rights regarding your personal information:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        <li><strong>Access:</strong> Request access to your personal information</li>
                        <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                        <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                        <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                        <li><strong>Objection:</strong> Object to certain processing of your information</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">7. Cookies and Tracking</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our service. You can control cookie settings through your browser preferences.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">8. Children's Privacy</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">9. International Transfers</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">10. Changes to This Policy</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use of the service after such changes constitutes acceptance of the updated policy.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">11. Contact Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      If you have any questions about this Privacy Policy or our data practices, please contact us via{" "}
                      <Link href="/contact-us" className="text-blue-600 hover:underline">
                        our contact form
                      </Link>{" "}
                      or email us at{" "}
                      <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 hover:underline">
                        jeechallenger@gmail.com
                      </a>
                      . We are committed to addressing your concerns and protecting your privacy.
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

export default AITutorPrivacyComponent; 