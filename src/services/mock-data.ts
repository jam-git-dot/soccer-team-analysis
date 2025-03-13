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

// Team play style templates to generate realistic data
const TEAM_PLAY_STYLE_TEMPLATES = {
  'possession-based': {
    possession_percentage: { base: 65, variance: 10 },
    pass_completion: { base: 88, variance: 5 },
    progressive_passes: { base: 70, variance: 15 },
    build_up_time: { base: 15, variance: 5 },
    ppda: { base: 8, variance: 3 },
    direct_play_vs_possession: { base: 25, variance: 15 },
    transition_speed: { base: 12, variance: 5 },
  },
  'high-pressing': {
    pressing_intensity: { base: 85, variance: 10 },
    ppda: { base: 6, variance: 2 },
    recovery_time: { base: 6, variance: 3 },
    defensive_line_height: { base: 48, variance: 8 },
    transition_speed: { base: 18, variance: 4 },
  },
  'counter-attacking': {
    counter_attack_frequency: { base: 35, variance: 10 },
    transition_speed: { base: 22, variance: 5 },
    direct_play_vs_possession: { base: 75, variance: 15 },
    possession_percentage: { base: 40, variance: 10 },
  },
  'direct-play': {
    direct_play_vs_possession: { base: 80, variance: 10 },
    build_up_time: { base: 8, variance: 3 },
    progressive_passes: { base: 45, variance: 10 },
    pass_completion: { base: 70, variance: 8 },
  },
  'defensive-solid': {
    defensive_duels_won: { base: 65, variance: 10 },
    defensive_line_height: { base: 32, variance: 6 },
    pressing_intensity: { base: 40, variance: 15 },
    recovery_time: { base: 12, variance: 4 },
  },
  'set-piece-specialists': {
    set_piece_dependency: { base: 40, variance: 10 },
    defensive_duels_won: { base: 60, variance: 10 },
  },
};

// Assign play style templates to teams
const TEAM_STYLES: Record<TeamId, (keyof typeof TEAM_PLAY_STYLE_TEMPLATES)[]> = {
  'man-city': ['possession-based', 'high-pressing'],
  'arsenal': ['possession-based', 'high-pressing'],
  'liverpool': ['high-pressing', 'counter-attacking'],
  'man-utd': ['counter-attacking', 'direct-play'],
  'tottenham': ['possession-based', 'counter-attacking'],
  'chelsea': ['possession-based', 'set-piece-specialists'],
  'newcastle': ['high-pressing', 'defensive-solid'],
  'brighton': ['possession-based', 'high-pressing'],
  'aston-villa': ['counter-attacking', 'high-pressing'],
  'west-ham': ['defensive-solid', 'set-piece-specialists'],
  'crystal-palace': ['counter-attacking', 'defensive-solid'],
  'brentford': ['direct-play', 'set-piece-specialists'],
  'fulham': ['counter-attacking', 'direct-play'],
  'bournemouth': ['defensive-solid', 'counter-attacking'],
  'wolves': ['possession-based', 'defensive-solid'],
  'nottm-forest': ['defensive-solid', 'direct-play'],
  'everton': ['defensive-solid', 'direct-play'],
  'burnley': ['direct-play', 'defensive-solid'],
  'luton': ['defensive-solid', 'set-piece-specialists'],
  'sheffield': ['defensive-solid', 'direct-play'],
};

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
 * Generate base metrics for a team based on its play style templates
 */
function generateBaseMetrics(teamId: TeamId): Record<MetricId, number> {
  const styles = TEAM_STYLES[teamId] || ['defensive-solid'];
  const baseMetrics: Record<string, number> = {};
  
  // Start with random values for all metrics
  Object.keys(METRICS).forEach(metricId => {
    const metric = METRICS[metricId];
    const range = metric.range;
    baseMetrics[metricId] = randomBetween(range.min, range.max);
  });
  
  // Apply team style templates
  styles.forEach(style => {
    const template = TEAM_PLAY_STYLE_TEMPLATES[style];
    if (!template) return;
    
    Object.entries(template).forEach(([metricId, config]) => {
      if (baseMetrics[metricId] !== undefined) {
        // Apply template with some randomness
        const randomFactor = randomBetween(-config.variance, config.variance);
        baseMetrics[metricId] = clamp(
          config.base + randomFactor,
          METRICS[metricId].range.min,
          METRICS[metricId].range.max
        );
      }
    });
  });
  
  return baseMetrics as Record<MetricId, number>;
}

/**
 * Generate metrics for different match results
 * Values are based on the base metrics but with variations
 */
