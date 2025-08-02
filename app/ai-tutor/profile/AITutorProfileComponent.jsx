"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaRobot, FaCog, FaHistory, FaBookmark, FaChartLine } from "react-icons/fa";
import AITutorNavbar from "@/components/AiTutorComponents/AITutorNavbar";

const AITutorProfileComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('ai-tutor-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
        router.push('/ai-tutor');
      }
    } else {
      router.push('/ai-tutor');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ai-tutor-user');
    localStorage.removeItem('ai-tutor-messages');
    localStorage.removeItem('ai-tutor-token');
    router.push('/ai-tutor');
  };



  if (loading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-black overflow-hidden">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <AITutorNavbar
          user={user}
          onClearChat={() => {}}
          onLogout={handleLogout}
          messages={[]}
        />

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="max-w-4xl mx-auto">

            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-3xl" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FaHistory className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <FaBookmark className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Saved Topics</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Study Hours</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">48</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <FaCog className="text-gray-500" />
                <span>Settings & Preferences</span>
              </h2>

                             <div className="space-y-4">
                 {/* Account Settings */}
                 <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                     Account Settings
                   </h3>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                         <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                       </div>
                       <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                         Change
                       </button>
                     </div>
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

export default AITutorProfileComponent; 