/**
 * Mock data service
 * Provides realistic mock data for development and testing
 */

import { METRICS, MetricId } from '../config/metrics';

// Team data types
export type TeamId = string;

export type TeamBasicInfo = {
  id: TeamId;
  name: string;
  shortName: string;
  logoUrl: string;
  leagueId?: string; // Optional league ID
};

export type MatchResult = 'win' | 'draw' | 'loss' | 'all';

export type TeamMetricValue = {
  value: number;
  percentile?: number; // Percentile rank compared to other teams (0-100)
};

export type TeamMetricsData = {
  teamId: TeamId;
  metrics: Record<MetricId, TeamMetricValue>;
};

export type TeamMetricsByResult = {
  all: TeamMetricsData;
  win: TeamMetricsData;
  draw: TeamMetricsData;
  loss: TeamMetricsData;
};

// Premier League teams for 2023-2024 season
export const PREMIER_LEAGUE_TEAMS: TeamBasicInfo[] = [
  { id: 'arsenal', name: 'Arsenal', shortName: 'ARS', logoUrl: 'https://placehold.co/80x80?text=ARS' },
  { id: 'aston-villa', name: 'Aston Villa', shortName: 'AVL', logoUrl: 'https://placehold.co/80x80?text=AVL' },
  { id: 'bournemouth', name: 'Bournemouth', shortName: 'BOU', logoUrl: 'https://placehold.co/80x80?text=BOU' },
  { id: 'brentford', name: 'Brentford', shortName: 'BRE', logoUrl: 'https://placehold.co/80x80?text=BRE' },
  { id: 'brighton', name: 'Brighton & Hove Albion', shortName: 'BHA', logoUrl: 'https://placehold.co/80x80?text=BHA' },
  { id: 'burnley', name: 'Burnley', shortName: 'BUR', logoUrl: 'https://placehold.co/80x80?text=BUR' },
  { id: 'chelsea', name: 'Chelsea', shortName: 'CHE', logoUrl: 'https://placehold.co/80x80?text=CHE' },
  { id: 'crystal-palace', name: 'Crystal Palace', shortName: 'CRY', logoUrl: 'https://placehold.co/80x80?text=CRY' },
  { id: 'everton', name: 'Everton', shortName: 'EVE', logoUrl: 'https://placehold.co/80x80?text=EVE' },
  { id: 'fulham', name: 'Fulham', shortName: 'FUL', logoUrl: 'https://placehold.co/80x80?text=FUL' },
  { id: 'liverpool', name: 'Liverpool', shortName: 'LIV', logoUrl: 'https://placehold.co/80x80?text=LIV' },
  { id: 'man-city', name: 'Manchester City', shortName: 'MCI', logoUrl: 'https://placehold.co/80x80?text=MCI' },
  { id: 'man-utd', name: 'Manchester United', shortName: 'MUN', logoUrl: 'https://placehold.co/80x80?text=MUN' },
  { id: 'newcastle', name: 'Newcastle United', shortName: 'NEW', logoUrl: 'https://placehold.co/80x80?text=NEW' },
  { id: 'nottm-forest', name: 'Nottingham Forest', shortName: 'NFO', logoUrl: 'https://placehold.co/80x80?text=NFO' },
  { id: 'sheffield', name: 'Sheffield United', shortName: 'SHU', logoUrl: 'https://placehold.co/80x80?text=SHU' },
  { id: 'tottenham', name: 'Tottenham Hotspur', shortName: 'TOT', logoUrl: 'https://placehold.co/80x80?text=TOT' },
  { id: 'west-ham', name: 'West Ham United', shortName: 'WHU', logoUrl: 'https://placehold.co/80x80?text=WHU' },
  { id: 'wolves', name: 'Wolverhampton', shortName: 'WOL', logoUrl: 'https://placehold.co/80x80?text=WOL' },
  { id: 'luton', name: 'Luton Town', shortName: 'LUT', logoUrl: 'https://placehold.co/80x80?text=LUT' },
];

