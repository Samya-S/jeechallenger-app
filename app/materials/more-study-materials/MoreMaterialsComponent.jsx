"use client";
import TelegramPost from '@/components/utils/TelegramPost';
import ScrollToTopButton from '@/components/utils/ScrollToTopButton';

const MoreMaterialsComponent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-700 dark:from-indigo-900 dark:to-cyan-900 py-20">
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              More Study Materials
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-md animate-fade-in-delay">
              Access comprehensive JEE preparation resources including Allen modules, FIITJEE materials, and exclusive study content
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">
        {/* Miscellaneous Resources Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Miscellaneous Resources Drive
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access a comprehensive collection of study materials from top coaching institutes
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Available Materials
            </h3>
            <div className="space-y-3 max-w-2xl mx-auto w-fit text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Allen JEE Modules (Complete PCM) Latest</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Bansal Maths Module</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">FIITJEE AITS for JEE Mains and JEE Advanced 2022</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">JEE Previous Year Questions</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Miscellaneous PCM Resources</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Resonance + Allen Study Materials</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Resonance Complete Sheets with solutions</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Unacademy Plus Notes (PMS, BJ, MKA, VJ sir)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Unacademy Iconic JEE Notes</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Unacademy JEE - Predictor papers</span>
              </div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6 font-medium">And many more...</p>
            
            <div className="text-center mt-8">
              <a
                href="https://drive.google.com/drive/folders/19r66GAkz0zAsEY_GlI-Ehf0lNqGm5caA?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                                 <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                   <span className="flex items-center justify-center">
                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     Access More Study Materials
                   </span>
                 </button>
              </a>
            </div>
          </div>
        </section>

        {/* Etoos Lectures Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Etoos Lectures
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              All Etoos lectures by NV sir, PS sir, NJ sir in one place
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="rounded-2xl max-w-6xl mx-auto">
            <div className="text-center my-6">
                              <a 
                  href="https://bit.ly/etooslectures" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-medium"
                >
                https://bit.ly/etooslectures
              </a>
            </div>
            <div className='rounded-lg border border-gray-200 dark:border-gray-700' style={{ minHeight: '500px' }}>
              <iframe
                className="w-full h-[500px] rounded-lg dark:!invert"
                src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTIZhOA_KrJYPUirK-Xp5XutggAWlQzCbeE7q735675W3OiJTstbvNzZrbHBzLvM7g_bFHQDuiGPLNO/pubhtml?widget=true&headers=false"
                title="Etoos Lectures Spreadsheet"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Telegram Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Couldn't find what you're searching for?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Some materials are not directly published on the website due to copyright issues. If you are searching for something like that, you may get it from our telegram channel.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <img
                src="/images/jcicon.jpg"
                alt="JEE Challenger Telegram Channel Icon"
                className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">JEE Challenger</h3>
                <p className="text-gray-600 dark:text-gray-300">Official Telegram Channel</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <a 
                href="https://t.me/+oOnj4y_ZYqYyZjA1" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                                 <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                   <span className="flex items-center justify-center">
                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                     </svg>
                     Join us on Telegram
                   </span>
                 </button>
              </a>
            </div>

            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You can also contribute study materials to this website if you find something missing here.
              </p>
              <a
                href="https://drive.google.com/drive/folders/1gs_ehca1F1-K9g3q_Q0mTteUSGzd6z8F?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="border-2 border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Click here to contribute
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Telegram Post Section */}
        <div className="py-8">
          <TelegramPost url="jeechallengerindex/7" themeGradient="from-indigo-600 to-cyan-600" />
        </div>
      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton 
        gradientColors="from-indigo-600 to-cyan-600"
        hoverColors="hover:from-indigo-700 hover:to-cyan-700"
      />
    </div>
  );
};

export default MoreMaterialsComponent;
