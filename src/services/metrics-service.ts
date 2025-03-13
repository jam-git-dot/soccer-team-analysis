import apiClient, { ENDPOINTS } from '@/config/api';
import { FEATURES } from '@/config/constants';
import type { 
  TeamMetrics,
  MatchMetrics,
  ComparativeMetrics,
  TeamMetricsResponse,
  MatchMetricsResponse,
  ComparativeMetricsResponse,
  PlayStyle
} from '@/types';

// Import mock data
import mockTeamMetricsData from '@/mock/team-metrics.json';
import mockMatchMetricsData from '@/mock/match-metrics.json';
import matchService from '../mock/match-service';

/**
 * Service for fetching and processing team metrics data
 */
class MetricsService {
  /**
   * Get team metrics data
   * @param teamId Team ID
   * @param seasonId Optional season ID
   * @returns Promise with team metrics
   */
  async getTeamMetrics(teamId: string, seasonId?: string): Promise<TeamMetrics> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock team metrics data');
        const teamMetrics = mockTeamMetricsData.find(
          metrics => metrics.teamId === teamId && (!seasonId || metrics.seasonId === seasonId)
        );
        
        if (!teamMetrics) {
          throw new Error(`Metrics for team ID ${teamId} not found`);
        }
        
        return teamMetrics as TeamMetrics;
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.TEAM_METRICS(teamId)}${seasonId ? `?seasonId=${seasonId}` : ''}`;
      const response = await apiClient.get<TeamMetricsResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metrics for team ID ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Get team metrics for a specific match
   * @param teamId Team ID
   * @param matchId Match ID
   * @returns Promise with match metrics
   */
  async getMatchMetrics(teamId: string, matchId: string): Promise<MatchMetrics> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock match metrics data');
        const matchMetrics = mockMatchMetricsData.find(
          metrics => metrics.teamId === teamId && metrics.matchId === matchId
        );
        
        if (!matchMetrics) {
          throw new Error(`Metrics for team ID ${teamId} and match ID ${matchId} not found`);
        }
        
        return matchMetrics as MatchMetrics;
      }

      // Use real API data
      const endpoint = ENDPOINTS.TEAM_METRICS_BY_MATCH(teamId, matchId);
      const response = await apiClient.get<MatchMetricsResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metrics for team ID ${teamId} and match ID ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Get comparative metrics data for a team in a league context
   * @param teamId Team ID
   * @param leagueId League ID
   * @param seasonId Optional season ID
   * @returns Promise with comparative metrics
   */
  async getComparativeMetrics(
    teamId: string, 
    leagueId: string, 
    seasonId?: string
  ): Promise<ComparativeMetrics> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock comparative metrics data');
        
        // Get team's metrics
        const teamMetrics = await this.getTeamMetrics(teamId, seasonId);
        
        // Get all teams in the league with metrics
        const allTeamMetrics = mockTeamMetricsData.filter(
          metrics => metrics.seasonId?.startsWith(leagueId) && (!seasonId || metrics.seasonId === seasonId)
        ) as TeamMetrics[];
        
        // Calculate comparative metrics
        const comparativeMetrics: ComparativeMetrics = {
          teamId,
          leagueId,
          seasonId: seasonId || teamMetrics.seasonId,
          metrics: {}
        };
        
        // Helper function to add a metric to the comparative metrics object
        const addMetric = (key: string, value: number) => {
          // Get all values for this metric across teams
          const allValues = allTeamMetrics.map(m => {
            // Navigate the object path to get the value
            const parts = key.split('.');
            let val: any = m;
            for (const part of parts) {
              val = val[part];
            }
            return val as number;
          });
          
          // Calculate league averages and percentiles
          const leagueAverage = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
          const leagueMax = Math.max(...allValues);
          const leagueMin = Math.min(...allValues);
          
          // Calculate percentile (what percentage of teams does this team outperform)
          const belowTeamCount = allValues.filter(val => val < value).length;
          const percentile = (belowTeamCount / allValues.length) * 100;
          
          // Add to metrics object
          comparativeMetrics.metrics[key] = {
            value,
            percentile,
            leagueAverage,
            leagueMax,
            leagueMin
          };
        };
        
        // Add key metrics
        addMetric('possession.possessionPercentage', teamMetrics.possession.possessionPercentage);
        addMetric('possession.passCompletionRate', teamMetrics.possession.passCompletionRate);
        addMetric('possession.progressivePassesPerMatch', teamMetrics.possession.progressivePassesPerMatch);
        addMetric('possession.ppda', teamMetrics.possession.ppda);
        
        addMetric('attacking.goalsPerMatch', teamMetrics.attacking.goalsPerMatch);
        addMetric('attacking.xGPerMatch', teamMetrics.attacking.xGPerMatch);
        addMetric('attacking.shotsPerMatch', teamMetrics.attacking.shotsPerMatch);
        addMetric('attacking.bigChancesCreatedPerMatch', teamMetrics.attacking.bigChancesCreatedPerMatch);
        
        addMetric('defensive.goalsAgainstPerMatch', teamMetrics.defensive.goalsAgainstPerMatch);
        addMetric('defensive.xGAgainstPerMatch', teamMetrics.defensive.xGAgainstPerMatch);
        addMetric('defensive.cleanSheetPercentage', teamMetrics.defensive.cleanSheetPercentage);
        addMetric('defensive.pressingIntensity', teamMetrics.defensive.pressingIntensity);
        
        addMetric('tempo.directPlayIndex', teamMetrics.tempo.directPlayIndex);
        addMetric('tempo.counterPressAfterLoss', teamMetrics.tempo.counterPressAfterLoss);
        
        // Play style categories
        addMetric('playStyleCategories.possessionDominance', teamMetrics.playStyleCategories.possessionDominance);
        addMetric('playStyleCategories.pressingIntensity', teamMetrics.playStyleCategories.pressingIntensity);
        addMetric('playStyleCategories.buildUpSpeed', teamMetrics.playStyleCategories.buildUpSpeed);
        addMetric('playStyleCategories.attackingDirectness', teamMetrics.playStyleCategories.attackingDirectness);
        addMetric('playStyleCategories.counterAttackThreat', teamMetrics.playStyleCategories.counterAttackThreat);
        
        return comparativeMetrics;
      }

      // Use real API data
      const params = new URLSearchParams();
      params.append('leagueId', leagueId);
      if (seasonId) params.append('seasonId', seasonId);
      
      const endpoint = `${ENDPOINTS.TEAM_METRICS(teamId)}/comparative?${params.toString()}`;
      const response = await apiClient.get<ComparativeMetricsResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comparative metrics for team ID ${teamId} in league ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Get metrics grouped by match result (win, draw, loss)
   * @param teamId Team ID
   * @param seasonId Optional season ID
   * @returns Promise with metrics categorized by match result
   */
  async getMetricsByResult(teamId: string, seasonId?: string): Promise<{
    win: Partial<TeamMetrics>;
    draw: Partial<TeamMetrics>;
    loss: Partial<TeamMetrics>;
  }> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock metrics by result data');
        
        // Get team's matches
        const matches = await matchService.getMatchesByTeam(teamId, { season: seasonId });
        
        // Get metrics for each match
        const matchMetricsPromises = matches.map(match => 
          this.getMatchMetrics(teamId, match.id).catch(() => null)
        );
        
        const allMatchMetrics = (await Promise.all(matchMetricsPromises)).filter(
          metrics => metrics !== null
        ) as MatchMetrics[];
        
        // Group metrics by result
        const winMetrics = allMatchMetrics.filter(metrics => metrics.matchResult === 'WIN');
        const drawMetrics = allMatchMetrics.filter(metrics => metrics.matchResult === 'DRAW');
        const lossMetrics = allMatchMetrics.filter(metrics => metrics.matchResult === 'LOSS');
        
        // Helper function to average metrics
        const averageMetrics = (metricsList: MatchMetrics[]): Partial<TeamMetrics> => {
          if (metricsList.length === 0) return {};
          
          // Initialize result object with the same structure as TeamMetrics
          const result: Partial<TeamMetrics> = {
            possession: {
              possessionPercentage: 0,
              passCompletionRate: 0,
              progressivePassesPerMatch: 0,
              averageBuildUpTime: 0,
              passingSequencesOver5: 0,
              ppda: 0,
              fieldTiltPercentage: 0,
              directnessIndex: 0
            },
            attacking: {
              goalsPerMatch: 0,
              xGPerMatch: 0,
              shotsPerMatch: 0,
              shotsOnTargetPerMatch: 0,
              bigChancesCreatedPerMatch: 0,
              setPieceGoalsPercentage: 0,
              counterAttackGoalsPercentage: 0,
              openPlayGoalsPercentage: 0,
              attackZones: { left: 0, center: 0, right: 0 },
              crossesPerMatch: 0,
              dribbleSuccessRate: 0,
              touchesInBox: 0
            },
            defensive: {
              goalsAgainstPerMatch: 0,
              xGAgainstPerMatch: 0,
              cleanSheetPercentage: 0,
              tacklesPerMatch: 0,
              interceptionPerMatch: 0,
              clearancesPerMatch: 0,
              defensiveLineHeight: 0,
              pressingIntensity: 0,
              challengesWonPercentage: 0,
              aerialDuelsWonPercentage: 0,
              defensiveActionsPerMatch: 0,
              opponentPassCompletionAllowed: 0,
              defensiveRecoveryTime: 0
            },
            tempo: {
              directPlayIndex: 0,
              averagePossessionDuration: 0,
              transitionSpeedAttacking: 0,
              transitionSpeedDefensive: 0,
              counterPressAfterLoss: 0,
              verticalityIndex: 0,
              passesPerOffensiveAction: 0,
              progressiveCarriesPerMatch: 0,
              gameStateAdaptability: { winningStyle: 0, drawingStyle: 0, losingStyle: 0 }
            }
          };
          
          // Sum all values
          metricsList.forEach(metrics => {
            // Possession metrics
            Object.keys(metrics.possession).forEach(key => {
              if (key === 'attackZones') {
                result.attacking!.attackZones!.left += metrics.attacking.attackZones.left / metricsList.length;
                result.attacking!.attackZones!.center += metrics.attacking.attackZones.center / metricsList.length;
                result.attacking!.attackZones!.right += metrics.attacking.attackZones.right / metricsList.length;
              } else {
                (result.possession as any)[key] += (metrics.possession as any)[key] / metricsList.length;
              }
            });
            
            // Attacking metrics
            Object.keys(metrics.attacking).forEach(key => {
              if (key !== 'attackZones') {
                (result.attacking as any)[key] += (metrics.attacking as any)[key] / metricsList.length;
              }
            });
            
            // Defensive metrics
            Object.keys(metrics.defensive).forEach(key => {
              (result.defensive as any)[key] += (metrics.defensive as any)[key] / metricsList.length;
            });
            
            // Tempo metrics
            Object.keys(metrics.tempo).forEach(key => {
              if (key === 'gameStateAdaptability') {
                const adaptability = metrics.tempo.gameStateAdaptability;
                result.tempo!.gameStateAdaptability!.winningStyle += adaptability.winningStyle / metricsList.length;
                result.tempo!.gameStateAdaptability!.drawingStyle += adaptability.drawingStyle / metricsList.length;
                result.tempo!.gameStateAdaptability!.losingStyle += adaptability.losingStyle / metricsList.length;
              } else {
                (result.tempo as any)[key] += (metrics.tempo as any)[key] / metricsList.length;
              }
            });
          });
          
          return result;
        };
        
        return {
          win: averageMetrics(winMetrics),
          draw: averageMetrics(drawMetrics),
          loss: averageMetrics(lossMetrics)
        };
      }

      // Use real API data
      const endpoint = `${ENDPOINTS.TEAM_METRICS(teamId)}/by-result${seasonId ? `?seasonId=${seasonId}` : ''}`;
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metrics by result for team ID ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Determine the most common play style in a league
   * @param leagueId League ID
   * @param seasonId Optional season ID
   * @returns Promise with the most common play style and its frequency
   */
  async getLeaguePlayStyleDistribution(
    leagueId: string, 
    seasonId?: string
  ): Promise<Record<PlayStyle, number>> {
    try {
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        console.log('Using mock league play style distribution data');
        
        // Get all teams in the league with metrics
        const leagueTeamMetrics = mockTeamMetricsData.filter(
          metrics => metrics.seasonId?.startsWith(leagueId) && (!seasonId || metrics.seasonId === seasonId)
        ) as TeamMetrics[];
        
        // Count play styles
        const playStyleCounts: Record<PlayStyle, number> = {
          'POSSESSION_BASED': 0,
          'DIRECT_PLAY': 0,
          'COUNTER_ATTACKING': 0,
          'HIGH_PRESSING': 0,
          'LOW_BLOCK': 0,
          'TIKI_TAKA': 0,
          'WING_PLAY': 0,
          'LONG_BALL': 0,
          'VERTICAL_TIKI_TAKA': 0,
          'BALANCED': 0
        };
        
        // Count primary play styles
        leagueTeamMetrics.forEach(metrics => {
          playStyleCounts[metrics.playStyleCategories.primaryPlayStyle]++;
        });
        
        return playStyleCounts;
      }

      // Use real API data
      const params = new URLSearchParams();
      if (seasonId) params.append('seasonId', seasonId);
      
      const endpoint = `${ENDPOINTS.LEAGUES}/${leagueId}/play-styles?${params.toString()}`;
      const response = await apiClient.get<Record<PlayStyle, number>>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching play style distribution for league ID ${leagueId}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const metricsService = new MetricsService();

export default metricsService;