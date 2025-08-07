"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaRobot, FaChevronDown, FaTrash, FaSignOutAlt, FaUser, FaComments } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

const AITutorNavbar = ({ user, onClearChat, onLogout, messages, showSignIn, onSignIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const isProfilePage = pathname === '/ai-tutor/profile';
  const isChatPage = pathname === '/ai-tutor';

  // Handle scroll detection for the messages container
  useEffect(() => {
    const handleScroll = () => {
      // Look for the messages container within the AI Tutor component
      const messagesContainer = document.querySelector('.overflow-y-auto');
      if (messagesContainer) {
        const scrolled = messagesContainer.scrollTop > 10 && isChatPage;
        setIsScrolled(scrolled);
      } else {
        // Fallback to window scroll
        const scrolled = window.scrollY > 10 && isChatPage;
        setIsScrolled(scrolled);
      }
    };

    // Set up a timer to check for the container periodically
    const checkForContainer = () => {
      const messagesContainer = document.querySelector('.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.addEventListener('scroll', handleScroll);
        return () => messagesContainer.removeEventListener('scroll', handleScroll);
      }
      return null;
    };

    // Try immediately
    let cleanup = checkForContainer();

    // If not found, check periodically
    if (!cleanup) {
      const interval = setInterval(() => {
        cleanup = checkForContainer();
        if (cleanup) {
          clearInterval(interval);
        }
      }, 100);

      return () => {
        clearInterval(interval);
        if (cleanup) cleanup();
      };
    }

    return cleanup;
  }, []);

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
    <div className={`bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 shadow-lg transition-all duration-300 ${isScrolled ? 'py-1' : 'py-4'
      }`}>
      <div className="flex items-center justify-between">
        {/* Left - Home Button */}
        <div className="flex items-center">
          <Link
            href="/"
            className={`flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full text-white ${isScrolled ? 'px-2.5 py-1' : 'px-4 py-2'
              }`}
            title="Go to Home"
          >
            <FaHome className={`transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'
              }`} />
            <span className={`font-medium transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'
              }`}>Return</span>
          </Link>
        </div>

        {/* Center - Title */}
        <Link href="/ai-tutor" className="flex items-center space-x-4">
          <div className={`bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${isScrolled ? 'w-8 h-8 m-1' : 'w-12 h-12'
            }`}>
            <FaRobot className={`text-white transition-all duration-300 ${isScrolled ? 'text-md' : 'text-xl'
              }`} />
          </div>
          <div className="text-left">
            <h1 className={`font-bold transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'
              }`}>
              JEE Challenger AI Tutor
            </h1>
            <p className={`text-blue-100 transition-all duration-300 ${isScrolled ? 'text-xs opacity-0 h-0 overflow-hidden' : 'text-sm'
              }`}>
              Your personalized JEE preparation assistant
            </p>
          </div>
        </Link>

        {/* Right - User Info Dropdown or Sign In Button */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {showSignIn ? (
            <button
              onClick={onSignIn}
              className={`bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isScrolled ? 'px-3 py-1' : 'px-5 py-2'
                }`}
            >
              Sign In
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className={`flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${isScrolled ? 'px-2 sm:px-2 py-1' : 'px-2 sm:px-3 py-2'
                  }`}
                title="User menu"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className={`rounded-full border-2 border-white/30 object-cover transition-all duration-300 ${isScrolled ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5 sm:w-6 sm:h-6'
                      }`}
                  />
                ) : (
                  <div className={`rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center transition-all duration-300 ${isScrolled ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5 sm:w-6 sm:h-6'
                    }`}>
                    <FaUser className={`text-white transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                      }`} />
                  </div>
                )}
                <span className={`font-medium text-white hidden sm:inline transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                  }`}>{user.name}</span>
                <FaChevronDown className={`text-white transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                  } ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AITutorNavbar; 