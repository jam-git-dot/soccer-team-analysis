/**
 * League data model interfaces
 * Defines the structure of league data used across the application
 */

/**
 * Basic league information
 */
export interface League {
    id: string;
    name: string;
    shortName: string;
    country: string;
    logo: string;
    type: 'league' | 'cup' | 'international';
    season?: string;
  }
  
  /**
   * Extended league information with additional details
   */
  export interface LeagueDetails extends League {
    numberOfTeams: number;
    currentMatchday?: number;
    currentSeason: string;
    seasons: Season[];
    description?: string;
  }
  
  /**
   * Season information
   */
  export interface Season {
    id: string;
    startDate: string;
    endDate: string;
    currentMatchday?: number;
    winner?: string;
    year: string;
  }
  
  /**
   * League standing
   */
  export interface LeagueStanding {
    position: number;
    teamId: string;
    teamName: string;
    teamLogo: string;
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    form?: string; // Last 5 matches, e.g., "WWDLW"
  }
  
  /**
   * League standings table
   */
  export interface LeagueStandingsTable {
    leagueId: string;
    seasonId: string;
    updatedAt: string;
    standings: LeagueStanding[];
  }
  
  /**
   * Type for league list response
   */
  export type LeagueListResponse = League[];
  
  /**
   * Type for league details response
   */
  export type LeagueDetailsResponse = LeagueDetails;
  
  /**
   * Type for league standings response
   */
  export type LeagueStandingsResponse = LeagueStandingsTable;