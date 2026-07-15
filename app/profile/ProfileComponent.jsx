"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaCog, FaShieldAlt, FaPalette, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@teispace/next-themes";

const profileImageLoader = ({ src }) => src;

const ProfileContent = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const returnUrl = searchParams.get('returnUrl');

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const profilePath = `/profile${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
      router.push(`/login?returnUrl=${encodeURIComponent(profilePath)}`);
      return;
    }

    if (status === "authenticated") {
      setUser(session.user);
      setLoading(false);
    }
  }, [status, session, router, returnUrl]);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col text-left">
      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-4xl mx-auto">

          {/* Back Button */}
          {returnUrl && (
            <button
              onClick={() => router.push(returnUrl)}
              className="mb-4 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
          )}

          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={80}
                  height={80}
                  loader={profileImageLoader}
                  unoptimized
                  className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-3xl" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 truncate text-sm sm:text-base">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Joined on {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                  })}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <FaCog className="text-gray-500" />
              <span>Account Settings</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <FaUser className="text-blue-500" />
                  <span>Personal Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Name</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Privacy */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <FaShieldAlt className="text-purple-500" />
                  <span>Legal & Privacy</span>
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Privacy Policy</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Read our privacy policy</p>
                    </div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">→</span>
                  </Link>
                  <Link
                    href="/terms-of-service"
                    target="_blank"
                    className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Terms of Service</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Read our terms of service</p>
                    </div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">→</span>
                  </Link>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <FaPalette className="text-orange-500" />
                  <span>Preferences</span>
                </h3>
                <div className="space-y-3">
                  <div
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Dark/Light mode</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      {theme === "dark" ? "Dark" : "Light"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Account */}
            <div className="pt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FaTrash className="text-red-500" />
                <span>Account Actions</span>
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      Permanent Account Deletion
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      To delete your account and all associated data, please email us at{' '}
                      <a
                        href="mailto:jeechallenger@gmail.com"
                        className="underline hover:text-red-800 dark:hover:text-red-200"
                      >
                        jeechallenger@gmail.com
                      </a>
                      {' '}with your request.
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400 mt-3">
                      This action cannot be undone. All your data, including chat history and uploaded files, will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileComponent = () => {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
};

export default ProfileComponent;
