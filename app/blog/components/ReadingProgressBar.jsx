export default function ReadingProgressBar({ progress }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
      <div 
        className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
