/**
 * Play Style Radar Chart component
 * Visualizes team play style using a radar chart
 * Organizes metrics by category to create a meaningful shape:
 * - Top: Attacking metrics
 * - Bottom: Defensive metrics
 * - Left: Possession/Build-up metrics
 * - Right: Tempo/Transition metrics
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
      <p className="text-xs mt-1 text-gray-500 italic">
        Category: {getCategoryLabel(metric.category)}
      </p>
    </div>
  );
};

// Helper function to get readable category label
const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'attacking': return 'Attacking';
    case 'defensive': return 'Defensive';
    case 'possession': return 'Possession/Build-up';
    case 'tempo': return 'Tempo/Transition';
    default: return category;
  }
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
  height = 600, // Increased default height
  className = '',
  teamName = 'Team',
}) => {
  // Organize metrics by category for meaningful radar shape
  const organizedData = organizeMetricsByCategory(data);
  
  // Transform organized data for Recharts
  const chartData = organizedData.map(item => {
    const metric = METRICS[item.metricId];
    const displayValue = usePercentiles && item.percentile !== undefined 
      ? item.percentile 
      : item.value;
    
    return {
      metricName: metric ? metric.name : item.metricId,
      category: metric ? metric.category : 'unknown',
      [item.metricId]: displayValue,
      fullMetric: item.metricId,
      value: item.value,
      percentile: item.percentile,
      // Add the original metric ID for reference
      metricId: item.metricId
    };
  });

  // Determine max value for the chart
  const maxValue = usePercentiles ? 100 : Math.max(...data.map(item => item.value)) * 1.2;
  
  // Create a custom formatter for the radial axis values
  const formatAxisValue = (value: number) => {
    return value.toFixed(0);
  };

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid gridType="circle" />
          <PolarAngleAxis 
            dataKey="metricName" 
            tick={(props) => renderCategoryColoredTick(props, chartData)}
            fontSize={13}
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, maxValue]} 
            tickCount={5} 
            axisLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={formatAxisValue}
          />
          
          <Radar
            name={teamName}
            dataKey={d => d[d.fullMetric]}
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.6}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Value labels */}
      <div className="mt-4 text-sm text-center text-gray-700">
        <p className="font-medium">Chart values: {usePercentiles ? 'Percentile rankings (higher is better)' : 'Actual metric values'}</p>
      </div>
      
      {/* Category legend */}
      <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-gray-600">
        <div className="flex items-center">
          <span className="mr-2 inline-block h-3 w-3 rounded-full bg-red-400"></span>
          <span>Attacking (Top)</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-400"></span>
          <span>Possession (Left)</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 inline-block h-3 w-3 rounded-full bg-blue-400"></span>
          <span>Defensive (Bottom)</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 inline-block h-3 w-3 rounded-full bg-yellow-400"></span>
          <span>Tempo (Right)</span>
        </div>
      </div>
    </div>
  );
};

// Organize metrics by category into a specific order
// This ensures attacking is at top, defensive at bottom, etc.
function organizeMetricsByCategory(data: Array<{
  metricId: MetricId;
  value: number;
  percentile?: number;
}>): Array<{
  metricId: MetricId;
  value: number;
  percentile?: number;
}> {
  // Create buckets for each category
  const attacking: typeof data = [];
  const defensive: typeof data = [];
  const possession: typeof data = [];
  const tempo: typeof data = [];
  const other: typeof data = [];
  
  // Sort metrics into appropriate buckets
  data.forEach(item => {
    const metric = METRICS[item.metricId];
    if (!metric) {
      other.push(item);
      return;
    }
    
    switch (metric.category) {
      case 'attacking':
        attacking.push(item);
        break;
      case 'defensive':
        defensive.push(item);
        break;
      case 'possession':
        possession.push(item);
        break;
      case 'tempo':
        tempo.push(item);
        break;
      default:
        other.push(item);
    }
  });
  
  // Order metrics in a specific sequence for the radar chart:
  // Starting from top, going clockwise: attacking -> tempo -> defensive -> possession -> back to attacking
  return [
    ...attacking,  // Top
    ...tempo,      // Right
    ...defensive,  // Bottom
    ...possession, // Left
    ...other       // Any remaining metrics
  ];
}

// Custom tick for the radar chart with category-specific colors
const renderCategoryColoredTick = (props: any, data: any[]) => {
  const { x, y, payload } = props;
  const { value } = payload;
  
  // Find the metric category from chartData
  const metricData = data.find(item => item.metricName === value);
  const category = metricData ? metricData.category : 'unknown';
  
  // Select color based on category
  let color = '#6b7280'; // Default gray
  switch (category) {
    case 'attacking':
      color = '#f87171'; // Red
      break;
    case 'defensive':
      color = '#60a5fa'; // Blue
      break;
    case 'possession':
      color = '#4ade80'; // Green
      break;
    case 'tempo':
      color = '#fbbf24'; // Yellow
      break;
  }
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={16} 
        textAnchor="middle" 
        fill={color}
        fontSize="12"
        fontWeight="500"
      >
        {value}
      </text>
    </g>
  );
};

export default PlayStyleRadarChart;