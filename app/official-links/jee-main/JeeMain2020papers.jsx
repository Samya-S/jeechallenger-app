import { FaFilePdf, FaCalendarAlt, FaDownload } from "react-icons/fa";

const JeeMain2020papers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-900 dark:to-teal-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            JEE Main 2020
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 dark:text-emerald-200 mb-8">
            Question Papers with Solutions
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 text-emerald-100 dark:text-emerald-200">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-2xl" />
              <span className="text-lg">Complete Exam Papers</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaFilePdf className="text-2xl" />
              <span className="text-lg">PDF Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-12">
        {/* January Papers */}
        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-3">
            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400" />
            <span>January 2020 Papers</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* January 7 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">January 7</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-physics-jan-7-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-chemistry-jan-7-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-maths-jan-7-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-7th-Jan-Shift-2-Physics.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-7th-Jan-Shift-2-Chemistry.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-7th-Jan-Shift-2-Maths.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* January 8 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">January 8</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-8th-Jan-Shift-1-Physics.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-8th-Jan-Shift-1-Chemistry.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-8th-Jan-Shift-1-Maths.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-8th-Jan-Shift-2-Physics.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-8th-Jan-Shift-2-Chemistry.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-8th-Jan-Shift-2-Maths.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* January 9 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">January 9</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-9th-Jan-Shift-1-Physics.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-9th-Jan-Shift-1-Chemistry.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-9th-Jan-Shift-1-Maths.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-9th-Jan-Shift-2-Physics.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-9th-Jan-Shift-2-Chemistry.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-9th-Jan-Shift-2-Maths.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* September Papers */}
        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-3">
            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400" />
            <span>September 2020 Papers</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* September 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">September 2</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Sep-2nd-Shift-1-Physics-Paper.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Sep-2nd-Shift-1-Chemistry-Paper.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Sep-2nd-Shift-1-Maths-Paper.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-physics-Paper-With-Solutions-Sept-2-Shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Chemistry-Paper-With-Solutions-Sept-2-Shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Sep-2nd-Shift-1-Maths-Paper.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* September 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">September 3</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-physics-sept-3-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Chemistry-Paper-With-Solutions-Sept-3-Shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Maths-Paper-With-Solutions-September-3-Shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-physics-september-3-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Chemistry-Paper-With-Solutions-Sept-3-Shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-maths-september-3-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* September 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">September 4</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-physics-september-4-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-chemistry-september-4-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Maths-4th-Sep-Shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-physics-september-4-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-chemistry-september-4-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-maths-september-4-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional September Papers */}
        <div className="mb-4 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* September 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">September 5</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-physics-september-5-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/JEE-Main-2020-Chemistry-Paper-With-Solutions-Sept-5-Shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-maths-september-5-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-physics-september-5-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-chemistry-september-5-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-maths-september-5-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* September 6 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">September 6</h3>
              <div className="space-y-3">
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-physics-september-6-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-chemistry-sept-6-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-maths-september-6-shift-1.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-1</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-physics-september-6-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Physics Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/09/jee-main-2020-question-paper-chemistry-sept-6-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Chemistry Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://cdn1.byjus.com/wp-content/uploads/2020/10/jee-main-2020-question-paper-maths-september-6-shift-2.pdf" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-all duration-200 group">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Maths Shift-2</span>
                  <FaDownload className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Allen Papers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
            <FaFilePdf className="text-emerald-600 dark:text-emerald-400" />
            <span>Complete Collection from Allen</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                JEE-Main-January-September-2020-TEST-PAPERS-EN.pdf
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete collection of all JEE Main 2020 papers in a single PDF
              </p>
            </div>
            <a
              href="https://drive.google.com/file/d/1RfPImPktG3FtpSFt0sQIGGAyYVR6uyOl/view?usp=sharing"
              target="_blank"
              rel="noreferrer noopener"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <FaDownload />
              <span>Download Complete Collection</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JeeMain2020papers
