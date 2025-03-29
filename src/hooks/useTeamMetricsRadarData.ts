import { useMemo } from 'react';
import { METRICS_DICTIONARY } from '@/config/metrics-dictionary';
import { MetricDefinition } from '@/config/metrics-dictionary';
import { ChartConfig } from '@/config/chart-configs';
import { PLAY_STYLE_CATEGORIES } from '@/config/constants';

// Define the structure for radar chart data entries
export interface RadarChartDataEntry {
  name: string;           // Display name for the axis label
  category: string;       // Metric category (possession, attacking, etc.)
  metricId: string;       // Original metric ID
  value: number;          // Normalized value for the chart (0-100)
  originalValue: number;  // Original raw value of the metric
  percentile?: number;    // Percentile value (0-100) if available
  teamName?: string;      // Team name for data key in chart
  displayValue?: string;  // Formatted raw value for display
  leagueContext?: string; // Description of league ranking
  angle?: number;         // Optional angle for positioning
  color?: string;         // Optional color based on category
}

// Map of category colors for visual styling
export const METRIC_CATEGORIES_COLORS = {
  attacking: {
    position: 'top',
    color: '#EF4444', // Red
    baseAngle: 0,     // Top 
    angleRange: [-30, 30] // 60 degree span centered at top (0 degrees)
  },
  possession: {
    position: 'left',
    color: '#10B981', // Green
    baseAngle: 90,    // Left
    angleRange: [60, 120] // 60 degree span centered at left (90 degrees)
  },
  defending: {
    position: 'bottom',
    color: '#3B82F6', // Blue
    baseAngle: 180,   // Bottom
    angleRange: [150, 210] // 60 degree span centered at bottom (180 degrees)
  },
  tempo: {
    position: 'right',
    color: '#F59E0B', // Amber/yellow
    baseAngle: 270,   // Right
    angleRange: [240, 300] // 60 degree span centered at right (270 degrees)
  }
};

/**
 * Custom hook to transform team metrics into radar chart data
 * @param teamMetrics Raw team metrics data
 * @param config Chart configuration defining which metrics to include
 * @param usePercentiles Whether to use percentiles instead of raw values (defaults to true)
 * @returns Array of data entries ready for the radar chart
 */
export function useTeamMetricsRadarData(
  teamMetrics: any | null,
  config?: ChartConfig,
  usePercentiles: boolean = true
): RadarChartDataEntry[] {
  return useMemo(() => {
    if (!teamMetrics || !teamMetrics.metrics) {
      console.log('No metrics data provided to useTeamMetricsRadarData');
      return [];
    }
    
    const result: RadarChartDataEntry[] = [];
    
    // Get metrics to display from config or use all metrics
    const metricsToDisplay = config?.metrics || {};
    
    // Process each category of metrics
    Object.entries(metricsToDisplay).forEach(([category, metricIds]) => {
      if (!Array.isArray(metricIds)) return;
      
      // Get the category information for positioning
      const categoryInfo = METRIC_CATEGORIES_COLORS[category as keyof typeof METRIC_CATEGORIES_COLORS];
      if (!categoryInfo) return;
      
      // Fix number of metrics to exactly 3 per category for even distribution
      const displayMetrics = metricIds.slice(0, 3);
      const metricCount = displayMetrics.length;
      
      // Calculate angles based on fixed positions
      const baseAngle = categoryInfo.baseAngle; // 0, 90, 180, or 270
      
      // Process each metric in this category (max 3)
      displayMetrics.forEach((metricId, index) => {
        // Find the metric definition
        const metricDef = METRICS_DICTIONARY.find(m => m.id === metricId);
        if (!metricDef) {
          console.warn(`Metric definition not found for ID: ${metricId}`);
          return;
        }
        
        // Get the raw value from team metrics
        const rawValue = teamMetrics.metrics[metricId];
        if (rawValue === undefined) {
          console.warn(`No data for metric ${metricId} in team metrics`);
          return;
        }
        
        // Calculate angle based on position within category
        // With 3 metrics per category, we space them at -30, 0, and +30 degrees from the base angle
        const angleAdjustment = (index - 1) * 30; // -30, 0, or +30
        const angle = baseAngle + angleAdjustment;
        
        // Get percentile for this metric if available, or normalize the raw value
        // In a real implementation, percentiles would come from the backend
        let percentile: number | undefined;
        if (teamMetrics.metrics[metricId]?.percentile !== undefined) {
          percentile = teamMetrics.metrics[metricId].percentile;
        }
        
        // Normalize the value for display (0-100 scale)
        const normalizedValue = normalizeMetricValue(rawValue, metricDef);
        
        // Create the radar chart data entry
        const dataEntry: RadarChartDataEntry = {
          name: metricDef.displayName,
          category: category,
          metricId: metricId,
          originalValue: rawValue,
          value: percentile !== undefined ? percentile : normalizedValue,
          percentile: percentile !== undefined ? percentile : normalizedValue,
          teamName: percentile !== undefined ? percentile : normalizedValue, // Use as dataKey for the chart
          displayValue: getDisplayValue(metricDef, rawValue), // Formatted raw value
          leagueContext: getLeagueContextDescription(percentile || normalizedValue),
          angle: angle,
          color: categoryInfo.color
        };
        
        result.push(dataEntry);
      });
    });
    
    // Sort by angle for consistent presentation
    return result.sort((a, b) => (a.angle || 0) - (b.angle || 0));
  }, [teamMetrics, config, usePercentiles]);
}

/**
 * Format a raw metric value for display based on its definition
 */
function getDisplayValue(metricDef: MetricDefinition, value: number): string {
  // Handle different unit types
  switch (metricDef.units) {
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'per90':
      return `${value.toFixed(2)}/90`;
    case 'qty':
      return value.toFixed(1);
    default:
      return value.toFixed(1);
  }
}

/**
 * Normalize a metric value to 0-100 scale based on its definition
 * @param rawValue The raw metric value
 * @param metricDef The metric definition containing range information
 * @returns Normalized value between 0-100
 */
function normalizeMetricValue(rawValue: number, metricDef: MetricDefinition): number {
  // If there's no range defined, treat the value as a percentage already
  if (!metricDef.range) {
    return Math.max(0, Math.min(100, rawValue));
  }
  
  const { min, max } = metricDef.range;
  
  // Linear normalization to 0-100 scale
  let normalized = ((rawValue - min) / (max - min)) * 100;
  
  // If higher values are worse, invert the scale
  if (metricDef.higherIsBetter === false) {
    normalized = 100 - normalized;
  }
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, normalized));
}

/**
 * Get a text description of where a percentile ranks in the league
 * @param percentile Percentile value (0-100)
 * @returns Text description of the league ranking
 */
function getLeagueContextDescription(percentile: number): string {
  if (percentile >= 90) return 'Top 10%';
  if (percentile >= 80) return 'Top 20%';
  if (percentile >= 70) return 'Top 30%';
  if (percentile >= 60) return 'Above Average';
  if (percentile >= 40) return 'Average';
  if (percentile >= 30) return 'Below Average';
  if (percentile >= 20) return 'Bottom 30%';
  if (percentile >= 10) return 'Bottom 20%';
  return 'Bottom 10%';
}

export default useTeamMetricsRadarData;