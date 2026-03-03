"use client";

import { useState, useEffect } from 'react';
import { submitFeedbackForm } from '@/server/contact-actions';

const FeedbackModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [responseMessage, setResponseMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Check if modal has been shown in this session
		const hasSeenModal = sessionStorage.getItem('hasSeenFeedbackModal');
		if (!hasSeenModal) {
			// Delay modal appearance to prevent CLS and give user time to explore
			const timer = setTimeout(() => {
				setIsOpen(true);
			}, 15000); // Show after 15 seconds
			return () => clearTimeout(timer);
		}
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await submitFeedbackForm(formData);

			if (result.success) {
				setResponseMessage("Thank you for your feedback! We really appreciate it.");
				setFormData({ name: "", email: "", feedback: "" });
				setIsSubmitted(true);
				setIsError(false);

				// Close modal after success
				setTimeout(() => {
					setIsOpen(false);
					sessionStorage.setItem('hasSeenFeedbackModal', 'true');
				}, 3000);
			} else {
				setErrorMessage("Oops! Something went wrong. Please try again.");
				setIsError(true);
				setIsSubmitted(false);
				setTimeout(() => setIsError(false), 5000);
			}
		} catch (error) {
			setErrorMessage("Network error. Please try again later.");
			setIsError(true);
			setIsSubmitted(false);
			setTimeout(() => setIsError(false), 5000);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		sessionStorage.setItem('hasSeenFeedbackModal', 'true');
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
					aria-label="Close feedback modal"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{/* Content - Scrollable */}
				<div className="overflow-y-auto" style={{ scrollbarWidth: "none" }}>
					<div className="text-center mb-6">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
							</svg>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
							We Value Your Feedback! 💭
						</h2>
						<p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
							Help us improve JEE Challenger by sharing your thoughts on our features and suggesting new ones!
						</p>
					</div>

					{/* Success Message */}
					{isSubmitted && (
						<div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
							<p className="text-green-700 dark:text-green-300 flex items-center">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								{responseMessage}
							</p>
						</div>
					)}

					{/* Error Message */}
					{isError && (
						<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-red-700 dark:text-red-300 flex items-center">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
								{errorMessage}
							</p>
						</div>
					)}

					{/* Form */}
					{!isSubmitted && (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
									Name <span className="text-red-500">*</span>
								</label>
								<input
									id="name"
									className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
									name="name"
									placeholder="Your name"
									value={formData.name}
									onChange={handleChange}
									required
								/>
							</div>

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
									Email <span className="text-red-500">*</span>
								</label>
								<input
									id="email"
									className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
									type="email"
									name="email"
									placeholder="Your email address"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>

							<div>
								<label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
									Your Feedback <span className="text-red-500">*</span>
								</label>
								<textarea
									id="feedback"
									className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
									name="feedback"
									placeholder="Tell us what you think about our features or suggest new ones you'd like to see..."
									value={formData.feedback}
									onChange={handleChange}
									rows={4}
									required
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:from-blue-700 hover:enabled:to-purple-700 hover:enabled:shadow-lg"
							>
								{isLoading ? (
									<span className="flex items-center justify-center">
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Sending...
									</span>
								) : (
									<span className="flex items-center justify-center">
										<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
										</svg>
										Submit Feedback
									</span>
								)}
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default FeedbackModal;
