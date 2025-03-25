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
   * @param seasonId Optional season ID
   * @returns Promise with team metrics
   */
  async getTeamMetrics(teamId: string, seasonId?: string): Promise<TeamMetrics> {
    try {
      console.log('Using mock team metrics data for team:', teamId);
      // Find team metrics in mock data
      const teamMetrics = mockTeamMetricsData.find(
        metrics => metrics.teamId === teamId && (!seasonId || metrics.seasonId === seasonId)
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
      
      return teamMetrics as TeamMetrics;
    } catch (error) {
      console.error(`Error fetching metrics for team ID ${teamId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get comparative metrics for the team in a league context
   * Not implemented in this simplified version
   */
  async getComparativeMetrics(teamId: string, leagueId: string, seasonId?: string) {
    return null;
  }
  
  /**
   * Get metrics grouped by match result (win, draw, loss)
   * Not implemented in this simplified version
   */
  async getMetricsByResult(teamId: string, seasonId?: string) {
    return null;
  }
}

// Create singleton instance
const metricsService = new MetricsService();

export default metricsService;