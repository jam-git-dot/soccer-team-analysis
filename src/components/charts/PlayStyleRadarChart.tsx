/**
 * Play Style Radar Chart component
 * Visualizes team play style using a radar chart
 */

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend
} from 'recharts';
import { MetricId, METRICS, formatMetricValue } from '../../config/metrics';

// Custom tooltip component for the radar chart
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;
  
  const data = payload[0];
  const metricId = data.dataKey as MetricId;
  const metric = METRICS[metricId];
  
  if (!metric) return null;
  
  const value = data.value as number;
  const percentile = (data.payload as any).percentile;
  
  return (
    <div className="custom-tooltip bg-white p-3 border border-gray-200 shadow-md rounded-md">
      <p className="font-medium">{metric.name}</p>
      <p className="text-sm">
        Value: <span className="font-medium">{formatMetricValue(metricId, value)}</span>
      </p>
      {percentile !== undefined && (
        <p className="text-sm">
          Percentile: <span className="font-medium">{percentile}%</span>
        </p>
      )}
      <p className="text-xs mt-1 text-gray-500">{metric.description}</p>
    </div>
  );
};

type PlayStyleRadarChartProps = {
  data: Array<{
    metricId: MetricId;
    value: number;
    percentile?: number;
  }>;
  usePercentiles?: boolean;
  height?: number;
  className?: string;
  teamName?: string;
};

const PlayStyleRadarChart: React.FC<PlayStyleRadarChartProps> = ({
  data,
  usePercentiles = true,
  height = 400,
  className = '',
  teamName = 'Team',
}) => {
  // Transform data for Recharts
  const chartData = data.map(item => {
    const metric = METRICS[item.metricId];
    const displayValue = usePercentiles && item.percentile !== undefined 
      ? item.percentile 
      : item.value;
    
    return {
      metricName: metric ? metric.name : item.metricId,
      [item.metricId]: displayValue,
      fullMetric: item.metricId,
      value: item.value,
      percentile: item.percentile,
    };
  });

  // Determine max value for the chart
  const maxValue = usePercentiles ? 100 : Math.max(...data.map(item => item.value)) * 1.2;

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metricName" />
          <PolarRadiusAxis angle={90} domain={[0, maxValue]} />
          
          <Radar
            name={teamName}
            dataKey={d => d[d.fullMetric]}
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.6}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayStyleRadarChart;