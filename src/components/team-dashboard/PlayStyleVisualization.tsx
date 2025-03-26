import React, { useState } from 'react';
import { ChartContainer, RadarChart } from '@/components/charts';
import { useTeamMetricsRadarData } from '@/hooks/useChartData';
import type { TeamMetrics } from '@/types';
import { ChartConfig, RADAR_CHART_CONFIGS } from '@/config/chart-configs';

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
  
  // Configure radar chart data keys - ensure the key matches what's in the radarData
  const dataKeys = [
    {
      key: 'teamName', // This must match the property name in the radar data!
      name: teamName,
      color: '#0ea5e9', // Primary blue
      fillOpacity: 0.6,
    }
  ];
  
  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string, props: any) => {
    // Get the original (un-normalized) value if available
    const item = radarData.find(d => d.name === props.payload.name);
    const originalValue = item?.originalValue ?? value;
    
    return [`${originalValue.toFixed(1)}`, name];
  };

  // Handle configuration change
  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConfigId(e.target.value);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <ChartContainer
        title="Play Style Visualization"
        description="Key performance metrics across different categories"
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        minHeight={500}
        bordered={false}
        infoTooltip="This radar chart shows key metrics normalized to a 0-100 scale across different categories. The further out on each axis, the stronger the team is in that metric."
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
          <RadarChart
            data={radarData}
            dataKeys={dataKeys}
            radiusAxisDomain={[0, 100]}
            tooltipFormatter={tooltipFormatter}
            height={350}
            showLegend={true}
            radiusAxisTickFormatter={(value) => `${value}`}
            className="mx-auto"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No data available to display</p>
          </div>
        )}
        
        {/* Legend with category colors */}
        {radarData.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Metric Categories</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-red-400"></span>
                <span>Attacking</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-400"></span>
                <span>Possession</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-blue-400"></span>
                <span>Defensive</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-yellow-400"></span>
                <span>Tempo</span>
              </div>
            </div>
          </div>
        )}
      </ChartContainer>
    </div>
  );
};

export default PlayStyleVisualization;