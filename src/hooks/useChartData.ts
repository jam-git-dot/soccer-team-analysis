import { useMemo } from 'react';
import { TeamMetrics, MatchMetrics, ComparativeMetrics } from '@/types';

interface ChartDataEntry extends Record<string, any> {
  name: string;
}

type DataTransformer<T, R> = (data: T) => R[];

type MetricDataKeys = {
  possession: Array<keyof TeamMetrics['possession']>;
  attacking: Array<keyof TeamMetrics['attacking']>;
  defensive: Array<keyof TeamMetrics['defensive']>;
  tempo: Array<keyof TeamMetrics['tempo']>;
};

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
    const selectedMetrics: MetricDataKeys = {
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
      const metricKeys = selectedMetrics[category as keyof MetricDataKeys];
      
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
 * Custom hook to transform team metrics by result into bar chart data
 * @param metricsByResult Metrics grouped by match result (win, draw, loss)
 * @param metricKey Specific metric to chart (e.g., 'possession.possessionPercentage')
 * @returns Array of data points for the bar chart
 */
export function useMetricsByResultBarData(
  metricsByResult: { win: Partial<TeamMetrics>; draw: Partial<TeamMetrics>; loss: Partial<TeamMetrics>; } | null,
  metricKey: string
): ChartDataEntry[] {
  return useMemo(() => {
    if (!metricsByResult) return [];
    
    // Extract category and specific metric from the key
    const [category, metric] = metricKey.split('.');
    
    // Validate the metric path
    if (!category || !metric) {
      console.error('Invalid metric key format, expected "category.metric"');
      return [];
    }
    
    // Extract values for each result
    const data: ChartDataEntry[] = [];
    
    // Helper to safely extract metric value
    const getMetricValue = (result: Partial<TeamMetrics>, cat: string, met: string): number | null => {
      if (!result || !result[cat as keyof TeamMetrics]) return null;
      const categoryData = result[cat as keyof TeamMetrics];
      if (!categoryData || !(met in categoryData)) return null;
      const value = (categoryData as any)[met];
      return typeof value === 'number' ? value : null;
    };
    
    // Get metric values for each result type
    const results = ['win', 'draw', 'loss'] as const;
    results.forEach(result => {
      const value = getMetricValue(metricsByResult[result], category, metric);
      if (value !== null) {
        data.push({
          name: result.charAt(0).toUpperCase() + result.slice(1),
          value,
          result
        });
      }
    });
    
    return data;
  }, [metricsByResult, metricKey]);
}

/**
 * Custom hook to transform comparative metrics into bar chart data
 * @param comparativeMetrics Comparative metrics object
 * @param metricKeys Array of metric keys to include
 * @returns Array of data points for the bar chart
 */
export function useComparativeMetricsBarData(
  comparativeMetrics: ComparativeMetrics | null,
  metricKeys: string[]
): ChartDataEntry[] {
  return useMemo(() => {
    if (!comparativeMetrics || !comparativeMetrics.metrics) return [];
    
    return metricKeys.map(key => {
      const metricData = comparativeMetrics.metrics[key];
      if (!metricData) return { name: formatMetricName(key), value: 0, percentile: 0 };
      
      return {
        name: formatMetricName(key),
        value: metricData.value,
        percentile: metricData.percentile,
        leagueAverage: metricData.leagueAverage,
        leagueMax: metricData.leagueMax,
        leagueMin: metricData.leagueMin,
        key
      };
    });
  }, [comparativeMetrics, metricKeys]);
}

/**
 * Custom hook to transform match data into a line chart format
 * @param matches Array of match metrics for a specific team
 * @param metricKey Specific metric to chart (e.g., 'possession.possessionPercentage')
 * @returns Array of data points for the line chart
 */
export function useMatchMetricsLineData(
  matches: MatchMetrics[] | null,
  metricKey: string
): ChartDataEntry[] {
  return useMemo(() => {
    if (!matches || matches.length === 0) return [];
    
    // Extract category and specific metric from the key
    const [category, metric] = metricKey.split('.');
    
    // Validate the metric path
    if (!category || !metric) {
      console.error('Invalid metric key format, expected "category.metric"');
      return [];
    }
    
    // Extract values for each match
    return matches.map(match => {
      // Get date and opponent info
      const matchDate = new Date(match.updatedAt);
      const formattedDate = `${matchDate.getMonth() + 1}/${matchDate.getDate()}`;
      const isHome = match.isHome;
      const opponent = match.opponentId;
      const result = match.matchResult;
      
      // Get the specific metric value
      const metricValue = match[category as keyof MatchMetrics]?.[metric as any];
      
      return {
        name: formattedDate,
        value: typeof metricValue === 'number' ? metricValue : 0,
        opponent,
        isHome,
        result,
        matchId: match.matchId,
        date: match.updatedAt
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [matches, metricKey]);
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
  useTeamMetricsRadarData,
  useMetricsByResultBarData,
  useComparativeMetricsBarData,
  useMatchMetricsLineData
};