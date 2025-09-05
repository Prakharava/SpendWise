import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-700 mb-4 font-extrabold">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Page not found
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-md bg-yellow-400 text-blue-900 font-semibold hover:bg-yellow-300 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/analytics"
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
