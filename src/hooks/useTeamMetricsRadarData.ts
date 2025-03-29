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
  leagueContext?: string; // Description of league ranking
  angle?: number;         // Optional angle for positioning
  color?: string;         // Optional color based on category
}

// Map of category colors for visual styling
export const METRIC_CATEGORIES_COLORS = {
  attacking: {
    position: 'top',
    color: '#EF4444', // Red
    angleRange: [-45, 45] // Centered at top (0 degrees)
  },
  possession: {
    position: 'left',
    color: '#10B981', // Green
    angleRange: [45, 135] // Centered at left (90 degrees)
  },
  defending: {
    position: 'bottom',
    color: '#3B82F6', // Blue
    angleRange: [135, 225] // Centered at bottom (180 degrees)
  },
  tempo: {
    position: 'right',
    color: '#F59E0B', // Amber/yellow
    angleRange: [225, 315] // Centered at right (270 degrees)
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
      
      // Get the angle range for this category
      const categoryInfo = METRIC_CATEGORIES_COLORS[category as keyof typeof METRIC_CATEGORIES_COLORS];
      if (!categoryInfo) return;
      
      const [startAngle, endAngle] = categoryInfo.angleRange;
      const metricCount = metricIds.length;
      
      // Process each metric in this category
      metricIds.forEach((metricId, index) => {
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
        
        // Calculate angle for positioning (for visual organization)
        let angle;
        if (metricCount === 1) {
          // If only one metric in this category, put it in the middle
          angle = (startAngle + endAngle) / 2;
        } else {
          // Otherwise, distribute evenly
          const angleSpan = endAngle - startAngle;
          const fraction = (index / (metricCount - 1)) - 0.5;
          angle = (startAngle + endAngle) / 2 + (fraction * angleSpan);
        }
        
        // Normalize the value for display (0-100 scale)
        const normalizedValue = normalizeMetricValue(rawValue, metricDef);
        
        // Create the radar chart data entry
        const dataEntry: RadarChartDataEntry = {
          name: metricDef.displayName,
          category: category,
          metricId: metricId,
          originalValue: rawValue,
          value: normalizedValue,
          teamName: normalizedValue, // Use as dataKey for the chart
          leagueContext: getLeagueContextDescription(normalizedValue),
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