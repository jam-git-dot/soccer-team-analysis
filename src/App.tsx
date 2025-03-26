import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <p className="text-xl">Loading...</p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;