# Soccer Play Style Analysis Data Flow

This document describes the current data flow architecture for the soccer play style analysis application, with a focus on the radar chart visualization.

## Data Flow Overview

The application follows a unidirectional data flow pattern:

1. Raw metrics data is stored in mock JSON files
2. Services access this data and provide it to the application 
3. Custom hooks transform the raw data into visualization-ready formats
4. React components render the visualizations using the transformed data

## Key Components

### 1. Data Definition and Structure

- **`src/mock/team-metrics.json`**: Contains mock team metrics data for all teams in the Developer League
- **`src/config/metrics-dictionary.ts`**: Defines all available metrics with metadata (display name, category, range, etc.)
- **`src/config/constants.ts`**: Contains league definitions, category definitions, and application constants
- **`src/config/chart-configs.ts`**: Defines chart configurations and metric selections for different views

### 2. Data Access Layer

- **`src/services/metrics-service.ts`**: Service that retrieves metrics from mock data
- **`src/services/team-service.ts`**: Service for team information and metadata
- **`src/services/mock-data.ts`**: Helper service for accessing and transforming mock data

### 3. Data Transformation Layer

- **`src/hooks/useTeamMetrics.ts`**: Hook for fetching team metrics data
- **`src/hooks/useTeamMetricsRadarData.ts`**: Transforms metrics data for radar chart visualization

### 4. Visualization Components

- **`src/components/charts/RadarChart.tsx`**: Reusable radar chart component
- **`src/components/charts/ChartContainer.tsx`**: Container with loading/error states
- **`src/components/team-dashboard/PlayStyleVisualization.tsx`**: Team visualization wrapper

## Detailed Data Flow for Radar Chart

The primary radar chart visualization follows this data flow:

1. **Data Source**:
   - Raw team metrics stored in `team-metrics.json`
   - Metrics metadata defined in `metrics-dictionary.ts`
   - Chart configurations in `chart-configs.ts`

2. **Data Fetching**:
   - `TeamDashboard` component requests data for a specific team
   - Team ID is extracted from the URL parameters
   - `metrics-service.ts` is called to fetch the team's metrics
   - `mock-data.ts` provides team information (name, logo, etc.)

3. **Data Transformation**:
   - `useTeamMetricsRadarData` hook transforms raw metrics into visualization format
   - Metrics are normalized to a 0-100 scale based on league benchmarks
   - Metrics are organized by category (possession, attacking, defending, tempo)
   - Category colors and angle positioning are applied for visual organization

4. **Visualization Rendering**:
   - `PlayStyleVisualization` component receives transformed data
   - Uses `RadarChart` component to render the visualization
   - `ChartContainer` provides consistent styling and handles loading/error states
   - User can switch between different metric views using the configuration selector

## League Context

The application now supports the concept of leagues:

1. **The Developer League**: 
   - Active league with full data support
   - Contains all teams from `team-metrics.json`
   - Users can browse and view all team data

2. **Other Leagues** (Premier League, etc.):
   - Shown as "Coming Soon" and disabled
   - Cannot be selected by users
   - No data available for these leagues yet

Services check for valid league access and provide appropriate error handling when users attempt to access unavailable leagues.

## Type Flow

The TypeScript type system ensures data integrity across the application:

1. **Base Types**:
   - `MetricDefinition`: Structure of a metric definition in metrics-dictionary
   - `TeamMetrics`: Structure of team metrics data
   - `ChartConfig`: Configuration for charts

2. **Transformation Types**:
   - `RadarChartDataEntry`: Structure for radar chart data points
   - `CategoryMetrics`: Maps categories to metric IDs

3. **Component Props**:
   - `RadarChartProps`: Props for the radar chart component
   - `ChartContainerProps`: Props for the chart container
   - `PlayStyleVisualizationProps`: Props for the team visualization

## Visual Data Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  team-metrics   │────▶│  metrics-       │────▶│  TeamDashboard  │
│  .json          │     │  service.ts     │     │  .tsx           │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐              │
│                 │     │                 │              │
│  metrics-       │────▶│  chart-         │              │
│  dictionary.ts  │     │  configs.ts     │              │
│                 │     │                 │              │
└─────────────────┘     └────────┬────────┘              │
                                 │                        │
                                 │                        │
                        ┌────────▼────────┐     ┌─────────▼───────┐
                        │                 │     │                 │
                        │  useTeamMetrics │◀────│  PlayStyle      │
                        │  RadarData.ts   │     │  Visualization  │
                        │                 │     │                 │
                        └────────┬────────┘     └────────┬────────┘
                                 │                        │
                                 │                        │
                                 │              ┌─────────▼───────┐
                                 │              │                 │
                                 └──────────────▶│  RadarChart    │
                                                │  .tsx           │
                                                │                 │
                                                └─────────────────┘
```

## Normalization Strategy

The application uses a consistent normalization strategy to make different metrics comparable:

1. **Range-Based Normalization**:
   - Each metric has a defined range (min, max) in metrics-dictionary
   - Raw values are linearly mapped to a 0-100 scale
   - For metrics where lower is better, the scale is inverted

2. **Percentile Calculation**:
   - Some metrics include percentile rankings in their tooltip display
   - These show where a team ranks compared to other teams in the league
   - Text labels provide context (e.g., "Top 10%", "Above Average")

3. **League Benchmarking**:
   - Metrics are displayed relative to league benchmarks
   - This provides context for understanding a team's strengths and weaknesses
   - Tooltips show both raw values and league context

## Future Enhancements

Future improvements to the data flow architecture may include:

1. Replacing mock data with real API integration
2. Adding caching layer for performance optimization
3. Implementing more sophisticated normalization algorithms
4. Supporting custom metric selection by users
5. Adding comparison views for multiple teams
6. Implementing time-series analysis for trends
7. Expanding to additional leagues with real data