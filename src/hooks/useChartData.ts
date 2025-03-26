import { useMemo } from 'react';
import { TeamMetrics } from '@/types';
import { MetricId, METRICS, normalizeMetricValue } from '@/config/metrics';
import { ChartConfig, getDefaultRadarConfig } from '@/config/chart-configs';

interface ChartDataEntry extends Record<string, any> {
  name: string;
  category: string;
  value: number;
  originalValue: number;
  metricId: string;
}

/**
 * Custom hook to transform team metrics into radar chart data
 * @param metrics Team metrics object
 * @param config Chart configuration (optional, uses default if not provided)
 * @returns Array of data points for the radar chart
 */
export function useTeamMetricsRadarData(
  metrics: TeamMetrics | null,
  config?: ChartConfig
): ChartDataEntry[] {
  return useMemo(() => {
    if (!metrics) {
      console.log('No metrics data provided to useTeamMetricsRadarData');
      return [];
    }
    
    // Use provided config or default
    const chartConfig = config || getDefaultRadarConfig();
    console.log('Using chart config:', chartConfig.name);
    
    // Create radar chart data
    const radarData: ChartDataEntry[] = [];
    
    // Process each category in the config
    Object.entries(chartConfig.metrics).forEach(([category, metricIds]) => {
      if (!(category in metrics)) {
        console.log(`Category ${category} not found in metrics data`);
        return;
      }
      
      const categoryMetrics = metrics[category as keyof TeamMetrics];
      
      // Process each metric ID in this category
      metricIds.forEach(metricId => {
        const metric = METRICS[metricId];
        if (!metric) {
          console.log(`Metric ${metricId} not found in METRICS dictionary`);
          return;
        }
        
        // Extract path to the value based on the metric ID
        // This assumes metric IDs follow a convention that matches the object structure
        const pathParts = metricId.split('_');
        let value: number | undefined;
        
        try {
          // Try to navigate the object path to find the value
          let obj = categoryMetrics as any;
          for (const part of pathParts) {
            if (obj && typeof obj === 'object' && part in obj) {
              obj = obj[part];
            } else {
              // If path doesn't exist, try the original metric ID
              obj = undefined;
              break;
            }
          }
          
          // If we couldn't find it with the path, try the direct property
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
        } catch (err) {
          console.error(`Error accessing metric ${metricId}:`, err);
        }
        
        // Only add the datapoint if we found a numeric value
        if (value !== undefined) {
          // Normalize the value for the chart
          const normalizedValue = normalizeMetricValue(metricId, value);
          
          // Create the data entry for the radar chart
          const dataEntry: ChartDataEntry = {
            name: metric.name,
            category: category,
            metricId: metricId,
            originalValue: value,
            value: normalizedValue,
            // Add team name as the key for the RadarChart component
            teamName: normalizedValue,
          };
          
          radarData.push(dataEntry);
        }
      });
    });
    
    if (radarData.length === 0) {
      console.log('No radar data points were generated');
    } else {
      console.log(`Generated ${radarData.length} radar data points`);
    }
    
    return radarData;
  }, [metrics, config]);
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
 * Helper function to convert snake_case to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
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
  useMatchMetricsLineData
};