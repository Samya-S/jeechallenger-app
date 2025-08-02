"use client";

import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';

const SimpleGoogleAuth = ({ onLoginSuccess, onLoginError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      // Send Google ID token to your backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential  // This is the Google ID token
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();

      // Store token and user data based on your API response
      localStorage.setItem('ai-tutor-token', data.access_token);
      localStorage.setItem('ai-tutor-user', JSON.stringify(data.user));

      onLoginSuccess(data.user);
    } catch (error) {
      console.error('Google login error:', error);
      onLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.log('Google Login Failed');
    onLoginError('Google login failed. Please try again.');
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span>Signing in...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          disabled={isLoading}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="100%"
          className="!w-full"
        />
      )}
    </div>
  );
};

export default SimpleGoogleAuth; 