"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GoogleAuthButton from "@/app/login/GoogleAuthButton";
import { useState, useEffect } from "react";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState("");
  
  const returnUrl = searchParams.get("returnUrl") || searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "Callback" || errorParam === "AccessDenied") {
        setAuthError("Authentication was cancelled. Please try again.");
      } else {
        setAuthError("An error occurred during login. Please try again.");
      }
    }
  }, [searchParams]);

  return (
    <div className="flex-1 flex items-center justify-center p-4 w-full relative overflow-hidden bg-gray-50 dark:bg-gray-950">



      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 sm:p-10 relative overflow-hidden flex flex-col items-center">


          <div className="text-center mb-8 w-full">
            <div className="w-20 h-20 mx-auto mb-6 relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <Image 
                src="/images/jcicon.jpg" 
                alt="JEE Challenger Icon" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Sign in
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              to continue to JEE Challenger
            </p>
          </div>

          {authError && (
            <div className="w-full bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md mb-8">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{authError}</p>
            </div>
          )}

          <div className="w-full space-y-6">
            <GoogleAuthButton
              returnUrl={returnUrl}
              onLoginError={(msg) => setAuthError(msg)}
            />
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              New to JEE Challenger? Signing in will automatically create your account.
            </p>
          </div>

          <div className="text-center mt-8 w-full border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              By signing in, you agree to our{" "}
              <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
