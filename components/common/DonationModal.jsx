"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const DonationModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		// Check if modal has been shown in this session
		const hasSeenModal = sessionStorage.getItem('hasSeenDonationModal');
		if (!hasSeenModal) {
			// Delay modal appearance to prevent CLS and give user time to explore
			const timer = setTimeout(() => {
				setIsOpen(true);
			}, 15000); // Show after 15 seconds
			return () => clearTimeout(timer);
		}
	}, []);

	const handleClose = () => {
		setIsOpen(false);
		sessionStorage.setItem('hasSeenDonationModal', 'true');
		window.dispatchEvent(new CustomEvent('donationModalClosed'));
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
				onClick={handleClose}
			/>

			{/* Modal */}
			<div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 sm:p-8 max-w-2xl w-full mx-auto shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col">
				{/* Close button */}
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
					aria-label="Close donation modal"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{/* Content - Scrollable */}
				<div className="overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="text-center w-full">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Keep JEE Challenger Running 🚀</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 mt-4">
                                We are committed to keeping our tools, trackers, resources, and AI assistant free for all aspirants. However, maintaining our infrastructure and keeping the platform running smoothly costs money. We currently rely on ads to keep the site running, but we hate them as much as you do! If our platform has added value to your preparation journey, consider chipping in. <strong>Once we reach our bare minimum funding goal to cover infrastructure costs, we will remove all pop-up ads and redirects completely!</strong>
                            </p>

                            <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto">
                                {/* QR Code */}
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                                    <Image
                                        src="/images/donation-qr.png"
                                        alt="Support us with UPI"
                                        className="w-40 h-40 object-cover"
                                        width={1000}
                                        height={1000}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Scan to pay with any UPI app</p>

                                <div className="flex items-center w-full my-2">
                                    <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                                    <span className="px-3 text-xs text-gray-400 font-medium">OR</span>
                                    <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                                </div>

                                {/* UPI Button */}
                                <a
                                    href="upi://pay?pa=samyasaha@upi&pn=JEE%20Challenger&cu=INR"
                                    className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Pay via UPI App
                                </a>
                            </div>
                        </div>
                    </div>
				</div>
			</div>
		</div>
	);
};

export default DonationModal;
