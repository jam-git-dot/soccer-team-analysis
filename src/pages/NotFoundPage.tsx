import { Link } from 'react-router-dom';

/**
 * 404 Not Found page component
 * Displayed when a user navigates to a non-existent route
 */
const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary-600">404</h1>
      <h2 className="mb-6 text-3xl font-semibold">Page Not Found</h2>
      <p className="mb-8 max-w-md text-lg text-gray-600">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
