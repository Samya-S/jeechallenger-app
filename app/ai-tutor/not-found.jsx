import Link from "next/link";
import { FaRobot, FaArrowLeft } from "react-icons/fa";

export default function AITutorNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
      <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6">
        <FaRobot className="text-6xl text-blue-600 dark:text-blue-400" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
        404 - Page Not Found
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Oops! It looks like the AI Tutor couldn&lsquo;t find the page you are looking for. 
      </p>
      
      <Link
        href="/ai-tutor"
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        <FaArrowLeft className="text-sm" />
        Back to AI Chat
      </Link>
    </div>
  );
}