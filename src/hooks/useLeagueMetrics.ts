/**
 * Hook for accessing and comparing league-wide metrics data
 */

import { useMemo } from 'react';
import { 
  TeamId, 
  MatchResult, 
  TeamBasicInfo,
  getAllTeams,
  getMockTeamData
} from '../services/mock-data';
import { MetricId, METRICS, isHigherBetter } from '../config/metrics';

type UseLeagueMetricsProps = {
  teamId?: TeamId;
  result?: MatchResult;
};

type TeamMetricComparisonData = {
  teamId: string;
  teamName: string;
  teamShortName: string;
  value: number;
  percentile?: number;
  rank: number;
};

type UseLeagueMetricsReturn = {
  teamInfo: TeamBasicInfo | null;
  allTeams: TeamBasicInfo[];
  getMetricComparisonData: (metricId: MetricId) => TeamMetricComparisonData[];
  getTeamRank: (metricId: MetricId) => number;
  getTopTeamsForMetric: (metricId: MetricId, count?: number) => TeamMetricComparisonData[];
  getCategoryAverages: (categoryId: string) => Record<MetricId, { 
    leagueAvg: number;
    teamValue: number;
    difference: number;
    percentDifference: number;
  }>;
};

/**
 * Hook for accessing and comparing league-wide metrics data
 */
export default function useLeagueMetrics({
  teamId,
  result = 'all'
}: UseLeagueMetricsProps = {}): UseLeagueMetricsReturn {
  // Get all teams
  const allTeams = getAllTeams();
  
  // Get all team data
  const allTeamData = useMemo(() => getMockTeamData(), []);
  
  // Find team info if teamId is provided
  const teamInfo = useMemo(() => {
    if (!teamId) return null;
    return allTeams.find(team => team.id === teamId) || null;
  }, [teamId, allTeams]);
  
  // Get comparison data for a specific metric
  const getMetricComparisonData = (metricId: MetricId): TeamMetricComparisonData[] => {
    const metric = METRICS[metricId];
    if (!metric) return [];
    
    // Extract values for all teams
    const teamsData = allTeams.map(team => {
      const metrics = allTeamData[team.id]?.[result]?.metrics || {};
      const value = metrics[metricId]?.value || 0;
      const percentile = metrics[metricId]?.percentile;
      
      return {
        teamId: team.id,
        teamName: team.name,
        teamShortName: team.shortName,
        value,
        percentile
      };
    });
    
    // Sort teams based on metric value
    const sortedTeams = [...teamsData].sort((a, b) => {
      if (metric.higherIsBetter === false) {
        // For metrics where lower is better, sort ascending
        return a.value - b.value;
      }
      // For metrics where higher is better, sort descending
      return b.value - a.value;
    });
    
    // Add rank to each team
    return sortedTeams.map((team, index) => ({
      ...team,
      rank: index + 1
    }));
  };
  
  // Get a team's rank for a specific metric
  const getTeamRank = (metricId: MetricId): number => {
    if (!teamId) return 0;
    
    const comparisonData = getMetricComparisonData(metricId);
    const teamData = comparisonData.find(data => data.teamId === teamId);
    
    return teamData?.rank || 0;
  };
  
  // Get top N teams for a specific metric
  const getTopTeamsForMetric = (
    metricId: MetricId, 
    count: number = 5
  ): TeamMetricComparisonData[] => {
    const comparisonData = getMetricComparisonData(metricId);
    return comparisonData.slice(0, count);
  };
  
  // Get category averages compared to the selected team
  const getCategoryAverages = (categoryId: string): Record<MetricId, { 
    leagueAvg: number;
    teamValue: number;
    difference: number;
    percentDifference: number;
  }> => {
    if (!teamId) return {};
    
    // Get all metrics for this category
    const categoryMetrics = Object.values(METRICS).filter(
      metric => metric.category === categoryId
    );
    
    const result: Record<string, any> = {};
    
    categoryMetrics.forEach(metric => {
      // Calculate league average
      let sum = 0;
      let count = 0;
      
      allTeams.forEach(team => {
        const value = allTeamData[team.id]?.[result]?.metrics[metric.id]?.value;
        if (value !== undefined) {
          sum += value;
          count++;
        }
      });
      
      const leagueAvg = count > 0 ? sum / count : 0;
      
      // Get team value
      const teamValue = allTeamData[teamId]?.[result]?.metrics[metric.id]?.value || 0;
      
      // Calculate difference
      const difference = teamValue - leagueAvg;
      
      // Calculate percent difference
      const percentDifference = leagueAvg !== 0 
        ? (difference / leagueAvg) * 100 
        : 0;
      
      result[metric.id] = {
        leagueAvg,
        teamValue,
        difference,
        percentDifference
      };
    });
    
    return result;
  };
  
  return {
    teamInfo,
    allTeams,
    getMetricComparisonData,
    getTeamRank,
    getTopTeamsForMetric,
    getCategoryAverages
  };
}