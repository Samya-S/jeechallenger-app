const CategorySection = ({ category, backgroundColor, items, colorTheme = "blue" }) => {
  const getButtonGradient = () => {
    switch (colorTheme) {
      case "green":
        return "from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700";
      case "purple":
        return "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700";
      default:
        return "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700";
    }
  };

  const getAccentGradient = () => {
    switch (colorTheme) {
      case "green":
        return "from-green-500 to-teal-500";
      case "purple":
        return "from-purple-500 to-pink-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  return (
    <section className="py-16">
      <div className="mx-auto">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category}
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r ${getAccentGradient()} mx-auto rounded-full`}></div>
        </div>

        {/* Resources Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden animate-stagger flex flex-col w-full md:w-80 lg:w-96"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 flex flex-col h-full">
                {/* Resource Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                {/* Subtitle if exists */}
                {item.subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
                    {item.subtitle}
                  </p>
                )}

                {/* Additional Links */}
                {item.links && item.links.length > 1 && (
                  <div className="space-y-2 mb-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Additional Links:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {item.links.slice(1).map((link, linkIndex) => (
                        <a
                          key={`${index}-${linkIndex}`}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Link {linkIndex + 2}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Button */}
                <div className="mt-auto">
                  <a
                    href={item.link || item.links[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full"
                  >
                    <button className={`w-full bg-gradient-to-r ${getButtonGradient()} text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}>
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
