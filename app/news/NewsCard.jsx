import Image from 'next/image';
import Link from 'next/link';

export default function NewsCard({ article }) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-lg shadow-md dark:shadow-lg dark:shadow-gray-800/50 overflow-hidden hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-gray-800/70 transition-all duration-300 border border-gray-200 dark:border-gray-800">
      <div className="relative h-48 w-full">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <Link href={article.source.url} className="hover:text-blue-600 dark:hover:text-blue-400">
            {article.source.name}
          </Link>
        </div>
        <h2 className="text-left text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-justify text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.description}
        </p>
        <Link
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Read more
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
} 