/**
 * Central export file for all hooks
 * This allows importing hooks with a simpler syntax:
 * import { useTeamMetrics, useTeamMetricsRadarData } from '@/hooks';
 */

// Team metrics hooks
export { useTeamMetrics } from './useTeamMetrics';

// Chart data hooks
export { 
  useTeamMetricsRadarData,
  useMetricsByResultBarData,
  useComparativeMetricsBarData,
  useMatchMetricsLineData
} from './useChartData';

// Team hooks
export { default as useTeam } from './useTeam';
export { default as useTeams } from './useTeams';

// League hooks
export { default as useLeague } from './useLeague';
export { default as useLeagues } from './useLeagues';

// Match hooks
export { default as useMatches } from './useMatches';

// Metrics hooks
export { default as useMetrics } from './useMetrics';