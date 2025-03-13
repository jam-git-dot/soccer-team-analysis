/**
 * Central export file for all hooks
 * This allows importing hooks with a simpler syntax:
 * import { useTeam, useLeague } from '@/hooks';
 */

// Team hooks
export { useTeam } from './useTeam';
export { useTeams } from './useTeams';

// League hooks
export { useLeague } from './useLeague';
export { useLeagues } from './useLeagues';

// Match hooks
export { useMatches, useMatch } from './useMatches';

// Metrics hooks
export { 
  useTeamMetrics,
  useMatchMetrics,
  useLeaguePlayStyles
} from './useMetrics';

// Chart data hooks
export {
  useTeamMetricsRadarData,
  useMetricsByResultBarData,
  useComparativeMetricsBarData,
  useMatchMetricsLineData
} from './useChartData';