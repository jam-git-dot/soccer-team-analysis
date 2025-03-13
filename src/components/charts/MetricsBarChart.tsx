/**
 * Metrics Bar Chart component
 * Displays a bar chart for a set of metrics
 */

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { MetricId, METRICS, formatMetricValue } from '../../config/metrics';

// Custom tooltip component for the bar chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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

type MetricsBarChartProps = {
  data: Array<{
    metricId: MetricId;
    value: number;
    percentile?: number;
  }>;
  showPercentiles?: boolean;
  layout?: 'vertical' | 'horizontal';
  height?: number;
  className?: string;
};

const MetricsBarChart: React.FC<MetricsBarChartProps> = ({
  data,
  showPercentiles = true,
  layout = 'horizontal',
  height = 300,
  className = '',
}) => {
  // Transform data for Recharts
  const chartData = data.map(item => {
    const metric = METRICS[item.metricId];
    return {
      name: metric ? metric.name : item.metricId,
      [item.metricId]: item.value,
      percentile: item.percentile,
    };
  });

  // Get fill color based on percentile
  const getFillColor = (percentile?: number) => {
    if (percentile === undefined) return '#3b82f6'; // Default blue
    
    if (percentile >= 80) return '#10b981'; // Green
    if (percentile >= 60) return '#6ee7b7'; // Light green
    if (percentile >= 40) return '#fbbf24'; // Yellow
    if (percentile >= 20) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey="name" />
              <YAxis />
            </>
          ) : (
            <>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {data.map(item => (
            <Bar
              key={item.metricId}
              dataKey={item.metricId}
              fill={getFillColor(item.percentile)}
              name={METRICS[item.metricId]?.name || item.metricId}
            />
          ))}
          {showPercentiles && (
            <ReferenceLine y={50} stroke="#666" strokeDasharray="3 3" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsBarChart;