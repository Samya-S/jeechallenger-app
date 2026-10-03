import Image from 'next/image';
import { DONATION_CONFIG } from '@/config/donation-config';

const DonationBox = ({ variant = 'plain' }) => {
  const isBoxed = variant === 'boxed';

  const containerClasses = isBoxed
    ? 'text-center w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm'
    : 'text-center w-full';

  const titleClasses = isBoxed
    ? 'text-xl font-bold text-gray-800 dark:text-gray-200 mb-2'
    : 'text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 px-6 sm:px-8 pt-1 sm:pt-0';

  const paragraphClasses = isBoxed
    ? 'text-sm text-gray-600 dark:text-gray-400 mb-6'
    : 'text-sm text-gray-600 dark:text-gray-400 mb-6 mt-4';

  return (
    <div className={containerClasses}>
      <h3 className={titleClasses}>{DONATION_CONFIG.headline}</h3>
      <p className={paragraphClasses}>
        {DONATION_CONFIG.missionStatement} {DONATION_CONFIG.adsStatement}{' '}
        <strong>{DONATION_CONFIG.goalCallout}</strong>
      </p>

      <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto">
        {/* QR Code */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          <Image
            src={DONATION_CONFIG.qrImageSrc}
            alt="Support us with UPI"
            className="w-40 h-40 object-cover"
            width={1000}
            height={1000}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
          Scan to pay with any UPI app
        </p>

        <div className="flex items-center w-full my-2">
          <hr className="flex-grow border-gray-200 dark:border-gray-700" />
          <span className="px-3 text-xs text-gray-400 font-medium">OR</span>
          <hr className="flex-grow border-gray-200 dark:border-gray-700" />
        </div>

        {/* UPI Button */}
        <a
          href={DONATION_CONFIG.upiDeepLink}
          className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Pay via UPI App
        </a>
      </div>
    </div>
  );
};

export default DonationBox;
