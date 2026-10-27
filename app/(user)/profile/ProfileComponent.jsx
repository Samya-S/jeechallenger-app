"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaCog, FaShieldAlt, FaPalette, FaTrash, FaArrowLeft } from "react-icons/fa";
import { Award, History, Target, ArrowRight, Clock } from "lucide-react";
import { useTheme } from "@teispace/next-themes";

const profileImageLoader = ({ src }) => src;

const ProfileContent = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cbtAttempts, setCbtAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
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
      fetch('/api/cbt/attempts')
        .then((res) => res.json())
        .then((d) => {
          setCbtAttempts(d.submissions || []);
          setLoadingAttempts(false);
        })
        .catch(() => setLoadingAttempts(false));
      setLoading(false);
    }
  }, [status, session, router, returnUrl]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center [main:has(&)]:min-h-0">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-left [main:has(&)]:min-h-0">
      {/* Profile Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-12">
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 sm:p-8 mb-6">
            <div className="flex items-center space-x-4 sm:space-x-5">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={80}
                  height={80}
                  loader={profileImageLoader}
                  unoptimized
                  className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover shadow-sm"
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

          {/* Mock Test Performance & History */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 sm:p-8 mb-6 text-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2.5">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Mock Test History & Analytics</span>
              </h2>
              <Link
                href="/previous-year-questions?tab=papers"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Take New Mock Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingAttempts ? (
              <div className="py-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : cbtAttempts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 text-center space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  No mock test attempts recorded yet.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Practice with real timed CBT mock tests for JEE Main and Advanced to analyze your pacing and accuracy.
                </p>
                <div className="pt-2">
                  <Link
                    href="/previous-year-questions?tab=papers"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                  >
                    <span>Browse Question Papers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cbtAttempts.slice(0, 10).map((att) => {
                  const score = att.summary?.total_score ?? 0;
                  const max = att.summary?.max_marks ?? 300;
                  const accuracy = att.summary?.accuracy_percentage ?? 0;
                  const dateStr = att.submitted_at
                    ? new Date(att.submitted_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';
                  const mins = Math.round((att.time_taken_seconds || 0) / 60);

                  return (
                    <div
                      key={String(att._id)}
                      className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/50 transition-all"
                    >
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {att.paper_title || att.paper_id}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span>{mins} mins</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Target className="w-3 h-3" />
                            <span>{accuracy.toFixed(1)}% Acc</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200 dark:border-gray-800">
                        <div className="text-right">
                          <div className="text-base font-black text-gray-900 dark:text-white">
                            {score} <span className="text-xs text-gray-400 font-semibold">/ {max}</span>
                          </div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                            Score
                          </div>
                        </div>

                        <Link
                          href={`/mock-test/${att.paper_slug || att.paper_id}/results?submission=${att._id}`}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all inline-flex items-center gap-1"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 sm:p-8">
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
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Name</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 rounded-xl">
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
                    className="flex items-center justify-between w-full p-3.5 bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 rounded-xl transition-colors cursor-pointer"
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
                    className="flex items-center justify-between w-full p-3.5 bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 rounded-xl transition-colors cursor-pointer"
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
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <FaPalette className="text-orange-500" />
                  <span>Preferences</span>
                </h3>
                <div className="space-y-3">
                  <div
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 rounded-xl transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Dark/Light mode</p>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
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
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl">
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
                      This action cannot be undone. All your data will be permanently deleted.
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
      <div className="py-24 flex items-center justify-center [main:has(&)]:min-h-0">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
};

export default ProfileComponent;
