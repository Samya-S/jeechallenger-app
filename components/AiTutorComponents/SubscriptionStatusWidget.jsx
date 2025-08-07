"use client";

import { useEffect, useState } from "react";
import { FaCreditCard, FaUser, FaChartLine, FaShieldAlt } from "react-icons/fa";

const fetchUserSubscription = async (token) => {
  const res = await fetch("/api/subscription/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
};

const SubscriptionStatusWidget = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("ai-tutor-token");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    fetchUserSubscription(token)
      .then(setSubscription)
      .catch(() => setError("Could not load subscription info."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading subscription...</div>;
  }
  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }
  if (!subscription) return null;

  const { plan, start_date, end_date, is_active } = subscription;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
        <FaCreditCard className="text-green-500" />
        <span>Subscription Details</span>
        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {is_active ? 'Active' : 'Inactive'}
        </span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <FaUser className="text-blue-500" />
            <span>Plan Information</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Current Plan</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{plan.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Start Date</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(start_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit'
                })}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">End Date</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{end_date ? new Date(end_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit'
                }) : 'Lifetime subscription'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <FaChartLine className="text-purple-500" />
            <span>Usage Limits</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">AI Chat Limit/Day</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{plan.ai_chat_limit_per_day}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">File Upload Limit/Day</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.file_upload_limit_per_day}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Max File Size</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.max_file_size_mb} MB</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Chat History Limit</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.chat_history_limit ?? "Unlimited"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Files */}
        <div className="space-y-6">
          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <FaShieldAlt className="text-orange-500" />
              <span>Customer Support</span>
            </h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Support Level</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{plan.support_level}</p>
              </div>
            </div>
          </div>

          {/* File Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <FaShieldAlt className="text-blue-500" />
              <span>File Support</span>
            </h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Supported File Types</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.supported_file_types.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatusWidget;