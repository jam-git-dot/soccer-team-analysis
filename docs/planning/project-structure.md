## Documentation Maintenance Workflow
- Update documentation separately from code changes
- Version documentation alongside code using git tags
- Review documentation as part of code review process
- Automate documentation checks using GitHub Actions

## Project Structure
soccer-analysis-app/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── assets/                  # Static assets (images, logos)
│   │   └── react.svg            # React logo
│   ├── components/              # Reusable UI components
│   │   ├── charts/              # Chart components 
│   │   │   ├── index.ts         # Exports all chart components
│   │   │   ├── ChartContainer.tsx  # Container for charts with consistent styling
│   │   │   ├── RadarChart.tsx   # Radar chart component
│   │   │   ├── BarChart.tsx     # Bar chart component
│   │   │   ├── LineChart.tsx    # Line chart component
│   │   │   ├── PieChart.tsx     # Pie chart component
│   │   │   ├── MetricsBarChart.tsx # Specialized bar chart for metrics
│   │   │   └── LeagueMetricsChart.tsx # League comparison chart
│   │   ├── common/              # Shared UI elements
│   │   │   └── ErrorBoundary.tsx # Error handling component
│   │   ├── metrics/             # Metric-specific components
│   │   │   ├── AttackingMetrics.tsx  # Attacking metrics visualization
│   │   │   ├── DefensiveMetrics.tsx  # Defensive metrics visualization
│   │   │   ├── TempoMetrics.tsx      # Tempo metrics visualization
│   │   │   ├── PosessionMetrics.tsx  # Possession metrics visualization
│   │   │   ├── MetricCard.tsx        # Single metric display card
│   │   │   ├── MetricsTable.tsx      # Tabular metrics display
│   │   │   └── MetricsSection.tsx    # Section container for metrics
│   │   ├── team-dashboard/      # Team dashboard components
│   │   │   ├── PlayStyleVisualization.tsx # Radar chart wrapper
│   │   │   ├── PerformanceByResult.tsx    # Performance comparison by match result
│   │   │   └── PlayStyleDashboard.tsx     # Main dashboard layout
│   ├── config/                  # Application configuration
│   │   ├── api.ts               # API client configuration
│   │   ├── constants.ts         # App constants and supported leagues
│   │   └── metrics.ts           # Metrics definitions and formatting
│   ├── hooks/                   # Custom React hooks
│   │   ├── index.ts             # Central export for hooks
│   │   ├── useTeamMetrics.ts    # Hook for fetching team metrics
│   │   └── useChartData.ts      # Hook for transforming data for charts
│   ├── mock/                    # Mock data for development
│   │   ├── team-metrics.json    # Mock team metrics data
│   │   ├── leagues.json         # Empty placeholder for leagues
│   │   ├── matches.json         # Empty placeholder for matches
│   │   ├── match-metrics.json   # Empty placeholder for match metrics
│   │   ├── team-stats.json      # Empty placeholder for team stats
│   │   └── teams.json           # Empty placeholder for teams
│   ├── pages/                   # Page components
│   │   └── TeamDashboard.tsx    # Main team analysis dashboard page
│   ├── services/                # API and data services
│   │   ├── metrics-service.ts   # Service for fetching metrics data
│   │   └── mock-data.ts         # Service for generating mock data
│   ├── styles/                  # CSS styles
│   │   └── theme.css            # Theme variables and base styles
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts             # Exports all types
│   │   ├── api.ts               # API response types
│   │   ├── league.ts            # League data model types
│   │   ├── match.ts             # Match data model types
│   │   ├── metrics.ts           # Metrics data model types
│   │   └── team.ts              # Team data model types
│   ├── App.tsx                  # Main application component
│   ├── index.css                # Global styles
│   ├── main.tsx                 # Application entry point
│   ├── vite-env.d.ts            # Vite type definitions
│   └── polyfills.ts             # Polyfills for browser compatibility
├── .env                         # Environment variables
├── .env.development             # Development environment variables
├── .env.production              # Production environment variables
├── .eslintrc.js                 # ESLint configuration
├── .gitignore                   # Git ignore file
├── index.html                   # Main HTML template
├── package.json                 # NPM package configuration
├── README.md                    # Project documentation
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript Node configuration
└── vite.config.ts               # Vite configuration

## Key Components for Radar Chart Visualization

The primary data flow for the radar chart visualization involves these key files:

1. **src/pages/TeamDashboard.tsx** - Entry point that fetches team data
2. **src/hooks/useTeamMetrics.ts** - Fetches team metrics data
3. **src/services/metrics-service.ts** - Service that retrieves metrics from mock data
4. **src/mock/team-metrics.json** - Mock data source for team metrics
5. **src/components/team-dashboard/PlayStyleVisualization.tsx** - Main visualization component
6. **src/hooks/useChartData.ts** - Transforms metrics data for the radar chart
7. **src/components/charts/RadarChart.tsx** - Renders the actual radar chart
8. **src/components/charts/ChartContainer.tsx** - Container with loading/error states

The metric selection for the radar chart is currently controlled in **src/hooks/useChartData.ts**, where there's a hardcoded `selectedMetrics` object that determines which metrics from each category are displayed in the visualization.