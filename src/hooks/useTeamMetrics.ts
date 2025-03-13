/**
 * Hook for accessing and filtering team metrics data
 */

import { useState, useMemo } from 'react';
import { 
  TeamId, 
  MatchResult, 
  TeamMetricsData, 
  TeamBasicInfo,
  getTeamData, 
  getTeamInfo
} from '../services/mock-data';
import { MetricId, getMetricsByCategory, getMetricsByIds } from '../config/metrics';

type UseTeamMetricsProps = {
  teamId: TeamId;
  defaultResult?: MatchResult;
};

type UseTeamMetricsReturn = {
  teamInfo: TeamBasicInfo | null;
  metricsData: TeamMetricsData | null;
  selectedResult: MatchResult;
  setSelectedResult: (result: MatchResult) => void;
  getMetricValue: (metricId: MetricId) => number | null;
  getMetricPercentile: (metricId: MetricId) => number | null;
  getCategoryMetrics: (categoryId: string) => Array<{
    metricId: MetricId;
    value: number;
    percentile: number | undefined;
  }>;
  getMetricsSubset: (metricIds: MetricId[]) => Array<{
    metricId: MetricId;
    value: number;
    percentile: number | undefined;
  }>;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Hook for accessing and filtering team metrics data
 */
export default function useTeamMetrics({
  teamId,
  defaultResult = 'all'
}: UseTeamMetricsProps): UseTeamMetricsReturn {
  const [selectedResult, setSelectedResult] = useState<MatchResult>(defaultResult);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch team data and info
  const teamData = useMemo(() => getTeamData(teamId), [teamId]);
  const teamInfo = useMemo(() => getTeamInfo(teamId), [teamId]);
  
  // Get current metrics data based on selected result
  const metricsData = useMemo(() => {
    if (!teamData) return null;
    return teamData[selectedResult];
  }, [teamData, selectedResult]);

  // Helper function to get a specific metric value
  const getMetricValue = (metricId: MetricId): number | null => {
    if (!metricsData || !metricsData.metrics[metricId]) return null;
    return metricsData.metrics[metricId].value;
  };

  // Helper function to get a specific metric percentile
  const getMetricPercentile = (metricId: MetricId): number | null => {
    if (!metricsData || !metricsData.metrics[metricId] || 
        metricsData.metrics[metricId].percentile === undefined) {
      return null;
    }
    return metricsData.metrics[metricId].percentile;
  };

  // Helper function to get metrics for a category
  const getCategoryMetrics = (categoryId: string) => {
    if (!metricsData) return [];
    
    const categoryMetrics = getMetricsByCategory(categoryId);
    return categoryMetrics.map(metric => ({
      metricId: metric.id,
      value: metricsData.metrics[metric.id]?.value || 0,
      percentile: metricsData.metrics[metric.id]?.percentile
    }));
  };

  // Helper function to get a subset of metrics by IDs
  const getMetricsSubset = (metricIds: MetricId[]) => {
    if (!metricsData) return [];
    
    return metricIds.map(metricId => ({
      metricId,
      value: metricsData.metrics[metricId]?.value || 0,
      percentile: metricsData.metrics[metricId]?.percentile
    }));
  };

    // Add console log here
    console.log("TeamData for", teamId, ":", teamData);
    console.log("Current metrics data:", metricsData);

  return {
    teamInfo,
    metricsData,
    selectedResult,
    setSelectedResult,
    getMetricValue,
    getMetricPercentile,
    getCategoryMetrics,
    getMetricsSubset,
    isLoading,
    error
  };
}