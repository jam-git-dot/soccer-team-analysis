import React from 'react';
import { ChartContainer, RadarChart } from '@/components/charts';
import { useTeamMetricsRadarData } from '@/hooks';
import type { TeamMetrics } from '@/types';

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
  // Transform metrics data for the radar chart
  const radarData = useTeamMetricsRadarData(metrics, ['possession', 'attacking', 'defensive', 'tempo']);
  
  // Configure radar chart data keys
  const dataKeys = [
    {
      key: teamName,
      name: teamName,
      color: '#0ea5e9', // Primary blue
      fillOpacity: 0.6,
    }
  ];
  
  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string, props: any) => {
    // Get the original (un-normalized) value if available
    const item = radarData.find(d => d.name === props.payload.name);
    const originalValue = item?.original || value;
    
    return [`${originalValue.toFixed(1)}`, name];
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <ChartContainer
        title="Play Style Visualization"
        description="Key performance metrics across different categories"
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        minHeight={400}
        bordered={false}
        infoTooltip="This radar chart shows key metrics normalized to a 0-100 scale across different categories. The further out on each axis, the stronger the team is in that metric."
      >
        <RadarChart
          data={radarData}
          dataKeys={[
            { key: teamName, name: teamName, color: '#0ea5e9', fillOpacity: 0.6 }
          ]}
          radiusAxisDomain={[0, 100]}
          tooltipFormatter={tooltipFormatter}
          height={350}
          showLegend={false}
          radiusAxisTickFormatter={(value) => `${value}`}
          className="mx-auto"
        />
      </ChartContainer>
    </div>
  );
};

export default PlayStyleVisualization;