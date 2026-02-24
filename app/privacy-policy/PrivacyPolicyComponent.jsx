"use client";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";
import Link from "next/link";

const PrivacyPolicyComponent = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
				<div className="container mx-auto px-4 max-w-6xl">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Privacy Policy
						</h1>
						<p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
							Your privacy is important to us. Learn how we collect, use, and protect your information.
						</p>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="py-12 md:py-16">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 space-y-10">

						{/* Last Updated */}
						<div className="text-sm text-gray-600 dark:text-gray-400 text-right pb-6 border-b border-gray-200 dark:border-gray-700">
							Last Updated: February 2026
						</div>

						{/* Introduction */}
						<div className="prose dark:prose-invert max-w-none text-left">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								At <strong>JEE Challenger</strong>, accessible at <a href="https://jeechallenger.vercel.app" className="text-blue-600 dark:text-blue-400 hover:underline">jeechallenger.vercel.app</a>, protecting your privacy is a priority. This Privacy Policy describes the types of information collected and recorded by JEE Challenger and how we use, protect, and manage that information.
							</p>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
								If you have questions or need additional information about our Privacy Policy, please contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
							</p>
						</div>

						{/* 1. Log Files */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									1
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Log Files
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											JEE Challenger follows standard industry practice by maintaining log files. These files automatically record visitor activity when users access the website. This is a standard procedure for all web hosting services as part of analytics and security measures. The information collected by log files includes:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-3">
											<li>Internet Protocol (IP) addresses</li>
											<li>Browser type</li>
											<li>Internet Service Provider (ISP)</li>
											<li>Date and time stamp</li>
											<li>Referring/exit pages</li>
											<li>Number of clicks</li>
										</ul>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
											This information is <strong>not linked to any personally identifiable information</strong>. The data is used for analyzing trends, administering the site, understanding user navigation patterns, and gathering aggregate demographic information.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 2. Cookies and Web Beacons */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									2
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Cookies and Web Beacons
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Like most websites, JEE Challenger uses <strong>cookies</strong> to enhance user experience. These cookies store information including visitor preferences and pages accessed during website visits. This information helps us optimize your experience by customizing web content based on your browser type and other preferences.
										</p>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Google DoubleClick DART Cookie
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Google serves as a third-party vendor on our site and uses cookies, known as <strong>DART cookies</strong>, to serve advertisements based on users' visits to our site and other websites. Users may opt out of DART cookies by visiting the Google ad and content network Privacy Policy at:
										</p>
										<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4">
											<a
												href="https://policies.google.com/technologies/ads"
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
											>
												https://policies.google.com/technologies/ads
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 3. Local Storage */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									3
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Local Storage
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Certain features utilize your browser's <strong>Local Storage</strong> to save your preferences, progress, and personalized settings. This data is stored <strong>locally on your device only</strong> and is <strong>NOT transmitted to or stored on our servers</strong>.
										</p>
										<div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-4">
											<h4 className="font-bold text-green-800 dark:text-green-300 mb-2">
												✓ Your Data Stays On Your Device
											</h4>
											<p className="text-green-800 dark:text-green-300">
												Because this data remains on your device, clearing your browser cache or local storage will result in loss of saved preferences and progress. We cannot access, view, or modify your locally stored data.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 4. Advertising Partners */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									4
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Advertising Partners Privacy Policies
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											We work with third-party advertising partners who may have their own privacy policies. We recommend reviewing their policies to understand how they handle your data.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Third-party ad servers and networks use technologies such as cookies, JavaScript, and Web Beacons in advertisements and links appearing on JEE Challenger. These are sent directly to your browser and automatically receive your IP address. These technologies measure advertising campaign effectiveness and personalize the advertising content you see across websites.
										</p>
										<div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 my-4">
											<h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
												⚠️ Important Note
											</h4>
											<p className="text-amber-800 dark:text-amber-300">
												JEE Challenger has no access to or control over these cookies that are used by third-party advertisers.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 5. Third Party Privacy Policies */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									5
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Third Party Privacy Policies
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											JEE Challenger's Privacy Policy does not apply to third-party advertisers or external websites. We advise you to consult the respective privacy policies of these third-party services for detailed information about their practices and opt-out instructions.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											You can disable cookies through your browser settings. For detailed information about cookie management in specific browsers, please refer to your browser's official documentation or help resources.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 6. User Submitted Data */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									6
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										User Submitted Data
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											When you contact us via our <Link href="/contact-us" className="text-blue-600 dark:text-blue-400 hover:underline">website forms</Link> or email, we collect your name and email address solely to respond to your inquiry. We <strong>do not sell, trade, rent, or share</strong> your personal information with third parties.
										</p>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Data Retention
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											Contact form inquiries are retained for a reasonable period to address your concerns and improve our services. To request deletion of your contact information, please email us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 7. AI Tutor Service */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									7
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										AI Tutor Service
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Our <strong>AI Tutor</strong> feature is a <strong>separate authenticated service</strong> governed by its own comprehensive Terms of Service and Privacy Policy. This service collects and processes additional data including:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>Google account information (name, email, profile picture)</li>
											<li>Chat conversation history</li>
											<li>Uploaded files and attachments</li>
											<li>Learning preferences and subscription status</li>
										</ul>
										<div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 my-4">
											<h4 className="font-bold text-cyan-800 dark:text-cyan-300 mb-3">
												📄 Separate Policies
											</h4>
											<p className="text-cyan-800 dark:text-cyan-300 mb-3">
												The AI Tutor service is governed by separate policies. Please review:
											</p>
											<div className="space-y-2">
												<div className="text-cyan-800 dark:text-cyan-300">
													→ <Link
														href="/ai-tutor/privacy"
														className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
													>
														AI Tutor Privacy Policy
													</Link>
												</div>
												<div className="text-cyan-800 dark:text-cyan-300">
													→ <Link
														href="/ai-tutor/terms"
														className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
													>
														AI Tutor Terms of Service
													</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 8. Your Data Rights */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									8
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Your Data Rights
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											You have the following rights regarding your personal data:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li><strong>Right to Access:</strong> Request information about data we have collected via contact forms</li>
											<li><strong>Right to Deletion:</strong> Request removal of your contact form submissions and personal data</li>
											<li><strong>Right to Opt-Out:</strong> Disable advertising cookies through your browser settings</li>
											<li><strong>Right to Data Portability:</strong> Export locally stored data using available export features</li>
										</ul>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											To exercise any of these rights, contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 9. Updates to Privacy Policy */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									9
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Updates to Privacy Policy
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											We may update this Privacy Policy periodically to reflect changes in our practices or for operational, legal, or regulatory reasons. Material changes will be indicated by updating the "Last Updated" date at the top of this policy.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											Continued use of the site following posted changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this page regularly to stay informed about how we protect your information.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 10. Consent */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									10
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Consent
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											By using our website, you consent to this Privacy Policy and agree to its terms. If you do not agree with this policy, please discontinue use of our website.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Contact Section */}
						<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
								<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
									Questions About This Policy?
								</h3>
								<p className="text-gray-700 dark:text-gray-300 mb-4">
									If you have questions or concerns about our Privacy Policy, please contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a> or via our <Link href="/contact-us" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>.
								</p>
							</div>
						</div>

					</div>
				</div>
			</section>

			<ScrollToTopButton
				gradientColors="from-blue-600 to-purple-600"
				hoverColors="hover:from-blue-700 hover:to-purple-700"
			/>
		</div>
	);
};

export default PrivacyPolicyComponent;
