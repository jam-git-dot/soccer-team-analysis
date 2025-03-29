# Soccer Team Play Style Analysis Project Structure

## Overview

This document outlines the current project structure of the Soccer Team Play Style Analysis application. The application is built using React, TypeScript, Vite, and Tailwind CSS, and follows a modular architecture.

## Project Structure

```
soccer-analysis-app/
├── public/             # Public assets
│   ├── favicon.ico
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── assets/         # Static assets (images, logos)
│   │   └── react.svg
│   ├── components/     # Reusable UI components
│   │   ├── charts/     # Visualization components
│   │   │   ├── index.ts                # Exports all chart components
│   │   │   ├── ChartContainer.tsx      # Container for charts with styling
│   │   │   ├── RadarChart.tsx          # Radar chart component
│   │   │   ├── BarChart.tsx            # Bar chart component (if implemented)
│   │   │   ├── LineChart.tsx           # Line chart component (if implemented)
│   │   │   └── MetricsBarChart.tsx     # Specialized metrics chart component
│   │   ├── common/     # Common UI elements
│   │   │   └── ErrorBoundary.tsx       # Error handling component
│   │   ├── filters/    # Filter components
│   │   │   └── ResultFilter.tsx        # Match result filter
│   │   ├── layout/     # Layout components
│   │   │   ├── MainLayout.tsx          # Main layout wrapper
│   │   │   ├── Header.tsx              # Application header
│   │   │   └── Footer.tsx              # Application footer
│   │   ├── metrics/    # Metric display components
│   │   │   ├── MetricCard.tsx          # Individual metric display
│   │   │   ├── MetricsTable.tsx        # Tabular metrics display
│   │   │   └── MetricsSection.tsx      # Section for grouping metrics
│   │   └── team-dashboard/  # Team dashboard components
│   │       ├── PlayStyleVisualization.tsx  # Team play style radar chart
│   │       └── PlayStyleDashboard.tsx      # Overall dashboard layout
│   ├── config/         # Application configuration
│   │   ├── api.ts                      # API client configuration
│   │   ├── constants.ts                # Application constants and leagues
│   │   ├── chart-configs.ts            # Chart configurations
│   │   └── metrics-dictionary.ts       # Comprehensive metrics definitions
│   ├── hooks/          # Custom React hooks
│   │   ├── index.ts                    # Central export for hooks
│   │   ├── useTeamMetrics.ts           # Hook for fetching team metrics
│   │   ├── useTeamMetricsRadarData.ts  # Hook for radar chart data
│   │   └── useTeam.ts                  # Hook for team data
│   ├── mock/           # Mock data for development
│   │   ├── team-metrics.json           # Mock team metrics data
│   │   ├── teams.json                  # Mock team data
│   │   ├── team-stats.json             # Mock team statistics
│   │   └── matches.json                # Mock match data
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx                # Landing page
│   │   ├── TeamSelectionPage.tsx       # Team selection page
│   │   ├── TeamDashboard.tsx           # Team analysis dashboard
│   │   └── NotFoundPage.tsx            # 404 page
│   ├── services/       # API and data services
│   │   ├── metrics-service.ts          # Service for metrics data
│   │   ├── team-service.ts             # Service for team data
│   │   └── mock-data.ts                # Mock data service
│   ├── styles/         # CSS styles
│   │   └── theme.css                   # Theme variables
│   ├── types/          # TypeScript type definitions
│   │   ├── index.ts                    # Export all types
│   │   ├── api.ts                      # API response types
│   │   ├── league.ts                   # League data model
│   │   ├── match.ts                    # Match data model
│   │   ├── metrics.ts                  # Metrics data model
│   │   └── team.ts                     # Team data model
│   ├── utils/          # Utility functions
│   │   └── formatters.ts               # Data formatting utilities
│   ├── App.tsx                         # Main application component
│   ├── App.css                         # App-specific styles
│   ├── index.css                       # Global styles with Tailwind
│   ├── main.tsx                        # Application entry point
│   ├── routes.tsx                      # Route definitions
│   ├── vite-env.d.ts                   # Vite type definitions
│   └── polyfills.ts                    # Browser compatibility polyfills
├── docs/               # Documentation
│   └── architecture/
│       ├── data-flow.md                # Data flow documentation
│       └── project-structure.md        # This file
├── .env                                # Environment variables
├── .env.development                    # Development environment variables
├── .env.production                     # Production environment variables
├── .eslintrc.js                        # ESLint configuration
├── .gitignore                          # Git ignore file
├── index.html                          # Main HTML template
├── package.json                        # NPM package configuration
├── README.md                           # Project documentation
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.node.json                  # TypeScript Node configuration
└── vite.config.ts                      # Vite configuration
```

