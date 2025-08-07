"use client";

import { useEffect, useState } from "react";
import AITutorNavbar from "@/components/AiTutorComponents/AITutorNavbar";
import { useRouter } from "next/navigation";

const fetchPlans = async () => {
  const res = await fetch("/api/subscription/plans");
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
};

const fetchUserProfile = async (token) => {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
};

const PlanCard = ({ plan, isPopular, user, isCurrent, isStarter, onGetStarted }) => {
  return (
    <div className={`relative flex flex-col rounded-3xl shadow-xl border-2 ${isPopular ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 p-8 pt-10 transition-transform hover:scale-105 hover:shadow-2xl`}>
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg z-10">Most Popular</span>
      )}
      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">{plan.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{plan.description}</p>
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-extrabold text-blue-600">₹{plan.price_inr}</span>
          <span className="text-base text-gray-500 dark:text-gray-400">/month</span>
        </div>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-lg font-bold text-purple-600">₹{plan.yearly_price_inr}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/year</span>
        </div>
      </div>
      <ul className="mb-6 space-y-3 text-sm text-left">
        <li className="flex items-start gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-[5px]"></span>
          <span>AI Chat Limit/Day: <b>{plan.ai_chat_limit_per_day}</b></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-[5px]"></span>
          <span>File Upload Limit/Day: <b>{plan.file_upload_limit_per_day}</b></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-[5px]"></span>
          <span>Max File Size: <b>{plan.max_file_size_mb} MB</b></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-[5px]"></span>
          <div className="flex-1">
            <span>Supported File Types:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {plan.supported_file_types.map(type => (
                <span
                  key={type}
                  className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </li>
        <li className="flex items-start gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-[5px]"></span>
          <span>Chat History Limit: <b>{plan.chat_history_limit ?? "Unlimited"}</b></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-[5px]"></span>
          <span>Support Level: <b>{plan.support_level}</b></span>
        </li>
      </ul>
      {/* Button logic */}
      {user && isCurrent ? (
        <button className="mt-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg cursor-default" disabled>
          Current Plan
        </button>
      ) : !user && isStarter ? (
        <button
          className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all duration-200"
          onClick={onGetStarted}
        >
          Get Started
        </button>
      ) : (
        <button className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg opacity-60 cursor-not-allowed" disabled>
          Coming Soon
        </button>
      )}
    </div>
  );
};

const AITutorPlansComponent = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [subscriptionPlanId, setSubscriptionPlanId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch plans
    fetchPlans()
      .then(setPlans)
      .catch(() => setError("Could not load plans. Please try again later."))
      .finally(() => setLoading(false));
    // Fetch user profile if logged in
    const token = localStorage.getItem('ai-tutor-token');
    if (token) {
      fetchUserProfile(token)
        .then(profile => {
          setUser(profile);
          setSubscriptionPlanId(profile.subscription_plan_id);
        })
        .catch(() => {
          setUser(null);
          setSubscriptionPlanId(null);
        });
    } else {
      setUser(null);
      setSubscriptionPlanId(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ai-tutor-user');
    localStorage.removeItem('ai-tutor-messages');
    localStorage.removeItem('ai-tutor-token');
    setUser(null);
    router.push('/ai-tutor/plans');
  };

  const handleSignIn = () => router.push('/ai-tutor');

  // Find the most popular plan (e.g., the middle one if 3, or the highest price if >1)
  let popularPlanId = null;
  if (plans.length > 0) {
    if (plans.length === 3) {
      popularPlanId = plans[1].id;
    } else {
      popularPlanId = plans.reduce((max, p) => p.price_inr > max.price_inr ? p : max, plans[0]).id;
    }
  }

  // Get user's current plan id if logged in
  let userPlanId = null;
  if (user && user.plan && user.plan.id) {
    userPlanId = user.plan.id;
  }
  const handleGetStarted = () => router.push('/ai-tutor');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black overflow-hidden">
      <AITutorNavbar
        user={user}
        messages={[]}
        onClearChat={() => { }}
        onLogout={handleLogout}
        showSignIn={!user}
        onSignIn={handleSignIn}
      />
      <div className="w-full flex flex-col text-justify">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">Subscription Plans</h1>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-lg">Loading plans...</div>
            </div>
          )}
          {error && <div className="text-center py-8 text-red-500">{error}</div>}
          {!loading && !error && plans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No plans available at the moment.
            </div>
          )}
          {!loading && !error && plans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map(plan => {
                const isStarter = plan.id === 'starter' || plan.name.toLowerCase().includes('starter');
                const isCurrent = user && subscriptionPlanId && plan.id === subscriptionPlanId;
                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isPopular={plan.id === popularPlanId}
                    user={user}
                    isCurrent={isCurrent}
                    isStarter={isStarter}
                    onGetStarted={handleGetStarted}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITutorPlansComponent;