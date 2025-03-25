import { FEATURES } from '@/config/constants';
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
      // Use mock data 
      console.log('Using mock team metrics data');
      const teamMetrics = mockTeamMetricsData.find(
        metrics => metrics.teamId === teamId && (!seasonId || metrics.seasonId === seasonId)
      );
      
      if (!teamMetrics) {
        throw new Error(`Metrics for team ID ${teamId} not found`);
      }
      
      return teamMetrics as TeamMetrics;
    } catch (error) {
      console.error(`Error fetching metrics for team ID ${teamId}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const metricsService = new MetricsService();

export default metricsService;