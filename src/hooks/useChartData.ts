import { useMemo } from 'react';
import { TeamMetrics } from '@/types';

interface ChartDataEntry extends Record<string, any> {
  name: string;
}

/**
 * Custom hook to transform team metrics into radar chart data
 * @param metrics Team metrics object
 * @param categories Metric categories to include
 * @returns Array of data points for the radar chart
 */
export function useTeamMetricsRadarData(
  metrics: TeamMetrics | null,
  categories: string[] = ['possession', 'attacking', 'defensive', 'tempo']
): ChartDataEntry[] {
  return useMemo(() => {
    if (!metrics) return [];
    
    // Predefined metrics to display in the radar chart
    const selectedMetrics: Record<string, string[]> = {
      possession: [
        'possessionPercentage',
        'passCompletionRate',
        'progressivePassesPerMatch',
        'fieldTiltPercentage'
      ],
      attacking: [
        'goalsPerMatch',
        'xGPerMatch',
        'bigChancesCreatedPerMatch',
        'shotsPerMatch'
      ],
      defensive: [
        'pressingIntensity',
        'defensiveLineHeight',
        'challengesWonPercentage',
        'cleanSheetPercentage'
      ],
      tempo: [
        'counterPressAfterLoss',
        'directPlayIndex',
        'verticalityIndex',
        'transitionSpeedAttacking'
      ]
    };
    
    // Create radar chart data
    const radarData: ChartDataEntry[] = [];
    
    // Process each category
    categories.forEach(category => {
      if (!(category in selectedMetrics) || !(category in metrics)) {
        return;
      }
      
      const categoryMetrics = metrics[category as keyof TeamMetrics];
      const metricKeys = selectedMetrics[category];
      
      // Process each metric in the category
      metricKeys.forEach(key => {
        if (key in categoryMetrics) {
          const value = categoryMetrics[key as keyof typeof categoryMetrics];
          // Only include numeric values and ensure they're in a reasonable range (0-100)
          if (typeof value === 'number') {
            let normalizedValue = value;
            
            // Normalize certain metrics if needed
            if (key === 'goalsPerMatch' && value > 0) {
              normalizedValue = Math.min(value * 20, 100); // Scale goals (0-5 goals becomes 0-100)
            } else if (key === 'xGPerMatch' && value > 0) {
              normalizedValue = Math.min(value * 20, 100); // Scale xG similar to goals
            } else if (key === 'shotsPerMatch' && value > 0) {
              normalizedValue = Math.min(value * 5, 100); // Scale shots (0-20 shots becomes 0-100)
            } else if (key === 'progressivePassesPerMatch' && value > 0) {
              normalizedValue = Math.min(value / 1.2, 100); // Scale progressive passes
            }
            
            // Add to radar data
            radarData.push({
              name: formatMetricName(key.toString()),
              value: normalizedValue,
              category: category,
              original: value,
            });
          }
        }
      });
    });
    
    return radarData;
  }, [metrics, categories]);
}

/**
 * Format a camelCase metric name to a readable form
 * @param metricName Metric name in camelCase
 * @returns Formatted metric name
 */
function formatMetricName(metricName: string): string {
  // Split by capital letters and join with spaces
  return metricName
    .replace(/([A-Z])/g, ' $1')
    // Replace common abbreviations
    .replace(/Ppda/g, 'PPDA')
    .replace(/Xg/g, 'xG')
    // Handle special cases
    .replace(/Per Match/g, '')
    .replace(/Percentage/g, '%')
    // Capitalize first letter
    .replace(/^\w/, c => c.toUpperCase());
}

export default {
  useTeamMetricsRadarData
};