// Developer League teams (based on team-metrics.json)
export const DEVELOPER_LEAGUE_TEAMS: TeamBasicInfo[] = [
  { id: 'Arsenaki', name: 'Arsenaki FC', shortName: 'ARS', logoUrl: 'https://placehold.co/80x80?text=ARS', leagueId: 'developer-league' },
  { id: 'Astons Village', name: 'Astons Village', shortName: 'AST', logoUrl: 'https://placehold.co/80x80?text=AST', leagueId: 'developer-league' },
  { id: 'Bournemilk', name: 'Bournemilk United', shortName: 'BOU', logoUrl: 'https://placehold.co/80x80?text=BOU', leagueId: 'developer-league' },
  { id: 'Brents Bees', name: 'Brents Bees', shortName: 'BEE', logoUrl: 'https://placehold.co/80x80?text=BEE', leagueId: 'developer-league' },
  { id: 'Bright Ton', name: 'Bright Ton Rovers', shortName: 'BRI', logoUrl: 'https://placehold.co/80x80?text=BRI', leagueId: 'developer-league' },
  { id: 'Chelzea', name: 'Chelzea Blues', shortName: 'CHE', logoUrl: 'https://placehold.co/80x80?text=CHE', leagueId: 'developer-league' },
  { id: 'Crystal House', name: 'Crystal House', shortName: 'CRY', logoUrl: 'https://placehold.co/80x80?text=CRY', leagueId: 'developer-league' },
  { id: 'EverteenyTiny', name: 'EverteenyTiny', shortName: 'EVE', logoUrl: 'https://placehold.co/80x80?text=EVE', leagueId: 'developer-league' },
  { id: 'Fullestham', name: 'Fullestham FC', shortName: 'FUL', logoUrl: 'https://placehold.co/80x80?text=FUL', leagueId: 'developer-league' },
  { id: 'Ipswizzle Town', name: 'Ipswizzle Town', shortName: 'IPS', logoUrl: 'https://placehold.co/80x80?text=IPS', leagueId: 'developer-league' },
  { id: 'Leicester, Barely Know Her', name: 'Leicester, Barely Know Her', shortName: 'LEI', logoUrl: 'https://placehold.co/80x80?text=LEI', leagueId: 'developer-league' },
  { id: 'Liverpump', name: 'Liverpump FC', shortName: 'LIV', logoUrl: 'https://placehold.co/80x80?text=LIV', leagueId: 'developer-league' },
  { id: 'Manc Blues', name: 'Manc Blues', shortName: 'MNC', logoUrl: 'https://placehold.co/80x80?text=MNC', leagueId: 'developer-league' },
  { id: 'Manchester RedShite', name: 'Manchester RedShite', shortName: 'MNU', logoUrl: 'https://placehold.co/80x80?text=MNU', leagueId: 'developer-league' },
  { id: 'New Beheddies', name: 'New Beheddies', shortName: 'NEW', logoUrl: 'https://placehold.co/80x80?text=NEW', leagueId: 'developer-league' },
  { id: 'NotTingHamForRest', name: 'NotTingHamForRest', shortName: 'NOT', logoUrl: 'https://placehold.co/80x80?text=NOT', leagueId: 'developer-league' },
  { id: 'SouthEastHampton', name: 'SouthEastHampton', shortName: 'SOU', logoUrl: 'https://placehold.co/80x80?text=SOU', leagueId: 'developer-league' },
  { id: 'Tottingham', name: 'Tottingham Hotties', shortName: 'TOT', logoUrl: 'https://placehold.co/80x80?text=TOT', leagueId: 'developer-league' },
  { id: 'Wests Clarets', name: 'Wests Clarets', shortName: 'WES', logoUrl: 'https://placehold.co/80x80?text=WES', leagueId: 'developer-league' },
  { id: 'Wolfpack', name: 'Wolfpack Wanderers', shortName: 'WOL', logoUrl: 'https://placehold.co/80x80?text=WOL', leagueId: 'developer-league' },
];

// Mock data generation functions
/**
 * Generate a random number between min and max
 */
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get teams based on league ID
 */
export function getTeamsByLeague(leagueId: string = 'developer-league'): TeamBasicInfo[] {
  switch (leagueId) {
    case 'developer-league':
      return DEVELOPER_LEAGUE_TEAMS;
    case 'premier-league':
      return PREMIER_LEAGUE_TEAMS;
    default:
      console.warn(`No teams data available for league: ${leagueId}`);
      return [];
  }
}

/**
 * Get mock data for a specific team
 */
export function getTeamData(teamId: TeamId): TeamMetricsByResult | null {
  // In a real implementation, this would fetch team metrics data
  // For now, return null since we're using team-metrics.json directly
  console.log(`Placeholder for getting team data: ${teamId}`);
  return null;
}

/**
 * Get team info by ID
 */
export function getTeamInfo(teamId: TeamId): TeamBasicInfo | null {
  // First check Developer League
  const devLeagueTeam = DEVELOPER_LEAGUE_TEAMS.find(team => team.id === teamId);
  if (devLeagueTeam) return devLeagueTeam;
  
  // Then check Premier League
  const premLeagueTeam = PREMIER_LEAGUE_TEAMS.find(team => team.id === teamId);
  if (premLeagueTeam) return premLeagueTeam;
  
  // Not found
  return null;
}

/**
 * Get all teams
 */
export function getAllTeams(): TeamBasicInfo[] {
  // Currently only returning Developer League teams since that's where our real data is
  return DEVELOPER_LEAGUE_TEAMS;
}