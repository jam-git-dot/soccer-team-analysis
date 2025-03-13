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
   * @param leagueId Optional league ID to filter teams
   * @returns Promise with array of teams
   */
  async getTeams(leagueId?: string): Promise<Team[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock team data');
        // Filter teams by league if leagueId is provided
        const teams = leagueId 
          ? mockTeamsData.filter(team => team.leagueId === leagueId)
          : mockTeamsData;
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
   * @returns Promise with team details
   */
  async getTeamById(teamId: string): Promise<TeamDetails> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock team details data');
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
   * @param seasonId Optional season ID
   * @returns Promise with team statistics
   */
  async getTeamStats(teamId: string, seasonId?: string): Promise<TeamStats> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock team stats data');
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
   * @param seasonId Optional season ID
   * @returns Promise with team and stats combined
   */
  async getTeamWithStats(teamId: string, seasonId?: string): Promise<TeamWithStats> {
    try {
      const team = await this.getTeamById(teamId);
      const stats = await this.getTeamStats(teamId, seasonId);
      
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
   * @param leagueId Optional league ID to filter results
   * @returns Promise with array of matching teams
   */
  async searchTeams(searchTerm: string, leagueId?: string): Promise<Team[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock team search data');
        let teams = mockTeamsData.filter(
          team => team.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Filter by league if provided
        if (leagueId) {
          teams = teams.filter(team => team.leagueId === leagueId);
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
   * @param seasonId Optional season ID
   * @returns Promise with array of rival teams
   */
  async getRivalTeams(teamId: string, seasonId?: string): Promise<Team[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock rival teams data');
        
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
   * @param leagueId League ID
   * @param seasonId Optional season ID
   * @param limit Optional limit of teams to return
   * @returns Promise with array of teams in standing order
   */
  async getTeamsByStanding(leagueId: string, seasonId?: string, limit?: number): Promise<TeamWithStats[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock teams by standing data');
        
        // Get all teams in the league
        const leagueTeams = mockTeamsData.filter(team => team.leagueId === leagueId) as Team[];
        
        // Get team stats for those teams
        const teamsWithStats = await Promise.all(
          leagueTeams.map(async (team) => {
            try {
              const stats = await this.getTeamStats(team.id, seasonId);
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