import { useMemo } from 'react';
import { TeamMetrics } from '@/types';
import { MetricId, METRICS, normalizeMetricValue } from '@/config/metrics';
import { ChartConfig, getDefaultRadarConfig } from '@/config/chart-configs';

// Define metric category positions and colors
export const METRIC_CATEGORIES = {
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
  defensive: {
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

interface ChartDataEntry extends Record<string, any> {
  name: string;
  category: string;
  value: number;
  originalValue: number;
  metricId: string;
  angle?: number; // For positioning metrics
  color?: string; // For color coding
}

/**
 * Custom hook to transform team metrics into radar chart data
 * @param metrics Team metrics object
 * @param config Chart configuration (optional, uses default if not provided)
 * @param usePercentiles Whether to use percentiles instead of normalized values (defaults to true)
 * @returns Array of data points for the radar chart
 */
export function useTeamMetricsRadarData(
  metrics: TeamMetrics | null,
  config?: ChartConfig,
  usePercentiles: boolean = true
): ChartDataEntry[] {
  return useMemo(() => {
    if (!metrics) {
      console.log('No metrics data provided to useTeamMetricsRadarData');
      return [];
    }
    
    // Use provided config or default
    const chartConfig = config || getDefaultRadarConfig();
    console.log('Using chart config:', chartConfig.name);
    
    // Organize metrics by category
    const categorizedMetrics: Record<string, MetricId[]> = {};
    Object.entries(chartConfig.metrics).forEach(([category, metricIds]) => {
      categorizedMetrics[category] = metricIds;
    });
    
    // Calculate angles for each metric to ensure proper positioning
    const organizedMetrics = assignMetricPositions(categorizedMetrics);
    
    // Create radar chart data
    const radarData: ChartDataEntry[] = [];
    
    // Process each metric with its assigned position
    organizedMetrics.forEach((metricInfo) => {
      const { metricId, category, angle } = metricInfo;
      
      if (!(category in metrics)) {
        console.log(`Category ${category} not found in metrics data`);
        return;
      }
      
      const categoryMetrics = metrics[category as keyof TeamMetrics];
      const metric = METRICS[metricId];
      
      if (!metric) {
        console.log(`Metric ${metricId} not found in METRICS dictionary. Available metrics: ${Object.keys(METRICS).join(', ')}`);
        return;
      }
      
      // Extract path to the value based on the metric ID
      const pathParts = metricId.split('_');
      let value: number | undefined;
      let percentile: number | undefined;
      
      try {
        // Get the property path for this metric
        const propertyPath = getMetricPropertyPath(metricId, category);
        
        // Try to navigate the object path to find the value
        let obj = categoryMetrics as any;
        for (const part of propertyPath) {
          if (obj && typeof obj === 'object' && part in obj) {
            obj = obj[part];
          } else {
            // If the path doesn't exist, try alternative approaches
            obj = undefined;
            break;
          }
        }
        
        // If we couldn't find it with the property path, try the original paths
        if (obj === undefined) {
          // Try with original path parts
          obj = categoryMetrics as any;
          for (const part of pathParts) {
            if (obj && typeof obj === 'object' && part in obj) {
              obj = obj[part];
            } else {
              obj = undefined;
              break;
            }
          }
        }
        
        // If we still couldn't find it, try the direct property
        if (obj === undefined && metricId in categoryMetrics) {
          obj = categoryMetrics[metricId as keyof typeof categoryMetrics];
        }
        
        // If we still don't have it, try with camelCase version (for legacy support)
        if (obj === undefined) {
          const camelCaseKey = toCamelCase(metricId);
          if (camelCaseKey in categoryMetrics) {
            obj = categoryMetrics[camelCaseKey as keyof typeof categoryMetrics];
          }
        }
        
        // Only use the value if it's a number
        if (typeof obj === 'number') {
          value = obj;
        }
        
        // Log debug info for missing metrics
        if (value === undefined) {
          console.log(`Could not find value for metric ${metricId} in category ${category}`);
        }
        
        // Look for percentile data - first in playStyleCategories
        if (metrics.playStyleCategories) {
          const camelCaseKey = toCamelCase(metricId);
          if (camelCaseKey in metrics.playStyleCategories) {
            percentile = metrics.playStyleCategories[camelCaseKey as keyof typeof metrics.playStyleCategories] as number;
          }
        }
        
        // If we don't have percentile from playStyleCategories, generate one
        if (percentile === undefined && value !== undefined) {
          // For now, use a simple normalization as our percentile
          // In a real implementation, this would come from the backend
          percentile = normalizeMetricValue(metricId, value);
          
          // Ensure percentile is between 0-100
          percentile = Math.max(0, Math.min(100, percentile));
        }
      } catch (err) {
        console.error(`Error accessing metric ${metricId}:`, err);
      }
      
      // Only add the datapoint if we found a numeric value
      if (value !== undefined) {
        // Use either percentile (if available and requested) or normalized value
        const displayValue = (usePercentiles && percentile !== undefined) 
          ? percentile 
          : normalizeMetricValue(metricId, value);
        
        // Get category color
        const categoryInfo = METRIC_CATEGORIES[category as keyof typeof METRIC_CATEGORIES];
        const categoryColor = categoryInfo?.color || '#94A3B8';
        
        // Create the data entry for the radar chart
        const dataEntry: ChartDataEntry = {
          name: metric.name,
          category: category,
          metricId: metricId,
          originalValue: value,
          value: displayValue,
          percentile: percentile,
          // Add team name as the key for the RadarChart component
          teamName: displayValue,
          // Add league rank info
          leagueContext: getLeagueContextDescription(percentile || 50),
          // Add position and color information
          angle: angle,
          color: categoryColor
        };
        
        radarData.push(dataEntry);
      }
    });
    
    if (radarData.length === 0) {
      console.log('No radar data points were generated');
    } else {
      console.log(`Generated ${radarData.length} radar data points`);
    }
    
    // Sort by angle for consistent presentation
    return radarData.sort((a, b) => (a.angle || 0) - (b.angle || 0));
  }, [metrics, config, usePercentiles]);
}

/**
 * Organize metrics by category and assign positions within each category
 * @param categorizedMetrics Metrics grouped by category
 * @returns Array of metrics with assigned positions
 */
function assignMetricPositions(categorizedMetrics: Record<string, MetricId[]>): Array<{
  metricId: MetricId,
  category: string,
  angle: number
}> {
  const result: Array<{
    metricId: MetricId,
    category: string,
    angle: number
  }> = [];
  
  // Process each category
  Object.entries(categorizedMetrics).forEach(([category, metricIds]) => {
    const categoryInfo = METRIC_CATEGORIES[category as keyof typeof METRIC_CATEGORIES];
    if (!categoryInfo) return;
    
    const [startAngle, endAngle] = categoryInfo.angleRange;
    const metricCount = metricIds.length;
    
    // Calculate mid-point of the category's angle range
    const midAngle = (startAngle + endAngle) / 2;
    
    // Calculate the total angle span
    const angleSpan = endAngle - startAngle;
    
    // Calculate angles for each metric in this category
    metricIds.forEach((metricId, index) => {
      // For single metrics, put at the center
      if (metricCount === 1) {
        result.push({
          metricId,
          category,
          angle: midAngle
        });
        return;
      }
      
      // For multiple metrics, distribute evenly around the mid-point
      // Calculate fraction position from middle (-0.5 to 0.5 for total range)
      let fraction = (index / (metricCount - 1)) - 0.5;
      
      // Calculate angle by scaling the fraction to the angle span
      const angle = midAngle + (fraction * angleSpan);
      
      result.push({
        metricId,
        category,
        angle
      });
    });
  });
  
  return result;
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

/**
 * Helper function to convert snake_case to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Helper function to map a metric ID to the corresponding property in our data structure
 * This handles the mismatch between our metric IDs (snake_case) and our data structure (camelCase)
 */
function getMetricPropertyPath(metricId: string, category: string): string[] {
  // Map of special cases where the property path doesn't match the metric ID convention
  const specialCaseMap: Record<string, string[]> = {
    'possession_percentage': ['possessionPercentage'],
    'pass_completion': ['passCompletionRate'],
    'progressive_passes': ['progressivePassesPerMatch'],
    'build_up_time': ['averageBuildUpTime'],
    'field_tilt_percentage': ['fieldTiltPercentage'],
    'expected_goals': ['xGPerMatch'],
    'shot_accuracy': ['shotsOnTargetPerMatch'], // Approximation
    'counter_attack_frequency': ['counterAttackGoalsPercentage'],
    'set_piece_dependency': ['setPieceGoalsPercentage'],
    'shots_per_match': ['shotsPerMatch'],
    'big_chances_created': ['bigChancesCreatedPerMatch'],
    'defensive_line_height': ['defensiveLineHeight'],
    'pressing_intensity': ['pressingIntensity'],
    'recovery_time': ['defensiveRecoveryTime'],
    'defensive_duels_won': ['challengesWonPercentage'],
    'clean_sheet_percentage': ['cleanSheetPercentage'],
    'tackles_per_match': ['tacklesPerMatch'],
    'direct_play_vs_possession': ['directPlayIndex'],
    'transition_speed': ['transitionSpeedAttacking'],
    'counter_press_after_loss': ['counterPressAfterLoss'],
    'verticality_index': ['verticalityIndex'],
    'progressive_carries': ['progressiveCarriesPerMatch'],
    'game_state_adaptability': ['gameStateAdaptability', 'drawingStyle'] // Example - could be any of the game state metrics
  };
  
  // Check if we have a special case mapping for this metric
  if (metricId in specialCaseMap) {
    return specialCaseMap[metricId];
  }
  
  // Otherwise, convert to camelCase and return as single path element
  return [toCamelCase(metricId)];
}

/**
 * Transform metrics data grouped by result into bar chart data
 * @param metricsByResult Metrics grouped by match result
 * @param metricKey Full metric key (category.metric)
 * @returns Array of data points for the bar chart
 */
export function useMetricsByResultBarData(
  metricsByResult: {
    win: Partial<TeamMetrics>;
    draw: Partial<TeamMetrics>;
    loss: Partial<TeamMetrics>;
  } | null,
  metricKey: string
): Array<{name: string; value: number; result: string}> {
  return useMemo(() => {
    if (!metricsByResult) return [];
    
    const [category, metric] = metricKey.split('.');
    if (!category || !metric) return [];
    
    const results = ['win', 'draw', 'loss'] as const;
    const data: Array<{name: string; value: number; result: string}> = [];
    
    results.forEach(result => {
      const resultMetrics = metricsByResult[result];
      if (!resultMetrics || !(category in resultMetrics)) return;
      
      const categoryMetrics = resultMetrics[category as keyof typeof resultMetrics];
      if (!categoryMetrics || !(metric in categoryMetrics)) return;
      
      const value = (categoryMetrics as any)[metric];
      if (typeof value !== 'number') return;
      
      data.push({
        name: result.charAt(0).toUpperCase() + result.slice(1) + 's',
        value,
        result
      });
    });
    
    return data;
  }, [metricsByResult, metricKey]);
}

/**
 * Transform comparative metrics into bar chart data
 * @param comparativeMetrics Comparative metrics object
 * @param metricKeys Array of metric IDs to include
 * @returns Array of data points for the bar chart
 */
export function useComparativeMetricsBarData(
  comparativeMetrics: any | null,
  metricKeys: string[]
): Array<{name: string; value: number; leagueAverage: number}> {
  return useMemo(() => {
    if (!comparativeMetrics || !comparativeMetrics.metrics) return [];
    
    return metricKeys.map(key => {
      const metric = comparativeMetrics.metrics[key];
      const metricName = key.split('.').pop() || key;
      
      return {
        name: formatMetricName(metricName),
        value: metric?.value || 0,
        leagueAverage: metric?.leagueAverage || 0
      };
    });
  }, [comparativeMetrics, metricKeys]);
}

/**
 * Transform match metrics into line chart data
 * @param matchMetrics Array of match metrics
 * @param metricKey Metric key to extract
 * @returns Array of data points for the line chart
 */
export function useMatchMetricsLineData(
  matchMetrics: any[] | null,
  metricKey: string
): Array<{name: string; value: number}> {
  return useMemo(() => {
    if (!matchMetrics) return [];
    
    // Extract category and metric name
    const [category, metric] = metricKey.split('.');
    if (!category || !metric) return [];
    
    return matchMetrics.map((match, index) => {
      // Extract value safely
      let value = 0;
      try {
        if (match[category] && typeof match[category][metric] === 'number') {
          value = match[category][metric];
        }
      } catch (e) {
        console.error(`Error extracting ${metricKey} from match data:`, e);
      }
      
      return {
        name: `Match ${index + 1}`,
        value
      };
    });
  }, [matchMetrics, metricKey]);
}

/**
 * Format a camelCase or snake_case metric name to a readable form
 */
function formatMetricName(metricName: string): string {
  // Replace underscores with spaces
  let formatted = metricName.replace(/_/g, ' ');
  
  // Split camelCase
  formatted = formatted.replace(/([A-Z])/g, ' $1');
  
  // Replace common abbreviations
  formatted = formatted
    .replace(/\bppda\b/i, 'PPDA')
    .replace(/\bxg\b/i, 'xG');
  
  // Capitalize first letter
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  
  return formatted;
}

export default {
  useTeamMetricsRadarData,
  useMetricsByResultBarData,
  useComparativeMetricsBarData,
  useMatchMetricsLineData,
  METRIC_CATEGORIES
};