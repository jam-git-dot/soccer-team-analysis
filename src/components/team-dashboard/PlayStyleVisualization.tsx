import React, { useState } from 'react';
import { ChartContainer } from '@/components/charts';
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

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Team header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">{teamName}</h2>
        <p className="text-sm text-gray-600">Developer League · {season}</p>
      </div>
      
      <ChartContainer
        title="Play Style Analysis"
        description="Metrics normalized against league averages"
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        minHeight={700}
        bordered={false}
        infoTooltip="This radar chart shows how the team compares to league averages across key metrics. Values further from the center indicate better performance relative to other teams."
      >
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
            {/* Brief explanation of the chart */}
            <div className="mb-4 text-sm text-gray-600">
              <p>This chart shows how {teamName} compares to other teams in the league across key metrics, normalized on a 0-100 scale.</p>
            </div>
            
            {/* Radar chart */}
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
            
            {/* Category legend */}
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {Object.entries(METRIC_CATEGORIES_COLORS).map(([category, info]) => (
                <div key={category} className="flex flex-col items-center rounded-lg border border-gray-200 p-3">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: info.color }}>
                    <span className="text-sm font-bold text-white">{category.charAt(0).toUpperCase()}</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>
                  <p className="mt-1 text-center text-xs text-gray-500">
                    {getCategoryDescription(category)}
                  </p>
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
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No data available for visualization</p>
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
    case 'defending':
      return 'How the team prevents opponents from scoring';
    case 'tempo':
      return 'How the team transitions between phases of play';
    default:
      return '';
  }
}

export default PlayStyleVisualization;