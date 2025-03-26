import { useState, useEffect } from 'react';
import metricsService from '@/services/metrics-service';
import type { 
  TeamMetrics, 
  MatchMetrics, 
  ComparativeMetrics,
  PlayStyle
} from '@/types';

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
        const teamMetrics = await metricsService.getTeamMetrics(teamId, seasonId);
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
   * Get comparative metrics for the team in a league context
   * @param leagueId League ID
   */
  const getComparativeMetrics = async (leagueId: string) => {
    if (!teamId) {
      setError(new Error('Team ID is required to fetch comparative metrics'));
      return null;
    }
    
    try {
      return await metricsService.getComparativeMetrics(teamId, leagueId, seasonId);
    } catch (err) {
      console.error('Error fetching comparative metrics:', err);
      return null;
    }
  };
  
  /**
   * Get metrics grouped by match result (win, draw, loss)
   */
  const getMetricsByResult = async () => {
    if (!teamId) {
      setError(new Error('Team ID is required to fetch metrics by result'));
      return null;
    }
    
    try {
      return await metricsService.getMetricsByResult(teamId, seasonId);
    } catch (err) {
      console.error('Error fetching metrics by result:', err);
      return null;
    }
  };
  
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
    getComparativeMetrics,
    getMetricsByResult,
    refreshMetrics
  };
}

/**
 * Hook for fetching and managing match metrics data
 * @param matchId Match ID to fetch metrics for
 * @param teamId Team ID to fetch metrics for
 */
export function useMatchMetrics(matchId: string | undefined, teamId: string | undefined) {
  const [metrics, setMetrics] = useState<MatchMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when parameters change
    setMetrics(null);
    setError(null);
    
    // Don't fetch if either ID is missing
    if (!matchId || !teamId) {
      setLoading(false);
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    // Fetch match metrics
    const fetchMatchMetrics = async () => {
      try {
        const matchMetrics = await metricsService.getMatchMetrics(teamId, matchId);
        setMetrics(matchMetrics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching match metrics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch match metrics'));
        setLoading(false);
      }
    };
    
    fetchMatchMetrics();
  }, [matchId, teamId]);
  
  /**
   * Manually refresh the match metrics
   */
  const refreshMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!matchId || !teamId) {
        throw new Error('Match ID and Team ID are required to refresh match metrics');
      }
      
      const matchMetrics = await metricsService.getMatchMetrics(teamId, matchId);
      setMetrics(matchMetrics);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing match metrics:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh match metrics'));
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

/**
 * Hook for fetching play style distribution in a league
 * @param leagueId League ID
 * @param seasonId Optional season ID
 */
export function useLeaguePlayStyles(leagueId: string | undefined, seasonId?: string) {
  const [playStyles, setPlayStyles] = useState<Record<PlayStyle, number> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when parameters change
    setPlayStyles(null);
    setError(null);
    
    // Don't fetch if no league ID is provided
    if (!leagueId) {
      setLoading(false);
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    // Fetch play style distribution
    const fetchPlayStyleDistribution = async () => {
      try {
        const distribution = await metricsService.getLeaguePlayStyleDistribution(leagueId, seasonId);
        setPlayStyles(distribution);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching play style distribution:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch play style distribution'));
        setLoading(false);
      }
    };
    
    fetchPlayStyleDistribution();
  }, [leagueId, seasonId]);
  
  /**
   * Manually refresh the play style distribution
   */
  const refreshPlayStyles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!leagueId) {
        throw new Error('League ID is required to refresh play style distribution');
      }
      
      const distribution = await metricsService.getLeaguePlayStyleDistribution(leagueId, seasonId);
      setPlayStyles(distribution);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing play style distribution:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh play style distribution'));
      setLoading(false);
    }
  };
  
  /**
   * Get the most common play style in the league
   */
  const getMostCommonPlayStyle = (): { style: PlayStyle, count: number } | null => {
    if (!playStyles) {
      return null;
    }
    
    let maxCount = 0;
    let dominantStyle: PlayStyle = 'BALANCED';
    
    Object.entries(playStyles).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantStyle = style as PlayStyle;
      }
    });
    
    return { style: dominantStyle, count: maxCount };
  };
  
  return {
    playStyles,
    loading,
    error,
    getMostCommonPlayStyle,
    refreshPlayStyles
  };
}

export default useTeamMetrics;