"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

const SimpleGoogleAuth = ({ onLoginError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      // NextAuth securely handles the Google redirect and database integration
      await signIn('google', { callbackUrl: '/ai-tutor' });
    } catch (error) {
      console.error('Google login error:', error);
      if (onLoginError) onLoginError('Failed to initialize login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full max-w-sm flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          ) : (
            <FaGoogle className="text-red-500 text-lg" />
          )}
          <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleGoogleAuth;