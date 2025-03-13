import { useState, useEffect } from 'react';
import matchService from '@/services/match-service';
import type { Match, MatchDetails, MatchStatus, MatchWithStats } from '@/types';

interface MatchesFilters {
  leagueId?: string;
  teamId?: string;
  status?: MatchStatus;
  dateFrom?: string;
  dateTo?: string;
  season?: string;
}

/**
 * Hook for fetching and managing matches data
 * @param filters Filters for matches query
 */
export function useMatches(filters?: MatchesFilters) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when filters change
    setMatches([]);
    setError(null);
    setLoading(true);
    
    // Fetch matches data
    const fetchMatchesData = async () => {
      try {
        const matchesData = await matchService.getMatches(filters);
        setMatches(matchesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching matches data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch matches data'));
        setLoading(false);
      }
    };
    
    fetchMatchesData();
  }, [
    filters?.leagueId,
    filters?.teamId,
    filters?.status,
    filters?.dateFrom,
    filters?.dateTo,
    filters?.season
  ]);
  
  /**
   * Get upcoming matches for a team
   * @param teamId Team ID
   * @param limit Optional limit of matches to return
   */
  const getUpcomingMatches = async (teamId: string, limit?: number) => {
    setLoading(true);
    try {
      const upcomingMatches = await matchService.getUpcomingMatches(teamId, limit);
      setMatches(upcomingMatches);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching upcoming matches:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch upcoming matches'));
      setLoading(false);
    }
  };
  
  /**
   * Get head-to-head matches between two teams
   * @param teamId1 First team ID
   * @param teamId2 Second team ID
   * @param limit Optional limit of matches to return
   * @param seasonId Optional season ID filter
   */
  const getHeadToHeadMatches = async (
    teamId1: string,
    teamId2: string,
    limit?: number,
    seasonId?: string
  ) => {
    setLoading(true);
    try {
      const h2hMatches = await matchService.getHeadToHeadMatches(teamId1, teamId2, limit, seasonId);
      setMatches(h2hMatches);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching head-to-head matches:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch head-to-head matches'));
      setLoading(false);
    }
  };
  
  /**
   * Manually refresh the matches data
   */
  const refreshMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const matchesData = await matchService.getMatches(filters);
      setMatches(matchesData);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing matches data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh matches data'));
      setLoading(false);
    }
  };
  
  return {
    matches,
    loading,
    error,
    getUpcomingMatches,
    getHeadToHeadMatches,
    refreshMatches
  };
}

/**
 * Hook for fetching and managing data for a specific match
 * @param matchId Match ID to fetch data for
 * @param includeStats Whether to include match statistics
 */
export function useMatch(matchId: string | undefined, includeStats = false) {
  const [match, setMatch] = useState<MatchDetails | MatchWithStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when match ID changes
    setMatch(null);
    setError(null);
    
    // Don't fetch if no match ID is provided
    if (!matchId) {
      setLoading(false);
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    // Fetch match data
    const fetchMatchData = async () => {
      try {
        if (includeStats) {
          // Fetch match with stats
          const matchWithStats = await matchService.getMatchWithStats(matchId);
          setMatch(matchWithStats);
        } else {
          // Fetch just the match details
          const matchDetails = await matchService.getMatchById(matchId);
          setMatch(matchDetails);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching match data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch match data'));
        setLoading(false);
      }
    };
    
    fetchMatchData();
  }, [matchId, includeStats]);
  
  /**
   * Get match metrics for a specific team
   * @param teamId Team ID
   */
  const getMatchMetrics = async (teamId: string) => {
    if (!matchId) {
      setError(new Error('Match ID is required to fetch match metrics'));
      return null;
    }
    
    try {
      return await matchService.getMatchMetrics(matchId, teamId);
    } catch (err) {
      console.error('Error fetching match metrics:', err);
      return null;
    }
  };
  
  /**
   * Manually refresh the match data
   */
  const refreshMatch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!matchId) {
        throw new Error('Match ID is required to refresh match data');
      }
      
      if (includeStats) {
        const matchWithStats = await matchService.getMatchWithStats(matchId);
        setMatch(matchWithStats);
      } else {
        const matchDetails = await matchService.getMatchById(matchId);
        setMatch(matchDetails);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing match data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh match data'));
      setLoading(false);
    }
  };
  
  return {
    match,
    loading,
    error,
    getMatchMetrics,
    refreshMatch
  };
}

export default useMatches;