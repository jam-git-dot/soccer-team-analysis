import { useState, useEffect } from 'react';
import leagueService from '@/services/league-service';
import type { LeagueDetails, LeagueStandingsTable, Season } from '@/types';

/**
 * Hook for fetching and managing data for a specific league
 * @param leagueId League ID to fetch data for
 * @param includeStandings Whether to include league standings
 * @param seasonId Optional season ID for standings
 */
export function useLeague(
  leagueId: string | undefined, 
  includeStandings = false, 
  seasonId?: string
) {
  const [league, setLeague] = useState<LeagueDetails | null>(null);
  const [standings, setStandings] = useState<LeagueStandingsTable | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when league ID changes
    setLeague(null);
    setStandings(null);
    setSeasons([]);
    setError(null);
    
    // Don't fetch if no league ID is provided
    if (!leagueId) {
      setLoading(false);
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    // Fetch league data
    const fetchLeagueData = async () => {
      try {
        // Fetch league details
        const leagueDetails = await leagueService.getLeagueById(leagueId);
        setLeague(leagueDetails);
        
        // Fetch seasons
        setSeasons(leagueDetails.seasons);
        
        // Fetch standings if requested
        if (includeStandings) {
          const leagueStandings = await leagueService.getLeagueStandings(
            leagueId, 
            seasonId || leagueDetails.currentSeason
          );
          setStandings(leagueStandings);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching league data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch league data'));
        setLoading(false);
      }
    };
    
    fetchLeagueData();
  }, [leagueId, includeStandings, seasonId]);
  
  /**
   * Get standings for a specific season
   * @param seasonId Season ID
   */
  const getStandings = async (seasonIdToFetch: string) => {
    if (!leagueId) {
      setError(new Error('League ID is required to fetch standings'));
      return;
    }
    
    setLoading(true);
    try {
      const leagueStandings = await leagueService.getLeagueStandings(leagueId, seasonIdToFetch);
      setStandings(leagueStandings);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching league standings:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch league standings'));
      setLoading(false);
    }
  };
  
  /**
   * Manually refresh the league data
   */
  const refreshLeague = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!leagueId) {
        throw new Error('League ID is required to refresh league data');
      }
      
      // Fetch league details
      const leagueDetails = await leagueService.getLeagueById(leagueId);
      setLeague(leagueDetails);
      
      // Fetch seasons
      setSeasons(leagueDetails.seasons);
      
      // Fetch standings if previously requested
      if (standings || includeStandings) {
        const leagueStandings = await leagueService.getLeagueStandings(
          leagueId, 
          seasonId || leagueDetails.currentSeason
        );
        setStandings(leagueStandings);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing league data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh league data'));
      setLoading(false);
    }
  };
  
  return {
    league,
    standings,
    seasons,
    loading,
    error,
    getStandings,
    refreshLeague
  };
}

export default useLeague;