/**
 * Application footer component
 * Includes copyright information and links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary-800 py-4 text-center text-sm text-secondary-300">
      <div className="container mx-auto px-4">
        <p>
          &copy; {currentYear} Soccer Play Style Analysis. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;