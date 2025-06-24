import { useRouteError, Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 rounded-2xl p-8 backdrop-blur-lg border border-gray-700/30 text-center">
        <FiAlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Oops!</h1>
        <p className="text-gray-400 mb-6">
          {error.status === 404 
            ? "The page you're looking for doesn't exist."
            : "Something went wrong."}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {error.message || error.statusText}
        </p>
        <Link
          to="/home"
          className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;
