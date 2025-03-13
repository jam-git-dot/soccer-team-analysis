import { useState, useEffect } from 'react';
import teamService from '@/services/team-service';
import type { TeamDetails, TeamStats, TeamWithStats } from '@/types';

/**
 * Hook for fetching and managing data for a specific team
 * @param teamId Team ID to fetch data for
 * @param includeStats Whether to include team statistics
 * @param seasonId Optional season ID for statistics
 */
export function useTeam(teamId: string | undefined, includeStats = false, seasonId?: string) {
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when team ID changes
    setTeam(null);
    setStats(null);
    setError(null);
    
    // Don't fetch if no team ID is provided
    if (!teamId) {
      setLoading(false);
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    // Fetch team data
    const fetchTeamData = async () => {
      try {
        if (includeStats) {
          // Fetch team with stats
          const teamWithStats = await teamService.getTeamWithStats(teamId, seasonId);
          setTeam(teamWithStats);
          setStats(teamWithStats.stats);
        } else {
          // Fetch just the team details
          const teamDetails = await teamService.getTeamById(teamId);
          setTeam(teamDetails);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch team data'));
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [teamId, includeStats, seasonId]);
  
  /**
   * Manually refresh the team data
   */
  const refreshTeam = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!teamId) {
        throw new Error('Team ID is required to refresh team data');
      }
      
      if (includeStats) {
        const teamWithStats = await teamService.getTeamWithStats(teamId, seasonId);
        setTeam(teamWithStats);
        setStats(teamWithStats.stats);
      } else {
        const teamDetails = await teamService.getTeamById(teamId);
        setTeam(teamDetails);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing team data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh team data'));
      setLoading(false);
    }
  };
  
  return {
    team,
    stats,
    loading,
    error,
    refreshTeam
  };
}

export default useTeam;