import Breadcrumbs from '@/components/common/Breadcrumbs';
import ScrollToTopButton from '@/components/utils/ScrollToTopButton';
import Link from 'next/link';

const TermsOfServiceComponent = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-16 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Terms of Service', href: '/terms-of-service' }
          ]}
          hasBanner={true}
          className="pb-12"
        />

				<div className="container mx-auto px-4 max-w-6xl">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Terms of Service
						</h1>
						<p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
							By using JEE Challenger and any of its features, you agree to these terms. Please read them carefully.
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
							Last Updated: July 2026
						</div>

						{/* Introduction */}
						<div className="prose dark:prose-invert max-w-none text-left">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								These Terms of Service (&quot;Terms&quot;) govern your access to and use of <strong>JEE Challenger</strong> (&quot;the Platform&quot;), including the main website, the AI Tutor, and any other features or services offered now or in the future under the JEE Challenger umbrella.
							</p>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
								By accessing or using any part of the Platform, you confirm that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Privacy Policy</Link>. If you do not agree, please discontinue use immediately.
							</p>
						</div>

						{/* 1. Acceptance of Terms */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									1
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Acceptance of Terms
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											These Terms apply to all visitors, users, and others who access or use the Platform. By using any feature of the Platform — including browsing, using the AI Tutor, or any other authenticated or unauthenticated service — you agree to these Terms in full.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											If you are using the Platform on behalf of an organisation or institution, you represent that you have the authority to bind that entity to these Terms.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 2. Description of the Platform */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									2
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Description of the Platform
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											JEE Challenger is a free, open-source educational platform designed to assist students preparing for the Joint Entrance Examination (JEE). The Platform currently includes, and may in the future expand to include:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>Study materials, PYQs, and educational resources</li>
											<li>Progress tracking and syllabus management tools</li>
											<li>News, updates, and official links related to JEE</li>
											<li>An AI-powered tutoring assistant (AI Tutor)</li>
											<li>Any additional features or microservices introduced in the future</li>
										</ul>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											These Terms apply equally to all current and future features of the Platform. New services will be covered by these Terms unless explicitly stated otherwise at the time of their launch.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 3. User Accounts & Authenticated Services */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									3
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										User Accounts &amp; Authenticated Services
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Certain features of the Platform require you to sign in with a Google account. By signing in, you additionally agree to the following:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>You will provide accurate and complete information when authenticating.</li>
											<li>You are responsible for maintaining the confidentiality of your account and for all activity that occurs under it.</li>
											<li>You will notify us immediately at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a> if you suspect any unauthorised use of your account.</li>
											<li>You must be at least 13 years of age to create an account. If you are under 18, you confirm you have parental or guardian consent.</li>
										</ul>
										<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4">
											<h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
												📌 Note on Future Paid Features
											</h4>
											<p className="text-blue-800 dark:text-blue-300">
												The Platform is currently free. If paid or subscription-based features are introduced in the future, additional billing terms will be presented clearly at the point of purchase and will supplement these Terms.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 4. Acceptable Use */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									4
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Acceptable Use
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree <strong>NOT</strong> to:
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>Violate any applicable local, national, or international law or regulation</li>
											<li>Infringe upon the intellectual property rights of others</li>
											<li>Transmit harmful, offensive, abusive, threatening, or inappropriate content</li>
											<li>Attempt to gain unauthorised access to any part of the Platform, its servers, or related systems</li>
											<li>Use automated tools, scrapers, bots, or crawlers to extract content from the Platform without prior written consent</li>
											<li>Use the Platform or any of its features for commercial purposes without explicit permission</li>
											<li>Impersonate any person, entity, or organisation</li>
											<li>Engage in any conduct that restricts or inhibits any other person&apos;s use or enjoyment of the Platform</li>
										</ul>
										<div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mt-4">
											<h4 className="font-bold text-red-800 dark:text-red-300 mb-2">
												⚠️ Violations
											</h4>
											<p className="text-red-800 dark:text-red-300">
												Violation of these acceptable use rules may result in immediate suspension or termination of your access to the Platform, without prior notice or liability.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 5. Intellectual Property */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									5
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Intellectual Property
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
											Platform Code &amp; Design
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											JEE Challenger is open-source software. The source code is available under its respective open-source licence. The Platform&apos;s overall design, branding, and user experience are the creative work of its developers.
										</p>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											Third-Party Content
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											Educational materials, PDFs, books, and resources shared or linked on the Platform remain the intellectual property of their respective publishers and authors. JEE Challenger does not claim ownership over any third-party content. Please refer to our <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline">Disclaimer</Link> for full details on copyright and fair use.
										</p>

										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
											User-Submitted Content
										</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											Any content you submit to the Platform (feedback, comments, contact form messages, AI chat inputs) remains yours. By submitting content, you grant JEE Challenger a non-exclusive, royalty-free licence to use it solely for the purpose of operating and improving the Platform.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 6. Disclaimers & Limitation of Liability */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									6
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Disclaimers &amp; Limitation of Liability
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											The Platform and all its services are provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong>, without warranties of any kind, either express or implied.
										</p>
										<ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
											<li>We do not guarantee the accuracy, completeness, or timeliness of any content or information on the Platform.</li>
											<li>The Platform is not a substitute for professional educational guidance, counselling, or official advice.</li>
											<li>Any AI-generated responses are for educational assistance only and may contain errors. Do not rely on them as authoritative.</li>
										</ul>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											To the maximum extent permitted by applicable law, JEE Challenger, its developers, and contributors shall <strong>not be liable</strong> for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											For a full account of liability limitations and copyright notices, please read our <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline">Disclaimer</Link>.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 7. Privacy */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									7
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Privacy
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											Your use of the Platform is also governed by our <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Privacy Policy</Link>, which is incorporated into these Terms by reference. By agreeing to these Terms, you also agree to the Privacy Policy. Please review it to understand how we collect, use, and protect your information.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 8. Termination */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									8
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Termination
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											We reserve the right to suspend or terminate your access to all or any part of the Platform at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											You may stop using the Platform at any time. If you have an account, you may request deletion of your data by contacting us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 9. Changes to These Terms */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									9
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Changes to These Terms
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											We reserve the right to modify these Terms at any time. When we make material changes, we will update the &quot;Last Updated&quot; date at the top of this page. For significant changes, we will endeavour to provide notice (e.g., via a notice on the Platform).
										</p>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											Your continued use of the Platform after any changes constitutes your acceptance of the updated Terms. If you do not agree to the revised Terms, please discontinue use of the Platform.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 10. Governing Law */}
						<div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
									10
								</div>
								<div className="w-full">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
										Governing Law
									</h2>
									<div className="prose dark:prose-invert max-w-none text-left">
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Contact & Final Acknowledgment */}
						<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
							<div className="prose dark:prose-invert max-w-none text-left">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Contact Us</h2>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
									If you have any questions or concerns about these Terms of Service, please contact us at{' '}
									<a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
							</div>

							<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
								<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
									By using JEE Challenger, you acknowledge that:
								</h3>
								<ul className="space-y-2 text-gray-700 dark:text-gray-300">
									<li className="flex items-start">
										<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										<span>You have read and understood these Terms of Service in their entirety</span>
									</li>
									<li className="flex items-start">
										<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										<span>You agree to use the Platform responsibly and within the rules set out above</span>
									</li>
									<li className="flex items-start">
										<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										<span>You have also read and agreed to our <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link> and <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline">Disclaimer</Link></span>
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

export default TermsOfServiceComponent;
