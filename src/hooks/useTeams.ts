import { useState, useEffect } from 'react';
import teamService from '@/services/team-service';
import type { Team, TeamWithStats } from '@/types';

/**
 * Hook for fetching and managing teams data
 * @param leagueId Optional league ID to filter teams
 * @param withStandings Whether to include team standings (requires leagueId)
 * @param seasonId Optional season ID for standings
 * @param limit Optional limit for the number of teams to fetch when using standings
 */
export function useTeams(
  leagueId?: string,
  withStandings = false,
  seasonId?: string,
  limit?: number
) {
  const [teams, setTeams] = useState<Team[] | TeamWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when parameters change
    setTeams([]);
    setError(null);
    setLoading(true);
    
    // Fetch teams data
    const fetchTeamsData = async () => {
      try {
        let teamsData;
        
        if (withStandings && leagueId) {
          // Fetch teams with standings
          teamsData = await teamService.getTeamsByStanding(leagueId, seasonId, limit);
        } else {
          // Fetch regular teams list
          teamsData = await teamService.getTeams(leagueId);
        }
        
        setTeams(teamsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch teams data'));
        setLoading(false);
      }
    };
    
    fetchTeamsData();
  }, [leagueId, withStandings, seasonId, limit]);
  
  /**
   * Search teams by name
   * @param searchTerm Search term
   */
  const searchTeams = async (searchTerm: string) => {
    if (!searchTerm) {
      // If search term is empty, reset to original teams list
      setLoading(true);
      try {
        const teamsData = await teamService.getTeams(leagueId);
        setTeams(teamsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch teams data'));
        setLoading(false);
      }
      return;
    }
    
    // Search teams
    setLoading(true);
    try {
      const searchResults = await teamService.searchTeams(searchTerm, leagueId);
      setTeams(searchResults);
      setLoading(false);
    } catch (err) {
      console.error('Error searching teams:', err);
      setError(err instanceof Error ? err : new Error('Failed to search teams'));
      setLoading(false);
    }
  };
  
  /**
   * Get rival teams that have played against a specific team
   * @param teamId Team ID to find rivals for
   */
  const getRivalTeams = async (teamId: string) => {
    setLoading(true);
    try {
      const rivals = await teamService.getRivalTeams(teamId, seasonId);
      setTeams(rivals);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rival teams:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch rival teams'));
      setLoading(false);
    }
  };
  
  /**
   * Manually refresh the teams data
   */
  const refreshTeams = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let teamsData;
      
      if (withStandings && leagueId) {
        teamsData = await teamService.getTeamsByStanding(leagueId, seasonId, limit);
      } else {
        teamsData = await teamService.getTeams(leagueId);
      }
      
      setTeams(teamsData);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing teams data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh teams data'));
      setLoading(false);
    }
  };
  
  return {
    teams,
    loading,
    error,
    searchTeams,
    getRivalTeams,
    refreshTeams
  };
}

export default useTeams;