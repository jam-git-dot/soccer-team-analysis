/**
 * Match data model interfaces
 * Defines the structure of match data used across the application
 */

/**
 * Simplified Team interface for match references
 * This avoids circular dependencies between team.ts and match.ts
 */
interface Team {
    id: string;
    name: string;
    shortName?: string;
    logo: string;
    leagueId: string;
  }
  
  // Full Team interface is imported from './team' when used elsewhere
  
  /**
   * Match status types
   */
  export type MatchStatus = 
    | 'SCHEDULED' 
    | 'LIVE' 
    | 'IN_PLAY' 
    | 'PAUSED' 
    | 'FINISHED' 
    | 'POSTPONED' 
    | 'SUSPENDED' 
    | 'CANCELLED';
  
  /**
   * Basic match information
   */
  export interface Match {
    id: string;
    leagueId: string;
    seasonId: string;
    homeTeamId: string;
    awayTeamId: string;
    date: string;
    status: MatchStatus;
    matchday: number;
    stage?: string;
    group?: string;
    venue?: string;
    referee?: string;
  }
  
  /**
   * Match score information
   */
  export interface MatchScore {
    homeTeamScore: number;
    awayTeamScore: number;
    winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW';
    duration?: 'REGULAR' | 'EXTRA_TIME' | 'PENALTIES';
    halfTimeHome?: number;
    halfTimeAway?: number;
    fullTimeHome?: number;
    fullTimeAway?: number;
    extraTimeHome?: number;
    extraTimeAway?: number;
    penaltiesHome?: number;
    penaltiesAway?: number;
  }
  
  /**
   * Match with detailed information
   */
  export interface MatchDetails extends Match {
    homeTeam: Team;
    awayTeam: Team;
    score: MatchScore;
    timeElapsed?: number;
    lastUpdated: string;
  }
  
  /**
   * Match event types
   */
  export type MatchEventType = 
    | 'GOAL' 
    | 'CARD' 
    | 'SUBSTITUTION' 
    | 'VAR' 
    | 'PENALTY_MISSED' 
    | 'PENALTY_SCORED';
  
  /**
   * Match event information
   */
  export interface MatchEvent {
    id: string;
    matchId: string;
    teamId: string;
    playerId: string;
    playerName: string;
    minute: number;
    type: MatchEventType;
    detail?: string;
    assist?: {
      playerId: string;
      playerName: string;
    };
  }
  
  /**
   * Match statistics categories
   */
  export interface MatchStats {
    matchId: string;
    teamId: string;
    possession: number;
    shots: number;
    shotsOnTarget: number;
    passes: number;
    passAccuracy: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
    offsides: number;
    corners: number;
    tackles: number;
    clearances: number;
    shotsBlocked: number;
    expectedGoals: number;
    counterAttacks: number;
    bigChancesCreated: number;
    goalKicks: number;
    throwIns: number;
  }
  
  /**
   * Match with full statistics and events
   */
  export interface MatchWithStats extends MatchDetails {
    homeTeamStats: MatchStats;
    awayTeamStats: MatchStats;
    events: MatchEvent[];
  }
  
  /**
   * Type for match list response
   */
  export type MatchListResponse = Match[];
  
  /**
   * Type for match details response
   */
  export type MatchDetailsResponse = MatchDetails;
  
  /**
   * Type for match with stats response
   */
  export type MatchWithStatsResponse = MatchWithStats;