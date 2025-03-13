import apiClient, { ENDPOINTS } from '@/config/api';
import { FEATURES } from '@/config/constants';
import type { 
  Match, 
  MatchDetails, 
  MatchWithStats,
  MatchListResponse, 
  MatchDetailsResponse,
  MatchWithStatsResponse,
  MatchStatus
} from '@/types';

// Import mock data
import mockMatchesData from '@/mock/matches.json';
import mockMatchMetricsData from '@/mock/match-metrics.json';

/**
 * Service for fetching match data from the API or mock data
 */
class MatchService {
  /**
   * Get all matches
   * @param params Filter parameters (leagueId, teamId, status, dateFrom, dateTo, season)
   * @returns Promise with array of matches
   */
  async getMatches(params?: {
    leagueId?: string;
    teamId?: string;
    status?: MatchStatus;
    dateFrom?: string;
    dateTo?: string;
    season?: string;
  }): Promise<Match[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock matches data');
        let matches = mockMatchesData as Match[];
        
        // Apply filters
        if (params) {
          if (params.leagueId) {
            matches = matches.filter(match => match.leagueId === params.leagueId);
          }
          
          if (params.teamId) {
            matches = matches.filter(match => 
              match.homeTeamId === params.teamId || match.awayTeamId === params.teamId
            );
          }
          
          if (params.status) {
            matches = matches.filter(match => match.status === params.status);
          }
          
          if (params.season) {
            matches = matches.filter(match => match.seasonId === params.season);
          }
          
          if (params.dateFrom) {
            const fromDate = new Date(params.dateFrom);
            matches = matches.filter(match => new Date(match.date) >= fromDate);
          }
          
          if (params.dateTo) {
            const toDate = new Date(params.dateTo);
            matches = matches.filter(match => new Date(match.date) <= toDate);
          }
        }
        
        return matches;
      }

      // Use real API data
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      
      const endpoint = `${ENDPOINTS.MATCHES}?${queryParams.toString()}`;
      const response = await apiClient.get<MatchListResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  /**
   * Get matches by team ID
   * @param teamId Team ID
   * @param params Additional filter parameters
   * @returns Promise with array of matches
   */
  async getMatchesByTeam(teamId: string, params?: {
    status?: MatchStatus;
    dateFrom?: string;
    dateTo?: string;
    season?: string;
  }): Promise<Match[]> {
    try {
      return this.getMatches({
        teamId,
        ...params
      });
    } catch (error) {
      console.error(`Error fetching matches for team ID ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Get match details by ID
   * @param matchId Match ID
   * @returns Promise with match details
   */
  async getMatchById(matchId: string): Promise<MatchDetails> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock match details data');
        const match = mockMatchesData.find(m => m.id === matchId);
        
        if (!match) {
          throw new Error(`Match with ID ${matchId} not found`);
        }
        
        return match as unknown as MatchDetails;
      }

      // Use real API data
      const response = await apiClient.get<MatchDetailsResponse>(ENDPOINTS.MATCH_BY_ID(matchId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching match with ID ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Get match with full statistics
   * @param matchId Match ID
   * @returns Promise with match and full statistics
   */
  async getMatchWithStats(matchId: string): Promise<MatchWithStats> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock match with stats data');
        const match = await this.getMatchById(matchId);
        
        // In our mock implementation, the stats are already included in match data
        return match as unknown as MatchWithStats;
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.MATCH_BY_ID(matchId)}/stats`;
      const response = await apiClient.get<MatchWithStatsResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match with stats for ID ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Get head-to-head matches between two teams
   * @param teamId1 First team ID
   * @param teamId2 Second team ID
   * @param limit Optional limit of matches to return
   * @param seasonId Optional season ID filter
   * @returns Promise with array of head-to-head matches
   */
  async getHeadToHeadMatches(
    teamId1: string, 
    teamId2: string, 
    limit?: number,
    seasonId?: string
  ): Promise<Match[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock head-to-head matches data');
        let matches = mockMatchesData.filter(match => 
          (match.homeTeamId === teamId1 && match.awayTeamId === teamId2) ||
          (match.homeTeamId === teamId2 && match.awayTeamId === teamId1)
        );
        
        // Apply season filter if provided
        if (seasonId) {
          matches = matches.filter(match => match.seasonId === seasonId);
        }
        
        // Sort by date (most recent first)
        matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Apply limit if provided
        if (limit) {
          matches = matches.slice(0, limit);
        }
        
        return matches as Match[];
      }

      // Use real API data
      const params = new URLSearchParams();
      params.append('team1', teamId1);
      params.append('team2', teamId2);
      if (limit) params.append('limit', limit.toString());
      if (seasonId) params.append('seasonId', seasonId);
      
      const endpoint = `${ENDPOINTS.MATCHES}/head-to-head?${params.toString()}`;
      const response = await apiClient.get<MatchListResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching head-to-head matches for teams ${teamId1} and ${teamId2}:`, error);
      throw error;
    }
  }

  /**
   * Get upcoming matches for a team
   * @param teamId Team ID
   * @param limit Optional limit of matches to return
   * @returns Promise with array of upcoming matches
   */
  async getUpcomingMatches(teamId: string, limit?: number): Promise<Match[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock upcoming matches data');
        // For mock data, we'll pretend some matches are upcoming
        // In reality, we'd filter by date greater than now
        const currentDate = new Date();
        
        let matches = mockMatchesData
          .filter(match => 
            (match.homeTeamId === teamId || match.awayTeamId === teamId) &&
            new Date(match.date) > currentDate
          )
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // If we don't have any upcoming matches in our mock data, 
        // let's pretend some of the existing matches are in the future
        if (matches.length === 0) {
          matches = mockMatchesData
            .filter(match => match.homeTeamId === teamId || match.awayTeamId === teamId)
            .slice(0, limit || 3)
            .map(match => ({
              ...match,
              date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'SCHEDULED' as MatchStatus
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        
        // Apply limit if provided
        if (limit) {
          matches = matches.slice(0, limit);
        }
        
        return matches as Match[];
      }

      // Use real API data
      const params = new URLSearchParams();
      params.append('teamId', teamId);
      params.append('status', 'SCHEDULED');
      if (limit) params.append('limit', limit.toString());
      
      const endpoint = `${ENDPOINTS.MATCHES}?${params.toString()}`;
      const response = await apiClient.get<MatchListResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching upcoming matches for team ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Get match metrics for a specific team in a match
   * @param matchId Match ID
   * @param teamId Team ID
   * @returns Promise with match metrics
   */
  async getMatchMetrics(matchId: string, teamId: string) {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock match metrics data');
        const matchMetrics = mockMatchMetricsData.find(
          metrics => metrics.matchId === matchId && metrics.teamId === teamId
        );
        
        if (!matchMetrics) {
          throw new Error(`Metrics for match ID ${matchId} and team ID ${teamId} not found`);
        }
        
        return matchMetrics;
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.MATCH_BY_ID(matchId)}/teams/${teamId}/metrics`;
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metrics for match ID ${matchId} and team ID ${teamId}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const matchService = new MatchService();

export default matchService;