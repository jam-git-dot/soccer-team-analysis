import apiClient, { ENDPOINTS } from '@/config/api';
import { FEATURES } from '@/config/constants';
import type { 
  Team, 
  TeamDetails, 
  TeamStats,
  TeamListResponse, 
  TeamDetailsResponse, 
  TeamStatsResponse,
  TeamWithStats
} from '@/types';

// Import mock data
import mockTeamsData from '@/mock/teams.json';
import mockTeamStatsData from '@/mock/team-stats.json';
import mockMatchesData from '@/mock/matches.json';

/**
 * Service for fetching team data from the API or mock data
 */
class TeamService {
  /**
   * Get all teams
   * @param leagueId Optional league ID to filter teams (defaults to developer-league)
   * @returns Promise with array of teams
   */
  async getTeams(leagueId: string = 'developer-league'): Promise<Team[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log(`Using mock team data for league: ${leagueId}`);
        
        // Only provide data for the Developer League
        if (leagueId !== 'developer-league') {
          console.warn(`Data for league ${leagueId} is not available yet`);
          return [];
        }
        
        // Filter teams by league if leagueId is provided
        const teams = mockTeamsData.filter(team => 
          // In mock data, we might not have leagueId, so treat all teams as part of Developer League
          !leagueId || team.leagueId === leagueId || !team.leagueId
        );
        
        return teams as Team[];
      }

      // Use real API data
      const endpoint = leagueId 
        ? ENDPOINTS.TEAMS_BY_LEAGUE(leagueId) 
        : ENDPOINTS.TEAMS;
      
      const response = await apiClient.get<TeamListResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  /**
   * Get team details by ID
   * @param teamId Team ID
   * @param leagueId Optional league ID (defaults to developer-league)
   * @returns Promise with team details
   */
  async getTeamById(teamId: string, leagueId: string = 'developer-league'): Promise<TeamDetails> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log(`Using mock team details data for team: ${teamId}, league: ${leagueId}`);
        
        // Only provide data for the Developer League
        if (leagueId !== 'developer-league') {
          throw new Error(`Data for league ${leagueId} is not available yet`);
        }
        
        const team = mockTeamsData.find(t => t.id === teamId);
        
        if (!team) {
          throw new Error(`Team with ID ${teamId} not found`);
        }
        
