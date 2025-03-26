import React, { useState } from 'react';
import { ChartContainer, RadarChart } from '@/components/charts';
import { useTeamMetricsRadarData, METRIC_CATEGORIES } from '@/hooks/useChartData';
import type { TeamMetrics } from '@/types';
import { ChartConfig, RADAR_CHART_CONFIGS } from '@/config/chart-configs';
import { MetricId, METRICS } from '@/config/metrics';

interface PlayStyleVisualizationProps {
  /**
   * Team metrics data
   */
  metrics: TeamMetrics | null;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Error state
   */
  error?: Error | null;
  
  /**
   * Function to refresh data
   */
  onRefresh?: () => void;
  
  /**
   * Primary team name
   */
  teamName?: string;
  
  /**
   * Class name
   */
  className?: string;
}

/**
 * Play style visualization component
 * Uses a radar chart to visualize team play style metrics
 */
const PlayStyleVisualization: React.FC<PlayStyleVisualizationProps> = ({
  metrics,
  loading = false,
  error = null,
  onRefresh,
  teamName = 'Team',
  className = '',
}) => {
  // State for selected configuration
  const [selectedConfigId, setSelectedConfigId] = useState<string>('team-overview');
  const selectedConfig = RADAR_CHART_CONFIGS[selectedConfigId];
  
  // Transform metrics data for the radar chart using the selected config
  const radarData = useTeamMetricsRadarData(metrics, selectedConfig);
  
  // Configure radar chart to use color categories
  const dataKeys = [
    {
      key: 'teamName',
      name: teamName,
      color: '#0ea5e9', // Primary blue - will be overridden by color per point
      fillOpacity: 0.3,
    }
  ];
  
  // Get current season from metrics data
  const season = metrics?.seasonId?.split('-').slice(-2).join('-') || '2023-2024';
  
  // Custom tooltip formatter - show raw value first, then percentile
  const tooltipFormatter = (value: number, name: string, props: any) => {
    // Get the data item for this tooltip
    const item = radarData.find(d => d.name === props.payload.name);
    if (!item) return [value.toFixed(1), name];
    
    // Format the raw value
    const metric = item.metricId ? METRICS[item.metricId as MetricId] : null;
    let formattedValue = item.originalValue.toFixed(1);
    
    // Add unit if applicable
    if (metric?.unit === 'percentage') {
      formattedValue += '%';
    } else if (metric?.unit === 'seconds') {
      formattedValue += ' sec';
    }
    
    // Get league context description
    const leagueContext = item.leagueContext || '';
    
    // Return raw value first, then percentile with context
    return [`${formattedValue} (${item.percentile?.toFixed(0) || '--'}% - ${leagueContext})`, item.name];
  };

  // Handle configuration change
  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConfigId(e.target.value);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Title area */}
      <div className="py-4 px-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{teamName}</h2>
        <p className="text-sm text-gray-600">Premier League · {season} · Matches played: {metrics?.gamesPlayed || 'N/A'}</p>
      </div>
      
      <ChartContainer
        title="Play Style Analysis"
        description="Percentile rankings compared to other teams in the league"
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        minHeight={700}
        bordered={false}
        infoTooltip="This radar chart shows how the team compares to others in the league across key metrics. Higher values (further from center) indicate better performance relative to other teams."
      >
        {/* Configuration selector */}
        <div className="mb-6">
          <label htmlFor="config-select" className="block text-sm font-medium text-gray-700 mb-2">
            Visualization Focus
          </label>
          <select
            id="config-select"
            value={selectedConfigId}
            onChange={handleConfigChange}
            className="max-w-xs rounded-md border border-gray-300 py-2 px-3 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {Object.entries(RADAR_CHART_CONFIGS).map(([id, config]) => (
              <option key={id} value={id}>
                {config.name}
              </option>
            ))}
          </select>
        </div>
        
        {radarData.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              <p>This chart displays raw metric values with percentile rankings compared to other teams. The radar is segmented into four playing style categories, each color-coded for easy identification.</p>
            </div>
            <RadarChart
              data={radarData}
              dataKeys={dataKeys}
              radiusAxisDomain={[0, 100]}
              tooltipFormatter={tooltipFormatter}
              height={600}
              showLegend={false}
              radiusAxisTickFormatter={(value) => `${value}%`}
              className="mx-auto"
              colorByPoint={true} // Use this to color individual points
              dotSize={6} // Make dots more visible
              gridCount={5} // 5 circles for better readability
              showLabels={true} // Show axis labels
              labelClass="text-sm font-medium" // Style for labels
              connectNulls={false} // Don't connect null values
              colorMap={METRIC_CATEGORIES} // Map for category colors
            />
            
            {/* Category legend */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(METRIC_CATEGORIES).map(([category, info]) => (
                <div key={category} className="flex flex-col items-center border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-center mb-2 w-8 h-8 rounded-full" style={{ backgroundColor: info.color }}>
                    <span className="text-white font-bold text-sm">{category.charAt(0).toUpperCase()}</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {category.charAt(0).toUpperCase() + category.slice(1)} Style
                  </h4>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {getCategoryDescription(category)}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Percentile legend */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Percentile Rankings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-8 bg-gradient-to-r from-green-500 to-green-600"></span>
                  <span>80-100: Elite (Top 20%)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-8 bg-gradient-to-r from-green-300 to-green-400"></span>
                  <span>60-80: Above Average</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-8 bg-gradient-to-r from-gray-300 to-gray-400"></span>
                  <span>40-60: Average</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-8 bg-gradient-to-r from-yellow-200 to-yellow-300"></span>
                  <span>20-40: Below Average</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-8 bg-gradient-to-r from-red-300 to-red-400"></span>
                  <span>0-20: Poor (Bottom 20%)</span>
                </div>
              </div>
            </div>
            
            {/* Tooltip Instructions */}
            <div className="mt-4 text-xs text-gray-500 italic">
              <p>Hover over any point to see the actual metric value and its percentile ranking in the league.</p>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No data available to display</p>
          </div>
        )}
      </ChartContainer>
    </div>
  );
};

/**
 * Get a description for each category
 */
function getCategoryDescription(category: string): string {
  switch (category) {
    case 'attacking':
      return 'How the team creates and converts scoring opportunities';
    case 'possession':
      return 'How the team controls and progresses the ball';
    case 'defensive':
      return 'How the team prevents opponents from scoring';
    case 'tempo':
      return 'How the team transitions between phases of play';
    default:
      return '';
  }
}

export default PlayStyleVisualization;