import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-[80vh] w-full justify-center items-center px-4 bg-white dark:bg-black/5">
      <div className="headingimg"></div>
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-white mb-6">Page Not Found</h2>
      <p className="text-gray-600 dark:text-white text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
    </div>
  )
}

export default NotFoundPage
