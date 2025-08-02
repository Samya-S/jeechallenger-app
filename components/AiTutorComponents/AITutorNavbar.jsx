"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaRobot, FaChevronDown, FaTrash, FaSignOutAlt, FaUser, FaComments } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

const AITutorNavbar = ({ user, onClearChat, onLogout, messages }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const isProfilePage = pathname === '/ai-tutor/profile';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left - Home Button */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-4 py-2 rounded-full text-white"
            title="Go to Home"
          >
            <FaHome className="text-sm" />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>

        {/* Center - Title */}
        <Link href="/ai-tutor" className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <FaRobot className="text-white text-xl" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold">
              JEE Challenger AI Tutor
            </h1>
            <p className="text-blue-100 text-sm">
              Your personalized JEE preparation assistant
            </p>
          </div>
        </Link>

        {/* Right - User Info Dropdown */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-2 sm:px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="User menu"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/30 object-cover"
                />
              ) : (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center">
                  <FaUser className="text-white text-xs sm:text-sm" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-white hidden sm:inline">{user.name}</span>
              <FaChevronDown className={`text-xs sm:text-sm text-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center space-x-3">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <FaUser className="text-blue-600 dark:text-blue-400 text-sm" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>
                {/* Menu Items */}
                <div className="py-2">
                  {isProfilePage ? (
                    <Link
                      href="/ai-tutor"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 space-x-3 group"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <FaComments className="text-blue-500 group-hover:text-blue-600 text-sm" />
                      </div>
                      <span className="font-medium">Chat</span>
                    </Link>
                  ) : (
                    <Link
                      href="/ai-tutor/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 space-x-3 group"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <FaUser className="text-blue-500 group-hover:text-blue-600 text-sm" />
                      </div>
                      <span className="font-medium">Profile</span>
                    </Link>
                  )}
                  {messages && messages.length > 0 && (
                    <button
                      onClick={() => { setDropdownOpen(false); onClearChat(); }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 space-x-3 group"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <FaTrash className="text-red-500 group-hover:text-red-600 text-sm" />
                      </div>
                      <span className="font-medium">Clear Chat History</span>
                    </button>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 space-x-3 group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <FaSignOutAlt className="text-red-500 group-hover:text-red-600 text-sm" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorNavbar; 