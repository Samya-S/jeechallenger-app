import Link from 'next/link';
import { BookOpen, FileText, Calculator, Atom, FlaskConical, TrendingUp } from 'lucide-react';
import { FaChalkboardTeacher } from 'react-icons/fa';

export const metadata = {
	title: 'Free JEE Study Materials & Resources | JEE Challenger',
	description: 'Access free JEE Main & Advanced study materials including Physics, Chemistry, Mathematics notes, Previous Year Questions, and comprehensive preparation resources. Download PDFs, solved problems, and chapter-wise study materials.',
	alternates: {
		canonical: '/materials',
	},
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: 'Free JEE Study Materials & Resources | JEE Challenger',
		description: 'Access comprehensive JEE preparation materials for Physics, Chemistry, and Mathematics. Free PDFs, notes, and previous year questions for JEE Main & Advanced.',
		url: '/materials',
		siteName: 'JEE Challenger',
		images: [
			{
				url: '/images/jee-materials.jpg',
				width: 1200,
				height: 630,
				alt: 'JEE Study Materials for Physics, Chemistry, and Mathematics',
			}
		],
		locale: 'en_IN',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Free JEE Study Materials & Resources | JEE Challenger',
		description: 'Access comprehensive JEE preparation materials for Physics, Chemistry, and Mathematics. Free PDFs, notes, and previous year questions.',
		images: ['/images/jee-materials.jpg'],
	},
};

export default function MaterialsPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
			{/* Hero Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 content-auto">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							JEE Study Materials & Resources
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							Access comprehensive, high-quality study materials for JEE Main & Advanced preparation - completely free
						</p>
						<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
					</div>

					{/* Subject Materials */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
						{/* Physics */}
						<div className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200 dark:border-blue-800 overflow-hidden flex flex-col h-full">
							<div className="p-6 flex flex-col flex-grow">
								<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<Atom className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
									Physics
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
									Comprehensive study materials, formulas, and solved problems for JEE Physics
								</p>
								<div className="text-center mt-auto">
									<Link href="/materials/physics" aria-label="View Physics study materials">
										<button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
											<span className="flex items-center justify-center">
												<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
												View Materials
											</span>
										</button>
									</Link>
								</div>
							</div>
						</div>

						{/* Chemistry */}
						<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-200 dark:border-green-800 overflow-hidden flex flex-col h-full">
							<div className="p-6 flex flex-col flex-grow">
								<div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<FlaskConical className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
									Chemistry
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
									Notes, reactions, and practice problems for Physical, Organic & Inorganic Chemistry
								</p>
								<div className="text-center mt-auto">
									<Link href="/materials/chemistry" aria-label="View Chemistry study materials">
										<button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
											<span className="flex items-center justify-center">
												<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
												View Materials
											</span>
										</button>
									</Link>
								</div>
							</div>
						</div>

						{/* Mathematics */}
						<div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-200 dark:border-purple-800 overflow-hidden flex flex-col h-full">
							<div className="p-6 flex flex-col flex-grow">
								<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<Calculator className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
									Mathematics
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
									Formulas, theorems, and problem-solving techniques for JEE Mathematics
								</p>
								<div className="text-center mt-auto">
									<Link href="/materials/mathematics" aria-label="View Mathematics study materials">
										<button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
											<span className="flex items-center justify-center">
												<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
												View Materials
											</span>
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Additional Resources */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 content-auto">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Additional Resources
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							Supplementary materials to enhance your preparation
						</p>
						<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Previous Years' Questions */}
						<div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-200 dark:border-orange-800 overflow-hidden flex flex-col h-full">
							<div className="p-6 flex flex-col flex-grow">
								<div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<FileText className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
									Chapter-wise PYQs
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
									Solved previous year questions from JEE Main & Advanced with detailed solutions
								</p>
								<div className="text-center mt-auto">
									<Link href="/materials/chapterwise-solved-pyqs" aria-label="View Chapter-wise Previous Years' Questions">
										<button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
											<span className="flex items-center justify-center">
												<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
												View PYQs
											</span>
										</button>
									</Link>
								</div>
							</div>
						</div>

						{/* NCERT Books */}
						<div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-200 dark:border-indigo-800 overflow-hidden flex flex-col h-full">
							<div className="p-6 flex flex-col flex-grow">
								<div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<BookOpen className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
									NCERT Books
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
									Official NCERT textbooks in PDF format for Class 11 and 12
								</p>
								<div className="text-center mt-auto">
									<Link href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer" aria-label="Get NCERT Books from official website">
										<button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
											<span className="flex items-center justify-center">
												<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
												Get Books
											</span>
										</button>
									</Link>
								</div>
							</div>
						</div>

						{/* More Study Materials */}
						<div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-cyan-200 dark:border-cyan-800 overflow-hidden flex flex-col h-full">
							<div className="p-6 flex flex-col flex-grow">
								<div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<TrendingUp className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
									More Materials
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
									Additional resources, worksheets, and supplementary preparation materials
								</p>
								<div className="text-center mt-auto">
									<Link href="/materials/more-study-materials" aria-label="View More Study Materials">
										<button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
											<span className="flex items-center justify-center">
												<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
												Explore More
											</span>
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* AI Tutor Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 content-auto">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							AI-Powered Learning
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							Get personalized assistance and instant help with our advanced AI Tutor
						</p>
						<div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
					</div>

					<div className="max-w-4xl mx-auto">
						<div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-violet-200 dark:border-violet-800 overflow-hidden">
							<div className="p-8 md:p-12">
								<div className="flex flex-col md:flex-row items-center gap-8">
									<div className="flex-shrink-0">
										<div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
											<FaChalkboardTeacher className="w-12 h-12 text-white" />
										</div>
									</div>
									<div className="flex-1 text-center md:text-left">
										<h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
											Personal AI Tutor 👨‍🏫
										</h3>
										<p className="text-gray-600 dark:text-gray-300 mb-6">
											Experience personalized JEE preparation with our advanced AI Tutor. Get instant help with any subject, concept, or problem - anytime, anywhere.
										</p>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 w-fit mx-auto sm:w-auto">
											<div className="flex items-start gap-3">
												<div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
												<span className="text-gray-700 dark:text-gray-300">24/7 instant doubt solving</span>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
												<span className="text-gray-700 dark:text-gray-300">Step-by-step explanations</span>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
												<span className="text-gray-700 dark:text-gray-300">Personalized learning path</span>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
												<span className="text-gray-700 dark:text-gray-300">All JEE subjects covered</span>
											</div>
										</div>
										<div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
											<Link href="/ai-tutor" target="_blank" rel="noopener noreferrer" aria-label="Start learning with AI Tutor">
												<button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
													<span className="flex items-center justify-center">
														<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
														</svg>
														Try AI Tutor Now
													</span>
												</button>
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
