import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import App from './App.tsx';

// Layout
const MainLayout = lazy(() => import('./components/layout/MainLayout.tsx'));

// Pages
const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const TeamSelectionPage = lazy(() => import('./pages/TeamSelectionPage.tsx'));
const TeamDashboard = lazy(() => import('./pages/TeamDashboard.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'));

// Define routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'league/:leagueId',
            element: <TeamSelectionPage />,
          },
          {
            path: 'team/:teamId',
            children: [
              {
                index: true,
                element: <TeamDashboard />,
              },
              {
                path: 'compare/:compareTeamId',
                element: <TeamDashboard />,
              },
            ],
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
];

export default routes;