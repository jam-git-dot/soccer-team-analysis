import { useState, useEffect } from 'react';
import metricsService from '@/services/metrics-service';
import type { TeamMetrics } from '@/types';

/**
 * Hook for fetching and managing team metrics data
 * @param teamId Team ID to fetch metrics for
 * @param seasonId Optional season ID
 */
export function useTeamMetrics(teamId: string | undefined, seasonId?: string) {
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when parameters change
    setMetrics(null);
    setError(null);
    
    // Don't fetch if no team ID is provided
    if (!teamId) {
      setLoading(false);
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    // Fetch team metrics
    const fetchTeamMetrics = async () => {
      try {
        console.log(`Fetching metrics for team ID: ${teamId}`);
        const teamMetrics = await metricsService.getTeamMetrics(teamId, seasonId);
        console.log('Metrics fetched successfully');
        setMetrics(teamMetrics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team metrics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch team metrics'));
        setLoading(false);
      }
    };
    
    fetchTeamMetrics();
  }, [teamId, seasonId]);
  
  /**
   * Manually refresh the team metrics
   */
  const refreshMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!teamId) {
        throw new Error('Team ID is required to refresh team metrics');
      }
      
      const teamMetrics = await metricsService.getTeamMetrics(teamId, seasonId);
      setMetrics(teamMetrics);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing team metrics:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh team metrics'));
      setLoading(false);
    }
  };
  
  return {
    metrics,
    loading,
    error,
    refreshMetrics
  };
}

export default useTeamMetrics;