        return team as TeamDetails;
      }

      // Use real API data
      const response = await apiClient.get<TeamDetailsResponse>(ENDPOINTS.TEAM_BY_ID(teamId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching team with ID ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Get team statistics
   * @param teamId Team ID
   * @param leagueId Optional league ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @returns Promise with team statistics
   */
  async getTeamStats(teamId: string, leagueId: string = 'developer-league', seasonId?: string): Promise<TeamStats> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log(`Using mock team stats data for team: ${teamId}, league: ${leagueId}`);
        
        // Only provide data for the Developer League
        if (leagueId !== 'developer-league') {
          throw new Error(`Data for league ${leagueId} is not available yet`);
        }
        
        const teamStats = mockTeamStatsData.find(
          stats => stats.teamId === teamId && (!seasonId || stats.seasonId === seasonId)
        );
        
        if (!teamStats) {
          throw new Error(`Stats for team ID ${teamId} not found`);
        }
        
        return teamStats as TeamStats;
      }

      // Use real API data - endpoint would include season params if needed
      const endpoint = `${ENDPOINTS.TEAM_BY_ID(teamId)}/stats${seasonId ? `?seasonId=${seasonId}` : ''}`;
      const response = await apiClient.get<TeamStatsResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for team ID ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Get team with stats combined
   * @param teamId Team ID
   * @param leagueId Optional league ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @returns Promise with team and stats combined
   */
  async getTeamWithStats(teamId: string, leagueId: string = 'developer-league', seasonId?: string): Promise<TeamWithStats> {
    try {
      // Only provide data for the Developer League
      if (leagueId !== 'developer-league') {
        throw new Error(`Data for league ${leagueId} is not available yet`);
      }
      
      const team = await this.getTeamById(teamId, leagueId);
      const stats = await this.getTeamStats(teamId, leagueId, seasonId);
      
      return {
        ...team,
        stats
      };
    } catch (error) {
      console.error(`Error fetching team with stats for ID ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Search teams by name
   * @param searchTerm Search term
   * @param leagueId Optional league ID to filter results (defaults to developer-league)
   * @returns Promise with array of matching teams
   */
  async searchTeams(searchTerm: string, leagueId: string = 'developer-league'): Promise<Team[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log(`Using mock team search data for term: ${searchTerm}, league: ${leagueId}`);
        
        // Only provide data for the Developer League
        if (leagueId !== 'developer-league') {
          return [];
        }
        
        let teams = mockTeamsData.filter(
          team => team.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Filter by league if provided
        if (leagueId) {
          teams = teams.filter(team => 
            team.leagueId === leagueId || !team.leagueId // If no leagueId, assume it's in the Developer League
          );
        }
        
        return teams as Team[];
      }

      // Use real API data
      const params = new URLSearchParams();
      params.append('search', searchTerm);
      if (leagueId) {
        params.append('leagueId', leagueId);
      }
      
      const response = await apiClient.get<TeamListResponse>(`${ENDPOINTS.TEAMS}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching teams:', error);
      throw error;
    }
  }

  /**
   * Get rival teams that have played against the specified team
   * @param teamId Team ID
   * @param leagueId Optional league ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @returns Promise with array of rival teams
   */
  async getRivalTeams(teamId: string, leagueId: string = 'developer-league', seasonId?: string): Promise<Team[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log(`Using mock rival teams data for team: ${teamId}, league: ${leagueId}`);
        
        // Only provide data for the Developer League
        if (leagueId !== 'developer-league') {
          return [];
        }
        
        // Filter matches involving the team
        const teamMatches = mockMatchesData.filter(
          match => 
            (match.homeTeamId === teamId || match.awayTeamId === teamId) && 
            (!seasonId || match.seasonId === seasonId)
        );
        
        // Extract the rival team IDs from matches
        const rivalTeamIds = teamMatches.map(match => 
          match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId
        );
        
        // Remove duplicates
        const uniqueRivalTeamIds = [...new Set(rivalTeamIds)];
        
        // Get team details for each rival
        const rivalTeams = mockTeamsData.filter(team => 
          uniqueRivalTeamIds.includes(team.id)
        );
        
        return rivalTeams as Team[];
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.TEAM_BY_ID(teamId)}/rivals${seasonId ? `?seasonId=${seasonId}` : ''}`;
      const response = await apiClient.get<TeamListResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rival teams for team ID ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Get teams by league standing
   * @param leagueId League ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @param limit Optional limit of teams to return
   * @returns Promise with array of teams in standing order
   */
  async getTeamsByStanding(leagueId: string = 'developer-league', seasonId?: string, limit?: number): Promise<TeamWithStats[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log(`Using mock teams by standing data for league: ${leagueId}`);
        
        // Only provide data for the Developer League
        if (leagueId !== 'developer-league') {
          return [];
        }
        
        // Get all teams in the league
        const leagueTeams = mockTeamsData.filter(team => 
          team.leagueId === leagueId || !team.leagueId // If no leagueId, assume it's in the Developer League
        ) as Team[];
        
        // Get team stats for those teams
        const teamsWithStats = await Promise.all(
          leagueTeams.map(async (team) => {
            try {
              const stats = await this.getTeamStats(team.id, leagueId, seasonId);
              return { ...team, stats } as TeamWithStats;
            } catch (error) {
              console.error(`Error fetching stats for team ${team.id}:`, error);
              // Return team without stats in case of error
              return { ...team, stats: null } as any;
            }
          })
        );
        
        // Sort by position
        const sortedTeams = teamsWithStats
          .filter(team => team.stats)
          .sort((a, b) => (a.stats.position || 999) - (b.stats.position || 999));
        
        // Apply limit if provided
        return limit ? sortedTeams.slice(0, limit) : sortedTeams;
      }

      // Use real API data
      const params = new URLSearchParams();
      if (seasonId) params.append('seasonId', seasonId);
      if (limit) params.append('limit', limit.toString());
      
      const endpoint = `${ENDPOINTS.TEAMS_BY_LEAGUE(leagueId)}/standings?${params.toString()}`;
      const response = await apiClient.get<TeamWithStats[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching teams by standing for league ID ${leagueId}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const teamService = new TeamService();

export default teamService;