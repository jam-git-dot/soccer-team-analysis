/**
 * League Metrics Chart component
 * Displays a horizontal bar chart comparing teams across a single metric
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  TooltipProps
} from 'recharts';
import { MetricId, METRICS, formatMetricValue } from '../../config/metrics';
import { TeamBasicInfo } from '../../services/mock-data';

// Define types for the chart data
type TeamMetricData = {
  teamId: string;
  teamName: string;
  teamShortName: string;
  value: number;
  percentile?: number;
};

// Custom tooltip component for the bar chart
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;
  
  const data = payload[0].payload as TeamMetricData;
  const metricId = payload[0].dataKey as string;
  const value = data.value;
  const metric = metricId !== 'value' ? METRICS[metricId as MetricId] : null;
  
  return (
    <div className="custom-tooltip bg-white p-3 border border-gray-200 shadow-md rounded-md">
      <p className="font-medium">{data.teamName}</p>
      <p className="text-sm">
        {metric ? metric.name : 'Value'}: <span className="font-medium">
          {metric ? formatMetricValue(metric.id, value) : value.toFixed(1)}
        </span>
      </p>
    </div>
  );
};

type LeagueMetricsChartProps = {
  metricId: MetricId;
  data: TeamMetricData[];
  highlightedTeamId?: string;
  height?: number;
  className?: string;
};

const LeagueMetricsChart: React.FC<LeagueMetricsChartProps> = ({
  metricId,
  data,
  highlightedTeamId,
  height = 400,
  className = '',
}) => {
  // Sort data based on the metric value
  const sortedData = [...data].sort((a, b) => {
    const metric = METRICS[metricId];
    // If higher is better, sort descending, otherwise sort ascending
    return metric && metric.higherIsBetter === false ? a.value - b.value : b.value - a.value;
  });

  // Get the metric definition
  const metric = METRICS[metricId];
  
  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={metric ? [metric.range.min, metric.range.max] : 'auto'}
            label={{ 
              value: metric ? metric.name : '', 
              position: 'insideBottom', 
              offset: -5 
            }}
          />
          <YAxis
            type="category"
            dataKey="teamShortName"
            tick={{ fill: '#333' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name={metric ? metric.name : 'Value'}>
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.teamId === highlightedTeamId ? '#0ea5e9' : '#94a3b8'}
                stroke={entry.teamId === highlightedTeamId ? '#0369a1' : '#64748b'}
                strokeWidth={entry.teamId === highlightedTeamId ? 2 : 1}
              />
            ))}
          </Bar>
          
          {/* Add reference line for league average */}
          {data.length > 0 && (
            <ReferenceLine
              x={data.reduce((sum, item) => sum + item.value, 0) / data.length}
              stroke="#666"
              strokeDasharray="3 3"
              label={{ 
                value: 'League Average', 
                position: 'top', 
                fill: '#666' 
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeagueMetricsChart;