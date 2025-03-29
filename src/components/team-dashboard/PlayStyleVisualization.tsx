import React, { useState } from 'react';
import RadarChart from '@/components/charts/RadarChart';
import useTeamMetricsRadarData, { METRIC_CATEGORIES_COLORS } from '@/hooks/useTeamMetricsRadarData';
import { RADAR_CHART_CONFIGS, getChartConfig } from '@/config/chart-configs';

interface PlayStyleVisualizationProps {
  /**
   * Team metrics data
   */
  metrics: any | null;
  
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
 * PlayStyleVisualization component
 * Displays a radar chart visualization of a team's play style
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
  const selectedConfig = getChartConfig(selectedConfigId);
  
  // Transform metrics data for the radar chart
  const radarData = useTeamMetricsRadarData(metrics, selectedConfig);
  
  // Configure radar chart to use one team data series
  const dataKeys = [
    {
      key: 'teamName',
      name: teamName,
      color: '#0ea5e9', // Primary blue - will be overridden by color per point
      fillOpacity: 0.3,
    }
  ];
  
  // Get current season from metrics data
  const season = '2023-2024'; // This would come from metrics.seasonId in a real implementation
  
  // Custom tooltip formatter to show metric details
  const tooltipFormatter = (value: number, name: string, props: any) => {
    // Get the data item for this tooltip
    const item = radarData.find(d => d.name === props.payload.name);
    if (!item) return [value.toFixed(1), name];
    
    // Format with original value and context
    const formattedValue = item.originalValue.toFixed(1);
    const context = item.leagueContext || '';
    
    // Return the formatted tooltip content
    return [`${formattedValue} (${context})`, item.category.charAt(0).toUpperCase() + item.category.slice(1)];
  };

  // Handle configuration change
  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConfigId(e.target.value);
  };

  // Loading state
  if (loading) {
    return (
      <div className={`flex h-64 w-full items-center justify-center ${className}`}>
        <p className="text-lg text-gray-500">Loading metrics data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-lg bg-red-50 p-6 text-center ${className}`}>
        <h3 className="mb-2 text-xl font-semibold text-red-700">Error Loading Data</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Team header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">{teamName}</h2>
        <p className="text-sm text-gray-600">Developer League · {season}</p>
      </div>
      
      <div className="p-6">
        {/* Configuration selector */}
        <div className="mb-6">
          <label htmlFor="config-select" className="mb-2 block text-sm font-medium text-gray-700">
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
            {/* Radar chart */}
            <div className="h-[500px] w-full">
              <RadarChart
                data={radarData}
                dataKeys={dataKeys}
                radiusAxisDomain={[0, 100]}
                tooltipFormatter={tooltipFormatter}
                height={500}
                showLegend={false}
                radiusAxisTickFormatter={(value) => `${value}%`}
                className="mx-auto"
                colorByPoint={true}
                dotSize={6}
                gridCount={5}
                showLabels={true}
                labelClass="text-sm font-medium"
                connectNulls={false}
                colorMap={METRIC_CATEGORIES_COLORS}
              />
            </div>
            
            {/* Category legend with colored text */}
            <div className="mt-8 flex justify-center space-x-8">
              {Object.entries(METRIC_CATEGORIES_COLORS).map(([category, info]) => (
                <div key={category} className="text-center">
                  <h4 className="text-lg font-medium" style={{ color: info.color }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>
                </div>
              ))}
            </div>
            
            {/* Percentile legend */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Percentile Rankings</h4>
              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 lg:grid-cols-5">
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
          </>
        ) : (
          <div className="flex h-[500px] items-center justify-center">
            <p className="text-gray-500">No data available for visualization</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayStyleVisualization;