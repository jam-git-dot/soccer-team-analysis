import './polyfills.ts'; // Import polyfills first
import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider 
} from 'react-router-dom';
import './index.css';
import routes from './routes.tsx';

// Create router with future flags enabled
const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);