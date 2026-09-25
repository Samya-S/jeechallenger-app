import Breadcrumbs from '@/components/common/Breadcrumbs';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { getSiteUrl } from '@/config/site-url';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, AlertCircle, Info, ExternalLink } from 'lucide-react';

const PrivacyPolicyComponent = () => {
	return (
		<div className="min-h-screen bg-white dark:bg-[#090d16] text-left">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">
				{/* Breadcrumbs - No banner, no 'Legal' keyword */}
				<Breadcrumbs
					crumbs={[
						{ label: 'Privacy Policy', href: '/privacy-policy' }
					]}
					className="mb-6"
				/>

				{/* Document Switcher & Meta Header (Option 3: Single-Surface Editorial, no outer card box) */}
				<div>
					{/* Top Document Header */}
					<div className="pb-8 border-b border-gray-200 dark:border-gray-800">
						<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
							{/* Legal Document Switcher Pills */}
							<div className="inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 text-xs sm:text-sm font-medium">
								<span className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold">
									Privacy Policy
								</span>
								<Link
									href="/terms-of-service"
									className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
								>
									Terms of Service
								</Link>
								<Link
									href="/disclaimer"
									className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
								>
									Disclaimer
								</Link>
							</div>

							<span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800">
								Last Updated: July 2026
							</span>
						</div>

						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
							Privacy Policy
						</h1>
						<p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
							Your privacy is important to us. Learn how we collect, use, and protect your information.
						</p>
					</div>

					{/* Document Body */}
					<div className="pt-8 space-y-10">

						{/* Introduction */}
						<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								At <strong>JEE Challenger</strong>, accessible at <a href={getSiteUrl()} className="text-blue-600 dark:text-blue-400 hover:underline">{getSiteUrl()}</a>, protecting your privacy is a priority. This Privacy Policy describes the types of information collected and recorded by JEE Challenger and how we use, protect, and manage that information.
							</p>
							<p>
								If you have questions or need additional information about our Privacy Policy, please contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
							</p>
						</div>

						{/* 1. Log Files */}
						<section className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200/60 dark:border-blue-800/60 shrink-0">
									1
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Log Files
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									JEE Challenger follows standard industry practice by maintaining log files. These files automatically record visitor activity when users access the website. This is a standard procedure for all web hosting services as part of analytics and security measures. The information collected by log files includes:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Internet Protocol (IP) addresses</li>
									<li>Browser type</li>
									<li>Internet Service Provider (ISP)</li>
									<li>Date and time stamp</li>
									<li>Referring/exit pages</li>
									<li>Number of clicks</li>
								</ul>
								<p>
									This information is <strong>not linked to any personally identifiable information</strong>. The data is used for analyzing trends, administering the site, understanding user navigation patterns, and gathering aggregate demographic information.
								</p>
							</div>
						</section>

						{/* 2. Cookies and Web Beacons */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-sm border border-purple-200/60 dark:border-purple-800/60 shrink-0">
									2
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Cookies and Web Beacons
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									Like most websites, JEE Challenger uses <strong>cookies</strong> to enhance user experience. These cookies store information including visitor preferences and pages accessed during website visits. This information helps us optimize your experience by customizing web content based on your browser type and other preferences.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Google DoubleClick DART Cookie
								</h3>
								<p>
									Google serves as a third-party vendor on our site and uses cookies, known as <strong>DART cookies</strong>, to serve advertisements based on users&lsquo; visits to our site and other websites. Users may opt out of DART cookies by visiting the Google ad and content network Privacy Policy at:
								</p>
								<div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4">
									<a
										href="https://policies.google.com/technologies/ads"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm"
									>
										<span>https://policies.google.com/technologies/ads</span>
										<ExternalLink className="w-3.5 h-3.5" />
									</a>
								</div>
							</div>
						</section>

						{/* 3. Local Storage */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
									3
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Local Storage
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									Certain features utilize your browser&lsquo;s <strong>Local Storage</strong> to save your preferences, progress, and personalized settings. This data is stored <strong>locally on your device only</strong> and is <strong>NOT transmitted to or stored on our servers</strong>.
								</p>
								<div className="bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
										<h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
											Your Data Stays On Your Device
										</h4>
									</div>
									<p className="text-sm text-emerald-800 dark:text-emerald-300/90">
										Because this data remains on your device, clearing your browser cache or local storage will result in loss of saved preferences and progress. We cannot access, view, or modify your locally stored data.
									</p>
								</div>
							</div>
						</section>

						{/* 4. Advertising Partners */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm border border-orange-200/60 dark:border-orange-800/60 shrink-0">
									4
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Advertising Partners Privacy Policies
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									We work with third-party advertising partners who may have their own privacy policies. We recommend reviewing their policies to understand how they handle your data.
								</p>
								<p>
									Third-party ad servers and networks use technologies such as cookies, JavaScript, and Web Beacons in advertisements and links appearing on JEE Challenger. These are sent directly to your browser and automatically receive your IP address. These technologies measure advertising campaign effectiveness and personalize the advertising content you see across websites.
								</p>
								<div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
										<h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm">
											Important Note
										</h4>
									</div>
									<p className="text-sm text-amber-800 dark:text-amber-300/90">
										JEE Challenger has no access to or control over these cookies that are used by third-party advertisers.
									</p>
								</div>
							</div>
						</section>

						{/* 5. Third Party Privacy Policies */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
									5
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Third Party Privacy Policies
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									JEE Challenger&lsquo;s Privacy Policy does not apply to third-party advertisers or external websites. We advise you to consult the respective privacy policies of these third-party services for detailed information about their practices and opt-out instructions.
								</p>
								<p>
									You can disable cookies through your browser settings. For detailed information about cookie management in specific browsers, please refer to your browser&lsquo;s official documentation or help resources.
								</p>
							</div>
						</section>

						{/* 6. User Submitted Data */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold text-sm border border-pink-200/60 dark:border-pink-800/60 shrink-0">
									6
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									User Submitted Data
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									When you contact us via email, we collect your name and email address solely to respond to your inquiry. We <strong>do not sell, trade, rent, or share</strong> your personal information with third parties.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Data Retention
								</h3>
								<p>
									Contact form inquiries are retained for a reasonable period to address your concerns and improve our services. To request deletion of your contact information, please email us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
							</div>
						</section>

						{/* 7. Authenticated Services */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-bold text-sm border border-cyan-200/60 dark:border-cyan-800/60 shrink-0">
									7
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Authenticated Services
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									Certain features of JEE Challenger require you to sign in with a Google account. The current authenticated feature is the <strong>AI Tutor</strong>; additional authenticated services may be introduced in the future. All such services are covered by this Privacy Policy.
								</p>
								<p>
									When you sign in and use any authenticated feature, we collect and process the following additional data:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>Google account information</strong> — your name, email address, and profile picture, used to identify your account and personalise your experience</li>
									<li><strong>Interaction history</strong> — such as chat conversations and session data, stored to enable continuity across sessions</li>
									<li><strong>Uploaded files and attachments</strong> — any files you choose to share within the service</li>
									<li><strong>Usage and preference data</strong> — including learning preferences and feature usage patterns, used to improve the service</li>
								</ul>
								<div className="bg-cyan-50/80 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
										<h4 className="font-semibold text-cyan-900 dark:text-cyan-300 text-sm">
											One Policy for All Services
										</h4>
									</div>
									<p className="text-sm text-cyan-800 dark:text-cyan-300/90">
										All authenticated features — current and future — are governed by this single Privacy Policy. Your use of any authenticated feature is also subject to our{' '}
										<Link href="/terms-of-service" className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold">Terms of Service</Link>.
									</p>
								</div>
								<p>
									We do not sell or share authenticated service data with third parties, except as required to operate the service (e.g., the underlying AI model provider) or as required by law. Data shared with AI model providers is used solely to generate responses and is not used to train their models on your personal data.
								</p>
							</div>
						</section>

						{/* 8. Your Data Rights */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold text-sm border border-teal-200/60 dark:border-teal-800/60 shrink-0">
									8
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Your Data Rights
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									You have the following rights regarding your personal data:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>Right to Access:</strong> Request information about data we have collected via contact forms</li>
									<li><strong>Right to Deletion:</strong> Request removal of your contact form submissions and personal data</li>
									<li><strong>Right to Opt-Out:</strong> Disable advertising cookies through your browser settings</li>
									<li><strong>Right to Data Portability:</strong> Export locally stored data using available export features</li>
								</ul>
								<p>
									To exercise any of these rights, contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
							</div>
						</section>

						{/* 9. Updates to Privacy Policy */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-bold text-sm border border-violet-200/60 dark:border-violet-800/60 shrink-0">
									9
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Updates to Privacy Policy
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									We may update this Privacy Policy periodically to reflect changes in our practices or for operational, legal, or regulatory reasons. Material changes will be indicated by updating the &quot;Last Updated&quot; date at the top of this policy.
								</p>
								<p>
									Continued use of the site following posted changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this page regularly to stay informed about how we protect your information.
								</p>
							</div>
						</section>

						{/* 10. Consent */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
									10
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Consent
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									By using our website, you consent to this Privacy Policy and our <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Terms of Service</Link>. If you do not agree with these policies, please discontinue use of our website.
								</p>
							</div>
						</section>

						{/* Contact Section */}
						<div className="pt-6 border-t border-gray-200 dark:border-gray-800">
							<div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
								<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
									Questions About This Policy?
								</h3>
								<p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
									If you have questions or concerns about our Privacy Policy, please contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
								<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
									Also see: <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Terms of Service</Link> &bull; <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Disclaimer</Link>
								</p>
							</div>
						</div>

					</div>
				</div>
			</div>

			<ScrollToTopButton
				gradientColors="from-blue-600 to-purple-600"
				hoverColors="hover:from-blue-700 hover:to-purple-700"
			/>
		</div>
	);
};

export default PrivacyPolicyComponent;