## Key Components

### 1. Core Components

- **App.tsx**: The main application component that sets up routing and global state.
- **routes.tsx**: Defines all application routes and their corresponding components.
- **MainLayout.tsx**: A layout wrapper that includes the header, footer, and main content area.

### 2. Page Components

- **HomePage.tsx**: Landing page with league and team selection.
- **TeamSelectionPage.tsx**: Page for browsing and selecting teams within a league.
- **TeamDashboard.tsx**: The main dashboard for viewing team play style analysis.
- **NotFoundPage.tsx**: 404 page for handling invalid routes.

### 3. Data Visualization

- **RadarChart.tsx**: A reusable radar chart component built on Recharts.
- **ChartContainer.tsx**: A container for charts with consistent styling, loading states, etc.
- **PlayStyleVisualization.tsx**: The team play style visualization component that uses RadarChart.

### 4. Data Management

- **metrics-service.ts**: Service for fetching and processing team metrics data.
- **team-service.ts**: Service for managing team data and metadata.
- **useTeamMetrics.ts**: Hook for fetching team metrics from the service layer.
- **useTeamMetricsRadarData.ts**: Hook for transforming metrics into radar chart format.

### 5. Configuration

- **constants.ts**: Application constants, including supported leagues.
- **metrics-dictionary.ts**: Comprehensive definitions of all metrics used in the application.
- **chart-configs.ts**: Configuration for different chart views, defining which metrics to display.

## Module Dependencies

The application follows a clear dependency hierarchy:

1. **Data Layer**: Mock JSON data (team-metrics.json, teams.json, etc.)
2. **Service Layer**: Services that access and provide data (metrics-service.ts, team-service.ts)
3. **Hook Layer**: Custom hooks that fetch and transform data (useTeamMetrics.ts, useTeamMetricsRadarData.ts)
4. **Component Layer**: UI components that render the data (RadarChart.tsx, PlayStyleVisualization.tsx)
5. **Page Layer**: Full page components that compose multiple components (TeamDashboard.tsx)

This hierarchy ensures separation of concerns and maintainability as the application grows.

## Key Features and Implementation Notes

### League System

- The application currently supports a "Developer League" with mock data.
- Other leagues (Premier League, etc.) are shown as "Coming Soon" and disabled.
- The league system is extensible for future real data integration.

### Radar Chart Visualization

The radar chart visualization is implemented with the following components:

1. **chart-configs.ts**: Defines which metrics to display in different chart views.
2. **useTeamMetricsRadarData.ts**: Transforms raw metrics into radar chart format.
3. **RadarChart.tsx**: Renders the radar chart using Recharts.
4. **PlayStyleVisualization.tsx**: Wrapper component that handles configuration and context.

The radar chart is organized into four play style categories:
- Possession & Build-up (left)
- Attacking (top)
- Defensive (bottom)
- Tempo & Transitions (right)

### Metric Normalization

Metrics are normalized to a 0-100 scale relative to league benchmarks, with appropriate handling for metrics where lower values are better.

### TypeScript Integration

The application uses TypeScript throughout with comprehensive type definitions in the `/types` directory.

## Future Architectural Considerations

As the application evolves, consider:

1. **API Integration**: Replacing mock data with real API endpoints.
2. **State Management**: Adding more sophisticated state management (Context, Redux) as complexity grows.
3. **Testing**: Implementing unit and integration tests for components and hooks.
4. **Performance Optimization**: Adding memoization, virtualization, and code splitting as the application scales.
5. **Internationalization**: Supporting multiple languages for global users.