import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <p className="text-xl">Loading...</p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Outlet />
    </Suspense>
  );
}

export default App;