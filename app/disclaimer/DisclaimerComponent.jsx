"use client";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";

const DisclaimerComponent = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
				<div className="container mx-auto px-4 max-w-6xl">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Legal Disclaimer
						</h1>
						<p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
							Important legal information about JEE Challenger's operations, affiliations, and responsible use
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

						{/* 1. No Affiliation Clause */}
						<div className="space-y-4">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									1
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										No Affiliation or Endorsement
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											<strong>JEE Challenger</strong> is an <strong>independent, open-source educational project</strong> created and maintained by independent developers. We are <strong>NOT affiliated, associated, authorized, endorsed by, or officially connected</strong> in any manner with:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
											<li><strong>National Testing Agency (NTA)</strong></li>
											<li><strong>Indian Institutes of Technology (IITs)</strong></li>
											<li><strong>Central Board of Secondary Education (CBSE)</strong></li>
											<li>Any private coaching institutes, educational organizations, or publishers mentioned on this platform</li>
										</ul>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
											All names, logos, brands, and trademarks mentioned on this platform are the property of their respective owners. Any reference to these entities is for <strong>informational and educational purposes only</strong>. We do not claim any ownership, sponsorship, or affiliation with these organizations.
										</p>
										<div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 mt-4">
											<h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
												⚠️ Important
											</h4>
											<p className="text-amber-800 dark:text-amber-300">
												JEE Challenger is not the official application or website of any coaching institute or examination authority. Students should verify all information from official sources.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 2. Descriptive Use Defense */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									2
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Descriptive Use of Name
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											The name <strong>"JEE Challenger"</strong> is used solely to <strong>describe the purpose and function of this platform</strong> — a resource designed to support JEE (Joint Entrance Examination) aspirants in their preparation journey.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											We <strong>do not claim any trademark rights</strong> over the terms "JEE," "Challenger," or any combination thereof. The name is purely <strong>descriptive</strong> and does not function as a source identifier or commercial brand. It describes what the platform offers rather than indicating any official status or commercial origin.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											The term "JEE" is widely recognized in the educational sector as referring to the Joint Entrance Examination and is used here in its common, descriptive sense as understood in the public domain.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 3. Educational Fair Use Statement */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									3
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Educational Fair Use & Copyright Notice
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Study materials, including PDFs, books, notes, and educational resources available on or linked from this platform, are provided strictly for <strong>educational, non-commercial, and informational purposes</strong>.
										</p>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Copyright Ownership
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											We <strong>do not claim ownership</strong> of any copyrighted study materials, books, PDFs, or educational content shared or linked on this platform. All intellectual property rights belong to the <strong>respective publishers, authors, and content creators</strong>, including but not limited to:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>Arihant Publications</li>
											<li>Cengage Learning</li>
											<li>McGraw Hill Education</li>
											<li>Pearson Education</li>
											<li>Disha Publication</li>
											<li>And all other publishers whose materials may be referenced</li>
										</ul>

										<div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-6">
											<h4 className="font-bold text-green-800 dark:text-green-300 mb-2">
												📚 Support the Authors - Buy Original Copies
											</h4>
											<p className="text-green-800 dark:text-green-300">
												We <strong>strongly encourage</strong> all students to <strong>purchase original, legally published copies</strong> of educational materials. Supporting authors and publishers sustains the creation of quality educational content. If you find a resource valuable, please purchase the official version to support the creators.
											</p>
										</div>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Fair Use Policy
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Any materials shared on this platform are intended for:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li><strong>Educational purposes</strong> - To help students prepare for competitive examinations</li>
											<li><strong>Non-commercial use</strong> - We do not sell or profit from copyrighted materials</li>
											<li><strong>Reference and review</strong> - To help students make informed decisions about purchasing books</li>
										</ul>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											DMCA & Copyright Takedown
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
											If you are a copyright holder and believe any content on this platform infringes your intellectual property rights, please contact us immediately at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a> or via our <a href="/contact-us" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</a>.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											We take intellectual property rights seriously and will promptly investigate and remove any infringing content upon proper notification.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 4. No Liability Clause */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									4
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										No Liability & Accuracy Disclaimer
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
											Tools & Predictions
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											JEE Challenger may provide various tools and features designed to assist with exam preparation and college admissions, including but not limited to:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>Performance prediction and estimation tools</li>
											<li>Progress tracking and monitoring features</li>
											<li>Data analysis and visualization tools</li>
											<li>Educational resource aggregators</li>
											<li>Any other analytical, predictive, or informational utilities</li>
										</ul>

										<div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 my-6">
											<h4 className="font-bold text-red-800 dark:text-red-300 mb-2">
												⚠️ Important Disclaimer
											</h4>
											<p className="text-red-800 dark:text-red-300 leading-relaxed">
												All predictions, estimates, and analyses provided by these tools are based on <strong>historical data and statistical models</strong>. They are <strong>NOT official predictions</strong> and should <strong>NOT</strong> be relied upon as guaranteed or definitive outcomes.
											</p>
										</div>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Limitation of Liability
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											<strong>JEE Challenger, its developers, and contributors are NOT responsible or liable for:</strong>
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li><strong>Inaccurate predictions or estimates</strong> - Actual outcomes may differ significantly from predicted results</li>
											<li><strong>Academic or career decisions</strong> - Decisions made based on information from this platform (e.g., not applying to a college, choosing a stream)</li>
											<li><strong>Financial losses</strong> - Any direct or indirect financial impact resulting from use of this platform</li>
											<li><strong>Missed opportunities</strong> - Including missed cutoffs, application deadlines, or admission chances</li>
											<li><strong>Data accuracy</strong> - While we strive for accuracy, data may be outdated or incorrect</li>
											<li><strong>Third-party content</strong> - Information from external sources linked on this platform</li>
										</ul>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											User Responsibility
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Users are strongly advised to:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
											<li><strong>Verify all information</strong> independently from official sources (NTA, IITs, JoSAA, etc.)</li>
											<li><strong>Consult qualified counselors or advisors</strong> before making important academic or career decisions</li>
											<li><strong>Use this platform as a supplementary resource</strong>, not as the sole basis for critical decisions</li>
											<li><strong>Check official notifications</strong> for authoritative cutoffs, dates, and eligibility criteria</li>
										</ul>

										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4 font-semibold">
											By using JEE Challenger, you acknowledge and agree that you use the platform <strong>entirely at your own risk</strong> and that the developers, contributors, and maintainers bear no responsibility or liability for any consequences arising from your use of the platform.
										</p>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											User Generated Content
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											JEE Challenger may allow users to submit various types of content, including comments, feedback, poll responses, progress data, and other information.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											<strong>We are NOT responsible or liable for:</strong>
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li><strong>User comments, feedback, or opinions</strong> - These represent individual views only</li>
											<li><strong>Poll results or survey data</strong> - Crowd-sourced information may not be accurate or representative</li>
											<li><strong>User-submitted progress or performance data</strong> - We cannot verify the accuracy of user inputs</li>
											<li><strong>Interactions between users</strong> - Any disputes or issues arising from user communications</li>
										</ul>
										<div className="bg-gray-50 dark:bg-gray-900/20 border-l-4 border-gray-500 p-4 my-4">
											<p className="text-gray-700 dark:text-gray-300 font-semibold">
												The views, opinions, and data expressed by users do not represent or reflect the views, positions, or endorsement of JEE Challenger, its developers, or maintainers.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 5. Monetization & Referral Disclosure */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									5
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Monetization & Referral Disclosure
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
											Referral & Affiliate Programs
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											JEE Challenger may participate in referral and affiliate programs with various educational platforms and service providers. When you:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>Click on referral links to educational platforms (such as online coaching subscriptions)</li>
											<li>Sign up for courses or subscriptions through our links</li>
											<li>Make purchases through affiliated links</li>
										</ul>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											We may receive a commission or referral fee at <strong>no additional cost to you</strong>. These commissions help support the ongoing maintenance and development of this free educational platform.
										</p>
										<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4">
											<h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
												📢 Disclosure
											</h4>
											<p className="text-blue-800 dark:text-blue-300">
												We recommend platforms, courses, and resources that we believe offer genuine educational value for JEE preparation. Our recommendations are based on quality and relevance, not commission rates.
											</p>
										</div>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Advertising & Cookies
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											This website may use:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li><strong>Advertising networks</strong> to display relevant ads</li>
											<li><strong>Cookies and similar technologies</strong> to personalize content and advertisements</li>
											<li><strong>Analytics tools</strong> to understand user behavior and improve the platform</li>
										</ul>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											These third-party services may use cookies to serve ads or track referrals based on your activity. You can manage your cookie preferences through your browser settings.
										</p>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Transparency Commitment
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											We are committed to complete transparency in all monetization activities. Any sponsored content, affiliate links, or paid promotions will be clearly disclosed. Our primary mission is providing valuable educational resources to JEE aspirants; monetization serves solely to sustain the platform's operations and development.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Additional General Terms */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
								General Terms
							</h2>
							<div className="prose dark:prose-invert max-w-none text-left">
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
									Changes to This Disclaimer
								</h3>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
									We reserve the right to update, modify, or revise this disclaimer at any time without prior notice. Continued use of the platform following any changes constitutes your acceptance of the updated disclaimer. Users are encouraged to review this page periodically to stay informed of any updates.
								</p>

								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
									Governing Law
								</h3>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
									This disclaimer shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
								</p>

								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
									Contact Information
								</h3>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
									If you have any questions or concerns regarding this disclaimer, or if you believe any content on this platform violates your rights, please contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a> or via our <a href="/contact-us" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</a>.
								</p>
							</div>
						</div>

						{/* Final Acknowledgment */}
						<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
								<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
									By using JEE Challenger, you acknowledge that:
								</h3>
								<ul className="space-y-2 text-gray-700 dark:text-gray-300">
									<li className="flex items-start">
										<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										<span>You have read and understood this disclaimer in its entirety</span>
									</li>
									<li className="flex items-start">
										<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										<span>You agree to use the platform at your own risk and responsibility</span>
									</li>
									<li className="flex items-start">
										<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										<span>You will verify all critical information from official sources</span>
									</li>
									<li className="flex items-start">
										<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										<span>You understand the platform's limitations and will not hold the developers liable for any outcomes</span>
									</li>
								</ul>
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

export default DisclaimerComponent;
