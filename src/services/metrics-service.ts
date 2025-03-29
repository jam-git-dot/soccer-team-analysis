import type { TeamMetrics } from '@/types';

// Import mock data
import mockTeamMetricsData from '@/mock/team-metrics.json';

/**
 * Service for fetching and processing team metrics data
 */
class MetricsService {
  /**
   * Get team metrics data
   * @param teamId Team ID
   * @param leagueId League ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @returns Promise with team metrics
   */
  async getTeamMetrics(teamId: string, leagueId: string = 'developer-league', seasonId?: string): Promise<TeamMetrics> {
    try {
      console.log(`Fetching metrics for team: ${teamId} in league: ${leagueId}`);
      
      // Only return data for the Developer League
      if (leagueId !== 'developer-league') {
        throw new Error(`Data for league ${leagueId} is not available yet`);
      }
      
      // Find team metrics in mock data
      const teamMetrics = mockTeamMetricsData.find(
        metrics => metrics.teamId === teamId
      );
      
      if (!teamMetrics) {
        console.error(`No metrics found for team ID ${teamId} in mock data`);
        // If team not found, return first team as fallback to prevent errors
        if (mockTeamMetricsData.length > 0) {
          console.log(`Falling back to ${mockTeamMetricsData[0].teamId} metrics`);
          return mockTeamMetricsData[0] as TeamMetrics;
        }
        throw new Error(`Metrics for team ID ${teamId} not found`);
      }
      
      // Clone the data to avoid reference issues
      return JSON.parse(JSON.stringify(teamMetrics)) as TeamMetrics;
    } catch (error) {
      console.error(`Error fetching metrics for team ID ${teamId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get comparative metrics for the team in a league context
   * @param teamId Team ID
   * @param leagueId League ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @returns Promise with comparative metrics
   */
  async getComparativeMetrics(teamId: string, leagueId: string = 'developer-league', seasonId?: string) {
    // This would normally fetch comparative metrics from the API
    // For now, return a placeholder since this isn't implemented in the mock data
    console.log('Comparative metrics not implemented in mock data');
    return null;
  }
  
  /**
   * Get metrics grouped by match result (win, draw, loss)
   * @param teamId Team ID
   * @param leagueId League ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @returns Promise with metrics by result
   */
  async getMetricsByResult(teamId: string, leagueId: string = 'developer-league', seasonId?: string) {
    // This would normally fetch metrics grouped by result from the API
    // For now, return a placeholder since this isn't implemented in the mock data
    console.log('Metrics by result not implemented in mock data');
    return null;
  }
  
  /**
   * Get match metrics for a specific team
   * @param teamId Team ID
   * @param matchId Match ID
   * @param leagueId League ID (defaults to developer-league)
   * @returns Promise with match metrics
   */
  async getMatchMetrics(teamId: string, matchId: string, leagueId: string = 'developer-league') {
    // This would normally fetch match metrics from the API
    console.log('Match metrics not implemented in mock data');
    return null;
  }
  
  /**
   * Get play style distribution in a league
   * @param leagueId League ID (defaults to developer-league)
   * @param seasonId Optional season ID
   * @returns Promise with play style distribution
   */
  async getLeaguePlayStyleDistribution(leagueId: string = 'developer-league', seasonId?: string) {
    // This would normally fetch league play style distribution from the API
    console.log('League play style distribution not implemented in mock data');
    return null;
  }
}

// Create singleton instance
const metricsService = new MetricsService();

export default metricsService;