import { Link, useLocation } from 'react-router-dom';

/**
 * Application header component with navigation links
 * Includes logo and main navigation items
 */
const Header = () => {
  const location = useLocation();
  
  // Check if a nav link is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <header className="bg-primary-700 shadow-md">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 py-4 sm:flex-row">
        {/* Logo and App Name */}
        <Link to="/" className="mb-2 flex items-center text-white sm:mb-0">
          <span className="text-xl font-bold font-heading">Soccer Play Style Analysis</span>
        </Link>
        
        {/* Navigation */}
        <nav className="flex">
          <Link
            to="/"
            className={`rounded px-3 py-2 text-sm font-medium ${
              location.pathname === '/' 
                ? 'bg-primary-800 text-white' 
                : 'text-primary-100 hover:bg-primary-600 hover:text-white'
            }`}
          >
            Home
          </Link>
          <a
            href="https://github.com/your-username/soccer-analysis-app"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded px-3 py-2 text-sm font-medium text-primary-100 hover:bg-primary-600 hover:text-white"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;