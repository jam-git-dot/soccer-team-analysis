import apiClient, { ENDPOINTS } from '@/config/api';
import { FEATURES } from '@/config/constants';
import type { 
  League, 
  LeagueDetails, 
  LeagueStandingsTable,
  LeagueListResponse, 
  LeagueDetailsResponse,
  LeagueStandingsResponse,
  Season
} from '@/types';

// Import mock data
import mockLeaguesData from '@/mock/leagues.json';
import mockTeamStatsData from '@/mock/team-stats.json';
import mockTeamsData from '@/mock/teams.json';

/**
 * Service for fetching league data from the API or mock data
 */
class LeagueService {
  /**
   * Get all leagues
   * @param countryFilter Optional country to filter leagues
   * @returns Promise with array of leagues
   */
  async getLeagues(countryFilter?: string): Promise<League[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock leagues data');
        // Filter leagues by country if countryFilter is provided
        const leagues = countryFilter 
          ? mockLeaguesData.filter(league => league.country === countryFilter)
          : mockLeaguesData;
        return leagues as League[];
      }

      // Use real API data
      const endpoint = ENDPOINTS.LEAGUES + (countryFilter ? `?country=${countryFilter}` : '');
      const response = await apiClient.get<LeagueListResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw error;
    }
  }

  /**
   * Get league details by ID
   * @param leagueId League ID
   * @returns Promise with league details
   */
  async getLeagueById(leagueId: string): Promise<LeagueDetails> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock league details data');
        const league = mockLeaguesData.find(l => l.id === leagueId);
        
        if (!league) {
          throw new Error(`League with ID ${leagueId} not found`);
        }
        
        return league as LeagueDetails;
      }

      // Use real API data
      const response = await apiClient.get<LeagueDetailsResponse>(ENDPOINTS.LEAGUE_BY_ID(leagueId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching league with ID ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Get league standings
   * @param leagueId League ID
   * @param seasonId Optional season ID
   * @returns Promise with league standings
   */
  async getLeagueStandings(leagueId: string, seasonId?: string): Promise<LeagueStandingsTable> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock league standings data');
        
        // If no seasonId provided, use current season from league data
        if (!seasonId) {
          const league = await this.getLeagueById(leagueId);
          seasonId = league.currentSeason;
        }
        
        // Get all teams in the league
        const leagueTeams = mockTeamsData.filter(team => team.leagueId === leagueId);
        
        // Get team stats for those teams
        const teamStats = mockTeamStatsData
          .filter(stats => stats.seasonId.startsWith(leagueId) && (!seasonId || stats.seasonId === seasonId))
          .sort((a, b) => (a.position || 999) - (b.position || 999));
        
        // Create standings
        const standings = teamStats.map(stats => {
          const team = leagueTeams.find(team => team.id === stats.teamId);
          
          return {
            position: stats.position || 0,
            teamId: stats.teamId,
            teamName: team?.name || 'Unknown Team',
            teamLogo: team?.logo || '',
            playedGames: stats.matchesPlayed,
            won: stats.wins,
            draw: stats.draws,
            lost: stats.losses,
            points: stats.points,
            goalsFor: stats.goalsFor,
            goalsAgainst: stats.goalsAgainst,
            goalDifference: stats.goalsFor - stats.goalsAgainst,
            form: stats.form || ''
          };
        });
        
        // Create standings table
        const standingsTable: LeagueStandingsTable = {
          leagueId,
          seasonId: seasonId || '',
          updatedAt: new Date().toISOString(),
          standings
        };
        
        return standingsTable;
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.LEAGUE_BY_ID(leagueId)}/standings${seasonId ? `?seasonId=${seasonId}` : ''}`;
      const response = await apiClient.get<LeagueStandingsResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching standings for league ID ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Get league seasons
   * @param leagueId League ID
   * @returns Promise with array of seasons
   */
  async getLeagueSeasons(leagueId: string): Promise<Season[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock league seasons data');
        const league = mockLeaguesData.find(l => l.id === leagueId);
        
        if (!league) {
          throw new Error(`League with ID ${leagueId} not found`);
        }
        
        return league.seasons as Season[];
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.LEAGUE_BY_ID(leagueId)}/seasons`;
      const response = await apiClient.get<Season[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching seasons for league ID ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Get current season for a league
   * @param leagueId League ID
   * @returns Promise with current season
   */
  async getCurrentSeason(leagueId: string): Promise<Season> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock current season data');
        const league = await this.getLeagueById(leagueId);
        const currentSeasonId = league.currentSeason;
        
        const seasons = await this.getLeagueSeasons(leagueId);
        const currentSeason = seasons.find(season => season.id === currentSeasonId);
        
        if (!currentSeason) {
          throw new Error(`Current season not found for league ID ${leagueId}`);
        }
        
        return currentSeason;
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.LEAGUE_BY_ID(leagueId)}/seasons/current`;
      const response = await apiClient.get<Season>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching current season for league ID ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Search leagues by name
   * @param searchTerm Search term
   * @returns Promise with array of matching leagues
   */
  async searchLeagues(searchTerm: string): Promise<League[]> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock league search data');
        const leagues = mockLeaguesData.filter(
          league => 
            league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            league.shortName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return leagues as League[];
      }

      // Use real API data
      const params = new URLSearchParams();
      params.append('search', searchTerm);
      
      const response = await apiClient.get<LeagueListResponse>(`${ENDPOINTS.LEAGUES}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching leagues:', error);
      throw error;
    }
  }
}

// Create singleton instance
const leagueService = new LeagueService();

export default leagueService;