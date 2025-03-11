import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Loading fallback for nested routes
const RouteFallback = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <p className="text-lg">Loading...</p>
  </div>
);

/**
 * Main layout component that wraps all pages
 * Includes Header and Footer with Outlet for nested routes
 */
const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;