"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChalkboardTeacher, FaChevronDown, FaTrash, FaSignOutAlt, FaUser, FaComments } from "react-icons/fa";
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
    <div className={`bg-gradient-to-r from-blue-600 to-purple-700 text-white px-2 sm:px-4 lg:px-6 shadow-lg transition-all duration-300 ${isScrolled ? 'py-1 sm:py-1' : 'py-2 sm:py-3 lg:py-4'
      }`}>
      <div className="flex items-center justify-between gap-1 sm:gap-2 lg:gap-4">
        {/* Left - Home Button */}
        <div className="flex items-center flex-shrink-0">
          <Link
            href="/"
            className={`flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full text-white ${isScrolled ? 'px-2 sm:px-2.5 py-0.5 sm:py-1' : 'px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2'
              }`}
            title="Go to Home"
          >
            <FaHome className={`transition-all duration-300 ${isScrolled ? 'text-xs sm:text-xs' : 'text-xs sm:text-sm'
              }`} />
            <span className={`font-medium transition-all duration-300 hidden xs:inline ${isScrolled ? 'text-xs sm:text-xs' : 'text-xs sm:text-sm'
              }`}>Return</span>
          </Link>
        </div>

        {/* Center - Title */}
        <Link href="/ai-tutor" className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-1 min-w-0 justify-center">
          <div className={`bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isScrolled ? 'w-6 h-6 sm:w-8 sm:h-8 lg:m-1' : 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12'
            }`}>
            <FaChalkboardTeacher className={`text-white transition-all duration-300 ${isScrolled ? 'text-xs sm:text-md lg:text-md' : 'text-sm sm:text-lg lg:text-xl'
              }`} />
          </div>
          <div className="text-left min-w-0 flex-1">
            <h1 className={`font-bold transition-all duration-300 truncate ${isScrolled ? 'text-sm sm:text-lg lg:text-xl' : 'text-base sm:text-xl lg:text-2xl'
              }`}>
              <span className="hidden sm:inline">JEE Challenger AI Tutor</span>
              <span className="inline sm:hidden">AI Tutor</span>
            </h1>
            <p className={`text-blue-100 transition-all duration-300 truncate hidden md:block ${isScrolled ? 'text-xs opacity-0 h-0 overflow-hidden' : 'text-xs sm:text-sm'
              }`}>
              Your personalized JEE preparation assistant
            </p>
          </div>
        </Link>

        {/* Right - User Info Dropdown or Sign In Button */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
          {showSignIn ? (
            <button
              onClick={onSignIn}
              className={`bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap ${isScrolled ? 'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm' : 'px-3 sm:px-4 lg:px-5 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm'
                }`}
            >
              <span className="hidden xs:inline">Sign In</span>
              <span className="inline xs:hidden">
                <FaUser className="text-xs" />
              </span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className={`flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${isScrolled ? 'px-1.5 sm:px-2 py-0.5 sm:py-1' : 'px-2 sm:px-3 py-1 sm:py-1.5 lg:py-2'
                  }`}
                title="User menu"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className={`rounded-full border-2 border-white/30 object-cover transition-all duration-300 flex-shrink-0 ${isScrolled ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8'
                      }`}
                  />
                ) : (
                  <div className={`rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isScrolled ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8'
                    }`}>
                    <FaUser className={`text-white transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                      }`} />
                  </div>
                )}
                <span className={`font-medium text-white hidden md:inline transition-all duration-300 truncate max-w-[100px] lg:max-w-[150px] ${isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                  }`}>{user.name}</span>
                <FaChevronDown className={`text-white transition-all duration-300 hidden sm:inline ${isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                  } ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
                  {/* Menu Items */}
                  <div className="py-1 sm:py-2">
                    {isProfilePage ? (
                      <Link
                        href="/ai-tutor"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 space-x-2 sm:space-x-3 group"
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                          <FaComments className="text-blue-500 group-hover:text-blue-600 text-xs sm:text-sm" />
                        </div>
                        <span className="font-medium">Chat</span>
                      </Link>
                    ) : (
                      <Link
                        href="/ai-tutor/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 space-x-2 sm:space-x-3 group"
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                          <FaUser className="text-blue-500 group-hover:text-blue-600 text-xs sm:text-sm" />
                        </div>
                        <span className="font-medium">Profile</span>
                      </Link>
                    )}
                    {messages && messages.length > 0 && (
                      <button
                        onClick={() => { setDropdownOpen(false); onClearChat(); }}
                        className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 space-x-2 sm:space-x-3 group"
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                          <FaTrash className="text-red-500 group-hover:text-red-600 text-xs sm:text-sm" />
                        </div>
                        <span className="font-medium">Clear Chat</span>
                      </button>
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-0.5 sm:my-1"></div>
                    <button
                      onClick={() => { setDropdownOpen(false); onLogout(); }}
                      className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 space-x-2 sm:space-x-3 group"
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                        <FaSignOutAlt className="text-red-500 group-hover:text-red-600 text-xs sm:text-sm" />
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