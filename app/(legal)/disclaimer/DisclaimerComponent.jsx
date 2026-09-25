import Breadcrumbs from '@/components/common/Breadcrumbs';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import Link from 'next/link';
import { ShieldAlert, Scale, FileText, Mail, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const DisclaimerComponent = () => {
	return (
		<div className="min-h-screen bg-white dark:bg-[#090d16] text-left">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">
				{/* Breadcrumbs - No banner, no 'Legal' keyword */}
				<Breadcrumbs
					crumbs={[
						{ label: 'Disclaimer', href: '/disclaimer' }
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
								<Link
									href="/terms-of-service"
									className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
								>
									Terms of Service
								</Link>
								<span className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold">
									Disclaimer
								</span>
							</div>

							<span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800">
								Last Updated: August 2026
							</span>
						</div>

						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
							Legal Disclaimer
						</h1>
						<p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
							Important legal information about JEE Challenger&lsquo;s operations, affiliations, and responsible use
						</p>
					</div>

					{/* Document Body */}
					<div className="pt-8 space-y-10">

						{/* 1. No Affiliation Clause */}
						<section className="space-y-4">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200/60 dark:border-blue-800/60 shrink-0">
									1
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									No Affiliation or Endorsement
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									<strong>JEE Challenger</strong> is an <strong>independent, open-source educational project</strong> created and maintained by independent developers. We are <strong>NOT affiliated, associated, authorized, endorsed by, or officially connected</strong> in any manner with:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>National Testing Agency (NTA)</strong></li>
									<li><strong>Indian Institutes of Technology (IITs)</strong></li>
									<li><strong>Central Board of Secondary Education (CBSE)</strong></li>
									<li>Any private coaching institutes, educational organizations, or publishers mentioned on this platform</li>
								</ul>
								<p>
									All names, logos, brands, and trademarks mentioned on this platform are the property of their respective owners. Any reference to these entities is for <strong>informational and educational purposes only</strong>. We do not claim any ownership, sponsorship, or affiliation with these organizations.
								</p>
								<div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
										<h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm">
											Important
										</h4>
									</div>
									<p className="text-sm text-amber-800 dark:text-amber-300/90">
										JEE Challenger is not the official application or website of any coaching institute or examination authority. Students should verify all information from official sources.
									</p>
								</div>
							</div>
						</section>

						{/* 2. Descriptive Use Defense */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-sm border border-purple-200/60 dark:border-purple-800/60 shrink-0">
									2
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Descriptive Use of Name
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									The name <strong>&quot;JEE Challenger&quot;</strong> is used solely to <strong>describe the purpose and function of this platform</strong> — a resource designed to support JEE (Joint Entrance Examination) aspirants in their preparation journey.
								</p>
								<p>
									We <strong>do not claim any trademark rights</strong> over the terms &quot;JEE,&quot; &quot;Challenger,&quot; or any combination thereof. The name is purely <strong>descriptive</strong> and does not function as a source identifier or commercial brand. It describes what the platform offers rather than indicating any official status or commercial origin.
								</p>
								<p>
									The term &quot;JEE&quot; is widely recognized in the educational sector as referring to the Joint Entrance Examination and is used here in its common, descriptive sense as understood in the public domain.
								</p>
							</div>
						</section>

						{/* 3. Intellectual Property Statement */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
									3
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Intellectual Property &amp; Copyright Notice
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<p>
									JEE Challenger is committed to providing high-quality, original educational content. All study notes, platform designs, question bank structures, and interactive tools are the exclusive intellectual property of JEE Challenger.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Public Domain Educational Records
								</h3>
								<p>
									Any Previous Year Questions (PYQs), official syllabi, or examination patterns provided on this platform are part of the public domain educational record as released by examination authorities (e.g., NTA, IITs). They are provided strictly for educational and informational purposes to assist students in their preparation.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									DMCA &amp; Copyright Takedown
								</h3>
								<p>
									We take intellectual property rights seriously and ensure all content is either original or public domain. However, if you are a copyright holder and believe any content on this platform infringes your intellectual property rights, please contact us immediately at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
								<p>
									We will promptly investigate and remove any infringing content upon proper notification.
								</p>
							</div>
						</section>

						{/* 4. No Liability Clause */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm border border-orange-200/60 dark:border-orange-800/60 shrink-0">
									4
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									No Liability &amp; Accuracy Disclaimer
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Tools &amp; Predictions
								</h3>
								<p>
									JEE Challenger may provide various tools and features designed to assist with exam preparation and college admissions, including but not limited to:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Performance prediction and estimation tools</li>
									<li>Progress tracking and monitoring features</li>
									<li>Data analysis and visualization tools</li>
									<li>Educational resource aggregators</li>
									<li>Any other analytical, predictive, or informational utilities</li>
								</ul>

								<div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
										<h4 className="font-semibold text-red-900 dark:text-red-300 text-sm">
											Important Disclaimer
										</h4>
									</div>
									<p className="text-sm text-red-800 dark:text-red-300/90">
										All predictions, estimates, and analyses provided by these tools are based on <strong>historical data and statistical models</strong>. They are <strong>NOT official predictions</strong> and should <strong>NOT</strong> be relied upon as guaranteed or definitive outcomes.
									</p>
								</div>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Limitation of Liability
								</h3>
								<p>
									<strong>JEE Challenger, its developers, and contributors are NOT responsible or liable for:</strong>
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>Inaccurate predictions or estimates</strong> - Actual outcomes may differ significantly from predicted results</li>
									<li><strong>Academic or career decisions</strong> - Decisions made based on information from this platform (e.g., not applying to a college, choosing a stream)</li>
									<li><strong>Financial losses</strong> - Any direct or indirect financial impact resulting from use of this platform</li>
									<li><strong>Missed opportunities</strong> - Including missed cutoffs, application deadlines, or admission chances</li>
									<li><strong>Data accuracy</strong> - While we strive for accuracy, data may be outdated or incorrect</li>
									<li><strong>Third-party content</strong> - Information from external sources linked on this platform</li>
								</ul>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									User Responsibility
								</h3>
								<p>Users are strongly advised to:</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>Verify all information</strong> independently from official sources (NTA, IITs, JoSAA, etc.)</li>
									<li><strong>Consult qualified counselors or advisors</strong> before making important academic or career decisions</li>
									<li><strong>Use this platform as a supplementary resource</strong>, not as the sole basis for critical decisions</li>
									<li><strong>Check official notifications</strong> for authoritative cutoffs, dates, and eligibility criteria</li>
								</ul>

								<p className="font-medium">
									By using JEE Challenger, you acknowledge and agree that you use the platform <strong>entirely at your own risk</strong> and that the developers, contributors, and maintainers bear no responsibility or liability for any consequences arising from your use of the platform.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									User Generated Content
								</h3>
								<p>
									JEE Challenger may allow users to submit various types of content, including comments, feedback, poll responses, progress data, and other information.
								</p>
								<p>
									<strong>We are NOT responsible or liable for:</strong>
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>User comments, feedback, or opinions</strong> - These represent individual views only</li>
									<li><strong>Poll results or survey data</strong> - Crowd-sourced information may not be accurate or representative</li>
									<li><strong>User-submitted progress or performance data</strong> - We cannot verify the accuracy of user inputs</li>
									<li><strong>Interactions between users</strong> - Any disputes or issues arising from user communications</li>
								</ul>
								<div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
									The views, opinions, and data expressed by users do not represent or reflect the views, positions, or endorsement of JEE Challenger, its developers, or maintainers.
								</div>
							</div>
						</section>

						{/* 5. Monetization & Referral Disclosure */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3.5">
								<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
									5
								</span>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
									Monetization &amp; Referral Disclosure
								</h2>
							</div>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Referral &amp; Affiliate Programs
								</h3>
								<p>
									JEE Challenger may participate in referral and affiliate programs with various educational platforms and service providers. When you:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Click on referral links to educational platforms (such as online coaching subscriptions)</li>
									<li>Sign up for courses or subscriptions through our links</li>
									<li>Make purchases through affiliated links</li>
								</ul>
								<p>
									We may receive a commission or referral fee at <strong>no additional cost to you</strong>. These commissions help support the ongoing maintenance and development of this free educational platform.
								</p>
								<div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4">
									<div className="flex items-center gap-2 mb-1.5">
										<Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
										<h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
											Disclosure
										</h4>
									</div>
									<p className="text-sm text-blue-800 dark:text-blue-300/90">
										We recommend platforms, courses, and resources that we believe offer genuine educational value for JEE preparation. Our recommendations are based on quality and relevance, not commission rates.
									</p>
								</div>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Advertising &amp; Cookies
								</h3>
								<p>This website may use:</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>Advertising networks</strong> to display relevant ads</li>
									<li><strong>Cookies and similar technologies</strong> to personalize content and advertisements</li>
									<li><strong>Analytics tools</strong> to understand user behavior and improve the platform</li>
								</ul>
								<p>
									These third-party services may use cookies to serve ads or track referrals based on your activity. You can manage your cookie preferences through your browser settings.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Transparency Commitment
								</h3>
								<p>
									We are committed to complete transparency in all monetization activities. Any sponsored content, affiliate links, or paid promotions will be clearly disclosed. Our primary mission is providing valuable educational resources to JEE aspirants; monetization serves solely to sustain the platform&lsquo;s operations and development.
								</p>
							</div>
						</section>

						{/* Additional General Terms */}
						<section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
								General Terms
							</h2>
							<div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Changes to This Disclaimer
								</h3>
								<p>
									We reserve the right to update, modify, or revise this disclaimer at any time without prior notice. Continued use of the platform following any changes constitutes your acceptance of the updated disclaimer. Users are encouraged to review this page periodically to stay informed of any updates.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Governing Law
								</h3>
								<p>
									This disclaimer shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
								</p>

								<h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">
									Contact Information
								</h3>
								<p>
									If you have any questions or concerns regarding this disclaimer, or if you believe any content on this platform violates your rights, please contact us at <a href="mailto:jeechallenger@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">jeechallenger@gmail.com</a>.
								</p>
							</div>
						</section>

						{/* Final Acknowledgment Box */}
						<div className="pt-6 border-t border-gray-200 dark:border-gray-800">
							<div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
								<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
									By using JEE Challenger, you acknowledge that:
								</h3>
								<ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>You have read and understood this disclaimer in its entirety</span>
									</li>
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>You agree to use the platform at your own risk and responsibility</span>
									</li>
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>You will verify all critical information from official sources</span>
									</li>
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>You understand the platform&apos;s limitations and will not hold the developers liable for any outcomes</span>
									</li>
									<li className="flex items-start gap-2.5">
										<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
										<span>
											You have also read and agreed to our{' '}
											<Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</Link>{' '}
											and{' '}
											<Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Terms of Service</Link>
										</span>
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

export default DisclaimerComponent;
