"use client";

import { useState, useEffect } from 'react';
import DonationBox from '@/components/modals/DonationBox';

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
			<div className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-8 max-w-2xl w-full mx-auto shadow-2xl border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] max-h-[90vh] flex flex-col">
				{/* Close button */}
				<button
					onClick={handleClose}
					className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100/80 hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-700 backdrop-blur-sm active:scale-95 transition-all cursor-pointer outline-none focus:outline-none ring-0 focus:ring-0"
					aria-label="Close donation modal"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{/* Content - Scrollable */}
				<div className="overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    <div className="flex flex-col items-center animate-fade-in">
                        <DonationBox variant="plain" />
                    </div>
				</div>
			</div>
		</div>
	);
};

export default DonationModal;
