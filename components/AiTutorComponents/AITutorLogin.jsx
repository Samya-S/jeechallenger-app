"use client";

import Link from "next/link";
import { FaHome, FaRobot } from "react-icons/fa";
import SimpleGoogleAuth from "./auth/SimpleGoogleAuth";

const AITutorLogin = ({ onLoginSuccess, onLoginError, authError }) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaRobot className="text-white text-3xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to JEE Challenger AI Tutor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your personalized AI Tutor
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Error Message */}
            {authError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{authError}</p>
              </div>
            )}

            {/* Google Login Button */}
            <SimpleGoogleAuth
              onLoginSuccess={onLoginSuccess}
              onLoginError={onLoginError}
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Secure authentication powered by Google
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 w-fit mx-auto">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                What you'll get:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Personalized AI Tutor access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Chat history across devices</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Premium features and study materials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link href="/ai-tutor/terms" target="_blank" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/ai-tutor/privacy" target="_blank" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaHome className="text-sm" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AITutorLogin; 