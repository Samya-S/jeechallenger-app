import Breadcrumbs from '@/components/common/Breadcrumbs';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const TermsOfServiceComponent = () => {
	return (
		<div className="min-h-screen bg-white dark:bg-[#090d16] text-left">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">
				{/* Breadcrumbs - No banner, no 'Legal' keyword */}
				<Breadcrumbs
					crumbs={[
						{ label: 'Terms of Service', href: '/terms-of-service' }
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
								<Link
									href="/privacy-policy"
									className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
								>
									Privacy Policy
								</Link>
								<span className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold">
									Terms of Service
								</span>
								<Link
									href="/disclaimer"
									className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
								>
									Disclaimer
								</Link>
							</div>

							<span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800">
								Last Updated: August 2026
							</span>
						</div>

						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
							Terms of Service
						</h1>
						<p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
							By using JEE Challenger and any of its features, you agree to these terms. Please read them carefully.
						</p>
					</div>

					{/* Document Body */}
					<div className="pt-8 space-y-10">

						{/* Introduction */}
						<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								These Terms of Service (&quot;Terms&quot;) govern your access to and use of <strong>JEE Challenger</strong> (&quot;the Platform&quot;), including the main website, the AI Tutor, and any other features or services offered now or in the future under the JEE Challenger umbrella.
							</p>
							<p>
								By accessing or using any part of the Platform, you confirm that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Privacy Policy</Link>. If you do not agree, please discontinue use immediately.
							</p>
						</div>

						{/* 1. Acceptance of Terms */}
						<section className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200/60 dark:border-blue-800/60 shrink-0">
									1
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Acceptance of Terms
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									These Terms apply to all visitors, users, and others who access or use the Platform. By using any feature of the Platform — including browsing, using the AI Tutor, or any other authenticated or unauthenticated service — you agree to these Terms in full.
								</p>
								<p>
									If you are using the Platform on behalf of an organisation or institution, you represent that you have the authority to bind that entity to these Terms.
								</p>
							</div>
						</section>

						{/* 2. Description of the Platform */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-sm border border-purple-200/60 dark:border-purple-800/60 shrink-0">
									2
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Description of the Platform
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									JEE Challenger is a free, open-source educational platform designed to assist students preparing for the Joint Entrance Examination (JEE). The Platform currently includes, and may in the future expand to include:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Study materials, PYQs, and educational resources</li>
									<li>Progress tracking and syllabus management tools</li>
									<li>News, updates, and official links related to JEE</li>
									<li>An AI-powered tutoring assistant (AI Tutor)</li>
									<li>Any additional features or microservices introduced in the future</li>
								</ul>
								<p>
									These Terms apply equally to all current and future features of the Platform. New services will be covered by these Terms unless explicitly stated otherwise at the time of their launch.
								</p>
							</div>
						</section>

						{/* 3. User Accounts & Authenticated Services */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
									3
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									User Accounts &amp; Authenticated Services
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									Certain features of the Platform require you to sign in with a Google account. By signing in, you additionally agree to the following:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>You will provide accurate and complete information when authenticating.</li>
									<li>You are responsible for maintaining the confidentiality of your account and for all activity that occurs under it.</li>
									<li>You will notify us immediately at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a> if you suspect any unauthorised use of your account.</li>
									<li>You must be at least 13 years of age to create an account. If you are under 18, you confirm you have parental or guardian consent.</li>
								</ul>
								<div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
										<h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
											Note on Future Paid Features
										</h4>
									</div>
									<p className="text-sm text-blue-800 dark:text-blue-300/90">
										The Platform is currently free. If paid or subscription-based features are introduced in the future, additional billing terms will be presented clearly at the point of purchase and will supplement these Terms.
									</p>
								</div>
							</div>
						</section>

						{/* 4. Acceptable Use */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm border border-orange-200/60 dark:border-orange-800/60 shrink-0">
									4
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Acceptable Use
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree <strong>NOT</strong> to:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Violate any applicable local, national, or international law or regulation</li>
									<li>Infringe upon the intellectual property rights of others</li>
									<li>Transmit harmful, offensive, abusive, threatening, or inappropriate content</li>
									<li>Attempt to gain unauthorised access to any part of the Platform, its servers, or related systems</li>
									<li>Use automated tools, scrapers, bots, or crawlers to extract content from the Platform without prior written consent</li>
									<li>Use the Platform or any of its features for commercial purposes without explicit permission</li>
									<li>Impersonate any person, entity, or organisation</li>
									<li>Engage in any conduct that restricts or inhibits any other person&apos;s use or enjoyment of the Platform</li>
								</ul>
								<div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
										<h4 className="font-semibold text-red-900 dark:text-red-300 text-sm">
											Violations
										</h4>
									</div>
									<p className="text-sm text-red-800 dark:text-red-300/90">
										Violation of these acceptable use rules may result in immediate suspension or termination of your access to the Platform, without prior notice or liability.
									</p>
								</div>
							</div>
						</section>

						{/* 5. Intellectual Property */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
									5
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Intellectual Property
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Platform Code &amp; Design
								</h3>
								<p>
									JEE Challenger is open-source software. The source code is available under its respective open-source licence. The Platform&apos;s overall design, branding, and user experience are the creative work of its developers.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Intellectual Property
								</h3>
								<p>
									All original study notes, question bank structures, and platform designs are the intellectual property of JEE Challenger. Any official previous year questions (PYQs) or syllabi provided are public domain educational records. JEE Challenger respects all intellectual property rights. Please refer to our <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Disclaimer</Link> for full details.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									User-Submitted Content
								</h3>
								<p>
									Any content you submit to the Platform (feedback, comments, contact form messages, AI chat inputs) remains yours. By submitting content, you grant JEE Challenger a non-exclusive, royalty-free licence to use it solely for the purpose of operating and improving the Platform.
								</p>
							</div>
						</section>

						{/* 6. Disclaimers & Limitation of Liability */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm border border-red-200/60 dark:border-red-800/60 shrink-0">
									6
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Disclaimers &amp; Limitation of Liability
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									The Platform and all its services are provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong>, without warranties of any kind, either express or implied.
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>We do not guarantee the accuracy, completeness, or timeliness of any content or information on the Platform.</li>
									<li>The Platform is not a substitute for professional educational guidance, counselling, or official advice.</li>
									<li>Any AI-generated responses are for educational assistance only and may contain errors. Do not rely on them as authoritative.</li>
								</ul>
								<p>
									To the maximum extent permitted by applicable law, JEE Challenger, its developers, and contributors shall <strong>not be liable</strong> for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
								</p>
								<p>
									For a full account of liability limitations and copyright notices, please read our <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Disclaimer</Link>.
								</p>
							</div>
						</section>

						{/* 7. Privacy */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold text-sm border border-teal-200/60 dark:border-teal-800/60 shrink-0">
									7
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Privacy
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									Your use of the Platform is also governed by our <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Privacy Policy</Link>, which is incorporated into these Terms by reference. By agreeing to these Terms, you also agree to the Privacy Policy. Please review it to understand how we collect, use, and protect your information.
								</p>
							</div>
						</section>

						{/* 8. Termination */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold text-sm border border-pink-200/60 dark:border-pink-800/60 shrink-0">
									8
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Termination
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									We reserve the right to suspend or terminate your access to all or any part of the Platform at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
								</p>
								<p>
									You may stop using the Platform at any time. If you have an account, you may request deletion of your data by contacting us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
							</div>
						</section>

						{/* 9. Changes to These Terms */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-bold text-sm border border-violet-200/60 dark:border-violet-800/60 shrink-0">
									9
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Changes to These Terms
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									We reserve the right to modify these Terms at any time. When we make material changes, we will update the &quot;Last Updated&quot; date at the top of this page. For significant changes, we will endeavour to provide notice (e.g., via a notice on the Platform).
								</p>
								<p>
									Your continued use of the Platform after any changes constitutes your acceptance of the updated Terms. If you do not agree to the revised Terms, please discontinue use of the Platform.
								</p>
							</div>
						</section>

						{/* 10. Governing Law */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
									10
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Governing Law
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.
								</p>
							</div>
						</section>

						{/* Contact & Final Acknowledgment */}
						<div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-6">
							<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
								<p>
									If you have any questions or concerns about these Terms of Service, please contact us at{' '}
									<a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
							</div>

							<div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
								<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
									By using JEE Challenger, you acknowledge that:
								</h3>
								<ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>You have read and understood these Terms of Service in their entirety</span>
									</li>
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>You agree to use the Platform responsibly and within the rules set out above</span>
									</li>
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>You have also read and agreed to our <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</Link> and <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Disclaimer</Link></span>
									</li>
								</ul>
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

export default TermsOfServiceComponent;
