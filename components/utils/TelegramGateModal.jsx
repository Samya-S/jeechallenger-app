"use client";

const CHANNEL_URL = "https://t.me/+oOnj4y_ZYqYyZjA1";

const TelegramGateModal = ({ isOpen, targetUrl, onClose }) => {
  if (!isOpen) return null;

  const handleJoin = () => {
    window.open(CHANNEL_URL, "_blank", "noopener,noreferrer");
  };

  const handleProceed = () => {
    if (targetUrl) window.open(targetUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 sm:p-8 max-w-md w-full mx-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.837l-2.938-.916c-.638-.203-.651-.638.136-.953l11.48-4.43c.532-.194.995.13.957.683z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Join to Access This
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-2">
            This material is shared exclusively through our official Telegram channel.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Join the channel for free, then come back and open the link.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleJoin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-lg sm:text-xl px-5 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.837l-2.938-.916c-.638-.203-.651-.638.136-.953l11.48-4.43c.532-.194.995.13.957.683z" />
              </svg>
              Join Channel
            </button>

            <button
              onClick={handleProceed}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-base px-6 py-2.5 rounded-lg transition-all duration-200"
            >
              ✓ Already Joined — Open Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramGateModal;