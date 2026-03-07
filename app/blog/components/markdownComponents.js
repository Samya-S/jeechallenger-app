export const getMarkdownComponents = () => ({
  h1: ({ children }) => {
    const text = children?.toString() || '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h1 id={id} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-12 mb-6 scroll-mt-24 tracking-tight">
        {children}
      </h1>
    );
  },
  h2: ({ children }) => {
    const text = children?.toString() || '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h2 id={id} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-14 mb-6 pb-4 border-b-2 border-blue-200 dark:border-blue-800 scroll-mt-24 tracking-tight">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = children?.toString() || '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h3 id={id} className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100 mt-10 mb-4 scroll-mt-24">
        {children}
      </h3>
    );
  },
  h4: ({ children }) => {
    return (
      <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-3">
        {children}
      </h4>
    );
  },
  p: ({ children }) => {
    return (
      <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {children}
      </p>
    );
  },
  ul: ({ children }) => {
    return (
      <ul className="space-y-2.5 my-6">
        {children}
      </ul>
    );
  },
  ol: ({ children }) => {
    return (
      <ol className="space-y-2.5 my-6 list-decimal list-inside marker:text-blue-600 dark:marker:text-blue-400 marker:font-bold">
        {children}
      </ol>
    );
  },
  li: ({ children }) => {
    // Get the first child if children is an array, otherwise use children directly
    const firstChild = Array.isArray(children) ? children[0] : children;
    const text = typeof firstChild === 'string' ? firstChild : firstChild?.toString() || '';
    
    // Style for negative/error items (❌, ✖)
    if (text.includes('❌') || text.includes('✖')) {
      return (
        <li className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-none py-1.5">
          {children}
        </li>
      );
    }
    
    // Style for positive/success items (✅, ✓)
    if (text.includes('✅') || text.includes('✓')) {
      return (
        <li className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-none py-1.5">
          {children}
        </li>
      );
    }
    
    // Style for warning items (⚠️)
    if (text.includes('⚠️')) {
      return (
        <li className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-none py-1.5">
          {children}
        </li>
      );
    }
    
    // Default list item with bullet inside
    return (
      <li className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside marker:text-blue-600 dark:marker:text-blue-400">
        {children}
      </li>
    );
  },
  strong: ({ children }) => {
    return (
      <strong className="font-bold text-gray-900 dark:text-white text-[1.05em]">
        {children}
      </strong>
    );
  },
  em: ({ children }) => {
    return (
      <em className="italic text-gray-800 dark:text-gray-200 font-medium">
        {children}
      </em>
    );
  },
  blockquote: ({ children }) => {
    return (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-blue-50 dark:bg-blue-900/10 rounded-r-lg text-base md:text-lg text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    );
  },
  code: ({ inline, children }) => {
    if (inline) {
      return (
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-sm font-mono overflow-x-auto border border-gray-200 dark:border-gray-700">
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    return (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl overflow-x-auto border border-gray-200 dark:border-gray-700 my-6">
        {children}
      </pre>
    );
  },
  hr: () => {
    return <hr className="border-gray-300 dark:border-gray-700 my-10" />;
  },
  a: ({ href, children }) => {
    // Keep anchor links (TOC links) on same page
    if (href?.startsWith('#')) {
      return (
        <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-all">
          {children}
        </a>
      );
    }
    // Open all other links in new tab
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-all"
      >
        {children}
      </a>
    );
  },
});
