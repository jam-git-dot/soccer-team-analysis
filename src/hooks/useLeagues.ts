import { useState, useEffect } from 'react';
import leagueService from '@/services/league-service';
import type { League } from '@/types';

/**
 * Hook for fetching and managing leagues data
 * @param countryFilter Optional country to filter leagues
 */
export function useLeagues(countryFilter?: string) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when filter changes
    setLeagues([]);
    setError(null);
    setLoading(true);
    
    // Fetch leagues data
    const fetchLeaguesData = async () => {
      try {
        const leaguesData = await leagueService.getLeagues(countryFilter);
        setLeagues(leaguesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leagues data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch leagues data'));
        setLoading(false);
      }
    };
    
    fetchLeaguesData();
  }, [countryFilter]);
  
  /**
   * Search leagues by name
   * @param searchTerm Search term
   */
  const searchLeagues = async (searchTerm: string) => {
    if (!searchTerm) {
      // If search term is empty, reset to original leagues list
      setLoading(true);
      try {
        const leaguesData = await leagueService.getLeagues(countryFilter);
        setLeagues(leaguesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leagues data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch leagues data'));
        setLoading(false);
      }
      return;
    }
    
    // Search leagues
    setLoading(true);
    try {
      const searchResults = await leagueService.searchLeagues(searchTerm);
      
      // Apply country filter if specified
      const filteredResults = countryFilter
        ? searchResults.filter(league => league.country === countryFilter)
        : searchResults;
      
      setLeagues(filteredResults);
      setLoading(false);
    } catch (err) {
      console.error('Error searching leagues:', err);
      setError(err instanceof Error ? err : new Error('Failed to search leagues'));
      setLoading(false);
    }
  };
  
  /**
   * Filter leagues by type
   * @param type League type ('league', 'cup', or 'international')
   */
  const filterByType = (type: 'league' | 'cup' | 'international') => {
    if (leagues.length === 0) {
      return;
    }
    
    const filteredLeagues = leagues.filter(league => league.type === type);
    setLeagues(filteredLeagues);
  };
  
  /**
   * Manually refresh the leagues data
   */
  const refreshLeagues = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const leaguesData = await leagueService.getLeagues(countryFilter);
      setLeagues(leaguesData);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing leagues data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh leagues data'));
      setLoading(false);
    }
  };
  
  return {
    leagues,
    loading,
    error,
    searchLeagues,
    filterByType,
    refreshLeagues
  };
}

export default useLeagues;