function generateMetricsByResult(
  baseMetrics: Record<MetricId, number>
): { 
  win: Record<MetricId, number>;
  draw: Record<MetricId, number>;
  loss: Record<MetricId, number>;
} {
  const win: Record<MetricId, number> = {};
  const draw: Record<MetricId, number> = {};
  const loss: Record<MetricId, number> = {};
  
  Object.entries(baseMetrics).forEach(([metricId, value]) => {
    const metric = METRICS[metricId as MetricId];
    const range = metric.range;
    const span = range.max - range.min;
    
    // Team performs better in wins
    win[metricId as MetricId] = clamp(
      value * (metric.higherIsBetter !== false ? 1.15 : 0.85),
      range.min,
      range.max
    );
    
    // Team performs worse in losses
    loss[metricId as MetricId] = clamp(
      value * (metric.higherIsBetter !== false ? 0.85 : 1.15),
      range.min,
      range.max
    );
    
    // Team performance in draws is closer to the base
    draw[metricId as MetricId] = clamp(
      value * (metric.higherIsBetter !== false ? 1.02 : 0.98),
      range.min,
      range.max
    );
  });
  
  return { win, draw, loss };
}

/**
 * Calculate percentiles for all teams for a given metric
 */
function calculatePercentiles(
  allTeamsMetrics: Record<TeamId, Record<MetricId, number>>,
  metricId: MetricId
): Record<TeamId, number> {
  const metric = METRICS[metricId];
  if (!metric) return {};
  
  const values = Object.entries(allTeamsMetrics).map(([teamId, metrics]) => ({
    teamId,
    value: metrics[metricId]
  }));
  
  // Sort values based on whether higher is better
  values.sort((a, b) => {
    if (metric.higherIsBetter === false) {
      return a.value - b.value; // Lower is better, so sort ascending
    }
    return b.value - a.value; // Higher is better, so sort descending
  });
  
  // Calculate percentiles
  const percentiles: Record<TeamId, number> = {};
  values.forEach((item, index) => {
    percentiles[item.teamId] = Math.round(((values.length - index - 1) / (values.length - 1)) * 100);
  });
  
  return percentiles;
}

/**
 * Generate mock data for all Premier League teams
 */
export function generateMockTeamData(): Record<TeamId, TeamMetricsByResult> {
  // Generate base metrics for all teams
  const baseTeamMetrics: Record<TeamId, Record<MetricId, number>> = {};
  PREMIER_LEAGUE_TEAMS.forEach(team => {
    baseTeamMetrics[team.id] = generateBaseMetrics(team.id);
  });
  
  // Calculate percentiles for base metrics
  const basePercentiles: Record<MetricId, Record<TeamId, number>> = {};
  Object.keys(METRICS).forEach(metricId => {
    basePercentiles[metricId as MetricId] = calculatePercentiles(baseTeamMetrics, metricId as MetricId);
  });
  
  // Generate metrics by result for all teams
  const teamData: Record<TeamId, TeamMetricsByResult> = {};
  
  PREMIER_LEAGUE_TEAMS.forEach(team => {
    const baseMetrics = baseTeamMetrics[team.id];
    const metricsByResult = generateMetricsByResult(baseMetrics);
    
    // Create TeamMetricsData objects
    const createTeamMetricsData = (
      metrics: Record<MetricId, number>
    ): TeamMetricsData => {
      const data: TeamMetricsData = {
        teamId: team.id,
        metrics: {}
      };
      
      Object.entries(metrics).forEach(([metricId, value]) => {
        data.metrics[metricId as MetricId] = {
          value,
          percentile: basePercentiles[metricId as MetricId][team.id]
        };
      });
      
      return data;
    };
    
    teamData[team.id] = {
      all: createTeamMetricsData(baseMetrics),
      win: createTeamMetricsData(metricsByResult.win),
      draw: createTeamMetricsData(metricsByResult.draw),
      loss: createTeamMetricsData(metricsByResult.loss)
    };
  });
  
  return teamData;
}

// Cached mock data
let mockTeamData: Record<TeamId, TeamMetricsByResult> | null = null;

/**
 * Get mock data for all teams
 */
export function getMockTeamData(): Record<TeamId, TeamMetricsByResult> {
  if (!mockTeamData) {
    mockTeamData = generateMockTeamData();
  }
  return mockTeamData;
}

/**
 * Get mock data for a specific team
 */
export function getTeamData(teamId: TeamId): TeamMetricsByResult | null {
  const allTeamData = getMockTeamData();
  return allTeamData[teamId] || null;
}

/**
 * Get team info by ID
 */
export function getTeamInfo(teamId: TeamId): TeamBasicInfo | null {
  return PREMIER_LEAGUE_TEAMS.find(team => team.id === teamId) || null;
}

/**
 * Get all teams
 */
export function getAllTeams(): TeamBasicInfo[] {
  return PREMIER_LEAGUE_TEAMS;
}