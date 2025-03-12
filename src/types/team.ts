/**
 * Team data model interfaces
 * Defines the structure of team data used across the application
 */

/**
 * Basic team information
 */
export interface Team {
    id: string;
    name: string;
    shortName?: string;
    logo: string;
    leagueId: string;
    country: string;
    stadium?: string;
    founded?: number;
    color?: string;
  }
  
  /**
   * Extended team information with additional details
   */
  export interface TeamDetails extends Team {
    coach?: string;
    formation?: string;
    website?: string;
    description?: string;
  }
  
  /**
   * Team statistics for a specific season
   */
  export interface TeamStats {
    teamId: string;
    seasonId: string;
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    points: number;
    position?: number;
  }
  
  /**
   * Team with stats included
   */
  export interface TeamWithStats extends Team {
    stats: TeamStats;
  }
  
  /**
   * Type for team list response
   */
  export type TeamListResponse = Team[];
  
  /**
   * Type for team details response
   */
  export type TeamDetailsResponse = TeamDetails;
  
  /**
   * Type for team statistics response
   */
  export type TeamStatsResponse = TeamStats;